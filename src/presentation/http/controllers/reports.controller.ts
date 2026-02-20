/**
 * INSTRUCTIVO - ReportsController
 *
 * FUNCIÓN:
 *   Capa HTTP para reportes agregados (workouts, runs, volumen, distancia).
 *   Depende de que workouts, runs y measurements estén poblados.
 *
 * FLUJO:
 *   1. Validación DTO (query: from, to, injuryMode?, sessionType?)
 *   2. userId desde X-User-Id
 *   3. Mapeo query → ReportRange + ReportFilters
 *   4. useCase.execute(userId, range, filters)
 *   5. ReportData → ReportResponseDto → JSON
 *
 * RUTAS:
 *   GET /reports?from=YYYY-MM-DD&to=YYYY-MM-DD&injuryMode=&sessionType=
 */

import { Controller, Get, Query, Headers } from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { DateOnly } from '../../../domain/value-objects/date-only.vo';
import { GetReportsUseCase } from '../../../aplication/use-cases/reports/get-reports.use-case';
import {
  GetReportsQueryDto,
  ReportResponseDto,
} from '../../../aplication/dtos/reports';

const DEFAULT_USER_ID = '00000000-0000-4000-8000-000000000000';

@Controller('reports')
export class ReportsController {
  constructor(private readonly getReportsUseCase: GetReportsUseCase) {}

  private userId(header: string | undefined) {
    return Id.fromString(header || DEFAULT_USER_ID);
  }

  @Get()
  async getReports(
    @Headers('x-user-id') userIdHeader: string,
    @Query() query: GetReportsQueryDto,
  ): Promise<ReportResponseDto> {
    const range = {
      from: DateOnly.fromString(query.from),
      to: DateOnly.fromString(query.to),
    };
    const filters =
      query.injuryMode !== undefined || query.sessionType
        ? {
            injuryMode: query.injuryMode,
            sessionType: query.sessionType,
          }
        : undefined;
    const data = await this.getReportsUseCase.execute(
      this.userId(userIdHeader),
      range,
      filters,
    );
    return {
      range: { from: data.range.from.toString(), to: data.range.to.toString() },
      workoutsCount: data.workoutsCount,
      runsCount: data.runsCount,
      totalVolumeKg: data.totalVolumeKg,
      totalDistanceKm: data.totalDistanceKm,
    };
  }
}
