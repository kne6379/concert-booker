import { Module } from '@nestjs/common';
import { ShowService } from './show.service';
import { ShowController } from './show.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { Category } from './entities/category.entity';
import { Showdate } from './entities/showdate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Show, Category, Showdate])],
  providers: [ShowService],
  controllers: [ShowController],
})
export class ShowModule {}
