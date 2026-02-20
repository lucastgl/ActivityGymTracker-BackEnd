import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { Exercise } from '../../../domain/entities/exercise.entity';
import type { ExerciseRepository } from '../../../domain/repositories/exercise.repository';
import { CreateExerciseInput } from '../../../domain/repositories/exercise.repository';
import { EXERCISE_REPOSITORY } from './exercise-repository.token';

/**
 * CreateExerciseUseCase
 *
 * PASOS PARA CREAR UN USE CASE (guía de desarrollo):
 *
 * 1. Definir el input
 *    - Reutilizar CreateExerciseInput del ExerciseRepository
 *
 * 2. Definir el output
 *    - Exercise (entidad de dominio)
 *
 * 3. Declarar dependencias en el constructor
 *    - Solo interfaces (ExerciseRepository), nunca implementaciones concretas
 *
 * 4. Implementar execute()
 *    - Validar input (name no vacío, etc.)
 *    - Llamar al repositorio
 *    - Devolver resultado (errores los maneja el controller)
 *
 * 5. Registrar en el módulo NestJS
 *    - providers: [CreateExerciseUseCase]
 *    - Inyectar ExerciseRepository (implementación Prisma cuando exista)
 */

@Injectable()
export class CreateExerciseUseCase {
  constructor(
    @Inject(EXERCISE_REPOSITORY) // Inyectar ExerciseRepository (implementación Prisma cuando exista)
    private readonly exerciseRepository: ExerciseRepository,
  ) {}

  async execute(userId: Id, data: CreateExerciseInput): Promise<Exercise> {
    // Validar input
    if (!data.name?.trim()) {
      throw new Error('El nombre del ejercicio es requerido');
    }
    if (!data.category) {
      throw new Error('La categoría del ejercicio es requerida');
    }
    if (!data.equipment) {
      throw new Error('El equipo del ejercicio es requerido');
    }
    return this.exerciseRepository.create(userId, data);
  }
}
