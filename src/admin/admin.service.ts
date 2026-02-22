import { Injectable } from '@nestjs/common';
import { AdminDto } from './dto/admin.dto';
import { CustomerDto } from './dto/customer.dto';
import { SellerDto } from './dto/seller.dto';
import { ManagerDto } from './dto/manager.dto';

@Injectable()
export class AdminService {
  create(AdminDto: AdminDto):object {
    return AdminDto;
  }

  findAllCustomer() {
    return {
      msg : "returned all customer"
    };
  }
  findAllSeller() {
    return {
      msg : "returned all seller"
    };
  }
  findAllManager() {
    return {
      msg : "returned all Manager"
    };
  }

  // single customer / seller / manager 
  findOneCustomer(id: number) {
    return `This action returns a #${id} customer`;
  }
  findOneSeller(id: number) {
    return `This action returns a #${id} seller`;
  }
  findOneManager(id: number) {
    return `This action returns a #${id} manager`;
  }

  // create
  createCustomer(customer: CustomerDto) {
    return customer;
  }
  createSeller(seller: SellerDto) {
    return seller;
  }
  createManager(manager: ManagerDto) {
    return manager;
  }

  // update
  updateCustomer(id: number, customer: CustomerDto) {
    return `This action updates a #${id} customer`;
  }
  updateSeller(id: number, seller: SellerDto) {
    return `This action updates a #${id} seller`;
  }
  updateManager(id: number, manager: ManagerDto) {
    return `This action updates a #${id} manager`;
  }

  // partial update
  partialUpdateCustomer(id: number, partial: Partial<CustomerDto>) {
    return `This action partially updates a #${id} customer`;
  }
  partialUpdateSeller(id: number, partial: Partial<SellerDto>) {
    return `This action partially updates a #${id} seller`;
  }
  partialUpdateManager(id: number, partial: Partial<ManagerDto>) {
    return `This action partially updates a #${id} manager`;
  }

  // delete
  removeCustomer(id: number) {
    return `This action removes a #${id} customer`;
  }
  removeSeller(id: number) {
    return `This action removes a #${id} seller`;
  }
  removeManager(id: number) {
    return `This action removes a #${id} manager`;
  }

}
