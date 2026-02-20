import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { WorkoutSet } from '../../../domain/entities/workout-set.entity';
import type {
  WorkoutRepository,
  UpsertSetInput,
} from '../../../domain/repositories/workout.repository';
import { WORKOUT_REPOSITORY } from './workout-repository.token';

@Injectable()
export class UpsertWorkoutSetUseCase {
  constructor(
    @Inject(WORKOUT_REPOSITORY)
    private readonly workoutRepository: WorkoutRepository,
  ) {}

  async execute(
    userId: Id,
    workoutExerciseId: Id,
    set: UpsertSetInput,
  ): Promise<WorkoutSet | null> {
    return this.workoutRepository.upsertSet(
      userId,
      workoutExerciseId,
      set,
    );
  }
}
