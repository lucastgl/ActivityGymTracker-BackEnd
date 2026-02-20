import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { WorkoutExercise } from '../../../domain/entities/workout-exercise.entity';
import type { WorkoutRepository } from '../../../domain/repositories/workout.repository';
import { OriginType } from '../../../domain/enums/origin-type.enum';
import { WORKOUT_REPOSITORY } from './workout-repository.token';

@Injectable()
export class AddExerciseToWorkoutUseCase {
  constructor(
    @Inject(WORKOUT_REPOSITORY)
    private readonly workoutRepository: WorkoutRepository,
  ) {}

  async execute(
    userId: Id,
    sessionId: Id,
    exerciseId: Id,
    origin: OriginType,
    order: number,
  ): Promise<WorkoutExercise | null> {
    return this.workoutRepository.addExerciseToSession(
      userId,
      sessionId,
      exerciseId,
      origin,
      order,
    );
  }
}
