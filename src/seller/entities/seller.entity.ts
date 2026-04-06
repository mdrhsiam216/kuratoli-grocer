import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity('sellers')
export class Seller {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'text' })
  address!: string;

  @Column({ nullable: true })
  photo!: string;

  @Column({ default: true })
  status!: boolean;

  @OneToMany(() => Product, (product) => product.seller)
  products!: Product[];
}
