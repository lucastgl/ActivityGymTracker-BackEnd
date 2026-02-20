/**
 * PrismaService - Cliente Prisma para NestJS
 *
 * Proporciona el PrismaClient como singleton inyectable.
 * OnModuleInit: conecta al arrancar la app.
 * OnModuleDestroy: desconecta al cerrar (evita conexiones colgadas).
 *
 * Uso: inyectar en repositorios que necesiten acceso a la BD.
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
