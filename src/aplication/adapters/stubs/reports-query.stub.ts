/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */

import { Id } from '../../../domain/value-objects/id.vo';
import type {
  ReportsQueryRepository,
  ReportRange,
  ReportFilters,
  ReportData,
} from '../../ports/reports-query.repository';

export class ReportsQueryStub implements ReportsQueryRepository {
  async getReports(
    userId: Id,
    range: ReportRange,
    filters?: ReportFilters,
  ): Promise<ReportData> {
    void userId;
    void range;
    void filters;
    throw new Error(
      'ReportsQueryRepository no implementado. Agregar ReportsQueryRepositoryImpl.',
    );
  }
}
