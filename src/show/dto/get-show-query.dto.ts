import { IsString } from 'class-validator';

export class GetShowQueryDto {
  @IsString()
  category: string;

  @IsString()
  title: string;
}
