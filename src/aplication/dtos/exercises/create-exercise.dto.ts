import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { MuscleCategory } from '../../../domain/enums/muscle-category.enum';
import { Equipment } from '../../../domain/enums/equipment.enum';
import { SideType } from '../../../domain/enums/side-type.enum';

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(MuscleCategory)
  category!: MuscleCategory;

  @IsEnum(Equipment)
  equipment!: Equipment;

  @IsEnum(SideType)
  sideType!: SideType;
}
