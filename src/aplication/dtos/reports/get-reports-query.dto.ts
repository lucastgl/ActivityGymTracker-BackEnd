import { IsBoolean, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export type ReportSessionType = 'workout' | 'run' | 'all';

export class GetReportsQueryDto {
  @IsDateString()
  from!: string;

  @IsDateString()
  to!: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  injuryMode?: boolean;

  @IsOptional()
  @IsEnum(['workout', 'run', 'all'])
  sessionType?: ReportSessionType;
}
