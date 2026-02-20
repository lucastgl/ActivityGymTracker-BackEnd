import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MuscleCategory } from '../../../domain/enums/muscle-category.enum';
import { Equipment } from '../../../domain/enums/equipment.enum';
import { SideType } from '../../../domain/enums/side-type.enum';

export class CreateExerciseDto {
  @ApiProperty({ example: 'Curl de bíceps', description: 'Nombre del ejercicio' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ enum: MuscleCategory, example: MuscleCategory.ARM })
  @IsEnum(MuscleCategory)
  category!: MuscleCategory;

  @ApiProperty({ enum: Equipment, example: Equipment.DUMBBELL })
  @IsEnum(Equipment)
  equipment!: Equipment;

  @ApiProperty({ enum: SideType, example: SideType.BILATERLA })
  @IsEnum(SideType)
  sideType!: SideType;
}
