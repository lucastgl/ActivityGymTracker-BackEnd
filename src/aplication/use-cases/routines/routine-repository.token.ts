/**
 * Token para inyección de RoutineRepository.
 *
 * NestJS no puede inyectar interfaces directamente (se borran en runtime).
 * Usar: @Inject(ROUTINE_REPOSITORY) private readonly repo: RoutineRepository
 *
 * En infrastructure: proveer con useClass: PrismaRoutineRepository
 */

export const ROUTINE_REPOSITORY = Symbol('RoutineRepository');
