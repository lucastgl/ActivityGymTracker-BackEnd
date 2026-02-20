/**
 * InfrastructureModule - DEPRECADO
 *
 * Los repositorios se han movido a cada feature module (ExercisesModule, etc.).
 * Cada módulo declara: { provide: TOKEN, useClass: PrismaRepo }.
 *
 * Este módulo se mantiene para re-exportar PrismaModule si se necesita
 * por compatibilidad. No se usa en la app actual.
 */

import { Module } from '@nestjs/common';
import { PrismaModule } from './db/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [PrismaModule],
})
export class InfrastructureModule {}
