import { MuscleCategory } from '../../../domain/enums/muscle-category.enum';
import { Equipment } from '../../../domain/enums/equipment.enum';
import { SideType } from '../../../domain/enums/side-type.enum';

export class ExerciseResponseDto {
  id!: string;
  userId!: string;
  name!: string;
  category!: MuscleCategory;
  equipment!: Equipment;
  sideType!: SideType;
  isActive!: boolean;
  createdAt!: string;
  updatedAt!: string;
}
