import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { Exercise } from '../../../domain/entities/exercise.entity';
import type { ExerciseRepository } from '../../../domain/repositories/exercise.repository';
import { EXERCISE_REPOSITORY } from './exercise-repository.token';

/**
 * DeactivateExerciseUseCase
 *
 * PATRÓN: Soft-delete (setActive = false)
 *
 * 1. Input: userId, exerciseId
 * 2. Output: Exercise | null
 * 3. Flujo: repo.setActive(userId, id, false)
 *
 * RestoreExercise es el inverso (setActive = true).
 * Para Routine, WorkoutSession: mismo patrón si usan soft-delete.
 */
@Injectable()
export class DeactivateExerciseUseCase {
  constructor(
    @Inject(EXERCISE_REPOSITORY)
    private readonly exerciseRepository: ExerciseRepository,
  ) {}

  async execute(userId: Id, exerciseId: Id): Promise<Exercise | null> {
    return this.exerciseRepository.setActive(userId, exerciseId, false);
  }
}
