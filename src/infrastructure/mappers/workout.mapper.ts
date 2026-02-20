/**
 * MAPPER: WorkoutSession, WorkoutExercise, WorkoutSet, WorkoutDrop (Prisma ↔ Domain)
 *
 * Convierte entre modelos Prisma y entidades de dominio.
 * WorkoutSessionDetail incluye exercises → sets → drops (estructura anidada).
 */

import { Id } from '../../domain/value-objects/id.vo';
import { DateOnly } from '../../domain/value-objects/date-only.vo';
import { WorkoutSession } from '../../domain/entities/workout-session.entity';
import { WorkoutExercise } from '../../domain/entities/workout-exercise.entity';
import { WorkoutSet } from '../../domain/entities/workout-set.entity';
import { WorkoutDrop } from '../../domain/entities/workout-drop.entity';
import type {
  UpsertSessionMetaInput,
  WorkoutSessionDetail,
  WorkoutExerciseWithSets,
  WorkoutSetWithDrops,
} from '../../domain/repositories/workout.repository';
import type { SessionStatus } from '../../domain/enums/session-status.enum';
import type { OriginType } from '../../domain/enums/origin-type.enum';
import type { SetType } from '../../domain/enums/set-type.enum';

/** Fila WorkoutSession de Prisma */
interface PrismaWorkoutSessionRow {
  id: string;
  userId: string;
  date: string;
  status: string;
  injuryMode: boolean;
  createdAt: Date;
  updatedAt: Date;
  note: string | null;
  sourceRoutineId: string | null;
  sourceRoutineDayId: string | null;
}

/** Fila WorkoutExercise de Prisma */
interface PrismaWorkoutExerciseRow {
  id: string;
  workoutSessionId: string;
  exerciseId: string;
  origin: string;
  order: number;
}

/** Fila WorkoutSet de Prisma */
interface PrismaWorkoutSetRow {
  id: string;
  workoutExerciseId: string;
  type: string;
  order: number;
  weightKg: number | null;
  reps: number | null;
}

/** Fila WorkoutDrop de Prisma */
interface PrismaWorkoutDropRow {
  id: string;
  workoutSetId: string;
  order: number;
  weightKg: number;
  reps: number;
}

/** Data para prisma.workoutSession.update */
interface PrismaWorkoutSessionUpdateData {
  status?: SessionStatus;
  injuryMode?: boolean;
  note?: string;
}

export const WorkoutSessionMapper = {
  toDomain(row: PrismaWorkoutSessionRow): WorkoutSession {
    return new WorkoutSession(
      Id.fromString(row.id),
      Id.fromString(row.userId),
      DateOnly.fromString(row.date),
      row.status as SessionStatus,
      row.injuryMode,
      row.createdAt,
      row.updatedAt,
      row.note ?? undefined,
      row.sourceRoutineId ? Id.fromString(row.sourceRoutineId) : undefined,
      row.sourceRoutineDayId ? Id.fromString(row.sourceRoutineDayId) : undefined,
    );
  },

  toPrismaUpsertMeta(
    meta: UpsertSessionMetaInput,
  ): PrismaWorkoutSessionUpdateData {
    const data: PrismaWorkoutSessionUpdateData = {};
    if (meta.status !== undefined) data.status = meta.status;
    if (meta.injuryMode !== undefined) data.injuryMode = meta.injuryMode;
    if (meta.note !== undefined) data.note = meta.note;
    return data;
  },
};

export const WorkoutExerciseMapper = {
  toDomain(row: PrismaWorkoutExerciseRow): WorkoutExercise {
    return new WorkoutExercise(
      Id.fromString(row.id),
      Id.fromString(row.workoutSessionId),
      Id.fromString(row.exerciseId),
      row.origin as OriginType,
      row.order,
    );
  },
};

export const WorkoutSetMapper = {
  toDomain(row: PrismaWorkoutSetRow): WorkoutSet {
    return new WorkoutSet(
      Id.fromString(row.id),
      Id.fromString(row.workoutExerciseId),
      row.type as SetType,
      row.order,
      row.weightKg ?? undefined,
      row.reps ?? undefined,
    );
  },
};

export const WorkoutDropMapper = {
  toDomain(row: PrismaWorkoutDropRow): WorkoutDrop {
    return new WorkoutDrop(
      Id.fromString(row.id),
      Id.fromString(row.workoutSetId),
      row.order,
      row.weightKg,
      row.reps,
    );
  },
};

/** Construye WorkoutSessionDetail desde Prisma con includes */
export function toWorkoutSessionDetail(
  session: PrismaWorkoutSessionRow,
  exercises: (PrismaWorkoutExerciseRow & {
    sets: (PrismaWorkoutSetRow & { drops: PrismaWorkoutDropRow[] })[];
  })[],
): WorkoutSessionDetail {
  const exVOs: WorkoutExerciseWithSets[] = exercises.map((ex) => {
    const sets: WorkoutSetWithDrops[] = ex.sets.map((s) => ({
      ...WorkoutSetMapper.toDomain(s),
      drops: s.drops.map((d) => WorkoutDropMapper.toDomain(d)),
    }));
    return {
      ...WorkoutExerciseMapper.toDomain(ex),
      sets,
    };
  });
  return {
    ...WorkoutSessionMapper.toDomain(session),
    exercises: exVOs,
  };
}
