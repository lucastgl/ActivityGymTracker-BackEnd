import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { DateOnly } from '../../../domain/value-objects/date-only.vo';
import { BodyMeasurement } from '../../../domain/entities/body-measurement.entity';
import type { MeasurementRepository } from '../../../domain/repositories/measurement.repository';
import { MEASUREMENT_REPOSITORY } from './measurement-repository.token';

@Injectable()
export class ListMeasurementsUseCase {
  constructor(
    @Inject(MEASUREMENT_REPOSITORY)
    private readonly measurementRepository: MeasurementRepository,
  ) {}

  async execute(
    userId: Id,
    from: DateOnly,
    to: DateOnly,
  ): Promise<BodyMeasurement[]> {
    return this.measurementRepository.listByRange(userId, from, to);
  }
}
