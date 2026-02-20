import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDayDto {
  @IsOptional()
  @IsString()
  dayKey?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
