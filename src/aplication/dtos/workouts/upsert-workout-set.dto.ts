import { IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { SetType } from '../../../domain/enums/set-type.enum';

export class UpsertWorkoutSetDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsEnum(SetType)
  type!: SetType;

  @IsNumber()
  order!: number;

  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @IsOptional()
  @IsNumber()
  reps?: number;
}
