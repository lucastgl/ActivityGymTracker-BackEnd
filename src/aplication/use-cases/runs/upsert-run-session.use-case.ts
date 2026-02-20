import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { DateOnly } from '../../../domain/value-objects/date-only.vo';
import { RunSession } from '../../../domain/entities/run-session.entity';
import type {
  RunRepository,
  UpsertRunSessionInput,
} from '../../../domain/repositories/run.repository';
import { RUN_REPOSITORY } from './run-repository.token';

@Injectable()
export class UpsertRunSessionUseCase {
  constructor(
    @Inject(RUN_REPOSITORY)
    private readonly runRepository: RunRepository,
  ) {}

  async execute(
    userId: Id,
    date: DateOnly,
    data: UpsertRunSessionInput,
  ): Promise<RunSession> {
    return this.runRepository.upsertRunSession(userId, date, data);
  }
}
