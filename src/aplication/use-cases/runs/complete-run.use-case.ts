import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { RunSession } from '../../../domain/entities/run-session.entity';
import type { RunRepository } from '../../../domain/repositories/run.repository';
import { RUN_REPOSITORY } from './run-repository.token';

@Injectable()
export class CompleteRunUseCase {
  constructor(
    @Inject(RUN_REPOSITORY)
    private readonly runRepository: RunRepository,
  ) {}

  async execute(userId: Id, runSessionId: Id): Promise<RunSession | null> {
    return this.runRepository.completeRun(userId, runSessionId);
  }
}
