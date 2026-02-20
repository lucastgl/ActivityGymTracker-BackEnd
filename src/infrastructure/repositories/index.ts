/**
 * Repositories - Implementaciones concretas de los puertos del dominio
 *
 * Cada *Repository implementa la interfaz definida en domain/repositories.
 * La aplicación inyecta estas implementaciones vía tokens (EXERCISE_REPOSITORY, etc.).
 */

export * from './prisma-exercise.repository';
export * from './prisma-routine.repository';
export * from './prisma-workout.repository';
export * from './prisma-run.repository';
export * from './prisma-measurement.repository';
