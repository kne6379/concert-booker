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

  @OneToOne(() => SalesSeat, (salesSeat) => salesSeat.ticket)
  @JoinColumn({ name: 'sales_seat_id' })
  salesSeat: SalesSeat;

  @OneToOne(() => PurchaseHistory, (purchaseHistory) => purchaseHistory.ticket)
  purchaseHistory: PurchaseHistory;

  @ManyToOne(() => User, (user) => user.tickets)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Show, (show) => show.tickets)
  @JoinColumn({ name: 'show_id' })
  show: Show;
}
