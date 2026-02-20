import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MuscleCategory } from '../../../domain/enums/muscle-category.enum';
import { Equipment } from '../../../domain/enums/equipment.enum';
import { SideType } from '../../../domain/enums/side-type.enum';

export class UpdateExerciseDto {
  @ApiPropertyOptional({ example: 'Press de banca' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: MuscleCategory })
  @IsOptional()
  @IsEnum(MuscleCategory)
  category?: MuscleCategory;

  @ApiPropertyOptional({ enum: Equipment })
  @IsOptional()
  @IsEnum(Equipment)
  equipment?: Equipment;

  @ApiPropertyOptional({ enum: SideType })
  @IsOptional()
  @IsEnum(SideType)
  sideType?: SideType;
}
