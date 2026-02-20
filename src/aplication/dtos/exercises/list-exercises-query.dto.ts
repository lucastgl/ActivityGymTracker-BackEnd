import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { MuscleCategory } from '../../../domain/enums/muscle-category.enum';
import { Equipment } from '../../../domain/enums/equipment.enum';
import { SideType } from '../../../domain/enums/side-type.enum';

export class ListExercisesQueryDto {
  @IsOptional()
  @IsEnum(MuscleCategory)
  category?: MuscleCategory;

  @IsOptional()
  @IsEnum(Equipment)
  equipment?: Equipment;

  @IsOptional()
  @IsEnum(SideType)
  sideType?: SideType;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;
}
