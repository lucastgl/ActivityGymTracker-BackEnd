import { Module } from '@nestjs/common';
import { GetReportsUseCase } from './get-reports.use-case';
import { REPORTS_QUERY_REPOSITORY } from './reports-query.token';
import { ReportsQueryStub } from '../../adapters/stubs/reports-query.stub';

@Module({
  providers: [
    GetReportsUseCase,
    {
      provide: REPORTS_QUERY_REPOSITORY,
      useClass: ReportsQueryStub,
    },
  ],
  exports: [GetReportsUseCase],
})
export class ReportsModule {}
