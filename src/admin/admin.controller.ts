import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminDto } from './dto/admin.dto';
import { CustomerDto } from './dto/customer.dto';
import { SellerDto } from './dto/seller.dto';
import { ManagerDto } from './dto/manager.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("customer")
  findAllCustomer() {
    return this.adminService.findAllCustomer();
  }
  @Get("seller")
  findAllSeller() {
    return this.adminService.findAllSeller();
  }
  @Get("manager")
  findAllManager() {
    return this.adminService.findAllManager();
  }

  // single customer / seller / manager 
  @Get('customer/:id')
  findOneCustomer(@Param('id') id: number) {
    return this.adminService.findOneCustomer(id);
  }
  @Get('seller/:id')
  findOneSeller(@Param('id') id: number) {
    return this.adminService.findOneSeller(id);
  }
  @Get('manager/:id')
  findOneManager(@Param('id') id: number) {
    return this.adminService.findOneManager(id);
  }

  // post
  @Post('customer')
  createCustomer(@Body() customer: CustomerDto) {
    return this.adminService.createCustomer(customer);
  }
  @Post('seller')
  createSeller(@Body() seller: SellerDto) {
    return this.adminService.createSeller(seller);
  }
  @Post('manager')
  createManager(@Body() manager: ManagerDto) {
    return this.adminService.createManager(manager);
  }

  // "PUT"
  @Put('customer/:id')
  updateCustomer(@Param('id') id: string, @Body() customer: CustomerDto) {
    return this.adminService.updateCustomer(+id, customer);
  }
  @Put('seller/:id')
  updateSeller(@Param('id') id: string, @Body() seller: SellerDto) {
    return this.adminService.updateSeller(+id, seller);
  }
  @Put('manager/:id')
  updateManager(@Param('id') id: string, @Body() manager: ManagerDto) {
    return this.adminService.updateManager(+id, manager);
  }

  // Patch
  @Patch('customer/:id')
  partialUpdateCustomer(@Param('id') id: string, @Body() partialCustomer: Partial<CustomerDto>) {
    return this.adminService.partialUpdateCustomer(+id, partialCustomer);
  }
  @Patch('seller/:id')
  partialUpdateSeller(@Param('id') id: string, @Body() partialSeller: Partial<SellerDto>) {
    return this.adminService.partialUpdateSeller(+id, partialSeller);
  }
  @Patch('manager/:id')
  partialUpdateManager(@Param('id') id: string, @Body() partialManager: Partial<ManagerDto>) {
    return this.adminService.partialUpdateManager(+id, partialManager);
  }

  // delete 
  @Delete('customer/:id')
  removeCustomer(@Param('id') id: string) {
    return this.adminService.removeCustomer(+id);
  }
  @Delete('seller/:id')
  removeSeller(@Param('id') id: string) {
    return this.adminService.removeSeller(+id);
  }
  @Delete('manager/:id')
  removeManager(@Param('id') id: string) {
    return this.adminService.removeManager(+id);
  }
}