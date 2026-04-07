import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Manager } from './entities/manager.entity';
import { ManagerDto } from './dto/manager.dto';
import { LoginDto } from '../admin/dto/login.dto'; // Assuming shared login dto
import { Category } from '../category/entities/category.entity';
import { Coupon } from '../coupon/entities/coupon.entity';
import { Product } from '../product/entities/product.entity';
import { Seller } from '../seller/entities/seller.entity';
import { Order } from '../order/entities/order.entity';
import { Cart } from '../cart/entities/cart.entity';
import { Customer } from '../customer/entities/customer.entity';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private jwtService: JwtService,
  ) {}

  async register(
    managerDto: ManagerDto,
  ): Promise<{ message: string; manager: Manager }> {
    const existingManager = await this.managerRepository.findOne({
      where: { email: managerDto.email },
    });

    if (existingManager) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(managerDto.password, 10);

    const manager = this.managerRepository.create({
      name: managerDto.name,
      email: managerDto.email,
      password: hashedPassword,
    });

    const savedManager = await this.managerRepository.save(manager);
    return {
      message: 'Manager registered successfully',
      manager: savedManager,
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ message: string; token: string; manager: Manager }> {
    const manager = await this.managerRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!manager) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      manager.password,
    );
    if (!isPasswordValid) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = this.jwtService.sign({
      id: manager.id,
      email: manager.email,
      role: 'manager',
    });

    // Store token in database
    manager.token = token;
    await this.managerRepository.save(manager);

    return { message: 'Login successful', token, manager };
  }

  async getProfile(user: Manager): Promise<Manager> {
    const manager = await this.managerRepository.findOne({
      where: { id: user.id },
    });
    if (!manager) {
      throw new HttpException('Manager not found', HttpStatus.NOT_FOUND);
    }
    return manager;
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async getAllCoupons(): Promise<Coupon[]> {
    return this.couponRepository.find();
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async getAllSellers(): Promise<Seller[]> {
    return this.sellerRepository.find();
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async getAllCarts(): Promise<Cart[]> {
    return this.cartRepository.find();
  }

  async getAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.find();
  }
}
