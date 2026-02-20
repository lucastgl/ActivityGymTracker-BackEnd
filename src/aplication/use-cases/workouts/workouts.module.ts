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
import { PrismaWorkoutRepository } from '../../../infrastructure/repositories/prisma-workout.repository';
import { PrismaModule } from '../../../infrastructure/db/prisma.module';
import { WorkoutsController } from '../../../presentation/http/controllers/workouts.controller';

/**
 * WorkoutsModule - Feature module de sesiones de musculación
 *
 * - providers: use cases + binding WORKOUT_REPOSITORY → PrismaWorkoutRepository
 * - controllers: WorkoutsController
 * - exports WORKOUT_REPOSITORY (usado por RoutinesModule, CalendarModule)
 */
@Module({
  imports: [PrismaModule],
  providers: [
    GetWorkoutByDateUseCase,
    UpsertWorkoutSessionUseCase,
    AddExerciseToWorkoutUseCase,
    UpsertWorkoutSetUseCase,
    UpsertWorkoutDropsUseCase,
    CompleteWorkoutUseCase,
    RevertWorkoutToDraftUseCase,
    RemoveWorkoutExerciseUseCase,
    { provide: WORKOUT_REPOSITORY, useClass: PrismaWorkoutRepository },
  ],
  controllers: [WorkoutsController],
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
