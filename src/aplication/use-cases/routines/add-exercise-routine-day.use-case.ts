import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { RoutineDayExercise } from '../../../domain/entities/routine-day-exercise.entity';
import type { RoutineRepository } from '../../../domain/repositories/routine.repository';
import { AddDayExerciseInput } from '../../../domain/repositories/routine.repository';
import { ROUTINE_REPOSITORY } from './routine-repository.token';

@Injectable()
export class AddExerciseToRoutineUseCase {
  constructor(
    @Inject(ROUTINE_REPOSITORY)
    private readonly routineRepository: RoutineRepository,
  ) {}

  async execute(
    userId: Id,
    routineId: Id,
    dayId: Id,
    data: AddDayExerciseInput,
  ): Promise<RoutineDayExercise> {
    // Validar input
    if (!data.exerciseId) {
      throw new Error('El ejercicio es requerido');
    }
    if (data.plannedSets <= 0) {
      throw new Error('El número de series planeadas debe ser mayor a 0');
    }
    if (!data.plannedSetsType) {
      throw new Error('El tipo de series planeadas es requerido');
    }
    if (data.order <= 0) {
      throw new Error('El orden del ejercicio debe ser mayor a 0');
    }
    const exercise = await this.routineRepository.addExerciseToDay(
      userId,
      routineId,
      dayId,
      data,
    );
    if (!exercise) {
      throw new Error('No se pudo agregar el ejercicio a la rutina');
    }
    return exercise;
  }
}
