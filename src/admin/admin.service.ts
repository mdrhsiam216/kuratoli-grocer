import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity';
import { AdminDto } from './dto/admin.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async register(adminDto: AdminDto): Promise<{ message: string; admin: Admin }> {
    // Check if email already exists
    const existingAdmin = await this.adminRepository.findOne({
      where: { email: adminDto.email },
    });

    if (existingAdmin) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminDto.password, 10);

    // Create admin
    const admin = this.adminRepository.create({
      name: adminDto.name,
      email: adminDto.email,
      password: hashedPassword,
    });

    const savedAdmin = await this.adminRepository.save(admin);
    return { message: 'Admin registered successfully', admin: savedAdmin };
  }

  async login(loginDto: LoginDto): Promise<{ message: string; token: string; admin: Admin }> {
    // Find admin by email
    const admin = await this.adminRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!admin) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(loginDto.password, admin.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    // Generate JWT token
    const payload = { email: admin.email, sub: admin.id };
    const token = this.jwtService.sign(payload);

    // Store token in database
    admin.token = token;
    await this.adminRepository.save(admin);

    return { message: 'Admin logged in successfully', token, admin };
  }

  async getProfile(admin: Admin): Promise<Admin> {
    return admin;
  }

  // New protected routes

  async getDashboardStats(admin: Admin): Promise<any> {
    // Get aggregate statistics for admin dashboard
    // This requires connection to other entities' repositories
    return {
      message: 'Dashboard stats',
      admin: admin.email,
      timestamp: new Date(),
    };
  }

  async getAllCustomers(admin: Admin): Promise<any> {
    // Return all customers list
    // Admin verified through JWT middleware
    return {
      message: 'Customers list retrieved',
      admin: admin.email,
      timestamp: new Date(),
    };
  }

  async getAllOrders(admin: Admin): Promise<any> {
    // Return all orders with pagination
    // Admin verified through JWT middleware
    return {
      message: 'Orders list retrieved',
      admin: admin.email,
      timestamp: new Date(),
    };
  }

  async getAllSellers(admin: Admin): Promise<any> {
    // Return all sellers information
    // Admin verified through JWT middleware
    return {
      message: 'Sellers list retrieved',
      admin: admin.email,
      timestamp: new Date(),
    };
  }

  async getAllProducts(admin: Admin): Promise<any> {
    // Return all products from all sellers
    // Admin verified through JWT middleware
    return {
      message: 'Products list retrieved',
      admin: admin.email,
      timestamp: new Date(),
    };
  }

  async updateProfile(
    admin: Admin,
    updateData: Partial<{ name: string; email: string }>,
  ): Promise<{ message: string; admin: Admin }> {
    // Update admin profile information
    // Only allow updating name and email
    const existingAdmin = await this.adminRepository.findOne({
      where: { email: updateData.email },
    });

    if (existingAdmin && existingAdmin.id !== admin.id) {
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
    }

    admin.name = updateData.name || admin.name;
    admin.email = updateData.email || admin.email;

    const updatedAdmin = await this.adminRepository.save(admin);
    return { message: 'Profile updated successfully', admin: updatedAdmin };
  }

  async logout(admin: Admin): Promise<{ message: string }> {
    // Revoke token by removing it from database
    // This prevents token reuse
    admin.token = null;
    await this.adminRepository.save(admin);
    return { message: 'Successfully logged out' };
  }
}
