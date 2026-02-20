import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { BodyMeasurement } from '../../../domain/entities/body-measurement.entity';
import type {
  MeasurementRepository,
  CreateMeasurementInput,
} from '../../../domain/repositories/measurement.repository';
import { MEASUREMENT_REPOSITORY } from './measurement-repository.token';

@Injectable()
export class CreateMeasurementUseCase {
  constructor(
    @Inject(MEASUREMENT_REPOSITORY)
    private readonly measurementRepository: MeasurementRepository,
  ) {}

  async execute(
    userId: Id,
    data: CreateMeasurementInput,
  ): Promise<BodyMeasurement> {
    return this.measurementRepository.create(userId, data);
  }
}
