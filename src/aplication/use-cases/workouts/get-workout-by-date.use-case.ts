import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { DateOnly } from '../../../domain/value-objects/date-only.vo';
import type {
  WorkoutRepository,
  WorkoutSessionDetail,
} from '../../../domain/repositories/workout.repository';
import { WORKOUT_REPOSITORY } from './workout-repository.token';

@Injectable()
export class GetWorkoutByDateUseCase {
  constructor(
    @Inject(WORKOUT_REPOSITORY)
    private readonly workoutRepository: WorkoutRepository,
  ) {}

  async execute(
    userId: Id,
    date: DateOnly,
  ): Promise<WorkoutSessionDetail | null> {
    return this.workoutRepository.getByDate(userId, date);
  }
}
