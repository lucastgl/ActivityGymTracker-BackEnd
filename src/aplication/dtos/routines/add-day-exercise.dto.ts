import { IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { SetType } from '../../../domain/enums/set-type.enum';

export class AddDayExerciseDto {
  @IsUUID()
  exerciseId!: string;

  @IsNumber()
  plannedSets!: number;

  @IsEnum(SetType)
  plannedSetsType!: SetType;

  @IsNumber()
  order!: number;

  @IsOptional()
  @IsNumber()
  plannedDrops?: number;
}
