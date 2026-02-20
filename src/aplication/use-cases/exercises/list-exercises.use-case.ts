import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { Exercise } from '../../../domain/entities/exercise.entity';
import type { ExerciseRepository } from '../../../domain/repositories/exercise.repository';
import { ExerciseListFilters } from '../../../domain/repositories/exercise.repository';
import { EXERCISE_REPOSITORY } from './exercise-repository.token';

/**
 * ListExercisesUseCase
 *
 * PATRÓN: Use case de lectura (query)
 *
 * 1. Input: userId + filtros opcionales
 * 2. Output: array de Exercise
 * 3. Flujo: delegar al repositorio (sin lógica de negocio adicional)
 *
 * Para otros listados (routines, workouts): mismo patrón.
 */
@Injectable()
export class ListExercisesUseCase {
  constructor(
    @Inject(EXERCISE_REPOSITORY)
    private readonly exerciseRepository: ExerciseRepository,
  ) {}

  async execute(
    userId: Id,
    filters?: ExerciseListFilters,
  ): Promise<Exercise[]> {
    return this.exerciseRepository.list(userId, filters);
  }
}
