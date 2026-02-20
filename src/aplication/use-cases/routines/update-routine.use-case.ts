import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { Routine } from '../../../domain/entities/routine.entity';
import type { RoutineRepository } from '../../../domain/repositories/routine.repository';
import { UpdateRoutinePatch } from '../../../domain/repositories/routine.repository';
import { ROUTINE_REPOSITORY } from './routine-repository.token';

/**
 * UpdateRoutineUseCase
 *
 * Actualiza los datos de la rutina (plantilla): name, notes.
 * Usa: updateRoutine(userId, routineId, patch) con UpdateRoutinePatch.
 */
@Injectable()
export class UpdateRoutineUseCase {
  constructor(
    @Inject(ROUTINE_REPOSITORY)
    private readonly routineRepository: RoutineRepository,
  ) {}

  async execute(
    userId: Id,
    routineId: Id,
    patch: UpdateRoutinePatch,
  ): Promise<Routine | null> {
    const hasUpdates =
      patch &&
      Object.keys(patch).length > 0 &&
      Object.values(patch).some((v) => v !== undefined);

    if (!hasUpdates) {
      throw new Error('El patch debe contener al menos un campo a actualizar');
    }

    return this.routineRepository.updateRoutine(userId, routineId, patch);
  }
}
