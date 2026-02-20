import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SetType } from '../../../domain/enums/set-type.enum';

export class UpdateDayExerciseDto {
  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  plannedSets?: number;

  @ApiPropertyOptional({ enum: SetType })
  @IsOptional()
  @IsEnum(SetType)
  plannedSetsType?: SetType;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  plannedDrops?: number;
}
