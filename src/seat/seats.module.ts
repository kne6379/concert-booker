import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { SalesSeat } from './entities/sales-seat.entity';
import { SeatGrade } from './entities/seat-grade.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Show } from 'src/show/entities/show.entity';
import { Showdate } from 'src/show/entities/showdate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SalesSeat, SeatGrade, Ticket, Show, Showdate]),
  ],
  providers: [SeatsService],
  controllers: [SeatsController],
})
export class SeatsModule {}
