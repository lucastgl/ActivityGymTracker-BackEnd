import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { DateOnly } from '../../../domain/value-objects/date-only.vo';
import { WorkoutSession } from '../../../domain/entities/workout-session.entity';
import type { RoutineRepository } from '../../../domain/repositories/routine.repository';
import type { WorkoutRepository } from '../../../domain/repositories/workout.repository';
import { ROUTINE_REPOSITORY } from './routine-repository.token';
import { WORKOUT_REPOSITORY } from '../workouts/workout-repository.token';

/**
 * ActivateRoutineForDateUseCase
 *
 * Crea una sesión de musculación para una fecha a partir de una rutina (plantilla).
 * Flujo:
 * 1. Obtener rutina completa (getRoutineDetail)
 * 2. Crear sesión desde plantilla (createFromRoutineTemplate) - operación atómica
 *
 * La sesión queda en estado DRAFT para que el usuario complete los sets.
 */
@Injectable()
export class ActivateRoutineForDateUseCase {
  constructor(
    @Inject(ROUTINE_REPOSITORY)
    private readonly routineRepository: RoutineRepository,
    @Inject(WORKOUT_REPOSITORY)
    private readonly workoutRepository: WorkoutRepository,
  ) {}

  async execute(
    userId: Id,
    routineId: Id,
    date: DateOnly,
  ): Promise<WorkoutSession> {
    const routineDetail = await this.routineRepository.getRoutineDetail(
      userId,
      routineId,
    );

    if (!routineDetail) {
      throw new Error('Rutina no encontrada');
    }

    return this.workoutRepository.createFromRoutineTemplate(
      userId,
      date,
      routineDetail,
    );
  }
}
