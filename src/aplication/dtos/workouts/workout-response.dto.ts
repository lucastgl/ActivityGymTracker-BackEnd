import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SessionStatus } from '../../../domain/enums/session-status.enum';
import { OriginType } from '../../../domain/enums/origin-type.enum';
import { SetType } from '../../../domain/enums/set-type.enum';

export class WorkoutDropResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() order!: number;
  @ApiProperty() weightKg!: number;
  @ApiProperty() reps!: number;
}

export class WorkoutSetResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty({ enum: SetType }) type!: SetType;
  @ApiProperty() order!: number;
  @ApiPropertyOptional() weightKg?: number;
  @ApiPropertyOptional() reps?: number;
  @ApiPropertyOptional({ type: [WorkoutDropResponseDto] }) drops?: WorkoutDropResponseDto[];
}

export class WorkoutExerciseResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() workoutSessionId!: string;
  @ApiProperty() exerciseId!: string;
  @ApiProperty({ enum: OriginType }) origin!: OriginType;
  @ApiProperty() order!: number;
  @ApiProperty({ type: [WorkoutSetResponseDto] }) sets!: WorkoutSetResponseDto[];
}

export class WorkoutSessionResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() userId!: string;
  @ApiProperty({ example: '2024-01-15' }) date!: string;
  @ApiProperty({ enum: SessionStatus }) status!: SessionStatus;
  @ApiProperty() injuryMode!: boolean;
  @ApiPropertyOptional() note?: string;
  @ApiPropertyOptional() sourceRoutineId?: string;
  @ApiPropertyOptional() sourceRoutineDayId?: string;
  @ApiProperty() createdAt!: string;
  @ApiProperty() updatedAt!: string;
  @ApiProperty({ type: [WorkoutExerciseResponseDto] }) exercises!: WorkoutExerciseResponseDto[];
}
