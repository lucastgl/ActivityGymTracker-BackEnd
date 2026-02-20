import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { Routine } from '../../../domain/entities/routine.entity';
import type { RoutineRepository } from '../../../domain/repositories/routine.repository';
import { CreateRoutineInput } from '../../../domain/repositories/routine.repository';
import { ROUTINE_REPOSITORY } from './routine-repository.token';

@Injectable()
export class CreateRoutineUseCase {
  constructor(
    @Inject(ROUTINE_REPOSITORY)
    private readonly routineRepository: RoutineRepository,
  ) {}

  async execute(userId: Id, data: CreateRoutineInput): Promise<Routine> {
    // Validar input
    if (!data.name?.trim()) {
      throw new Error('El nombre de la rutina es requerido');
    }

    return this.routineRepository.createRoutine(userId, data);
  }
}
