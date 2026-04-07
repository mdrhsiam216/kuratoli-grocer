import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerDto } from './dto/customer.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CheckoutDto } from './dto/checkout.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('register')
  register(@Body(ValidationPipe) customerDto: CustomerDto) {
    return this.customerService.register(customerDto);
  }

  @Post('login')
  login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.customerService.login(loginDto);
  }

  @Get('profile')
  getProfile(@Req() req: any) {
    return this.customerService.getProfile(req.user);
  }

  @Patch('profile')
  updateProfile(@Req() req: any, @Body(ValidationPipe) updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.updateProfile(req.user, updateCustomerDto);
  }

  @Delete('profile')
  deleteProfile(@Req() req: any) {
    return this.customerService.deleteProfile(req.user);
  }

  @Get('orders')
  listOrders(@Req() req: any) {
    return this.customerService.getOrders(req.user);
  }

  @Get('orders/:id')
  getOrder(@Req() req: any, @Param('id') id: string) {
    return this.customerService.getOrderById(req.user, Number(id));
  }

  @Post('cart/add')
  addCartItem(@Req() req: any, @Body(ValidationPipe) addCartItemDto: AddCartItemDto) {
    return this.customerService.addCartItem(req.user, addCartItemDto);
  }

  @Get('cart')
  getCart(@Req() req: any) {
    return this.customerService.getCart(req.user);
  }

  @Post('checkout')
  checkout(@Req() req: any, @Body(ValidationPipe) checkoutDto: CheckoutDto) {
    return this.customerService.checkout(req.user, checkoutDto);
  }
}
