import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class AvailableSeatDto {
  @IsNotEmpty({ message: '일정 정보를 입력해주세요.' })
  @IsDate()
  @Type(() => Date)
  showDate: Date;

  @IsString()
  @IsNotEmpty({ message: '공연 제목을 입력해주세요.' })
  title: string;
}
