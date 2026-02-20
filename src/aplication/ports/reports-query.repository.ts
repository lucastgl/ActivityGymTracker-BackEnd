import { Id } from '../../domain/value-objects/id.vo';
import { DateOnly } from '../../domain/value-objects/date-only.vo';

/**
 * Filtros opcionales para reportes.
 */
export type ReportFilters = {
  injuryMode?: boolean;
  sessionType?: 'workout' | 'run' | 'all';
};

/**
 * Rango de fechas para reportes.
 */
export type ReportRange = {
  from: DateOnly;
  to: DateOnly;
};

/**
 * Estructura base de reporte (extensible según necesidades).
 */
export type ReportData = {
  range: ReportRange;
  workoutsCount: number;
  runsCount: number;
  totalVolumeKg?: number;
  totalDistanceKm?: number;
};

/**
 * ReportsQueryRepository - Solo lectura.
 * Depende de workouts, runs, measurements para agregar datos.
 */
export interface ReportsQueryRepository {
  getReports(
    userId: Id,
    range: ReportRange,
    filters?: ReportFilters,
  ): Promise<ReportData>;
}
