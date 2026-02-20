import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { DateOnly } from '../../../domain/value-objects/date-only.vo';
import { WorkoutSession } from '../../../domain/entities/workout-session.entity';
import type {
  WorkoutRepository,
  UpsertSessionMetaInput,
} from '../../../domain/repositories/workout.repository';
import { WORKOUT_REPOSITORY } from './workout-repository.token';

@Injectable()
export class UpsertWorkoutSessionUseCase {
  constructor(
    @Inject(WORKOUT_REPOSITORY)
    private readonly workoutRepository: WorkoutRepository,
  ) {}

  async execute(
    userId: Id,
    date: DateOnly,
    meta: UpsertSessionMetaInput,
  ): Promise<WorkoutSession> {
    return this.workoutRepository.upsertSessionMeta(userId, date, meta);
  }
}
