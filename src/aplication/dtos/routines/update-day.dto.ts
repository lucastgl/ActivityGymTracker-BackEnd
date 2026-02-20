import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDayDto {
  @ApiPropertyOptional({ example: 'Martes' })
  @IsOptional()
  @IsString()
  dayKey?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  order?: number;
}
