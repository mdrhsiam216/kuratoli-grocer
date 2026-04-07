import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Customer } from './entities/customer.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { Order, OrderStatus } from '../order/entities/order.entity';
import { OrderItem } from '../order/entities/order-item.entity';
import { Product } from '../product/entities/product.entity';
import { Coupon } from '../coupon/entities/coupon.entity';
import { CustomerDto } from './dto/customer.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    private jwtService: JwtService,
  ) {}

  async register(customerDto: CustomerDto) {
    const existingCustomer = await this.customerRepository.findOne({
      where: { email: customerDto.email },
    });

    if (existingCustomer) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(customerDto.password, 10);
    const customer = this.customerRepository.create({
      name: customerDto.name,
      email: customerDto.email,
      password: hashedPassword,
      phone: customerDto.phone,
      address: customerDto.address,
      photo: customerDto.photo,
    });

    const savedCustomer = await this.customerRepository.save(customer);
    const cart = this.cartRepository.create({ customer: savedCustomer });
    await this.cartRepository.save(cart);

    return { message: 'Customer registered successfully', customer: savedCustomer };
  }

  async login(loginDto: LoginDto) {
    const customer = await this.customerRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!customer) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, customer.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    const payload = { email: customer.email, sub: customer.id };
    const token = this.jwtService.sign(payload);
    customer.token = token;
    await this.customerRepository.save(customer);

    return { message: 'Customer logged in successfully', token, customer };
  }

  async getProfile(customer: Customer) {
    return customer;
  }

  async updateProfile(customer: Customer, updateData: UpdateCustomerDto) {
    if (updateData.email && updateData.email !== customer.email) {
      const emailExists = await this.customerRepository.findOne({
        where: { email: updateData.email },
      });
      if (emailExists) {
        throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
      }
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedCustomer = Object.assign(customer, updateData);
    await this.customerRepository.save(updatedCustomer);
    return { message: 'Profile updated successfully', customer: updatedCustomer };
  }

  async deleteProfile(customer: Customer) {
    await this.customerRepository.delete(customer.id);
    return { message: 'Customer account deleted successfully' };
  }

  async getOrders(customer: Customer) {
    return this.orderRepository.find({
      where: { customer: { id: customer.id } },
      relations: ['items', 'items.product'],
      order: { id: 'DESC' },
    });
  }

  async getOrderById(customer: Customer, orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, customer: { id: customer.id } },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    return order;
  }

  async getCart(customer: Customer) {
    const cart = await this.cartRepository.findOne({
      where: { customer: { id: customer.id } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      const newCart = this.cartRepository.create({ customer });
      return this.cartRepository.save(newCart);
    }

    return cart;
  }

  async addCartItem(customer: Customer, addCartItemDto: AddCartItemDto) {
    const product = await this.productRepository.findOne({
      where: { id: addCartItemDto.productId },
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    if (addCartItemDto.quantity <= 0) {
      throw new HttpException('Quantity must be greater than zero', HttpStatus.BAD_REQUEST);
    }

    const cart = await this.getCart(customer);
    let cartItem = await this.cartItemRepository.findOne({
      where: { cart: { id: cart.id }, product: { id: product.id } },
      relations: ['product'],
    });

    if (cartItem) {
      cartItem.quantity += addCartItemDto.quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity: addCartItemDto.quantity,
      });
    }

    await this.cartItemRepository.save(cartItem);
    return this.getCart(customer);
  }

  async checkout(customer: Customer, checkoutDto: CheckoutDto) {
    const cart = await this.cartRepository.findOne({
      where: { customer: { id: customer.id } },
      relations: ['items', 'items.product'],
    });

    if (!cart || cart.items.length === 0) {
      throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
    }

    let coupon: Coupon | null = null;
    if (checkoutDto.couponId) {
      coupon = await this.couponRepository.findOne({
        where: { id: checkoutDto.couponId },
      });

      if (!coupon) {
        throw new HttpException('Coupon not found', HttpStatus.NOT_FOUND);
      }

      if (coupon.usedCount >= coupon.maxUsage) {
        throw new HttpException('Coupon has already expired', HttpStatus.BAD_REQUEST);
      }
    }

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    const discount = coupon ? (totalPrice * coupon.discountPercentage) / 100 : 0;
    const finalPrice = Number((totalPrice - discount).toFixed(2));

    const order = this.orderRepository.create({
      customer,
      coupon: coupon || undefined,
      totalPrice: finalPrice,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);
    const orderItems = cart.items.map((cartItem) =>
      this.orderItemRepository.create({
        order: savedOrder,
        product: cartItem.product,
        quantity: cartItem.quantity,
        price: Number(cartItem.product.price),
      }),
    );

    await this.orderItemRepository.save(orderItems);

    if (coupon) {
      coupon.usedCount += 1;
      await this.couponRepository.save(coupon);
    }

    await this.cartItemRepository.remove(cart.items);

    return this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items', 'items.product'],
    });
  }
}
