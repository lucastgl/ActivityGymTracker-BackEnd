import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { RoutineDay } from '../../../domain/entities/routine-day.entity';
import type { RoutineRepository } from '../../../domain/repositories/routine.repository';
import { UpdateDayPatch } from '../../../domain/repositories/routine.repository';
import { ROUTINE_REPOSITORY } from './routine-repository.token';

/**
 * UpdateRoutineDayUseCase
 *
 * Actualiza los datos de un día de la rutina: dayKey, order.
 * Usa: updateDay(userId, routineId, dayId, patch) con UpdateDayPatch.
 */
@Injectable()
export class UpdateRoutineDayUseCase {
  constructor(
    @Inject(ROUTINE_REPOSITORY)
    private readonly routineRepository: RoutineRepository,
  ) {}

  async execute(
    userId: Id,
    routineId: Id,
    dayId: Id,
    patch: UpdateDayPatch,
  ): Promise<RoutineDay | null> {
    const hasUpdates =
      patch &&
      Object.keys(patch).length > 0 &&
      Object.values(patch).some((v) => v !== undefined);

    if (!hasUpdates) {
      throw new Error('El patch debe contener al menos un campo a actualizar');
    }

    return this.routineRepository.updateDay(userId, routineId, dayId, patch);
  }
}
