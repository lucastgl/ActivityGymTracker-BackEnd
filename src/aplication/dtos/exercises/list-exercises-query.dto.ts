import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MuscleCategory } from '../../../domain/enums/muscle-category.enum';
import { Equipment } from '../../../domain/enums/equipment.enum';
import { SideType } from '../../../domain/enums/side-type.enum';

export class ListExercisesQueryDto {
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

  @ApiPropertyOptional({ example: true, description: 'Filtrar por estado activo/inactivo' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;
}
