import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MuscleCategory } from '../../../domain/enums/muscle-category.enum';
import { Equipment } from '../../../domain/enums/equipment.enum';
import { SideType } from '../../../domain/enums/side-type.enum';

export class ExerciseResponseDto {
  @ApiProperty({ example: 'uuid-v4' })
  id!: string;

  @ApiProperty({ example: 'uuid-v4' })
  userId!: string;

  @ApiProperty({ example: 'Curl de bíceps' })
  name!: string;

  @ApiProperty({ enum: MuscleCategory })
  category!: MuscleCategory;

  @ApiProperty({ enum: Equipment })
  equipment!: Equipment;

  @ApiProperty({ enum: SideType })
  sideType!: SideType;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt!: string;
}
