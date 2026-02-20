import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import type { RoutineRepository } from '../../../domain/repositories/routine.repository';
import type { RoutineDetail } from '../../../domain/repositories/routine.repository';
import { ROUTINE_REPOSITORY } from './routine-repository.token';

/**
 * GetRoutineDetailUseCase
 *
 * Trae la rutina completa con su estructura: days + ejercicios planeados.
 * Usado para: vista de detalle, activar rutina para una fecha.
 */
@Injectable()
export class GetRoutineDetailUseCase {
  constructor(
    @Inject(ROUTINE_REPOSITORY)
    private readonly routineRepository: RoutineRepository,
  ) {}

  async execute(userId: Id, routineId: Id): Promise<RoutineDetail | null> {
    return this.routineRepository.getRoutineDetail(userId, routineId);
  }
}
