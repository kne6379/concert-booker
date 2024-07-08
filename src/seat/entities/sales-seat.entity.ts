import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { Showdate } from 'src/show/entities/showdate.entity';
import { SeatGrade } from './seat-grade.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';

@Entity({
  name: 'salesSeats',
})
export class SalesSeat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  showdateId: number;

  @Column({ type: 'int', nullable: false })
  seatNumber: number;

  @Column({ type: 'int', nullable: false })
  seatgradeId: number;

  @Column({ type: 'int', nullable: true })
  ticketId: number;

  @OneToOne(() => Ticket, (ticket) => ticket.salesSeat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ManyToOne(() => Showdate, (showdate) => showdate.salesSeats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'showdate_id' })
  showdate: Showdate;

  @ManyToOne(() => SeatGrade, (seatGrade) => seatGrade.salesSeats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'seatgrade_id' })
  seatGrade: SeatGrade;
}
