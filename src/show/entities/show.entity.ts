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

  @OneToMany(() => Showdate, (showdate) => showdate.show)
  showdates: Showdate[];
}
