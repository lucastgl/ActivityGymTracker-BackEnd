import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { WorkoutSession } from '../../../domain/entities/workout-session.entity';
import type { WorkoutRepository } from '../../../domain/repositories/workout.repository';
import { WORKOUT_REPOSITORY } from './workout-repository.token';

@Injectable()
export class CompleteWorkoutUseCase {
  constructor(
    @Inject(WORKOUT_REPOSITORY)
    private readonly workoutRepository: WorkoutRepository,
  ) {}

  async execute(userId: Id, sessionId: Id): Promise<WorkoutSession | null> {
    return this.workoutRepository.completeSession(userId, sessionId);
  }
}
