import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SessionStatus } from '../../../domain/enums/session-status.enum';

export class UpsertRunSessionDto {
  @ApiProperty({ example: 5.0, description: 'Distancia en kilómetros' })
  @IsNumber()
  distanceKm!: number;

  @ApiProperty({ example: 1800, description: 'Duración en segundos' })
  @IsNumber()
  durationSec!: number;

  @ApiPropertyOptional({ enum: SessionStatus })
  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  injuryMode?: boolean;

  @ApiPropertyOptional({ example: 'Buena carrera' })
  @IsOptional()
  @IsString()
  note?: string;
}
