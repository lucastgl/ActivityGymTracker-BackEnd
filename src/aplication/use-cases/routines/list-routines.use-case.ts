import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { Routine } from '../../../domain/entities/routine.entity';
import type { RoutineRepository } from '../../../domain/repositories/routine.repository';
import { ROUTINE_REPOSITORY } from './routine-repository.token';

@Injectable()
export class ListRoutinesUseCase {
  constructor(
    @Inject(ROUTINE_REPOSITORY)
    private readonly routineRepository: RoutineRepository,
  ) {}

  async execute(userId: Id): Promise<Routine[]> {
    return this.routineRepository.listRoutines(userId);
  }
}
