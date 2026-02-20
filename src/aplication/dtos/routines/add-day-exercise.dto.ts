import { IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SetType } from '../../../domain/enums/set-type.enum';

export class AddDayExerciseDto {
  @ApiProperty({ example: 'uuid-del-ejercicio' })
  @IsUUID()
  exerciseId!: string;

  @ApiProperty({ example: 4, description: 'Número de series planeadas' })
  @IsNumber()
  plannedSets!: number;

  @ApiProperty({ enum: SetType, example: SetType.SIMPLE })
  @IsEnum(SetType)
  plannedSetsType!: SetType;

  @ApiProperty({ example: 1, description: 'Orden del ejercicio en el día' })
  @IsNumber()
  order!: number;

  @ApiPropertyOptional({ example: 3, description: 'Número de drops para dropsets' })
  @IsOptional()
  @IsNumber()
  plannedDrops?: number;
}
