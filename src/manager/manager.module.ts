import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { Manager } from './entities/manager.entity';
import { Category } from '../category/entities/category.entity';
import { Coupon } from '../coupon/entities/coupon.entity';
import { Product } from '../product/entities/product.entity';
import { Seller } from '../seller/entities/seller.entity';
import { Order } from '../order/entities/order.entity';
import { Cart } from '../cart/entities/cart.entity';
import { Customer } from '../customer/entities/customer.entity';
import { ManagerAuthMiddleware } from './auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Manager,
      Category,
      Coupon,
      Product,
      Seller,
      Order,
      Cart,
      Customer,
    ]),
    JwtModule.register({
      secret: 'your-secret-key', // Use environment variable in production
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ManagerAuthMiddleware).forRoutes('manager/profile');
  }
}
