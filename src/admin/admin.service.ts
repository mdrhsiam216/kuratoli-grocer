import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { Admin } from './entities/admin.entity';
import { AdminDto } from './dto/admin.dto';
import { LoginDto } from './dto/login.dto';
import { Customer } from '../customer/entities/customer.entity';
import { Category } from '../category/entities/category.entity';
import { Coupon } from '../coupon/entities/coupon.entity';
import { Manager } from '../manager/entities/manager.entity';
import { Seller } from '../seller/entities/seller.entity';
import { Product } from '../product/entities/product.entity';
import { Order } from '../order/entities/order.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async register(dto: AdminDto) {
    if (await this.adminRepository.findOne({ where: { email: dto.email } })) {
      throw new HttpException('Email exists', HttpStatus.BAD_REQUEST);
    }
    const admin = await this.adminRepository.save({
      name: dto.name,
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
    });
    await this.mailerService.sendMail({
      to: admin.email,
      subject: 'Welcome to Kuratoli Grocer',
      text: `Hello ${admin.name}, your admin account created successfully.`,
    });
    return { message: 'Admin registered', admin };
  }

  async login(dto: LoginDto) {
    const admin = await this.adminRepository.findOne({
      where: { email: dto.email },
    });
    if (!admin || !(await bcrypt.compare(dto.password, admin.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const token = this.jwtService.sign({ email: admin.email, sub: admin.id });
    admin.token = token;
    await this.adminRepository.save(admin);
    return { message: 'Logged in', token, admin };
  }

  async getProfile(admin: Admin): Promise<Admin> {
    return admin;
  }

  getDashboardStats() {
    return Promise.all([
      this.customerRepository.count(),
      this.sellerRepository.count(),
      this.productRepository.count(),
      this.orderRepository.count(),
    ]).then(([customers, sellers, products, orders]) => ({
      totalCustomers: customers,
      totalSellers: sellers,
      totalProducts: products,
      totalOrders: orders,
    }));
  }

  getAllCustomers() {
    return this.customerRepository.find({
      select: ['id', 'name', 'email', 'phone', 'address'],
    });
  }

  getAllOrders() {
    return this.orderRepository.find({
      relations: ['customer', 'items'],
      select: {
        id: true,
        totalPrice: true,
        status: true,
        customer: { id: true, name: true },
        items: { id: true, quantity: true },
      },
    });
  }

  getAllSellers() {
    return this.sellerRepository.find({
      select: ['id', 'name', 'email', 'address', 'status'],
    });
  }

  getAllProducts() {
    return this.productRepository.find({
      relations: ['seller'],
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        status: true,
        seller: { id: true, name: true },
      },
    });
  }

  async updateProfile(
    admin: Admin,
    data: Partial<{ name: string; email: string }>,
  ) {
    const exists = await this.adminRepository.findOne({
      where: { email: data.email },
    });
    if (exists && exists.id !== admin.id) {
      throw new HttpException('Email in use', HttpStatus.BAD_REQUEST);
    }
    admin.name = data.name || admin.name;
    admin.email = data.email || admin.email;
    const updated = await this.adminRepository.save(admin);
    return { message: 'Profile updated', admin: updated };
  }

  async logout(admin: Admin) {
    admin.token = null;
    await this.adminRepository.save(admin);
    return { message: 'Logged out' };
  }

  // Category CRUD
  async getCategories(admin: Admin) {
    const categories = await this.categoryRepository.find();
    return { message: 'Categories retrieved', categories };
  }

  async createCategory(admin: Admin, data: { name: string }) {
    const category = this.categoryRepository.create({ name: data.name });
    const saved = await this.categoryRepository.save(category);
    return { message: 'Category created', category: saved };
  }

  async updateCategory(admin: Admin, id: number, data: { name: string }) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    category.name = data.name;
    const updated = await this.categoryRepository.save(category);
    return { message: 'Category updated', category: updated };
  }

  async deleteCategory(admin: Admin, id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    await this.categoryRepository.remove(category);
    return { message: 'Category deleted' };
  }

  // Coupon CRUD
  async getCoupons(admin: Admin) {
    const coupons = await this.couponRepository.find();
    return { message: 'Coupons retrieved', coupons };
  }

  async createCoupon(admin: Admin, data: { code: string; discountPercentage: number; maxUsage: number }) {
    const coupon = this.couponRepository.create(data);
    const saved = await this.couponRepository.save(coupon);
    return { message: 'Coupon created', coupon: saved };
  }

  async updateCoupon(admin: Admin, id: number, data: Partial<{ code: string; discountPercentage: number; maxUsage: number }>) {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) throw new HttpException('Coupon not found', HttpStatus.NOT_FOUND);
    Object.assign(coupon, data);
    const updated = await this.couponRepository.save(coupon);
    return { message: 'Coupon updated', coupon: updated };
  }

  async deleteCoupon(admin: Admin, id: number) {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) throw new HttpException('Coupon not found', HttpStatus.NOT_FOUND);
    await this.couponRepository.remove(coupon);
    return { message: 'Coupon deleted' };
  }

  // Manager CRUD
  async getManagers(admin: Admin) {
    const managers = await this.managerRepository.find();
    return { message: 'Managers retrieved', managers };
  }

  async createManager(admin: Admin, data: { name: string; email: string; password: string }) {
    const existing = await this.managerRepository.findOne({ where: { email: data.email } });
    if (existing) throw new HttpException('Email exists', HttpStatus.BAD_REQUEST);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const manager = this.managerRepository.create({ ...data, password: hashedPassword });
    const saved = await this.managerRepository.save(manager);
    return { message: 'Manager created', manager: saved };
  }

  async updateManager(admin: Admin, id: number, data: Partial<{ name: string; email: string }>) {
    const manager = await this.managerRepository.findOne({ where: { id } });
    if (!manager) throw new HttpException('Manager not found', HttpStatus.NOT_FOUND);
    Object.assign(manager, data);
    const updated = await this.managerRepository.save(manager);
    return { message: 'Manager updated', manager: updated };
  }

  async deleteManager(admin: Admin, id: number) {
    const manager = await this.managerRepository.findOne({ where: { id } });
    if (!manager) throw new HttpException('Manager not found', HttpStatus.NOT_FOUND);
    await this.managerRepository.remove(manager);
    return { message: 'Manager deleted' };
  }

  // Seller Management
  async approveSeller(admin: Admin, id: number) {
    const seller = await this.sellerRepository.findOne({ where: { id } });
    if (!seller) throw new HttpException('Seller not found', HttpStatus.NOT_FOUND);
    seller.status = true;
    const updated = await this.sellerRepository.save(seller);
    return { message: 'Seller approved', seller: updated };
  }

  async rejectSeller(admin: Admin, id: number) {
    const seller = await this.sellerRepository.findOne({ where: { id } });
    if (!seller) throw new HttpException('Seller not found', HttpStatus.NOT_FOUND);
    seller.status = false;
    const updated = await this.sellerRepository.save(seller);
    return { message: 'Seller rejected', seller: updated };
  }
}