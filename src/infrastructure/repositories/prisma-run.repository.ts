/**
 * PrismaRunRepository - Implementación de RunRepository
 *
 * Sesiones de running por fecha (userId+date unique).
 * upsertRunSession: crea o actualiza (distanceKm, durationSec, status, injuryMode, note).
 * replaceSplits: reemplaza la lista completa de parciales.
 */

import { Injectable } from '@nestjs/common';
import { Id } from '../../domain/value-objects/id.vo';
import { DateOnly } from '../../domain/value-objects/date-only.vo';
import { RunSession } from '../../domain/entities/run-session.entity';
import { RunSplit } from '../../domain/entities/run-split.entity';
import type {
  RunRepository,
  RunSessionDetail,
  UpsertRunSessionInput,
  ReplaceSplitInput,
} from '../../domain/repositories/run.repository';
import { PrismaService } from '../db/prisma.service';
import { RunSessionMapper, RunSplitMapper, toRunSessionDetail } from '../mappers/run.mapper';

@Injectable()
export class PrismaRunRepository implements RunRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getByDate(userId: Id, date: DateOnly): Promise<RunSessionDetail | null> {
    const session = await this.prisma.runSession.findUnique({
      where: { userId_date: { userId: userId.value, date: date.toString() } },
      include: { splits: { orderBy: { order: 'asc' } } },
    });
    if (!session) return null;
    return toRunSessionDetail(session, session.splits);
  }

  async upsertRunSession(
    userId: Id,
    date: DateOnly,
    data: UpsertRunSessionInput,
  ): Promise<RunSession> {
    const existing = await this.prisma.runSession.findUnique({
      where: { userId_date: { userId: userId.value, date: date.toString() } },
    });
    if (existing) {
      const updated = await this.prisma.runSession.update({
        where: { id: existing.id },
        data: RunSessionMapper.toPrismaUpsert(data),
      });
      return RunSessionMapper.toDomain(updated);
    }
    const created = await this.prisma.runSession.create({
      data: {
        user: { connect: { id: userId.value } },
        date: date.toString(),
        distanceKm: data.distanceKm,
        durationSec: data.durationSec,
        status: data.status ?? 'DRAFT',
        injuryMode: data.injuryMode ?? false,
        note: data.note,
      },
    });
    return RunSessionMapper.toDomain(created);
  }

  async replaceSplits(
    userId: Id,
    runSessionId: Id,
    splits: ReplaceSplitInput[],
  ): Promise<RunSplit[]> {
    const session = await this.prisma.runSession.findFirst({
      where: { id: runSessionId.value, userId: userId.value },
    });
    if (!session) return [];
    await this.prisma.runSplit.deleteMany({ where: { runSessionId: runSessionId.value } });
    if (splits.length === 0) return [];
    const created = await this.prisma.runSplit.createManyAndReturn({
      data: splits.map((s) => ({
        runSessionId: runSessionId.value,
        order: s.order,
        distanceKm: s.distanceKm,
        durationSec: s.durationSec,
      })),
    });
    return created.map((r) => RunSplitMapper.toDomain(r));
  }

  async completeRun(userId: Id, runSessionId: Id): Promise<RunSession | null> {
    const session = await this.prisma.runSession.findFirst({
      where: { id: runSessionId.value, userId: userId.value },
    });
    if (!session) return null;
    const updated = await this.prisma.runSession.update({
      where: { id: runSessionId.value },
      data: { status: 'COMPLETED' },
    });
    return RunSessionMapper.toDomain(updated);
  }

  async revertToDraft(userId: Id, runSessionId: Id): Promise<RunSession | null> {
    const session = await this.prisma.runSession.findFirst({
      where: { id: runSessionId.value, userId: userId.value },
    });
    if (!session) return null;
    const updated = await this.prisma.runSession.update({
      where: { id: runSessionId.value },
      data: { status: 'DRAFT' },
    });
    return RunSessionMapper.toDomain(updated);
  }
}
