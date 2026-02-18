import { Id } from '../value-objects/id.vo';
import { DateOnly } from '../value-objects/date-only.vo';
import { BodyMeasurement } from '../entities/body-measurement.entity';

/**
 * Datos para crear una medición.
 */
export type CreateMeasurementInput = {
  date: DateOnly;
  weightKg: number;
  deltaPctFat: number;
  deltaPctMuscle: number;
  note?: string;
};

/**
 * MeasurementRepository - Mediciones corporales
 *
 * Guardar mediciones y obtener la última (para default interval en informes).
 * Listar por rango.
 *
 * Informes y defaults dependen de esto.
 */
export interface MeasurementRepository {
  create(
    userId: Id,
    measurement: CreateMeasurementInput,
  ): Promise<BodyMeasurement>;

  listByRange(
    userId: Id,
    from: DateOnly,
    to: DateOnly,
  ): Promise<BodyMeasurement[]>;

  getLatest(userId: Id): Promise<BodyMeasurement | null>;
}
