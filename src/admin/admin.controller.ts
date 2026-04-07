import {
  Controller,
  Post,
  Get,
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
}
