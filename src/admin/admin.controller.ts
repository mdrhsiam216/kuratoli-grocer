import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Req,
  Param,
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

  // Category CRUD
  @UseGuards(AdminAuthGuard)
  @Get('categories')
  getCategories() {
    return this.adminService.getCategories(null as any);
  }

  @UseGuards(AdminAuthGuard)
  @Post('categories')
  createCategory(@Body() data: { name: string }) {
    return this.adminService.createCategory(null as any, data);
  }

  @UseGuards(AdminAuthGuard)
  @Put('categories/:id')
  updateCategory(@Param('id') id: string, @Body() data: { name: string }) {
    return this.adminService.updateCategory(null as any, +id, data);
  }

  @UseGuards(AdminAuthGuard)
  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.adminService.deleteCategory(null as any, +id);
  }

  // Coupon CRUD
  @UseGuards(AdminAuthGuard)
  @Get('coupons')
  getCoupons() {
    return this.adminService.getCoupons(null as any);
  }

  @UseGuards(AdminAuthGuard)
  @Post('coupons')
  createCoupon(@Body() data: { code: string; discountPercentage: number; maxUsage: number }) {
    return this.adminService.createCoupon(null as any, data);
  }

  @UseGuards(AdminAuthGuard)
  @Put('coupons/:id')
  updateCoupon(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateCoupon(null as any, +id, data);
  }

  @UseGuards(AdminAuthGuard)
  @Delete('coupons/:id')
  deleteCoupon(@Param('id') id: string) {
    return this.adminService.deleteCoupon(null as any, +id);
  }

  // Manager CRUD
  @UseGuards(AdminAuthGuard)
  @Get('managers')
  getManagers() {
    return this.adminService.getManagers(null as any);
  }

  @UseGuards(AdminAuthGuard)
  @Post('managers')
  createManager(@Body() data: { name: string; email: string; password: string }) {
    return this.adminService.createManager(null as any, data);
  }

  @UseGuards(AdminAuthGuard)
  @Put('managers/:id')
  updateManager(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateManager(null as any, +id, data);
  }

  @UseGuards(AdminAuthGuard)
  @Delete('managers/:id')
  deleteManager(@Param('id') id: string) {
    return this.adminService.deleteManager(null as any, +id);
  }

  // Seller Management
  @UseGuards(AdminAuthGuard)
  @Put('sellers/:id/approve')
  approveSeller(@Param('id') id: string) {
    return this.adminService.approveSeller(null as any, +id);
  }

  @UseGuards(AdminAuthGuard)
  @Put('sellers/:id/reject')
  rejectSeller(@Param('id') id: string) {
    return this.adminService.rejectSeller(null as any, +id);
  }
}
