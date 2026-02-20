import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { RoutineDay } from '../../../domain/entities/routine-day.entity';
import type { RoutineRepository } from '../../../domain/repositories/routine.repository';
import { AddDayInput } from '../../../domain/repositories/routine.repository';
import { ROUTINE_REPOSITORY } from './routine-repository.token';

@Injectable()
export class AddRoutineDayUseCase {
  constructor(
    @Inject(ROUTINE_REPOSITORY)
    private readonly routineRepository: RoutineRepository,
  ) {}

  async execute(
    userId: Id,
    routineId: Id,
    data: AddDayInput,
  ): Promise<RoutineDay> {
    // Validar input
    if (!data.dayKey?.trim()) {
      throw new Error('La clave del día es requerida');
    }
    if (data.order <= 0) {
      throw new Error('El orden del día debe ser mayor a 0');
    }
    const day = await this.routineRepository.addDay(userId, routineId, data);
    if (!day) {
      throw new Error('No se pudo agregar el día a la rutina');
    }
    return day;
  }
}
