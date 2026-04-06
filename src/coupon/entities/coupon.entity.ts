import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string;

  @Column({ type: 'float' })
  discountPercentage!: number;

  @Column({ type: 'int' })
  maxUsage!: number;

  @Column({ type: 'int', default: 0 })
  usedCount!: number;
}
