import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminDto } from './dto/admin.dto';
import { LoginDto } from './dto/login.dto';
import { AdminAuthGuard } from './auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  register(@Body(ValidationPipe) adminDto: AdminDto) {
    return this.adminService.register(adminDto);
  }

  @Post('login')
  login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.adminService.login(loginDto);
  }

  @UseGuards(AdminAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return this.adminService.getProfile(req.user);
  }

  @UseGuards(AdminAuthGuard)
  @Get('stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @UseGuards(AdminAuthGuard)
  @Get('customers')
  getAllCustomers() {
    return this.adminService.getAllCustomers();
  }

  @UseGuards(AdminAuthGuard)
  @Get('orders')
  getAllOrders() {
    return this.adminService.getAllOrders();
  }

  @UseGuards(AdminAuthGuard)
  @Get('sellers')
  getAllSellers() {
    return this.adminService.getAllSellers();
  }

  @UseGuards(AdminAuthGuard)
  @Get('products')
  getAllProducts() {
    return this.adminService.getAllProducts();
  }

  @UseGuards(AdminAuthGuard)
  @Put('profile')
  updateProfile(
    @Req() req: any,
    @Body() data: Partial<{ name: string; email: string }>,
  ) {
    return this.adminService.updateProfile(req.user, data);
  }

  @UseGuards(AdminAuthGuard)
  @Post('logout')
  logout(@Req() req: any) {
    return this.adminService.logout(req.user);
  }
}
