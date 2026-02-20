import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { RunSplit } from '../../../domain/entities/run-split.entity';
import type {
  RunRepository,
  ReplaceSplitInput,
} from '../../../domain/repositories/run.repository';
import { RUN_REPOSITORY } from './run-repository.token';

@Injectable()
export class UpdateSplitsUseCase {
  constructor(
    @Inject(RUN_REPOSITORY)
    private readonly runRepository: RunRepository,
  ) {}

  async execute(
    userId: Id,
    runSessionId: Id,
    splits: ReplaceSplitInput[],
  ): Promise<RunSplit[]> {
    return this.runRepository.replaceSplits(userId, runSessionId, splits);
  }
}
