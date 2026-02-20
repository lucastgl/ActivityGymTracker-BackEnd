/**
 * Mappers - Exportaciones centralizadas
 *
 * Los mappers son funciones puras que convierten entre:
 * - Prisma (modelo de persistencia) ↔ Domain (entidades de negocio)
 *
 * La capa de dominio nunca importa ni conoce Prisma.
 */

export * from './exercise.mapper';
export * from './routine.mapper';
export * from './workout.mapper';
export * from './run.mapper';
export * from './measurement.mapper';
