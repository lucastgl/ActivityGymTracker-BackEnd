import { Module } from '@nestjs/common';
import { GetWorkoutByDateUseCase } from './get-workout-by-date.use-case';
import { UpsertWorkoutSessionUseCase } from './upsert-workout-session.use-case';
import { AddExerciseToWorkoutUseCase } from './add-exercise-to-workout.use-case';
import { UpsertWorkoutSetUseCase } from './upsert-workout-set.use-case';
import { UpsertWorkoutDropsUseCase } from './upsert-workout-drops.use-case';
import { CompleteWorkoutUseCase } from './complete-workout.use-case';
import { RevertWorkoutToDraftUseCase } from './revert-workout-to-draft.use-case';
import { RemoveWorkoutExerciseUseCase } from './remove-workout-exercise.use-case';
import { WORKOUT_REPOSITORY } from './workout-repository.token';
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [
    GetWorkoutByDateUseCase,
    UpsertWorkoutSessionUseCase,
    AddExerciseToWorkoutUseCase,
    UpsertWorkoutSetUseCase,
    UpsertWorkoutDropsUseCase,
    CompleteWorkoutUseCase,
    RevertWorkoutToDraftUseCase,
    RemoveWorkoutExerciseUseCase,
  ],
  exports: [
    GetWorkoutByDateUseCase,
    UpsertWorkoutSessionUseCase,
    AddExerciseToWorkoutUseCase,
    UpsertWorkoutSetUseCase,
    UpsertWorkoutDropsUseCase,
    CompleteWorkoutUseCase,
    RevertWorkoutToDraftUseCase,
    RemoveWorkoutExerciseUseCase,
    WORKOUT_REPOSITORY,
  ],
})
export class WorkoutsModule {}
