import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { Admin } from '../admin/entities/admin.entity';
import { Manager } from '../manager/entities/manager.entity';
import { Seller } from '../seller/entities/seller.entity';
import { Customer } from '../customer/entities/customer.entity';
import { Category } from '../category/entities/category.entity';
import { Product } from '../product/entities/product.entity';
import { Coupon } from '../coupon/entities/coupon.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '123',
  database: process.env.DB_NAME || 'kuratoligrocer',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
});

async function run() {
  await AppDataSource.initialize();
  console.log('DataSource initialized for seeding');

  const adminRepo = AppDataSource.getRepository(Admin);
  const managerRepo = AppDataSource.getRepository(Manager);
  const sellerRepo = AppDataSource.getRepository(Seller);
  const customerRepo = AppDataSource.getRepository(Customer);
  const categoryRepo = AppDataSource.getRepository(Category);
  const productRepo = AppDataSource.getRepository(Product);
  const couponRepo = AppDataSource.getRepository(Coupon);
  const cartRepo = AppDataSource.getRepository(Cart);
  const cartItemRepo = AppDataSource.getRepository(CartItem);

  // Seed admins
  const hashedPassword = await bcrypt.hash('admin123', 10);
  let admin = await adminRepo.findOne({
    where: { email: 'admin@kuratoli.local' },
  });
  if (!admin) {
    admin = await adminRepo.save({
      name: 'Super Admin',
      email: 'admin@kuratoli.local',
      password: hashedPassword,
    });
    console.log('Seeded admin');
  } else {
    admin.password = hashedPassword;
    await adminRepo.save(admin);
    console.log('Updated admin password');
  }

  // Seed managers
  const managersCount = await managerRepo.count();
  if (managersCount === 0) {
    const hashedPassword = await bcrypt.hash('manager123', 10);
    await managerRepo.save({
      name: 'Main Manager',
      email: 'manager@kuratoli.local',
      password: hashedPassword,
    });
    console.log('Seeded manager');
  }

  // Seed sellers
  const sellersCount = await sellerRepo.count();
  let seller1: Seller | null = null;
  if (sellersCount === 0) {
    const hashedPassword = await bcrypt.hash('seller123', 10);
    seller1 = await sellerRepo.save({
      name: 'Fresh Fruits Shop',
      email: 'seller1@shop.local',
      password: hashedPassword,
      address: 'Market Road',
      status: true,
    });
    await sellerRepo.save({
      name: 'Daily Grocer',
      email: 'seller2@shop.local',
      password: hashedPassword,
      address: 'Town Center',
      status: true,
    });
    console.log('Seeded sellers');
  } else {
    seller1 = await sellerRepo.findOneBy({});
  }

  // Seed categories
  const categoriesCount = await categoryRepo.count();
  let cat1: Category | null = null;
  if (categoriesCount === 0) {
    cat1 = await categoryRepo.save({ name: 'Fruits' });
    await categoryRepo.save({ name: 'Vegetables' });
    await categoryRepo.save({ name: 'Dairy' });
    console.log('Seeded categories');
  } else {
    cat1 = await categoryRepo.findOneBy({});
  }

  // Seed products
  const productsCount = await productRepo.count();
  if (productsCount === 0 && seller1 && cat1) {
    await productRepo.save({
      seller: seller1,
      category: cat1,
      name: 'Apple',
      description: 'Fresh red apples',
      price: 1.5,
      stock: 100,
      image: 'apple.jpg',
      status: true,
    });
    await productRepo.save({
      seller: seller1,
      category: cat1,
      name: 'Banana',
      description: 'Yellow bananas',
      price: 0.8,
      stock: 200,
      image: 'banana.jpg',
      status: true,
    });
    console.log('Seeded products');
  }

  // Seed coupons
  const couponsCount = await couponRepo.count();
  if (couponsCount === 0) {
    await couponRepo.save({
      code: 'WELCOME10',
      discountPercentage: 10,
      maxUsage: 100,
      usedCount: 0,
    });
    console.log('Seeded coupons');
  }

  // Seed a customer with cart and cart items
  const customersCount = await customerRepo.count();
  if (customersCount === 0) {
    const hashedPassword = await bcrypt.hash('password', 10);
    const customer = await customerRepo.save({
      name: 'John Doe',
      email: 'john@local',
      password: hashedPassword,
      phone: '1234567890',
      address: '123 Main St',
    });
    const cart = await cartRepo.save({ customer });
    const someProduct = await productRepo.findOneBy({ name: 'Apple' });
    if (someProduct) {
      await cartItemRepo.save({ cart, product: someProduct, quantity: 5 });
    }
    console.log('Seeded customer, cart and cart items');
  }

  console.log('Seeding complete');
  await AppDataSource.destroy();
}

run().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
