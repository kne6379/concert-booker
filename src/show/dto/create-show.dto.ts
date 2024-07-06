import { IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { CATEGORY } from '../types/showRole.type';

export class CreateShowDto {
  @IsEnum(CATEGORY, { message: '카테고리를 정확히 입력해주세요.' })
  @IsNotEmpty({ message: '공연 카테고리를 입력해주세요.' })
  category: CATEGORY;

  @IsString()
  @IsNotEmpty({ message: '공연 제목을 입력해주세요.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '공연 설명을 입력해주세요.' })
  description: string;

  @IsString()
  address: string;

  @IsString()
  imgUrl: string;
}
