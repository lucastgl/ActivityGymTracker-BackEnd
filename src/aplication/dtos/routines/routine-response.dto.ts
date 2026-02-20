import { SetType } from '../../../domain/enums/set-type.enum';

export class RoutineDayExerciseResponseDto {
  id!: string;
  routineDayId!: string;
  exerciseId!: string;
  plannedSets!: number;
  plannedSetsType!: SetType;
  order!: number;
  plannedDrops?: number;
}

export class RoutineDayResponseDto {
  id!: string;
  routineId!: string;
  dayKey!: string;
  order!: number;
  exercises!: RoutineDayExerciseResponseDto[];
}

export class RoutineResponseDto {
  id!: string;
  userId!: string;
  name!: string;
  isActive!: boolean;
  notes?: string;
  createdAt!: string;
  updatedAt!: string;
  days?: RoutineDayResponseDto[];
}
