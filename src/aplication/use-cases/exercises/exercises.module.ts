import { Module } from '@nestjs/common';
import { CreateExerciseUseCase } from './create-exercise.use-case';
import { ListExercisesUseCase } from './list-exercises.use-case';
import { UpdateExerciseUseCase } from './update-exercise.use-case';
import { DeactivateExerciseUseCase } from './deactivate-exercise.use-case';
import { RestoreExerciseUseCase } from './restore-exercise.use-case';
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module';

/**
 * ExercisesModule
 *
 * Usa InfrastructureModule para EXERCISE_REPOSITORY (Prisma).
 * Para desarrollo sin BD: importar StubsModule en lugar de InfrastructureModule.
 */
@Module({
  imports: [InfrastructureModule],
  providers: [
    CreateExerciseUseCase,
    ListExercisesUseCase,
    UpdateExerciseUseCase,
    DeactivateExerciseUseCase,
    RestoreExerciseUseCase,
  ],
  exports: [
    CreateExerciseUseCase,
    ListExercisesUseCase,
    UpdateExerciseUseCase,
    DeactivateExerciseUseCase,
    RestoreExerciseUseCase,
  ],
})
export class ExercisesModule {}
