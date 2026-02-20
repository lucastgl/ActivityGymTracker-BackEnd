import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActivateRoutineForDateDto {
  @ApiProperty({ example: '2024-01-15', description: 'Fecha en formato YYYY-MM-DD' })
  @IsDateString()
  date!: string;
}
