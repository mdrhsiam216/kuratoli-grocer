import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { ManagerService } from './manager.service';
import { ManagerDto } from './dto/manager.dto';
import { LoginDto } from '../admin/dto/login.dto';
import { Manager } from './entities/manager.entity';

@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post('register')
  register(@Body(ValidationPipe) managerDto: ManagerDto) {
    return this.managerService.register(managerDto);
  }

  @Post('login')
  login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.managerService.login(loginDto);
  }

  @Get('profile')
  getProfile(
    @Req() req: Request & { user?: Manager },
  ) {
    return this.managerService.getProfile(req.user!);
  }

  @Get('categories')
  getAllCategories() {
    return this.managerService.getAllCategories();
  }

  @Get('coupons')
  getAllCoupons() {
    return this.managerService.getAllCoupons();
  }

  @Get('products')
  getAllProducts() {
    return this.managerService.getAllProducts();
  }

  @Get('sellers')
  getAllSellers() {
    return this.managerService.getAllSellers();
  }

  @Get('orders')
  getAllOrders() {
    return this.managerService.getAllOrders();
  }

  @Get('carts')
  getAllCarts() {
    return this.managerService.getAllCarts();
  }

  @Get('customers')
  getAllCustomers() {
    return this.managerService.getAllCustomers();
  }
}
