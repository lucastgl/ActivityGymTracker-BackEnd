import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SessionStatus } from '../../../domain/enums/session-status.enum';

export class RunSplitResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() order!: number;
  @ApiProperty() distanceKm!: number;
  @ApiProperty() durationSec!: number;
}

export class RunSessionResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() userId!: string;
  @ApiProperty({ example: '2024-01-15' }) date!: string;
  @ApiProperty({ enum: SessionStatus }) status!: SessionStatus;
  @ApiProperty() injuryMode!: boolean;
  @ApiPropertyOptional() note?: string;
  @ApiProperty() distanceKm!: number;
  @ApiProperty() durationSec!: number;
  @ApiProperty() createdAt!: string;
  @ApiProperty() updatedAt!: string;
  @ApiProperty({ type: [RunSplitResponseDto] }) splits!: RunSplitResponseDto[];
}
