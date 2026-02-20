import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { DateOnly } from '../../../domain/value-objects/date-only.vo';
import type {
  RunRepository,
  RunSessionDetail,
} from '../../../domain/repositories/run.repository';
import { RUN_REPOSITORY } from './run-repository.token';

@Injectable()
export class GetRunByDateUseCase {
  constructor(
    @Inject(RUN_REPOSITORY)
    private readonly runRepository: RunRepository,
  ) {}

  async execute(
    userId: Id,
    date: DateOnly,
  ): Promise<RunSessionDetail | null> {
    return this.runRepository.getByDate(userId, date);
  }
}
