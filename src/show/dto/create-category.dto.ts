import { IsNotEmpty, IsNumber, IsEnum, IsString } from 'class-validator';
import { CATEGORY } from '../types/showRole.type';

export class CreateCategoryDto {
  @IsEnum(CATEGORY, { message: '카테고리를 정확히 입력해주세요.' })
  @IsNotEmpty({ message: '공연 카테고리를 입력해주세요.' })
  category: CATEGORY;
}
