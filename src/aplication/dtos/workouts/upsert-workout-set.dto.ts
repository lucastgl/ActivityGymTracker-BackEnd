import { IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SetType } from '../../../domain/enums/set-type.enum';

export class UpsertWorkoutSetDto {
  @ApiPropertyOptional({ example: 'uuid-del-set', description: 'Si se provee, actualiza; si no, crea' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ enum: SetType, example: SetType.SIMPLE })
  @IsEnum(SetType)
  type!: SetType;

  @ApiProperty({ example: 1 })
  @IsNumber()
  order!: number;

  @ApiPropertyOptional({ example: 20.5 })
  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsNumber()
  reps?: number;
}
