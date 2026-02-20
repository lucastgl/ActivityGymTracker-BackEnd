import { Module } from '@nestjs/common';
import { GetCalendarMonthUseCase } from './get-calendar-month.use-case';
import { GetDaySummaryUseCase } from './get-day-summary.use-case';
import { CALENDAR_QUERY_REPOSITORY } from './calendar-query.token';
import { CalendarQueryRepositoryImpl } from '../../ports/calendar-query.repository';
import { WorkoutsModule } from '../workouts/workouts.module';
import { RunsModule } from '../runs/runs.module';
import { WORKOUT_REPOSITORY } from '../workouts/workout-repository.token';
import { RUN_REPOSITORY } from '../runs/run-repository.token';

@Module({
  imports: [WorkoutsModule, RunsModule],
  providers: [
    GetCalendarMonthUseCase,
    GetDaySummaryUseCase,
    {
      provide: CALENDAR_QUERY_REPOSITORY,
      useFactory: (workoutRepo: unknown, runRepo: unknown) => {
        return new CalendarQueryRepositoryImpl(
          workoutRepo as never,
          runRepo as never,
        );
      },
      inject: [WORKOUT_REPOSITORY, RUN_REPOSITORY],
    },
  ],
  exports: [GetCalendarMonthUseCase, GetDaySummaryUseCase],
})
export class CalendarModule {}
