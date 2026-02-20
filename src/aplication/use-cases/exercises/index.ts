/**
 * Barrel export de use cases de ejercicios.
 *
 * Para agregar nuevos use cases:
 * 1. Crear archivo xxx.use-case.ts
 * 2. Exportar la clase
 * 3. Agregar al array de providers en ExercisesModule
 */

export { EXERCISE_REPOSITORY } from './exercise-repository.token';
export { CreateExerciseUseCase } from './create-exercise.use-case';
export { ListExercisesUseCase } from './list-exercises.use-case';
export { UpdateExerciseUseCase } from './update-exercise.use-case';
export { DeactivateExerciseUseCase } from './deactivate-exercise.use-case';
export { RestoreExerciseUseCase } from './restore-exercise.use-case';
