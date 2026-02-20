import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateSplitsDto {
  @ApiProperty({ example: 5.0, description: 'Distancia total en kilómetros' })
  @IsNumber()
  totalDistanceKm!: number;

  @ApiPropertyOptional({ example: 1800, description: 'Duración total en segundos' })
  @IsOptional()
  @IsNumber()
  totalDurationSec?: number;
}
