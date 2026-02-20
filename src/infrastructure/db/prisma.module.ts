/**
 * PrismaModule - Módulo que exporta PrismaService
 *
 * Importar en módulos que necesiten acceso a la base de datos.
 * Global: puede registrarse como global para no re-importar en cada módulo.
 */

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
