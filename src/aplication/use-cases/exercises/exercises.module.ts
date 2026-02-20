import { Module } from '@nestjs/common';
import { CreateExerciseUseCase } from './create-exercise.use-case';
import { ListExercisesUseCase } from './list-exercises.use-case';
import { UpdateExerciseUseCase } from './update-exercise.use-case';
import { DeactivateExerciseUseCase } from './deactivate-exercise.use-case';
import { RestoreExerciseUseCase } from './restore-exercise.use-case';
import { EXERCISE_REPOSITORY } from './exercise-repository.token';
import { PrismaExerciseRepository } from '../../../infrastructure/repositories/prisma-exercise.repository';
import { PrismaModule } from '../../../infrastructure/db/prisma.module';
import { ExercisesController } from '../../../presentation/http/controllers/exercises.controller';

/**
 * ExercisesModule - Feature module de ejercicios
 *
 * - providers: use cases + binding token → PrismaExerciseRepository
 * - controllers: ExercisesController
 */
@Module({
  imports: [PrismaModule],
  providers: [
    CreateExerciseUseCase,
    ListExercisesUseCase,
    UpdateExerciseUseCase,
    DeactivateExerciseUseCase,
    RestoreExerciseUseCase,
    { provide: EXERCISE_REPOSITORY, useClass: PrismaExerciseRepository },
  ],
  controllers: [ExercisesController],
  exports: [
    CreateExerciseUseCase,
    ListExercisesUseCase,
    UpdateExerciseUseCase,
    DeactivateExerciseUseCase,
    RestoreExerciseUseCase,
  ],
})
export class ExercisesModule {}
