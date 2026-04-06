import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Customer, (customer) => customer.cart, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  customer!: Customer;

  @OneToMany(() => CartItem, (item) => item.cart)
  items!: CartItem[];
}
