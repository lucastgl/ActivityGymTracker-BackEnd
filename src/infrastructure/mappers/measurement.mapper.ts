/**
 * MAPPER: BodyMeasurement (Prisma ↔ Domain)
 *
 * Convierte entre el modelo Prisma BodyMeasurement y la entidad de dominio.
 */

import { Id } from '../../domain/value-objects/id.vo';
import { DateOnly } from '../../domain/value-objects/date-only.vo';
import { BodyMeasurement } from '../../domain/entities/body-measurement.entity';
import type { CreateMeasurementInput } from '../../domain/repositories/measurement.repository';

/** Fila BodyMeasurement de Prisma */
interface PrismaMeasurementRow {
  id: string;
  userId: string;
  date: string;
  weightKg: number;
  deltaPctFat: number;
  deltaPctMuscle: number;
  createdAt: Date;
  note: string | null;
}

/** Data para prisma.bodyMeasurement.create */
interface PrismaMeasurementCreateData {
  user: { connect: { id: string } };
  date: string;
  weightKg: number;
  deltaPctFat: number;
  deltaPctMuscle: number;
  note?: string;
}

export const MeasurementMapper = {
  toDomain(row: PrismaMeasurementRow): BodyMeasurement {
    return new BodyMeasurement(
      Id.fromString(row.id),
      Id.fromString(row.userId),
      DateOnly.fromString(row.date),
      row.weightKg,
      row.deltaPctFat,
      row.deltaPctMuscle,
      row.createdAt,
      row.note ?? undefined,
    );
  },

  toPrismaCreate(
    userId: Id,
    input: CreateMeasurementInput,
  ): PrismaMeasurementCreateData {
    return {
      user: { connect: { id: userId.value } },
      date: input.date.toString(),
      weightKg: input.weightKg,
      deltaPctFat: input.deltaPctFat,
      deltaPctMuscle: input.deltaPctMuscle,
      note: input.note,
    };
  },
};
