/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */

import { Id } from '../../../domain/value-objects/id.vo';
import { DateOnly } from '../../../domain/value-objects/date-only.vo';
import { RunSession } from '../../../domain/entities/run-session.entity';
import { RunSplit } from '../../../domain/entities/run-split.entity';
import type {
  RunRepository,
  RunSessionDetail,
  UpsertRunSessionInput,
  ReplaceSplitInput,
} from '../../../domain/repositories/run.repository';

export class RunRepositoryStub implements RunRepository {
  async getByDate(): Promise<RunSessionDetail | null> {
    throw new Error(
      'RunRepository no implementado. Agregar PrismaRunRepository.',
    );
  }

  async upsertRunSession(
    userId: Id,
    date: DateOnly,
    data: UpsertRunSessionInput,
  ): Promise<RunSession> {
    void userId;
    void date;
    void data;
    throw new Error(
      'RunRepository no implementado. Agregar PrismaRunRepository.',
    );
  }

  async replaceSplits(
    userId: Id,
    runSessionId: Id,
    splits: ReplaceSplitInput[],
  ): Promise<RunSplit[]> {
    void userId;
    void runSessionId;
    void splits;
    throw new Error(
      'RunRepository no implementado. Agregar PrismaRunRepository.',
    );
  }

  async completeRun(
    userId: Id,
    runSessionId: Id,
  ): Promise<RunSession | null> {
    void userId;
    void runSessionId;
    throw new Error(
      'RunRepository no implementado. Agregar PrismaRunRepository.',
    );
  }

  async revertToDraft(
    userId: Id,
    runSessionId: Id,
  ): Promise<RunSession | null> {
    void userId;
    void runSessionId;
    throw new Error(
      'RunRepository no implementado. Agregar PrismaRunRepository.',
    );
  }
}
