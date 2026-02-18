import { Module } from '@nestjs/common';
import { RunningSplitsService } from '../domain/services/running-splits.service';

/**
 * RunningModule - Módulo para el tracking de running
 *
 * Este módulo contiene el servicio de tracking de running
 * y las entidades relacionadas.
 * Incluye:
 * - RunningSplitsService
 */
@Module({
  providers: [RunningSplitsService],
  exports: [RunningSplitsService],
})
export class RunningModule {}
