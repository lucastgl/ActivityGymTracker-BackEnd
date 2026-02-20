import { SessionStatus } from '../../../domain/enums/session-status.enum';
import { OriginType } from '../../../domain/enums/origin-type.enum';
import { SetType } from '../../../domain/enums/set-type.enum';

export class WorkoutDropResponseDto {
  id!: string;
  order!: number;
  weightKg!: number;
  reps!: number;
}

export class WorkoutSetResponseDto {
  id!: string;
  type!: SetType;
  order!: number;
  weightKg?: number;
  reps?: number;
  drops?: WorkoutDropResponseDto[];
}

export class WorkoutExerciseResponseDto {
  id!: string;
  workoutSessionId!: string;
  exerciseId!: string;
  origin!: OriginType;
  order!: number;
  sets!: WorkoutSetResponseDto[];
}

export class WorkoutSessionResponseDto {
  id!: string;
  userId!: string;
  date!: string;
  status!: SessionStatus;
  injuryMode!: boolean;
  note?: string;
  sourceRoutineId?: string;
  sourceRoutineDayId?: string;
  createdAt!: string;
  updatedAt!: string;
  exercises!: WorkoutExerciseResponseDto[];
}
