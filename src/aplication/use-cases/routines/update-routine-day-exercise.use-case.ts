import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { RoutineDayExercise } from '../../../domain/entities/routine-day-exercise.entity';
import type { RoutineRepository } from '../../../domain/repositories/routine.repository';
import { UpdateDayExercisePatch } from '../../../domain/repositories/routine.repository';
import { ROUTINE_REPOSITORY } from './routine-repository.token';

@Injectable()
export class UpdateRoutineDayExerciseUseCase {
  constructor(
    @Inject(ROUTINE_REPOSITORY)
    private readonly routineRepository: RoutineRepository,
  ) {}

  async execute(
    userId: Id,
    routineId: Id,
    dayId: Id,
    dayExerciseId: Id,
    data: UpdateDayExercisePatch,
  ): Promise<RoutineDayExercise> {
    // Validar input
    if (!data.plannedSets) {
      throw new Error('El número de series planeadas es requerido');
    }
    if (!data.plannedSetsType) {
      throw new Error('El tipo de series planeadas es requerido');
    }
    if ((data.order ?? 0) <= 0) {
      throw new Error('El orden del ejercicio debe ser mayor a 0');
    }
    const exercise = await this.routineRepository.updateDayExercise(
      userId,
      routineId,
      dayId,
      dayExerciseId,
      data,
    );
    if (!exercise) {
      throw new Error('No se pudo actualizar el ejercicio planeado');
    }
    return exercise;
  }
}
