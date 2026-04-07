import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { Order } from '../order/entities/order.entity';
import { OrderItem } from '../order/entities/order-item.entity';
import { Product } from '../product/entities/product.entity';
import { Coupon } from '../coupon/entities/coupon.entity';
import { CustomerAuthMiddleware } from './auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Cart,
      CartItem,
      Order,
      OrderItem,
      Product,
      Coupon,
    ]),
    PassportModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerAuthMiddleware],
})
export class CustomerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CustomerAuthMiddleware)
      .forRoutes(
        { path: 'customer/profile', method: RequestMethod.ALL },
        { path: 'customer/orders', method: RequestMethod.ALL },
        { path: 'customer/orders/:id', method: RequestMethod.ALL },
        { path: 'customer/cart', method: RequestMethod.ALL },
        { path: 'customer/cart/add', method: RequestMethod.ALL },
        { path: 'customer/checkout', method: RequestMethod.ALL },
      );
  }
}
