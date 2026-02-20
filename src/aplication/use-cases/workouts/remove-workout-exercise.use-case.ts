import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import type { WorkoutRepository } from '../../../domain/repositories/workout.repository';
import { WORKOUT_REPOSITORY } from './workout-repository.token';

@Injectable()
export class RemoveWorkoutExerciseUseCase {
  constructor(
    @Inject(WORKOUT_REPOSITORY)
    private readonly workoutRepository: WorkoutRepository,
  ) {}

  async execute(
    userId: Id,
    workoutExerciseId: Id,
  ): Promise<boolean> {
    return this.workoutRepository.removeWorkoutExercise(
      userId,
      workoutExerciseId,
    );
  }
}
