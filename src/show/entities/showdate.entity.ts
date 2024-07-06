import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Show } from './show.entity';
import { SalesSeat } from 'src/seat/entities/sales-seat.entity';

@Entity({
  name: 'showdates',
})
export class Showdate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  showId: number;

  @Column({ type: 'datetime', nullable: false })
  showDate: Date;

  @Column({ type: 'int', nullable: false })
  totalSeat: number;

  @DeleteDateColumn()
  deletedAt?: Date | null;

  @ManyToOne(() => Show, (show) => show.showdates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'show_id' })
  show: Show;

  @OneToMany(() => SalesSeat, (salesSeats) => salesSeats.showdate)
  salesSeats: SalesSeat[];
}
