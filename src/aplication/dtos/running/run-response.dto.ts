import { SessionStatus } from '../../../domain/enums/session-status.enum';

export class RunSplitResponseDto {
  id!: string;
  order!: number;
  distanceKm!: number;
  durationSec!: number;
}

export class RunSessionResponseDto {
  id!: string;
  userId!: string;
  date!: string;
  status!: SessionStatus;
  injuryMode!: boolean;
  note?: string;
  distanceKm!: number;
  durationSec!: number;
  createdAt!: string;
  updatedAt!: string;
  splits!: RunSplitResponseDto[];
}
