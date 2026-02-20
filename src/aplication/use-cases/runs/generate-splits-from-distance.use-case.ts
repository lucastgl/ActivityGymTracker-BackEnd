import { Injectable } from '@nestjs/common';
import { RunningSplitsService } from '../../../domain/services/running-splits.service';

/**
 * Genera splits (parciales) a partir de distancia y opcionalmente duración.
 * Usa RunningSplitsService (domain puro).
 */
@Injectable()
export class GenerateSplitsFromDistanceUseCase {
  constructor(private readonly runningSplitsService: RunningSplitsService) {}

  execute(
    totalDistanceKm: number,
    totalDurationSec?: number,
  ): { order: number; distanceKm: number; durationSec: number }[] {
    return this.runningSplitsService.generateSplits(
      totalDistanceKm,
      totalDurationSec,
    );
  }
}
