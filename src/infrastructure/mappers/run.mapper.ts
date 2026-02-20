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
import type {
  UpsertRunSessionInput,
  RunSessionDetail,
} from '../../domain/repositories/run.repository';
import type { SessionStatus } from '../../domain/enums/session-status.enum';

/** Fila RunSession de Prisma */
interface PrismaRunSessionRow {
  id: string;
  userId: string;
  date: string;
  distanceKm: number;
  durationSec: number;
  status: string;
  injuryMode: boolean;
  createdAt: Date;
  updatedAt: Date;
  note: string | null;
}

/** Fila RunSplit de Prisma */
interface PrismaRunSplitRow {
  id: string;
  runSessionId: string;
  order: number;
  distanceKm: number;
  durationSec: number;
}

/** Data para prisma.runSession.update */
interface PrismaRunSessionUpdateData {
  distanceKm?: number;
  durationSec?: number;
  status?: SessionStatus;
  injuryMode?: boolean;
  note?: string;
}

export const RunSessionMapper = {
  toDomain(row: PrismaRunSessionRow): RunSession {
    return new RunSession(
      Id.fromString(row.id),
      Id.fromString(row.userId),
      DateOnly.fromString(row.date),
      row.distanceKm,
      row.durationSec,
      row.status as SessionStatus,
      row.injuryMode,
      row.createdAt,
      row.updatedAt,
      row.note ?? undefined,
    );
  },

  toPrismaUpsert(data: UpsertRunSessionInput): PrismaRunSessionUpdateData {
    const update: PrismaRunSessionUpdateData = {
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
  toDomain(row: PrismaRunSplitRow): RunSplit {
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
  session: PrismaRunSessionRow,
  splits: PrismaRunSplitRow[],
): RunSessionDetail {
  return {
    ...RunSessionMapper.toDomain(session),
    splits: splits.map((s) => RunSplitMapper.toDomain(s)),
  };
}
