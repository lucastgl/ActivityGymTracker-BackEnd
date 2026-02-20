import { Module } from '@nestjs/common';
import { GetReportsUseCase } from './get-reports.use-case';
import { REPORTS_QUERY_REPOSITORY } from './reports-query.token';
import { ReportsQueryStub } from '../../adapters/stubs/reports-query.stub';
import { ReportsController } from '../../../presentation/http/controllers/reports.controller';

/**
 * ReportsModule - Feature module de informes
 *
 * - providers: use case + REPORTS_QUERY_REPOSITORY (stub por ahora)
 * - controllers: ReportsController
 */
@Module({
  providers: [
    GetReportsUseCase,
    {
      provide: REPORTS_QUERY_REPOSITORY,
      useClass: ReportsQueryStub,
    },
  ],
  controllers: [ReportsController],
  exports: [GetReportsUseCase],
})
export class ReportsModule {}
