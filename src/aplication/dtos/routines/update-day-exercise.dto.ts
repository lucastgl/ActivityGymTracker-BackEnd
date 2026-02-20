import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { SetType } from '../../../domain/enums/set-type.enum';

export class UpdateDayExerciseDto {
  @IsOptional()
  @IsNumber()
  plannedSets?: number;

  @IsOptional()
  @IsEnum(SetType)
  plannedSetsType?: SetType;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsNumber()
  plannedDrops?: number;
}
