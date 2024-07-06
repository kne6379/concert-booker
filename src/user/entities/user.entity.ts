import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from '../types/userRole.type';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { PurchaseHistory } from 'src/ticket/entities/purchase-history.entity';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'int', default: 1000000 })
  point: number;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => Ticket, (tickets) => tickets.user)
  tickets: Ticket[];

  @OneToMany(
    () => PurchaseHistory,
    (purchaseHistories) => purchaseHistories.user,
  )
  purchaseHistories: PurchaseHistory[];
}
