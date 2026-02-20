import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OriginType } from '../../../domain/enums/origin-type.enum';

export class AddExerciseToWorkoutDto {
  @ApiProperty({ example: 'uuid-del-ejercicio' })
  @IsUUID()
  exerciseId!: string;

  @ApiProperty({ enum: OriginType, example: OriginType.MANUAL })
  @IsEnum(OriginType)
  origin!: OriginType;

  @ApiProperty({ example: 1, description: 'Orden del ejercicio en la sesión' })
  @IsNumber()
  order!: number;
}
