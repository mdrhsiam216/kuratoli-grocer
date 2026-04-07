import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminDto } from './dto/admin.dto';
import { LoginDto } from './dto/login.dto';

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

  @Get('profile')
  getProfile(@Req() req: any) {
    return this.adminService.getProfile(req.user);
  }

  // Protected routes (require JWT)

  @Get('stats')
  getDashboardStats(@Req() req: any) {
    return this.adminService.getDashboardStats(req.user);
  }

  @Get('customers')
  getAllCustomers(@Req() req: any) {
    return this.adminService.getAllCustomers(req.user);
  }

  @Get('orders')
  getAllOrders(@Req() req: any) {
    return this.adminService.getAllOrders(req.user);
  }

  @Get('sellers')
  getAllSellers(@Req() req: any) {
    return this.adminService.getAllSellers(req.user);
  }

  @Get('products')
  getAllProducts(@Req() req: any) {
    return this.adminService.getAllProducts(req.user);
  }

  @Put('profile')
  updateProfile(@Req() req: any, @Body() updateData: Partial<{ name: string; email: string }>) {
    return this.adminService.updateProfile(req.user, updateData);
  }

  @Post('logout')
  logout(@Req() req: any) {
    return this.adminService.logout(req.user);
  }
}
