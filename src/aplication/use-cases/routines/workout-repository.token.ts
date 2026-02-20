/**
 * Token para inyección de WorkoutRepository.
 *
 * Usado por ActivateRoutineForDateUseCase.
 * En infrastructure: proveer con useClass: PrismaWorkoutRepository
 */

export const WORKOUT_REPOSITORY = Symbol('WorkoutRepository');
