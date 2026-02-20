import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { SessionStatus } from '../../../domain/enums/session-status.enum';

export class UpsertWorkoutSessionDto {
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
