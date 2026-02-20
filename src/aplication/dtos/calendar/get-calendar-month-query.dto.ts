import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCalendarMonthQueryDto {
  @IsInt()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  month!: number;

  @IsInt()
  @Min(2000)
  @Max(2100)
  @Type(() => Number)
  year!: number;
}
