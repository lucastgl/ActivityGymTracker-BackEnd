import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SetType } from '../../../domain/enums/set-type.enum';

export class RoutineDayExerciseResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() routineDayId!: string;
  @ApiProperty() exerciseId!: string;
  @ApiProperty() plannedSets!: number;
  @ApiProperty({ enum: SetType }) plannedSetsType!: SetType;
  @ApiProperty() order!: number;
  @ApiPropertyOptional() plannedDrops?: number;
}

export class RoutineDayResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() routineId!: string;
  @ApiProperty() dayKey!: string;
  @ApiProperty() order!: number;
  @ApiProperty({ type: [RoutineDayExerciseResponseDto] })
  exercises!: RoutineDayExerciseResponseDto[];
}

export class RoutineResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() userId!: string;
  @ApiProperty() name!: string;
  @ApiProperty() isActive!: boolean;
  @ApiPropertyOptional() notes?: string;
  @ApiProperty() createdAt!: string;
  @ApiProperty() updatedAt!: string;
  @ApiPropertyOptional({ type: [RoutineDayResponseDto] })
  days?: RoutineDayResponseDto[];
}
