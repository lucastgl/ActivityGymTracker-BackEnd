import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { OriginType } from '../../../domain/enums/origin-type.enum';

export class AddExerciseToWorkoutDto {
  @IsUUID()
  exerciseId!: string;

  @IsEnum(OriginType)
  origin!: OriginType;

  @IsNumber()
  order!: number;
}
