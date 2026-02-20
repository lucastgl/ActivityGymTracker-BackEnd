/* eslint-disable @typescript-eslint/require-await */

import { Id } from '../../../domain/value-objects/id.vo';
import { Routine } from '../../../domain/entities/routine.entity';
import { RoutineDay } from '../../../domain/entities/routine-day.entity';
import { RoutineDayExercise } from '../../../domain/entities/routine-day-exercise.entity';
import {
  RoutineRepository,
  CreateRoutineInput,
  UpdateRoutinePatch,
  AddDayInput,
  UpdateDayPatch,
  AddDayExerciseInput,
  UpdateDayExercisePatch,
  RoutineDetail,
} from '../../../domain/repositories/routine.repository';

/**
 * Stub de RoutineRepository para desarrollo sin infraestructura.
 *
 * Reemplazar por PrismaRoutineRepository cuando exista.
 */
export class RoutineRepositoryStub implements RoutineRepository {
  async createRoutine(userId: Id, data: CreateRoutineInput): Promise<Routine> {
    void userId;
    void data;
    throw new Error(
      'RoutineRepository no implementado. Agregar PrismaRoutineRepository.',
    );
  }

  async updateRoutine(
    userId: Id,
    routineId: Id,
    patch: UpdateRoutinePatch,
  ): Promise<Routine | null> {
    void userId;
    void routineId;
    void patch;
    throw new Error(
      'RoutineRepository no implementado. Agregar PrismaRoutineRepository.',
    );
  }

  async listRoutines(userId: Id): Promise<Routine[]> {
    void userId;
    throw new Error(
      'RoutineRepository no implementado. Agregar PrismaRoutineRepository.',
    );
  }

  async getRoutineDetail(
    userId: Id,
    routineId: Id,
  ): Promise<RoutineDetail | null> {
    void userId;
    void routineId;
    throw new Error(
      'RoutineRepository no implementado. Agregar PrismaRoutineRepository.',
    );
  }

  async setRoutineActive(
    userId: Id,
    routineId: Id,
    isActive: boolean,
  ): Promise<Routine | null> {
    void userId;
    void routineId;
    void isActive;
    throw new Error(
      'RoutineRepository no implementado. Agregar PrismaRoutineRepository.',
    );
  }

  async duplicateRoutine(userId: Id, routineId: Id): Promise<Routine | null> {
    void userId;
    void routineId;
    throw new Error(
      'RoutineRepository no implementado. Agregar PrismaRoutineRepository.',
    );
  }

  async addDay(
    userId: Id,
    routineId: Id,
    day: AddDayInput,
  ): Promise<RoutineDay | null> {
    void userId;
    void routineId;
    void day;
    throw new Error(
      'RoutineRepository no implementado. Agregar PrismaRoutineRepository.',
    );
  }

  async updateDay(
    userId: Id,
    routineId: Id,
    dayId: Id,
    patch: UpdateDayPatch,
  ): Promise<RoutineDay | null> {
    void userId;
    void routineId;
    void dayId;
    void patch;
    throw new Error(
      'RoutineRepository no implementado. Agregar PrismaRoutineRepository.',
    );
  }

  async removeDay(userId: Id, routineId: Id, dayId: Id): Promise<boolean> {
    void userId;
    void routineId;
    void dayId;
    throw new Error(
      'RoutineRepository no implementado. Agregar PrismaRoutineRepository.',
    );
  }

  async addExerciseToDay(
    userId: Id,
    routineId: Id,
    dayId: Id,
    planned: AddDayExerciseInput,
  ): Promise<RoutineDayExercise | null> {
    void userId;
    void routineId;
    void dayId;
    void planned;
    throw new Error(
      'RoutineRepository no implementado. Agregar PrismaRoutineRepository.',
    );
  }

  async updateDayExercise(
    userId: Id,
    routineId: Id,
    dayId: Id,
    dayExerciseId: Id,
    patch: UpdateDayExercisePatch,
  ): Promise<RoutineDayExercise | null> {
    void userId;
    void routineId;
    void dayId;
    void dayExerciseId;
    void patch;
    throw new Error(
      'RoutineRepository no implementado. Agregar PrismaRoutineRepository.',
    );
  }

  async removeDayExercise(
    userId: Id,
    routineId: Id,
    dayId: Id,
    dayExerciseId: Id,
  ): Promise<boolean> {
    void userId;
    void routineId;
    void dayId;
    void dayExerciseId;
    throw new Error(
      'RoutineRepository no implementado. Agregar PrismaRoutineRepository.',
    );
  }
}
