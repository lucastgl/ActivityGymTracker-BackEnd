import { Id } from '../value-objects/id.vo';
import { Routine } from '../entities/routine.entity';
import { RoutineDay } from '../entities/routine-day.entity';
import { RoutineDayExercise } from '../entities/routine-day-exercise.entity';
import { SetType } from '../enums/set-type.enum';

/**
 * Datos para crear una rutina.
 */
export type CreateRoutineInput = {
  name: string;
  notes?: string;
};

/**
 * Parcial para actualizar una rutina.
 */
export type UpdateRoutinePatch = Partial<{
  name: string;
  notes: string;
}>;

/**
 * Datos para agregar un día a una rutina.
 */
export type AddDayInput = {
  dayKey: string;
  order: number;
};

/**
 * Parcial para actualizar un día.
 */
export type UpdateDayPatch = Partial<{
  dayKey: string;
  order: number;
}>;

/**
 * Datos para agregar un ejercicio planeado a un día.
 */
export type AddDayExerciseInput = {
  exerciseId: Id;
  plannedSets: number;
  plannedSetsType: SetType;
  order: number;
  plannedDrops?: number;
};

/**
 * Parcial para actualizar un ejercicio planeado.
 */
export type UpdateDayExercisePatch = Partial<{
  plannedSets: number;
  plannedSetsType: SetType;
  order: number;
  plannedDrops: number;
}>;

/**
 * Día con sus ejercicios planeados (para getRoutineDetail).
 */
export type RoutineDayWithExercises = RoutineDay & {
  exercises: RoutineDayExercise[];
};

/**
 * Rutina completa con su estructura (days + ejercicios planeados).
 * Usado por "Activar rutina" para traer todo en una sola lectura coherente.
 */
export type RoutineDetail = Routine & {
  days: RoutineDayWithExercises[];
};

/**
 * RoutineRepository - Plantillas de rutinas
 *
 * Maneja rutinas como plantillas: días y ejercicios planeados.
 * La activación requiere "traer rutina completa con sus días + ejercicios".
 */
export interface RoutineRepository {
  // --- CRUD Rutina ---
  createRoutine(userId: Id, data: CreateRoutineInput): Promise<Routine>;

  updateRoutine(
    userId: Id,
    routineId: Id,
    patch: UpdateRoutinePatch,
  ): Promise<Routine | null>;

  listRoutines(userId: Id): Promise<Routine[]>;

  /**
   * Trae rutina con days + ejercicios planeados.
   * Clave para "Activar rutina" (lectura agregada coherente).
   */
  getRoutineDetail(userId: Id, routineId: Id): Promise<RoutineDetail | null>;

  setRoutineActive(
    userId: Id,
    routineId: Id,
    isActive: boolean,
  ): Promise<Routine | null>;

  duplicateRoutine(userId: Id, routineId: Id): Promise<Routine | null>;

  // --- CRUD Days ---
  addDay(
    userId: Id,
    routineId: Id,
    day: AddDayInput,
  ): Promise<RoutineDay | null>;

  updateDay(
    userId: Id,
    routineId: Id,
    dayId: Id,
    patch: UpdateDayPatch,
  ): Promise<RoutineDay | null>;

  removeDay(userId: Id, routineId: Id, dayId: Id): Promise<boolean>;

  // --- CRUD DayExercises ---
  addExerciseToDay(
    userId: Id,
    routineId: Id,
    dayId: Id,
    planned: AddDayExerciseInput,
  ): Promise<RoutineDayExercise | null>;

  updateDayExercise(
    userId: Id,
    routineId: Id,
    dayId: Id,
    dayExerciseId: Id,
    patch: UpdateDayExercisePatch,
  ): Promise<RoutineDayExercise | null>;

  removeDayExercise(
    userId: Id,
    routineId: Id,
    dayId: Id,
    dayExerciseId: Id,
  ): Promise<boolean>;
}
