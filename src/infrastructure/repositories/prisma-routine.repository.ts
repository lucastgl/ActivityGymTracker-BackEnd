/**
 * PrismaRoutineRepository - Implementación de RoutineRepository
 *
 * Maneja rutinas, días y ejercicios planeados.
 * getRoutineDetail trae la estructura completa para "Activar rutina".
 * duplicateRoutine: crea copia con nueva estructura.
 */

import { Injectable } from '@nestjs/common';
import { Id } from '../../domain/value-objects/id.vo';
import { Routine } from '../../domain/entities/routine.entity';
import { RoutineDay } from '../../domain/entities/routine-day.entity';
import { RoutineDayExercise } from '../../domain/entities/routine-day-exercise.entity';
import type {
  RoutineRepository,
  CreateRoutineInput,
  UpdateRoutinePatch,
  AddDayInput,
  UpdateDayPatch,
  AddDayExerciseInput,
  UpdateDayExercisePatch,
  RoutineDetail,
} from '../../domain/repositories/routine.repository';
import { PrismaService } from '../db/prisma.service';
import {
  RoutineMapper,
  RoutineDayMapper,
  RoutineDayExerciseMapper,
  toRoutineDetail,
} from '../mappers/routine.mapper';

@Injectable()
export class PrismaRoutineRepository implements RoutineRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createRoutine(userId: Id, data: CreateRoutineInput): Promise<Routine> {
    const created = await this.prisma.routine.create({
      data: RoutineMapper.toPrismaCreate(userId, data),
    });
    return RoutineMapper.toDomain(created);
  }

  async updateRoutine(
    userId: Id,
    routineId: Id,
    patch: UpdateRoutinePatch,
  ): Promise<Routine | null> {
    const updated = await this.prisma.routine.updateMany({
      where: { id: routineId.value, userId: userId.value },
      data: RoutineMapper.toPrismaUpdate(patch),
    });
    if (updated.count === 0) return null;
    const row = await this.prisma.routine.findUnique({
      where: { id: routineId.value },
    });
    return row ? RoutineMapper.toDomain(row) : null;
  }

  async listRoutines(userId: Id): Promise<Routine[]> {
    const rows = await this.prisma.routine.findMany({
      where: { userId: userId.value },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map((r) => RoutineMapper.toDomain(r));
  }

  async getRoutineDetail(userId: Id, routineId: Id): Promise<RoutineDetail | null> {
    const routine = await this.prisma.routine.findFirst({
      where: { id: routineId.value, userId: userId.value },
      include: {
        days: {
          orderBy: { order: 'asc' },
          include: {
            exercises: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
    if (!routine) return null;
    return toRoutineDetail(routine, routine.days);
  }

  async setRoutineActive(
    userId: Id,
    routineId: Id,
    isActive: boolean,
  ): Promise<Routine | null> {
    const updated = await this.prisma.routine.updateMany({
      where: { id: routineId.value, userId: userId.value },
      data: { isActive },
    });
    if (updated.count === 0) return null;
    const row = await this.prisma.routine.findUnique({
      where: { id: routineId.value },
    });
    return row ? RoutineMapper.toDomain(row) : null;
  }

  async duplicateRoutine(userId: Id, routineId: Id): Promise<Routine | null> {
    const source = await this.getRoutineDetail(userId, routineId);
    if (!source) return null;
    const created = await this.prisma.routine.create({
      data: {
        user: { connect: { id: userId.value } },
        name: `${source.name} (copia)`,
        notes: source.notes,
        days: {
          create: source.days.map((d) => ({
            dayKey: d.dayKey,
            order: d.order,
            exercises: {
              create: d.exercises.map((e) => ({
                exerciseId: e.exerciseId.value,
                plannedSets: e.plannedSets,
                plannedSetsType: e.plannedSetsType,
                order: e.order,
                plannedDrops: e.plannedDrops,
              })),
            },
          })),
        },
      },
      include: { days: { include: { exercises: true } } },
    });
    return RoutineMapper.toDomain(created);
  }

  async addDay(
    userId: Id,
    routineId: Id,
    day: AddDayInput,
  ): Promise<RoutineDay | null> {
    const routine = await this.prisma.routine.findFirst({
      where: { id: routineId.value, userId: userId.value },
    });
    if (!routine) return null;
    const created = await this.prisma.routineDay.create({
      data: RoutineDayMapper.toPrismaCreate(routineId, day),
    });
    return RoutineDayMapper.toDomain(created);
  }

  async updateDay(
    userId: Id,
    routineId: Id,
    dayId: Id,
    patch: UpdateDayPatch,
  ): Promise<RoutineDay | null> {
    const day = await this.prisma.routineDay.findFirst({
      where: { id: dayId.value, routine: { id: routineId.value, userId: userId.value } },
    });
    if (!day) return null;
    const updated = await this.prisma.routineDay.update({
      where: { id: dayId.value },
      data: RoutineDayMapper.toPrismaUpdate(patch),
    });
    return RoutineDayMapper.toDomain(updated);
  }

  async removeDay(userId: Id, routineId: Id, dayId: Id): Promise<boolean> {
    const day = await this.prisma.routineDay.findFirst({
      where: { id: dayId.value, routine: { id: routineId.value, userId: userId.value } },
    });
    if (!day) return false;
    await this.prisma.routineDay.delete({ where: { id: dayId.value } });
    return true;
  }

  async addExerciseToDay(
    userId: Id,
    routineId: Id,
    dayId: Id,
    planned: AddDayExerciseInput,
  ): Promise<RoutineDayExercise | null> {
    const day = await this.prisma.routineDay.findFirst({
      where: { id: dayId.value, routine: { id: routineId.value, userId: userId.value } },
    });
    if (!day) return null;
    const created = await this.prisma.routineDayExercise.create({
      data: RoutineDayExerciseMapper.toPrismaCreate(Id.fromString(dayId.value), planned),
    });
    return RoutineDayExerciseMapper.toDomain(created);
  }

  async updateDayExercise(
    userId: Id,
    routineId: Id,
    dayId: Id,
    dayExerciseId: Id,
    patch: UpdateDayExercisePatch,
  ): Promise<RoutineDayExercise | null> {
    const ex = await this.prisma.routineDayExercise.findFirst({
      where: {
        id: dayExerciseId.value,
        routineDay: { id: dayId.value, routine: { id: routineId.value, userId: userId.value } },
      },
    });
    if (!ex) return null;
    const updated = await this.prisma.routineDayExercise.update({
      where: { id: dayExerciseId.value },
      data: RoutineDayExerciseMapper.toPrismaUpdate(patch),
    });
    return RoutineDayExerciseMapper.toDomain(updated);
  }

  async removeDayExercise(
    userId: Id,
    routineId: Id,
    dayId: Id,
    dayExerciseId: Id,
  ): Promise<boolean> {
    const ex = await this.prisma.routineDayExercise.findFirst({
      where: {
        id: dayExerciseId.value,
        routineDay: { id: dayId.value, routine: { id: routineId.value, userId: userId.value } },
      },
    });
    if (!ex) return false;
    await this.prisma.routineDayExercise.delete({ where: { id: dayExerciseId.value } });
    return true;
  }
}
