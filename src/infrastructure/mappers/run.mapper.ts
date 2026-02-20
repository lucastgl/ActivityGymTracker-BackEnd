/**
 * MAPPER: RunSession, RunSplit (Prisma ↔ Domain)
 *
 * Convierte entre modelos Prisma y entidades de dominio.
 * RunSessionDetail incluye splits.
 */

import { Id } from '../../domain/value-objects/id.vo';
import { DateOnly } from '../../domain/value-objects/date-only.vo';
import { RunSession } from '../../domain/entities/run-session.entity';
import { RunSplit } from '../../domain/entities/run-split.entity';
import type { UpsertRunSessionInput } from '../../domain/repositories/run.repository';
import type { RunSession as PrismaRunSession, RunSplit as PrismaRunSplit } from '@prisma/client';
import { Prisma } from '@prisma/client';

export const RunSessionMapper = {
  toDomain(row: PrismaRunSession): RunSession {
    return new RunSession(
      Id.fromString(row.id),
      Id.fromString(row.userId),
      DateOnly.fromString(row.date),
      row.distanceKm,
      row.durationSec,
      row.status as RunSession['status'],
      row.injuryMode,
      row.createdAt,
      row.updatedAt,
      row.note ?? undefined,
    );
  },

  toPrismaUpsert(data: UpsertRunSessionInput): Prisma.RunSessionUpdateInput {
    const update: Prisma.RunSessionUpdateInput = {
      distanceKm: data.distanceKm,
      durationSec: data.durationSec,
    };
    if (data.status !== undefined) update.status = data.status;
    if (data.injuryMode !== undefined) update.injuryMode = data.injuryMode;
    if (data.note !== undefined) update.note = data.note;
    return update;
  },
};

export const RunSplitMapper = {
  toDomain(row: PrismaRunSplit): RunSplit {
    return new RunSplit(
      Id.fromString(row.id),
      Id.fromString(row.runSessionId),
      row.order,
      row.distanceKm,
      row.durationSec,
    );
  },
};

export function toRunSessionDetail(
  session: PrismaRunSession,
  splits: PrismaRunSplit[],
): import('../../domain/repositories/run.repository').RunSessionDetail {
  return {
    ...RunSessionMapper.toDomain(session),
    splits: splits.map((s) => RunSplitMapper.toDomain(s)),
  };
}
