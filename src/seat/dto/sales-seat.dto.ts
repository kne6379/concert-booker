import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsString,
  IsDate,
} from 'class-validator';
import { SEAT_GRADES } from '../types/seatGrade.type';
import { Type } from 'class-transformer';

export class SalesSeatDto {
  @IsString()
  @IsNotEmpty({ message: '공연 제목을 입력해주세요.' })
  title: string;

  @IsNotEmpty({ message: '일정 정보를 입력해주세요.' })
  @IsDate()
  @Type(() => Date)
  showDate: Date;

  @IsEnum(SEAT_GRADES)
  @IsNotEmpty({ message: '좌석 등급을 입력해주세요.' })
  seatGrades: SEAT_GRADES;

  @IsNumber()
  @IsNotEmpty({ message: '좌석 번호를 입력해주세요.' })
  seatNumber: number;
}
