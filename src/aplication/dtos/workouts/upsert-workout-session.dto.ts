import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SessionStatus } from '../../../domain/enums/session-status.enum';

export class UpsertWorkoutSessionDto {
  @ApiPropertyOptional({ enum: SessionStatus })
  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  injuryMode?: boolean;

  @ApiPropertyOptional({ example: 'Sesión muy intensa' })
  @IsOptional()
  @IsString()
  note?: string;
}
