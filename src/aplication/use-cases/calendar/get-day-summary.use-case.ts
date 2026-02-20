import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { DateOnly } from '../../../domain/value-objects/date-only.vo';
import type {
  CalendarQueryRepository,
  CalendarDayData,
} from '../../ports/calendar-query.repository';
import { CALENDAR_QUERY_REPOSITORY } from './calendar-query.token';

@Injectable()
export class GetDaySummaryUseCase {
  constructor(
    @Inject(CALENDAR_QUERY_REPOSITORY)
    private readonly calendarQuery: CalendarQueryRepository,
  ) {}

  async execute(userId: Id, date: DateOnly): Promise<CalendarDayData> {
    return this.calendarQuery.getDayData(userId, date);
  }
}
