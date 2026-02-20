import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMeasurementDto {
  @IsDateString()
  date!: string;

  @IsNumber()
  weightKg!: number;

  @IsNumber()
  deltaPctFat!: number;

  @IsNumber()
  deltaPctMuscle!: number;

  @IsOptional()
  @IsString()
  note?: string;
}
