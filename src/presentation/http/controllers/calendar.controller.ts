/**
 * INSTRUCTIVO - CalendarController
 *
 * FUNCIÓN:
 *   Capa HTTP para vistas de calendario. Agrega datos de workouts y runs
 *   por fecha/mes para mostrar en la UI del calendario.
 *
 * FLUJO:
 *   1. Validación DTO (query params para mes; path/query para fecha)
 *   2. userId desde X-User-Id
 *   3. useCase.execute(...)
 *   4. CalendarDayOverview[] o CalendarDayData → DTO → JSON
 *
 * RUTAS:
 *   GET /calendar/month?year=2025&month=2  - Overview de cada día del mes
 *   GET /calendar/day/:date                 - Resumen detallado del día (workout + run)
 */

import { Controller, Get, Param, Query, Headers } from '@nestjs/common';
import { SetType } from '../../../domain/enums/set-type.enum';
import { Id } from '../../../domain/value-objects/id.vo';
import { DateOnly } from '../../../domain/value-objects/date-only.vo';
import { GetCalendarMonthUseCase } from '../../../aplication/use-cases/calendar/get-calendar-month.use-case';
import { GetDaySummaryUseCase } from '../../../aplication/use-cases/calendar/get-day-summary.use-case';
import {
  GetCalendarMonthQueryDto,
  CalendarDayOverviewResponseDto,
  CalendarDayDataResponseDto,
} from '../../../aplication/dtos/calendar';
import type { CalendarDayOverview, CalendarDayData } from '../../../aplication/ports/calendar-query.repository';

const DEFAULT_USER_ID = '00000000-0000-4000-8000-000000000000';

@Controller('calendar')
export class CalendarController {
  constructor(
    private readonly getCalendarMonth: GetCalendarMonthUseCase,
    private readonly getDaySummary: GetDaySummaryUseCase,
  ) {}

  private userId(header: string | undefined) {
    return Id.fromString(header || DEFAULT_USER_ID);
  }

  @Get('month')
  async getMonth(
    @Headers('x-user-id') userIdHeader: string,
    @Query() query: GetCalendarMonthQueryDto,
  ): Promise<CalendarDayOverviewResponseDto[]> {
    const overviews = await this.getCalendarMonth.execute(
      this.userId(userIdHeader),
      query.year,
      query.month,
    );
    return overviews.map((o) => this.overviewToDto(o));
  }

  @Get('day/:date')
  async getDaySummaryHandler(
    @Headers('x-user-id') userIdHeader: string,
    @Param('date') date: string,
  ): Promise<CalendarDayDataResponseDto> {
    const data = await this.getDaySummary.execute(
      this.userId(userIdHeader),
      DateOnly.fromString(date),
    );
    return this.dayDataToDto(data);
  }

  private overviewToDto(o: CalendarDayOverview): CalendarDayOverviewResponseDto {
    return {
      date: typeof o.date === 'object' && 'toString' in o.date ? o.date.toString() : String(o.date),
      workout: o.workout,
      run: o.run,
      combinedStatus: o.combinedStatus,
      combinedInjury: o.combinedInjury,
    };
  }

  private dayDataToDto(d: CalendarDayData): CalendarDayDataResponseDto {
    const out: CalendarDayDataResponseDto = {
      date: typeof d.date === 'object' && 'toString' in d.date ? d.date.toString() : String(d.date),
    };
    if (d.workout) {
      out.workout = {
        sessionId: d.workout.sessionId.value,
        date: typeof d.workout.date === 'object' && 'toString' in d.workout.date ? d.workout.date.toString() : String(d.workout.date),
        status: d.workout.status,
        injuryMode: d.workout.injuryMode,
        note: d.workout.note,
        routine: d.workout.routine ? {
          routineId: d.workout.routine.routineId.value,
          routineName: d.workout.routine.routineName,
          dayKey: d.workout.routine.dayKey,
        } : undefined,
        exercises: d.workout.exercises.map((ex) => ({
          workoutExerciseId: ex.workoutExerciseId.value,
          exerciseId: ex.exerciseId.value,
          name: ex.name,
          muscleCategory: ex.muscleCategory,
          equipment: ex.equipment,
          sideType: ex.sideType,
          origin: ex.origin,
          order: ex.order,
          sets: ex.sets.map((s) => {
            if ('drops' in s && s.drops) {
              return {
                setId: s.setId.value,
                type: s.type,
                order: s.order,
                drops: s.drops.map((d) => ({
                  dropId: d.dropId.value,
                  order: d.order,
                  weightKg: d.weightKg,
                  reps: d.reps,
                })),
              };
            }
            const simple = s as { setId: Id; type: SetType; order: number; weightKg: number; reps: number };
            return {
              setId: simple.setId.value,
              type: simple.type,
              order: simple.order,
              weightKg: simple.weightKg,
              reps: simple.reps,
            };
          }),
        })),
      };
    }
    if (d.run) {
      out.run = {
        runSessionId: d.run.runSessionId.value,
        date: typeof d.run.date === 'object' && 'toString' in d.run.date ? d.run.date.toString() : String(d.run.date),
        status: d.run.status,
        injuryMode: d.run.injuryMode,
        note: d.run.note,
        distanceKm: d.run.distanceKm,
        durationSec: d.run.durationSec,
        splits: d.run.splits.map((s) => ({
          splitId: s.splitId.value,
          order: s.order,
          distanceKm: s.distanceKm,
          durationSec: s.durationSec,
        })),
      };
    }
    return out;
  }
}
