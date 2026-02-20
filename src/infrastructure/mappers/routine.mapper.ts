/**
 * MAPPER: Routine, RoutineDay, RoutineDayExercise (Prisma ↔ Domain)
 *
 * Convierte entre modelos Prisma y entidades de dominio.
 * Incluye mapeo de relaciones (days, exercises) para RoutineDetail.
 */

import { Id } from '../../domain/value-objects/id.vo';
import { Routine } from '../../domain/entities/routine.entity';
import { RoutineDay } from '../../domain/entities/routine-day.entity';
import { RoutineDayExercise } from '../../domain/entities/routine-day-exercise.entity';
import type { CreateRoutineInput, UpdateRoutinePatch, AddDayInput, UpdateDayPatch, AddDayExerciseInput, UpdateDayExercisePatch } from '../../domain/repositories/routine.repository';
import type { Routine as PrismaRoutine, RoutineDay as PrismaRoutineDay, RoutineDayExercise as PrismaRoutineDayExercise } from '@prisma/client';
import type { RoutineDayWithExercises, RoutineDetail } from '../../domain/repositories/routine.repository';
import { Prisma } from '@prisma/client';

export const RoutineMapper = {
  toDomain(row: PrismaRoutine): Routine {
    return new Routine(
      Id.fromString(row.id),
      Id.fromString(row.userId),
      row.name,
      row.isActive,
      row.createdAt,
      row.updatedAt,
      row.notes ?? undefined,
    );
  },

  toPrismaCreate(userId: Id, input: CreateRoutineInput): Prisma.RoutineCreateInput {
    return {
      user: { connect: { id: userId.value } },
      name: input.name,
      notes: input.notes,
    };
  },

  toPrismaUpdate(patch: UpdateRoutinePatch): Prisma.RoutineUpdateInput {
    const data: Prisma.RoutineUpdateInput = {};
    if (patch.name !== undefined) data.name = patch.name;
    if (patch.notes !== undefined) data.notes = patch.notes;
    return data;
  },
};

export const RoutineDayMapper = {
  toDomain(row: PrismaRoutineDay): RoutineDay {
    return new RoutineDay(
      Id.fromString(row.id),
      Id.fromString(row.routineId),
      row.dayKey,
      row.order,
    );
  },

  toPrismaCreate(routineId: Id, input: AddDayInput): Prisma.RoutineDayCreateInput {
    return {
      routine: { connect: { id: routineId.value } },
      dayKey: input.dayKey,
      order: input.order,
    };
  },

  toPrismaUpdate(patch: UpdateDayPatch): Prisma.RoutineDayUpdateInput {
    const data: Prisma.RoutineDayUpdateInput = {};
    if (patch.dayKey !== undefined) data.dayKey = patch.dayKey;
    if (patch.order !== undefined) data.order = patch.order;
    return data;
  },
};

export const RoutineDayExerciseMapper = {
  toDomain(row: PrismaRoutineDayExercise): RoutineDayExercise {
    return new RoutineDayExercise(
      Id.fromString(row.id),
      Id.fromString(row.routineDayId),
      Id.fromString(row.exerciseId),
      row.plannedSets,
      row.plannedSetsType as RoutineDayExercise['plannedSetsType'],
      row.order,
      row.plannedDrops ?? undefined,
    );
  },

  toPrismaCreate(dayId: Id, input: AddDayExerciseInput): Prisma.RoutineDayExerciseCreateInput {
    return {
      routineDay: { connect: { id: dayId.value } },
      exercise: { connect: { id: input.exerciseId.value } },
      plannedSets: input.plannedSets,
      plannedSetsType: input.plannedSetsType,
      order: input.order,
      plannedDrops: input.plannedDrops,
    };
  },

  toPrismaUpdate(patch: UpdateDayExercisePatch): Prisma.RoutineDayExerciseUpdateInput {
    const data: Prisma.RoutineDayExerciseUpdateInput = {};
    if (patch.plannedSets !== undefined) data.plannedSets = patch.plannedSets;
    if (patch.plannedSetsType !== undefined) data.plannedSetsType = patch.plannedSetsType;
    if (patch.order !== undefined) data.order = patch.order;
    if (patch.plannedDrops !== undefined) data.plannedDrops = patch.plannedDrops;
    return data;
  },
};

/** Mapea rutina con days + exercises para RoutineDetail */
export function toRoutineDetail(
  routine: PrismaRoutine,
  days: (PrismaRoutineDay & { exercises: PrismaRoutineDayExercise[] })[],
): RoutineDetail {
  const dayVOs: RoutineDayWithExercises[] = days.map((d) => ({
    ...RoutineDayMapper.toDomain(d),
    exercises: d.exercises.map((e) => RoutineDayExerciseMapper.toDomain(e)),
  }));
  return {
    ...RoutineMapper.toDomain(routine),
    days: dayVOs,
  };
}
