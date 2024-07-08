import { IsNotEmpty, IsNumber, IsEnum, IsString } from 'class-validator';
import { SEAT_GRADES } from '../types/seatGrade.type';

export class CreateGradeDto {
  @IsEnum(SEAT_GRADES, { message: '좌석 등급을 정확히 입력해주세요.' })
  @IsNotEmpty({ message: '좌석 등급을 입력해주세요.' })
  seatGrades: SEAT_GRADES;

  @IsNumber()
  @IsNotEmpty({ message: '좌석 가격을 입력해주세요.' })
  price: number;

  @IsNumber()
  @IsNotEmpty({ message: '좌석 가격을 입력해주세요.' })
  gradeSeatCount: number;
}
