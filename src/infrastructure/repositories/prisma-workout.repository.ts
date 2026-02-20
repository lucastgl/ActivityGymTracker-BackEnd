/**
 * PrismaWorkoutRepository - Implementación de WorkoutRepository
 *
 * Sesiones de musculación por fecha (userId+date unique).
 * upsertSessionMeta: crea o actualiza metadata (status, injuryMode, note).
 * createFromRoutineTemplate: operación transaccional para activar rutina.
 */

import { Injectable } from '@nestjs/common';
import { Id } from '../../domain/value-objects/id.vo';
import { DateOnly } from '../../domain/value-objects/date-only.vo';
import { WorkoutSession } from '../../domain/entities/workout-session.entity';
import { WorkoutExercise } from '../../domain/entities/workout-exercise.entity';
import { WorkoutSet } from '../../domain/entities/workout-set.entity';
import { WorkoutDrop } from '../../domain/entities/workout-drop.entity';
import type {
  WorkoutRepository,
  WorkoutSessionDetail,
  UpsertSessionMetaInput,
  UpsertSetInput,
  ReplaceDropInput,
} from '../../domain/repositories/workout.repository';
import type { RoutineDetail } from '../../domain/repositories/routine.repository';
import { OriginType } from '../../domain/enums/origin-type.enum';
import { PrismaService } from '../db/prisma.service';
import {
  WorkoutSessionMapper,
  WorkoutExerciseMapper,
  WorkoutSetMapper,
  WorkoutDropMapper,
  toWorkoutSessionDetail,
} from '../mappers/workout.mapper';

@Injectable()
export class PrismaWorkoutRepository implements WorkoutRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getByDate(userId: Id, date: DateOnly): Promise<WorkoutSessionDetail | null> {
    const session = await this.prisma.workoutSession.findUnique({
      where: { userId_date: { userId: userId.value, date: date.toString() } },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
          include: {
            sets: {
              orderBy: { order: 'asc' },
              include: { drops: { orderBy: { order: 'asc' } } },
            },
          },
        },
      },
    });
    if (!session) return null;
    return toWorkoutSessionDetail(session, session.exercises);
  }

  async upsertSessionMeta(
    userId: Id,
    date: DateOnly,
    meta: UpsertSessionMetaInput,
  ): Promise<WorkoutSession> {
    const existing = await this.prisma.workoutSession.findUnique({
      where: { userId_date: { userId: userId.value, date: date.toString() } },
    });
    if (existing) {
      const updated = await this.prisma.workoutSession.update({
        where: { id: existing.id },
        data: WorkoutSessionMapper.toPrismaUpsertMeta(meta),
      });
      return WorkoutSessionMapper.toDomain(updated);
    }
    const created = await this.prisma.workoutSession.create({
      data: {
        user: { connect: { id: userId.value } },
        date: date.toString(),
        status: meta.status ?? 'DRAFT',
        injuryMode: meta.injuryMode ?? false,
        note: meta.note,
      },
    });
    return WorkoutSessionMapper.toDomain(created);
  }

  async createFromRoutineTemplate(
    userId: Id,
    date: DateOnly,
    routineSnapshot: RoutineDetail,
  ): Promise<WorkoutSession> {
    let order = 0;
    const exerciseCreates = routineSnapshot.days.flatMap((day) =>
      day.exercises.map((ex) => {
        order += 1;
        return {
          exerciseId: ex.exerciseId.value,
          origin: 'FROM_ROUTINE' as const,
          order,
          sets: {
            create: Array.from({ length: ex.plannedSets }, (_, i) => {
              const base = { type: ex.plannedSetsType, order: i + 1 };
              if (ex.plannedSetsType === 'DROPSET' && ex.plannedDrops && ex.plannedDrops > 0) {
                return {
                  ...base,
                  drops: {
                    create: Array.from({ length: ex.plannedDrops! }, (_, j) => ({
                      order: j + 1,
                      weightKg: 0,
                      reps: 0,
                    })),
                  },
                };
              }
              return base;
            }),
          },
        };
      }),
    );
    const session = await this.prisma.workoutSession.create({
      data: {
        user: { connect: { id: userId.value } },
        date: date.toString(),
        sourceRoutineId: routineSnapshot.id.value,
        exercises: { create: exerciseCreates },
      },
    });
    return WorkoutSessionMapper.toDomain(session);
  }

  async addExerciseToSession(
    userId: Id,
    sessionId: Id,
    exerciseId: Id,
    origin: OriginType,
    order: number,
  ): Promise<WorkoutExercise | null> {
    const session = await this.prisma.workoutSession.findFirst({
      where: { id: sessionId.value, userId: userId.value },
    });
    if (!session) return null;
    const created = await this.prisma.workoutExercise.create({
      data: {
        workoutSession: { connect: { id: sessionId.value } },
        exercise: { connect: { id: exerciseId.value } },
        origin,
        order,
      },
    });
    return WorkoutExerciseMapper.toDomain(created);
  }

  async removeWorkoutExercise(userId: Id, workoutExerciseId: Id): Promise<boolean> {
    const ex = await this.prisma.workoutExercise.findFirst({
      where: {
        id: workoutExerciseId.value,
        workoutSession: { userId: userId.value },
      },
    });
    if (!ex) return false;
    await this.prisma.workoutExercise.delete({ where: { id: workoutExerciseId.value } });
    return true;
  }

  async upsertSet(
    userId: Id,
    workoutExerciseId: Id,
    set: UpsertSetInput,
  ): Promise<WorkoutSet | null> {
    const ex = await this.prisma.workoutExercise.findFirst({
      where: {
        id: workoutExerciseId.value,
        workoutSession: { userId: userId.value },
      },
    });
    if (!ex) return null;
    if (set.id) {
      const updated = await this.prisma.workoutSet.update({
        where: { id: set.id.value },
        data: { type: set.type, order: set.order, weightKg: set.weightKg, reps: set.reps },
      });
      return WorkoutSetMapper.toDomain(updated);
    }
    const created = await this.prisma.workoutSet.create({
      data: {
        workoutExercise: { connect: { id: workoutExerciseId.value } },
        type: set.type,
        order: set.order,
        weightKg: set.weightKg,
        reps: set.reps,
      },
    });
    return WorkoutSetMapper.toDomain(created);
  }

  async replaceDrops(
    userId: Id,
    workoutSetId: Id,
    drops: ReplaceDropInput[],
  ): Promise<WorkoutDrop[]> {
    const set = await this.prisma.workoutSet.findFirst({
      where: {
        id: workoutSetId.value,
        workoutExercise: { workoutSession: { userId: userId.value } },
      },
    });
    if (!set) return [];
    await this.prisma.workoutDrop.deleteMany({ where: { workoutSetId: workoutSetId.value } });
    if (drops.length === 0) return [];
    const created = await this.prisma.workoutDrop.createManyAndReturn({
      data: drops.map((d) => ({
        workoutSetId: workoutSetId.value,
        order: d.order,
        weightKg: d.weightKg,
        reps: d.reps,
      })),
    });
    return created.map((r) => WorkoutDropMapper.toDomain(r));
  }

  async completeSession(userId: Id, sessionId: Id): Promise<WorkoutSession | null> {
    const session = await this.prisma.workoutSession.findFirst({
      where: { id: sessionId.value, userId: userId.value },
    });
    if (!session) return null;
    const updated = await this.prisma.workoutSession.update({
      where: { id: sessionId.value },
      data: { status: 'COMPLETED' },
    });
    return WorkoutSessionMapper.toDomain(updated);
  }

  async revertToDraft(userId: Id, sessionId: Id): Promise<WorkoutSession | null> {
    const session = await this.prisma.workoutSession.findFirst({
      where: { id: sessionId.value, userId: userId.value },
    });
    if (!session) return null;
    const updated = await this.prisma.workoutSession.update({
      where: { id: sessionId.value },
      data: { status: 'DRAFT' },
    });
    return WorkoutSessionMapper.toDomain(updated);
  }
}
