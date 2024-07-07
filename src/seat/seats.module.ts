import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { SalesSeat } from './entities/sales-seat.entity';
import { SeatGrade } from './entities/seat-grade.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SalesSeat, SeatGrade])],
  providers: [SeatsService],
  controllers: [SeatsController],
})
export class SeatsModule {}
