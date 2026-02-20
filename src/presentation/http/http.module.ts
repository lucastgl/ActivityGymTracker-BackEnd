import { Module } from '@nestjs/common';
import { ExercisesModule } from '../../aplication/use-cases/exercises/exercises.module';
import { RoutinesModule } from '../../aplication/use-cases/routines/routines.module';
import { WorkoutsModule } from '../../aplication/use-cases/workouts/workouts.module';
import { RunsModule } from '../../aplication/use-cases/runs/runs.module';
import { MeasurementsModule } from '../../aplication/use-cases/measurements/measurements.module';
import { CalendarModule } from '../../aplication/use-cases/calendar/calendar.module';
import { ReportsModule } from '../../aplication/use-cases/reports/reports.module';

/**
 * HttpModule - Agregador de feature modules
 *
 * Cada feature module declara su propio controller.
 * Este módulo solo importa y re-exporta los módulos de features.
 */
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
})
export class HttpModule {}
