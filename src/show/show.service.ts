import _ from 'lodash';
import { parse } from 'papaparse';
import { DataSource, Repository } from 'typeorm';

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateShowDto } from './dto/create-show.dto';
import { Show } from './entities/show.entity';
import { Category } from './entities/category.entity';
import { promises } from 'dns';
import { CreateShowDateDto } from './dto/create-showdate.dto';
import { Showdate } from './entities/showdate.entity';

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Show)
    private readonly showRepository: Repository<Show>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Showdate)
    private readonly showdateRepository: Repository<Showdate>,
    private dataSource: DataSource,
  ) {}
  async createShow(
    createShowDto: CreateShowDto,
    createShowDateDtos: CreateShowDateDto[],
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // 트랜잭션
    try {
      const category = await queryRunner.manager.findOneBy(Category, {
        category: createShowDto.category,
      });
      if (!category) {
        throw new BadRequestException('존재하지 않는 카테고리입니다.');
      }
      const showData = await queryRunner.manager.save(Show, {
        title: createShowDto.title,
        imgUrl: createShowDto.imgUrl,
        address: createShowDto.address,
        description: createShowDto.description,
        categoryId: category.id,
      });

      for (const createShowDateDto of createShowDateDtos) {
        const { showDate, totalSeat } = createShowDateDto;
        const scheduleData = await queryRunner.manager.save(Showdate, {
          showId: showData.id,
          showDate: showDate,
          totalSeat: totalSeat,
        });
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw Error;
    } finally {
      await queryRunner.release();
    }
  }
}
