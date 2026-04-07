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

  async register(
    adminDto: AdminDto,
  ): Promise<{ message: string; admin: Admin }> {
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

  async login(
    loginDto: LoginDto,
  ): Promise<{ message: string; token: string; admin: Admin }> {
    // Find admin by email
    const admin = await this.adminRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!admin) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
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
}
