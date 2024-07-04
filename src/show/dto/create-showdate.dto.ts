import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateShowDateDto {
  @IsString()
  @IsNotEmpty({ message: '공연 날짜를 입력해주세요.' })
  showDate: string;

  @IsNumber()
  @IsNotEmpty({ message: '전체 좌석 개수를 입력해주세요.' })
  totalSeat: number;
}
