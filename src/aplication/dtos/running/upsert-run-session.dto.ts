import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SessionStatus } from '../../../domain/enums/session-status.enum';

export class UpsertRunSessionDto {
  @IsNumber()
  distanceKm!: number;

  @IsNumber()
  durationSec!: number;

  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @IsOptional()
  @IsBoolean()
  injuryMode?: boolean;

  @IsOptional()
  @IsString()
  note?: string;
}
