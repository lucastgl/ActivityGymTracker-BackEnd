import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { WorkoutDrop } from '../../../domain/entities/workout-drop.entity';
import type {
  WorkoutRepository,
  ReplaceDropInput,
} from '../../../domain/repositories/workout.repository';
import { WORKOUT_REPOSITORY } from './workout-repository.token';

@Injectable()
export class UpsertWorkoutDropsUseCase {
  constructor(
    @Inject(WORKOUT_REPOSITORY)
    private readonly workoutRepository: WorkoutRepository,
  ) {}

  async execute(
    userId: Id,
    workoutSetId: Id,
    drops: ReplaceDropInput[],
  ): Promise<WorkoutDrop[]> {
    return this.workoutRepository.replaceDrops(
      userId,
      workoutSetId,
      drops,
    );
  }
}
