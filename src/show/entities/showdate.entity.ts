import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Show } from './show.entity';

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

  @ManyToOne(() => Show, (show) => show.showdates)
  @JoinColumn()
  show: Show;
}
