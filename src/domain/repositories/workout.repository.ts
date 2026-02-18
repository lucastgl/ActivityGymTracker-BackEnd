import { Id } from '../value-objects/id.vo';
import { DateOnly } from '../value-objects/date-only.vo';
import { WorkoutSession } from '../entities/workout-session.entity';
import { WorkoutExercise } from '../entities/workout-exercise.entity';
import { WorkoutSet } from '../entities/workout-set.entity';
import { WorkoutDrop } from '../entities/workout-drop.entity';
import { SessionStatus } from '../enums/session-status.enum';
import { OriginType } from '../enums/origin-type.enum';
import { SetType } from '../enums/set-type.enum';
import { RoutineDetail } from './routine.repository';

/**
 * Set con sus drops (para dropset).
 */
export type WorkoutSetWithDrops = WorkoutSet & {
  drops: WorkoutDrop[];
};

/**
 * Ejercicio con sus sets (y drops por set).
 */
export type WorkoutExerciseWithSets = WorkoutExercise & {
  sets: WorkoutSetWithDrops[];
};

/**
 * Sesión completa: session + exercises + sets + drops.
 * Modelo agregado para "Ejercicios del día".
 */
export type WorkoutSessionDetail = WorkoutSession & {
  exercises: WorkoutExerciseWithSets[];
};

/**
 * Parcial para upsert de metadata de sesión.
 */
export type UpsertSessionMetaInput = Partial<{
  status: SessionStatus;
  injuryMode: boolean;
  note: string;
}>;

/**
 * Datos para upsert de un set (simple o dropset).
 */
export type UpsertSetInput = {
  id?: Id; // si existe, update; si no, create
  type: SetType;
  order: number;
  weightKg?: number;
  reps?: number;
};

/**
 * Datos para un drop.
 */
export type ReplaceDropInput = {
  order: number;
  weightKg: number;
  reps: number;
};

/**
 * WorkoutRepository - Musculación ejecución
 *
 * Todo lo que pasa en "Ejercicios del día" musculación:
 * sesión por fecha, ejercicios, sets simples, dropsets con drops,
 * estado draft/completed, injuryMode y notas.
 *
 * La UI trabaja por fecha → find/upsert by date y operaciones puntuales.
 * Comandos específicos en lugar de updateEverything (objetos gigantes).
 */
export interface WorkoutRepository {
  /**
   * Devuelve session + exercises + sets + drops por fecha.
   */
  getByDate(userId: Id, date: DateOnly): Promise<WorkoutSessionDetail | null>;

  upsertSessionMeta(
    userId: Id,
    date: DateOnly,
    meta: UpsertSessionMetaInput,
  ): Promise<WorkoutSession>;

  /**
   * Crea sesión desde plantilla de rutina (operación atómica/transaccional).
   */
  createFromRoutineTemplate(
    userId: Id,
    date: DateOnly,
    routineSnapshot: RoutineDetail,
  ): Promise<WorkoutSession>;

  addExerciseToSession(
    userId: Id,
    sessionId: Id,
    exerciseId: Id,
    origin: OriginType,
    order: number,
  ): Promise<WorkoutExercise | null>;

  removeWorkoutExercise(userId: Id, workoutExerciseId: Id): Promise<boolean>;

  upsertSet(
    userId: Id,
    workoutExerciseId: Id,
    set: UpsertSetInput,
  ): Promise<WorkoutSet | null>;

  replaceDrops(
    userId: Id,
    workoutSetId: Id,
    drops: ReplaceDropInput[],
  ): Promise<WorkoutDrop[]>;

  completeSession(userId: Id, sessionId: Id): Promise<WorkoutSession | null>;

  revertToDraft(userId: Id, sessionId: Id): Promise<WorkoutSession | null>;
}
