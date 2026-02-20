import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import type {
  CalendarQueryRepository,
  CalendarDayOverview,
} from '../../ports/calendar-query.repository';
import { CALENDAR_QUERY_REPOSITORY } from './calendar-query.token';

@Injectable()
export class GetCalendarMonthUseCase {
  constructor(
    @Inject(CALENDAR_QUERY_REPOSITORY)
    private readonly calendarQuery: CalendarQueryRepository,
  ) {}

  async execute(
    userId: Id,
    year: number,
    month: number,
  ): Promise<CalendarDayOverview[]> {
    return await this.calendarQuery.getCalendarMonth(userId, year, month);
  }
}
