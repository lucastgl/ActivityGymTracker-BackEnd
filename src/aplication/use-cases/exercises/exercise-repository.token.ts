/**
 * Token para inyección de ExerciseRepository.
 *
 * NestJS no puede inyectar interfaces directamente (se borran en runtime).
 * Usar: @Inject(EXERCISE_REPOSITORY) private readonly repo: ExerciseRepository
 *
 * En infrastructure: proveer con useClass: PrismaExerciseRepository
 */

export const EXERCISE_REPOSITORY = Symbol('ExerciseRepository');
