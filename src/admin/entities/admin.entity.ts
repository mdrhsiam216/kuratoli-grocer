import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'varchar', nullable: true })
  token!: string | null;
}
