import { Show } from 'src/show/entities/show.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { PurchaseHistory } from './purchase-history.entity';
import { SalesSeat } from 'src/seat/entities/sales-seat.entity';

@Entity({
  name: 'tickets',
})
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'int', nullable: false })
  showId: number;

  @Column({ type: 'int', nullable: false })
  salesSeatId: number;

  @OneToOne(() => SalesSeat, (salesSeat) => salesSeat.ticket, {
    onDelete: 'CASCADE',
  })
  salesSeat: SalesSeat;

  @OneToOne(
    () => PurchaseHistory,
    (purchaseHistory) => purchaseHistory.ticket,
    { onDelete: 'CASCADE' },
  )
  purchaseHistory: PurchaseHistory;

  @ManyToOne(() => User, (user) => user.tickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Show, (show) => show.tickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'show_id' })
  show: Show;
}
