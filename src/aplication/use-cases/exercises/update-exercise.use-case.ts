import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { Exercise } from '../../../domain/entities/exercise.entity';
import type { ExerciseRepository } from '../../../domain/repositories/exercise.repository';
import { UpdateExercisePatch } from '../../../domain/repositories/exercise.repository';
import { EXERCISE_REPOSITORY } from './exercise-repository.token';

/**
 * UpdateExerciseUseCase
 *
 * PATRÓN: Use case de actualización parcial
 *
 * 1. Input: userId, exerciseId, patch (solo campos a cambiar)
 * 2. Output: Exercise | null (null si no existe)
 * 3. Validaciones: patch no vacío, ejercicio existe
 *
 * Para UpdateRoutine, UpdateWorkoutSession: mismo patrón.
 */
@Injectable()
export class UpdateExerciseUseCase {
  constructor(
    @Inject(EXERCISE_REPOSITORY)
    private readonly exerciseRepository: ExerciseRepository,
  ) {}

  async execute(
    userId: Id,
    exerciseId: Id,
    patch: UpdateExercisePatch,
  ): Promise<Exercise | null> {
    const hasUpdates =
      patch &&
      Object.keys(patch).length > 0 &&
      Object.values(patch).some((v) => v !== undefined);

    if (!hasUpdates) {
      throw new Error('El patch debe contener al menos un campo a actualizar');
    }

    const existing = await this.exerciseRepository.findById(userId, exerciseId);
    if (!existing) {
      return null;
    }

    return this.exerciseRepository.update(userId, exerciseId, patch);
  }
}
