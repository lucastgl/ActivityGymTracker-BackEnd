import { Module } from '@nestjs/common';
import { ExercisesModule } from '../../aplication/use-cases/exercises/exercises.module';
import { RoutinesModule } from '../../aplication/use-cases/routines/routines.module';
import { WorkoutsModule } from '../../aplication/use-cases/workouts/workouts.module';
import { RunsModule } from '../../aplication/use-cases/runs/runs.module';
import { MeasurementsModule } from '../../aplication/use-cases/measurements/measurements.module';
import { CalendarModule } from '../../aplication/use-cases/calendar/calendar.module';
import { ReportsModule } from '../../aplication/use-cases/reports/reports.module';
import {
  ExercisesController,
  RoutinesController,
  WorkoutsController,
  RunsController,
  MeasurementsController,
  CalendarController,
  ReportsController,
} from './controllers';

@Module({
  imports: [
    ExercisesModule,
    RoutinesModule,
    WorkoutsModule,
    RunsModule,
    MeasurementsModule,
    CalendarModule,
    ReportsModule,
  ],
  controllers: [
    ExercisesController,
    RoutinesController,
    WorkoutsController,
    RunsController,
    MeasurementsController,
    CalendarController,
    ReportsController,
  ],
})
export class HttpModule {}
