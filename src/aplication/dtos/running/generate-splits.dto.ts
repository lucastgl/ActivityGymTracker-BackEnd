import { IsNumber, IsOptional } from 'class-validator';

export class GenerateSplitsDto {
  @IsNumber()
  totalDistanceKm!: number;

  @IsOptional()
  @IsNumber()
  totalDurationSec?: number;
}
