import { Module } from '@nestjs/common';
import { ListRoutinesUseCase } from './list-routines.use-case';
import { CreateRoutineUseCase } from './create-routine.use-case';
import { AddRoutineDayUseCase } from './add-routine-day.use-case';
import { AddExerciseToRoutineUseCase } from './add-exercise-routine-day.use-case';
import { UpdateRoutineDayExerciseUseCase } from './update-routine-day-exercise.use-case';
import { UpdateRoutineUseCase } from './update-routine.use-case';
import { UpdateRoutineDayUseCase } from './update-routine-day.use-case';
import { GetRoutineDetailUseCase } from './get-routine-detail.use-case';
import { ActivateRoutineForDateUseCase } from './activate-routine-for-date.use-case';
import { ROUTINE_REPOSITORY } from './routine-repository.token';
import { PrismaRoutineRepository } from '../../../infrastructure/repositories/prisma-routine.repository';
import { PrismaModule } from '../../../infrastructure/db/prisma.module';
import { WorkoutsModule } from '../workouts/workouts.module';
import { RoutinesController } from '../../../presentation/http/controllers/routines.controller';

/**
 * RoutinesModule - Feature module de rutinas
 *
 * - providers: use cases + binding ROUTINE_REPOSITORY → PrismaRoutineRepository
 * - imports WorkoutsModule (para WORKOUT_REPOSITORY en ActivateRoutineForDateUseCase)
 * - controllers: RoutinesController
 */
@Module({
  imports: [PrismaModule, WorkoutsModule],
  providers: [
    ListRoutinesUseCase,
    CreateRoutineUseCase,
    AddRoutineDayUseCase,
    AddExerciseToRoutineUseCase,
    UpdateRoutineDayExerciseUseCase,
    UpdateRoutineUseCase,
    UpdateRoutineDayUseCase,
    GetRoutineDetailUseCase,
    ActivateRoutineForDateUseCase,
    { provide: ROUTINE_REPOSITORY, useClass: PrismaRoutineRepository },
  ],
  controllers: [RoutinesController],
  exports: [
    ListRoutinesUseCase,
    CreateRoutineUseCase,
    AddRoutineDayUseCase,
    AddExerciseToRoutineUseCase,
    UpdateRoutineDayExerciseUseCase,
    UpdateRoutineUseCase,
    UpdateRoutineDayUseCase,
    GetRoutineDetailUseCase,
    ActivateRoutineForDateUseCase,
  ],
})
export class RoutinesModule {}
