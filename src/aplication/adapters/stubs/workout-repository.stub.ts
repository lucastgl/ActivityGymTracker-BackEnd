/* eslint-disable @typescript-eslint/require-await */

import { Id } from '../../../domain/value-objects/id.vo';
import { DateOnly } from '../../../domain/value-objects/date-only.vo';
import { WorkoutSession } from '../../../domain/entities/workout-session.entity';
import { WorkoutExercise } from '../../../domain/entities/workout-exercise.entity';
import { WorkoutSet } from '../../../domain/entities/workout-set.entity';
import { WorkoutDrop } from '../../../domain/entities/workout-drop.entity';
import type {
  WorkoutRepository,
  WorkoutSessionDetail,
  UpsertSessionMetaInput,
  UpsertSetInput,
  ReplaceDropInput,
} from '../../../domain/repositories/workout.repository';
import type { RoutineDetail } from '../../../domain/repositories/routine.repository';
import { OriginType } from '../../../domain/enums/origin-type.enum';

/**
 * Stub de WorkoutRepository para desarrollo sin infraestructura.
 *
 * Reemplazar por PrismaWorkoutRepository cuando exista.
 */
export class WorkoutRepositoryStub implements WorkoutRepository {
  async getByDate(): Promise<WorkoutSessionDetail | null> {
    throw new Error(
      'WorkoutRepository no implementado. Agregar PrismaWorkoutRepository.',
    );
  }

  async upsertSessionMeta(
    userId: Id,
    date: DateOnly,
    meta: UpsertSessionMetaInput,
  ): Promise<WorkoutSession> {
    void userId;
    void date;
    void meta;
    throw new Error(
      'WorkoutRepository no implementado. Agregar PrismaWorkoutRepository.',
    );
  }

  async createFromRoutineTemplate(
    userId: Id,
    date: DateOnly,
    routineSnapshot: RoutineDetail,
  ): Promise<WorkoutSession> {
    void userId;
    void date;
    void routineSnapshot;
    throw new Error(
      'WorkoutRepository no implementado. Agregar PrismaWorkoutRepository.',
    );
  }

  async addExerciseToSession(
    userId: Id,
    sessionId: Id,
    exerciseId: Id,
    origin: OriginType,
    order: number,
  ): Promise<WorkoutExercise | null> {
    void userId;
    void sessionId;
    void exerciseId;
    void origin;
    void order;
    throw new Error(
      'WorkoutRepository no implementado. Agregar PrismaWorkoutRepository.',
    );
  }

  async removeWorkoutExercise(
    userId: Id,
    workoutExerciseId: Id,
  ): Promise<boolean> {
    void userId;
    void workoutExerciseId;
    throw new Error(
      'WorkoutRepository no implementado. Agregar PrismaWorkoutRepository.',
    );
  }

  async upsertSet(
    userId: Id,
    workoutExerciseId: Id,
    set: UpsertSetInput,
  ): Promise<WorkoutSet | null> {
    void userId;
    void workoutExerciseId;
    void set;
    throw new Error(
      'WorkoutRepository no implementado. Agregar PrismaWorkoutRepository.',
    );
  }

  async replaceDrops(
    userId: Id,
    workoutSetId: Id,
    drops: ReplaceDropInput[],
  ): Promise<WorkoutDrop[]> {
    void userId;
    void workoutSetId;
    void drops;
    throw new Error(
      'WorkoutRepository no implementado. Agregar PrismaWorkoutRepository.',
    );
  }

  async completeSession(
    userId: Id,
    sessionId: Id,
  ): Promise<WorkoutSession | null> {
    void userId;
    void sessionId;
    throw new Error(
      'WorkoutRepository no implementado. Agregar PrismaWorkoutRepository.',
    );
  }

  async revertToDraft(
    userId: Id,
    sessionId: Id,
  ): Promise<WorkoutSession | null> {
    void userId;
    void sessionId;
    throw new Error(
      'WorkoutRepository no implementado. Agregar PrismaWorkoutRepository.',
    );
  }
}
