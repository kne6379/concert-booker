import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Show } from 'src/show/entities/show.entity';
import { SEAT_GRADES } from '../types/seatGrade.type';
import { SalesSeat } from './sales-seat.entity';

@Entity({
  name: 'seatGrades',
})
export class SeatGrade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  showId: number;

  @Column({ type: 'enum', enum: SEAT_GRADES })
  seatGrades: SEAT_GRADES;

  @Column({ type: 'int' })
  price: number;

  @OneToMany(() => SalesSeat, (salesSeats) => salesSeats.seatGrade)
  salesSeats: SalesSeat[];

  @ManyToOne(() => Show, (show) => show.seatGrades, { onDelete: 'CASCADE' })
  @JoinColumn()
  show: Show;
}
