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
import type { UpsertSessionMetaInput, WorkoutSessionDetail, WorkoutExerciseWithSets, WorkoutSetWithDrops } from '../../domain/repositories/workout.repository';
import type { WorkoutSession as PrismaSession, WorkoutExercise as PrismaWorkoutEx, WorkoutSet as PrismaSet, WorkoutDrop as PrismaDrop } from '@prisma/client';
import { Prisma } from '@prisma/client';

export const WorkoutSessionMapper = {
  toDomain(row: PrismaSession): WorkoutSession {
    return new WorkoutSession(
      Id.fromString(row.id),
      Id.fromString(row.userId),
      DateOnly.fromString(row.date),
      row.status as WorkoutSession['status'],
      row.injuryMode,
      row.createdAt,
      row.updatedAt,
      row.note ?? undefined,
      row.sourceRoutineId ? Id.fromString(row.sourceRoutineId) : undefined,
      row.sourceRoutineDayId ? Id.fromString(row.sourceRoutineDayId) : undefined,
    );
  },

  toPrismaUpsertMeta(meta: UpsertSessionMetaInput): Prisma.WorkoutSessionUpdateInput {
    const data: Prisma.WorkoutSessionUpdateInput = {};
    if (meta.status !== undefined) data.status = meta.status;
    if (meta.injuryMode !== undefined) data.injuryMode = meta.injuryMode;
    if (meta.note !== undefined) data.note = meta.note;
    return data;
  },
};

export const WorkoutExerciseMapper = {
  toDomain(row: PrismaWorkoutEx): WorkoutExercise {
    return new WorkoutExercise(
      Id.fromString(row.id),
      Id.fromString(row.workoutSessionId),
      Id.fromString(row.exerciseId),
      row.origin as WorkoutExercise['origin'],
      row.order,
    );
  },
};

export const WorkoutSetMapper = {
  toDomain(row: PrismaSet): WorkoutSet {
    return new WorkoutSet(
      Id.fromString(row.id),
      Id.fromString(row.workoutExerciseId),
      row.type as WorkoutSet['type'],
      row.order,
      row.weightKg ?? undefined,
      row.reps ?? undefined,
    );
  },
};

export const WorkoutDropMapper = {
  toDomain(row: PrismaDrop): WorkoutDrop {
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
  session: PrismaSession,
  exercises: (PrismaWorkoutEx & { sets: (PrismaSet & { drops: PrismaDrop[] })[] })[],
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
