import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MuscleCategory } from '../../../domain/enums/muscle-category.enum';
import { Equipment } from '../../../domain/enums/equipment.enum';
import { SideType } from '../../../domain/enums/side-type.enum';

export class UpdateExerciseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(MuscleCategory)
  category?: MuscleCategory;

  @IsOptional()
  @IsEnum(Equipment)
  equipment?: Equipment;

  @IsOptional()
  @IsEnum(SideType)
  sideType?: SideType;
}
