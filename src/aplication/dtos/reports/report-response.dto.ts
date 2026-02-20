export class ReportRangeDto {
  from!: string;
  to!: string;
}

export class ReportResponseDto {
  range!: ReportRangeDto;
  workoutsCount!: number;
  runsCount!: number;
  totalVolumeKg?: number;
  totalDistanceKm?: number;
}
