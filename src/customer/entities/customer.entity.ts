import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../order/entities/order.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  phone!: string;

  @Column({ type: 'text' })
  address!: string;

  @Column({ nullable: true })
  photo!: string;

  @OneToOne(() => Cart, (cart) => cart.customer)
  cart!: Cart;

  @OneToMany(() => Order, (order) => order.customer)
  orders!: Order[];
}
