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
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
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
  ],
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
