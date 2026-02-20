/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */

import { Id } from '../../../domain/value-objects/id.vo';
import { DateOnly } from '../../../domain/value-objects/date-only.vo';
import { BodyMeasurement } from '../../../domain/entities/body-measurement.entity';
import type {
  MeasurementRepository,
  CreateMeasurementInput,
} from '../../../domain/repositories/measurement.repository';

export class MeasurementRepositoryStub implements MeasurementRepository {
  async create(
    userId: Id,
    measurement: CreateMeasurementInput,
  ): Promise<BodyMeasurement> {
    void userId;
    void measurement;
    throw new Error(
      'MeasurementRepository no implementado. Agregar PrismaMeasurementRepository.',
    );
  }

  async listByRange(
    userId: Id,
    from: DateOnly,
    to: DateOnly,
  ): Promise<BodyMeasurement[]> {
    void userId;
    void from;
    void to;
    throw new Error(
      'MeasurementRepository no implementado. Agregar PrismaMeasurementRepository.',
    );
  }

  async getLatest(userId: Id): Promise<BodyMeasurement | null> {
    void userId;
    throw new Error(
      'MeasurementRepository no implementado. Agregar PrismaMeasurementRepository.',
    );
  }
}
