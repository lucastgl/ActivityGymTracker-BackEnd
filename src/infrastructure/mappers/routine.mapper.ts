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
import type {
  CreateRoutineInput,
  UpdateRoutinePatch,
  AddDayInput,
  UpdateDayPatch,
  AddDayExerciseInput,
  UpdateDayExercisePatch,
  RoutineDayWithExercises,
  RoutineDetail,
} from '../../domain/repositories/routine.repository';
import type { SetType } from '../../domain/enums/set-type.enum';

/** Fila Routine de Prisma */
interface PrismaRoutineRow {
  id: string;
  userId: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  notes: string | null;
}

/** Fila RoutineDay de Prisma */
interface PrismaRoutineDayRow {
  id: string;
  routineId: string;
  dayKey: string;
  order: number;
}

/** Fila RoutineDayExercise de Prisma */
interface PrismaRoutineDayExerciseRow {
  id: string;
  routineDayId: string;
  exerciseId: string;
  plannedSets: number;
  plannedSetsType: string;
  order: number;
  plannedDrops: number | null;
}

/** Data para prisma.routine.create */
interface PrismaRoutineCreateData {
  user: { connect: { id: string } };
  name: string;
  notes?: string;
}

/** Data para prisma.routine.update */
interface PrismaRoutineUpdateData {
  name?: string;
  notes?: string;
}

/** Data para prisma.routineDay.create */
interface PrismaRoutineDayCreateData {
  routine: { connect: { id: string } };
  dayKey: string;
  order: number;
}

/** Data para prisma.routineDay.update */
interface PrismaRoutineDayUpdateData {
  dayKey?: string;
  order?: number;
}

/** Data para prisma.routineDayExercise.create */
interface PrismaRoutineDayExerciseCreateData {
  routineDay: { connect: { id: string } };
  exercise: { connect: { id: string } };
  plannedSets: number;
  plannedSetsType: SetType;
  order: number;
  plannedDrops?: number;
}

/** Data para prisma.routineDayExercise.update */
interface PrismaRoutineDayExerciseUpdateData {
  plannedSets?: number;
  plannedSetsType?: SetType;
  order?: number;
  plannedDrops?: number;
}

export const RoutineMapper = {
  toDomain(row: PrismaRoutineRow): Routine {
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

  toPrismaCreate(
    userId: Id,
    input: CreateRoutineInput,
  ): PrismaRoutineCreateData {
    return {
      user: { connect: { id: userId.value } },
      name: input.name,
      notes: input.notes,
    };
  },

  toPrismaUpdate(patch: UpdateRoutinePatch): PrismaRoutineUpdateData {
    const data: PrismaRoutineUpdateData = {};
    if (patch.name !== undefined) data.name = patch.name;
    if (patch.notes !== undefined) data.notes = patch.notes;
    return data;
  },
};

export const RoutineDayMapper = {
  toDomain(row: PrismaRoutineDayRow): RoutineDay {
    return new RoutineDay(
      Id.fromString(row.id),
      Id.fromString(row.routineId),
      row.dayKey,
      row.order,
    );
  },

  toPrismaCreate(
    routineId: Id,
    input: AddDayInput,
  ): PrismaRoutineDayCreateData {
    return {
      routine: { connect: { id: routineId.value } },
      dayKey: input.dayKey,
      order: input.order,
    };
  },

  toPrismaUpdate(patch: UpdateDayPatch): PrismaRoutineDayUpdateData {
    const data: PrismaRoutineDayUpdateData = {};
    if (patch.dayKey !== undefined) data.dayKey = patch.dayKey;
    if (patch.order !== undefined) data.order = patch.order;
    return data;
  },
};

export const RoutineDayExerciseMapper = {
  toDomain(row: PrismaRoutineDayExerciseRow): RoutineDayExercise {
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

  toPrismaCreate(
    dayId: Id,
    input: AddDayExerciseInput,
  ): PrismaRoutineDayExerciseCreateData {
    return {
      routineDay: { connect: { id: dayId.value } },
      exercise: { connect: { id: input.exerciseId.value } },
      plannedSets: input.plannedSets,
      plannedSetsType: input.plannedSetsType,
      order: input.order,
      plannedDrops: input.plannedDrops,
    };
  },

  toPrismaUpdate(
    patch: UpdateDayExercisePatch,
  ): PrismaRoutineDayExerciseUpdateData {
    const data: PrismaRoutineDayExerciseUpdateData = {};
    if (patch.plannedSets !== undefined) data.plannedSets = patch.plannedSets;
    if (patch.plannedSetsType !== undefined)
      data.plannedSetsType = patch.plannedSetsType;
    if (patch.order !== undefined) data.order = patch.order;
    if (patch.plannedDrops !== undefined)
      data.plannedDrops = patch.plannedDrops;
    return data;
  },
};

/** Mapea rutina con days + exercises para RoutineDetail */
export function toRoutineDetail(
  routine: PrismaRoutineRow,
  days: (PrismaRoutineDayRow & {
    exercises: PrismaRoutineDayExerciseRow[];
  })[],
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
