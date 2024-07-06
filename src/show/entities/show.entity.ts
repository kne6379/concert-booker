import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Showdate } from './showdate.entity';
import { SeatGrade } from 'src/seat/entities/seat-grade.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';

@Entity({
  name: 'shows',
})
export class Show {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'int', nullable: false })
  categoryId: number;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  imgUrl: string;

  @DeleteDateColumn({ name: 'delete_at' })
  deletedAt?: Date | null;

  @ManyToOne(() => Category, (category) => category.shows)
  @JoinColumn()
  category: Category;

  @OneToMany(() => Showdate, (showdates) => showdates.show)
  showdates: Showdate[];

  @OneToMany(() => SeatGrade, (seatGrades) => seatGrades.show)
  seatGrades: SeatGrade[];

  @OneToMany(() => Ticket, (tickets) => tickets.show)
  tickets: Ticket[];
}
