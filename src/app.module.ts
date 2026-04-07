import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { CustomerModule } from './customer/customer.module';
import { SellerModule } from './seller/seller.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    AdminModule,
    CustomerModule,
    SellerModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port:5432,
      username:'postgres',
      password: '123',
      database: 'kuratoligrocer',
      
      // load all entity files (ts for dev, js for prod)
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'dokani216@gmail.com',
          pass: 'tkjlllfllovvfgbf',
        },
      },
      defaults: {
        from: '"Kuratoli Grocer" <your-email@gmail.com>',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
