/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */

import { Id } from '../../../domain/value-objects/id.vo';
import { Exercise } from '../../../domain/entities/exercise.entity';
import {
  ExerciseRepository,
  CreateExerciseInput,
  UpdateExercisePatch,
  ExerciseListFilters,
} from '../../../domain/repositories/exercise.repository';

/**
 * Stub de ExerciseRepository para desarrollo sin infraestructura.
 *
 * Reemplazar por PrismaExerciseRepository cuando exista:
 * { provide: EXERCISE_REPOSITORY, useClass: PrismaExerciseRepository }
 */
export class ExerciseRepositoryStub implements ExerciseRepository {
  async create(_userId: Id, _exercise: CreateExerciseInput): Promise<Exercise> {
    throw new Error(
      'ExerciseRepository no implementado. Agregar PrismaExerciseRepository.',
    );
  }

  async update(
    _userId: Id,
    _exerciseId: Id,
    _patch: UpdateExercisePatch,
  ): Promise<Exercise | null> {
    throw new Error(
      'ExerciseRepository no implementado. Agregar PrismaExerciseRepository.',
    );
  }

  async findById(_userId: Id, _id: Id): Promise<Exercise | null> {
    throw new Error(
      'ExerciseRepository no implementado. Agregar PrismaExerciseRepository.',
    );
  }

  async list(_userId: Id, _filters?: ExerciseListFilters): Promise<Exercise[]> {
    throw new Error(
      'ExerciseRepository no implementado. Agregar PrismaExerciseRepository.',
    );
  }

  async setActive(
    _userId: Id,
    _id: Id,
    _isActive: boolean,
  ): Promise<Exercise | null> {
    throw new Error(
      'ExerciseRepository no implementado. Agregar PrismaExerciseRepository.',
    );
  }
}
