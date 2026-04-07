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
}
