import { Injectable, Inject } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import type {
  ReportsQueryRepository,
  ReportRange,
  ReportFilters,
  ReportData,
} from '../../ports/reports-query.repository';
import { REPORTS_QUERY_REPOSITORY } from './reports-query.token';

@Injectable()
export class GetReportsUseCase {
  constructor(
    @Inject(REPORTS_QUERY_REPOSITORY)
    private readonly reportsQuery: ReportsQueryRepository,
  ) {}

  async execute(
    userId: Id,
    range: ReportRange,
    filters?: ReportFilters,
  ): Promise<ReportData> {
    return this.reportsQuery.getReports(userId, range, filters);
  }
}
