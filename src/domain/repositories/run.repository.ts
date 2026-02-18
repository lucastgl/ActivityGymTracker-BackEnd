import { Id } from '../value-objects/id.vo';
import { DateOnly } from '../value-objects/date-only.vo';
import { RunSession } from '../entities/run-session.entity';
import { RunSplit } from '../entities/run-split.entity';
import { SessionStatus } from '../enums/session-status.enum';

/**
 * Sesión de running con sus splits (parciales).
 */
export type RunSessionDetail = RunSession & {
  splits: RunSplit[];
};

/**
 * Parcial para upsert de sesión de running.
 */
export type UpsertRunSessionInput = {
  distanceKm: number;
  durationSec: number;
  status?: SessionStatus;
  injuryMode?: boolean;
  note?: string;
};

/**
 * Datos para un split (parcial).
 */
export type ReplaceSplitInput = {
  order: number;
  distanceKm: number;
  durationSec: number;
};

/**
 * RunRepository - Running ejecución
 *
 * Sesión por fecha (distancia, duración, status, injuryMode, notas).
 * Splits (parciales) asociados.
 *
 * replaceSplits: la UI suele editar lista completa de parciales.
 */
export interface RunRepository {
  /**
   * Devuelve run + splits por fecha.
   */
  getByDate(userId: Id, date: DateOnly): Promise<RunSessionDetail | null>;

  upsertRunSession(
    userId: Id,
    date: DateOnly,
    data: UpsertRunSessionInput,
  ): Promise<RunSession>;

  replaceSplits(
    userId: Id,
    runSessionId: Id,
    splits: ReplaceSplitInput[],
  ): Promise<RunSplit[]>;

  completeRun(userId: Id, runSessionId: Id): Promise<RunSession | null>;

  revertToDraft(userId: Id, runSessionId: Id): Promise<RunSession | null>;
}
