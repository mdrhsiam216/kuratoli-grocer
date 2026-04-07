import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('managers')
export class Manager {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  photo!: string;

  @Column({ nullable: true })
  token!: string;
}
