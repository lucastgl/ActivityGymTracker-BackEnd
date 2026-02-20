import { SessionStatus } from '../../../domain/enums/session-status.enum';
import { MuscleCategory } from '../../../domain/enums/muscle-category.enum';
import { Equipment } from '../../../domain/enums/equipment.enum';
import { SideType } from '../../../domain/enums/side-type.enum';
import { OriginType } from '../../../domain/enums/origin-type.enum';
import { SetType } from '../../../domain/enums/set-type.enum';

export class SessionStatusMetaDto {
  status!: SessionStatus;
  injuryMode!: boolean;
}

export class CalendarDayOverviewResponseDto {
  date!: string;
  workout?: SessionStatusMetaDto;
  run?: SessionStatusMetaDto;
  combinedStatus?: SessionStatus;
  combinedInjury?: boolean;
}

export class DropDataDto {
  dropId!: string;
  order!: number;
  weightKg!: number;
  reps!: number;
}

export class SimpleSetDataDto {
  setId!: string;
  type!: SetType;
  order!: number;
  weightKg!: number;
  reps!: number;
}

export class DropSetDataDto {
  setId!: string;
  type!: SetType;
  order!: number;
  drops!: DropDataDto[];
}

export type WorkoutSetDataDto = SimpleSetDataDto | DropSetDataDto;

export class DayWorkoutExerciseDto {
  workoutExerciseId!: string;
  exerciseId!: string;
  name!: string;
  muscleCategory!: MuscleCategory;
  equipment!: Equipment;
  sideType!: SideType;
  origin!: OriginType;
  order!: number;
  sets!: WorkoutSetDataDto[];
}

export class DayWorkoutDataDto {
  sessionId!: string;
  date!: string;
  status!: SessionStatus;
  injuryMode!: boolean;
  note?: string;
  routine?: { routineId: string; routineName: string; dayKey: string };
  exercises!: DayWorkoutExerciseDto[];
}

export class SplitDataDto {
  splitId!: string;
  order!: number;
  distanceKm!: number;
  durationSec!: number;
}

export class DayRunDataDto {
  runSessionId!: string;
  date!: string;
  status!: SessionStatus;
  injuryMode!: boolean;
  note?: string;
  distanceKm!: number;
  durationSec!: number;
  splits!: SplitDataDto[];
}

export class CalendarDayDataResponseDto {
  date!: string;
  workout?: DayWorkoutDataDto;
  run?: DayRunDataDto;
}
