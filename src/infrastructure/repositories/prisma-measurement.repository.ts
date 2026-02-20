/**
 * PrismaMeasurementRepository - Implementación de MeasurementRepository
 *
 * Mediciones corporales (peso, % grasa, % músculo).
 * getLatest: última medición para defaults en informes.
 * listByRange: listado por rango de fechas.
 */

import { Injectable } from '@nestjs/common';
import { Id } from '../../domain/value-objects/id.vo';
import { DateOnly } from '../../domain/value-objects/date-only.vo';
import { BodyMeasurement } from '../../domain/entities/body-measurement.entity';
import type {
  MeasurementRepository,
  CreateMeasurementInput,
} from '../../domain/repositories/measurement.repository';
import { PrismaService } from '../db/prisma.service';
import { MeasurementMapper } from '../mappers/measurement.mapper';

@Injectable()
export class PrismaMeasurementRepository implements MeasurementRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: Id,
    measurement: CreateMeasurementInput,
  ): Promise<BodyMeasurement> {
    const created = await this.prisma.bodyMeasurement.create({
      data: MeasurementMapper.toPrismaCreate(userId, measurement),
    });
    return MeasurementMapper.toDomain(created);
  }

  async listByRange(
    userId: Id,
    from: DateOnly,
    to: DateOnly,
  ): Promise<BodyMeasurement[]> {
    const rows = await this.prisma.bodyMeasurement.findMany({
      where: {
        userId: userId.value,
        date: { gte: from.toString(), lte: to.toString() },
      },
      orderBy: { date: 'asc' },
    });
    return rows.map((r) => MeasurementMapper.toDomain(r));
  }

  async getLatest(userId: Id): Promise<BodyMeasurement | null> {
    const row = await this.prisma.bodyMeasurement.findFirst({
      where: { userId: userId.value },
      orderBy: { date: 'desc' },
    });
    return row ? MeasurementMapper.toDomain(row) : null;
  }
}
