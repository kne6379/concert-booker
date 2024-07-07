import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { CreateCategoryDto } from 'src/show/dto/create-category.dto';
import { Category } from 'src/show/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const ExistCategory =
      await this.categoryRepository.findBy(createCategoryDto);
    if (_.isNil(ExistCategory)) {
      throw new ConflictException('이미 존재하는 카테고리입니다.');
    }
    const category = await this.categoryRepository.save(createCategoryDto);
    return category;
  }
}
