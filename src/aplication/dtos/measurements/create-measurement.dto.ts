import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMeasurementDto {
  @ApiProperty({ example: '2024-01-15', description: 'Fecha en formato YYYY-MM-DD' })
  @IsDateString()
  date!: string;

  @ApiProperty({ example: 75.5, description: 'Peso en kilogramos' })
  @IsNumber()
  weightKg!: number;

  @ApiProperty({ example: -0.5, description: 'Variación de porcentaje de grasa' })
  @IsNumber()
  deltaPctFat!: number;

  @ApiProperty({ example: 0.3, description: 'Variación de porcentaje de músculo' })
  @IsNumber()
  deltaPctMuscle!: number;

  @ApiPropertyOptional({ example: 'Medición post-vacaciones' })
  @IsOptional()
  @IsString()
  note?: string;
}
