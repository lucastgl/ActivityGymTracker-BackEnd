/**
 * WorkoutScoringService - Domain Service puro (Clean Architecture)
 *
 * Tipos LiftAttempt y BestSetResult definidos aquí (contratos del scoring).
 * MuscleCategory se reutiliza del domain para evitar duplicación.
 */

import { MuscleCategory } from '../enums/muscle-category.enum';

export const MUSCLE_CATEGORIES = Object.values(
  MuscleCategory,
) as MuscleCategory[];

export type LiftAttempt = {
  exerciseId: string;
  muscleCategory: MuscleCategory;
  date: string; // DateOnly en formato YYYY-MM-DD
  order?: number;
  weightKg: number;
  reps: number;
};

export type BestSetResult = {
  exerciseId: string;
  muscleCategory: MuscleCategory;
  date: string;
  order?: number;
  weightKg: number;
  reps: number;
};

/**
 * Compara dos fechas YYYY-MM-DD lexicográficamente.
 * Retorna: positivo si dateA > dateB, negativo si dateA < dateB, 0 si iguales.
 */
function compareDateStrings(dateA: string, dateB: string): number {
  if (dateA > dateB) return 1;
  if (dateA < dateB) return -1;
  return 0;
}

/**
 * Compara dos intentos según la regla de "mejor set".
 * Retorna: positivo si a es mejor que b, negativo si b es mejor, 0 si empatan.
 * Orden: weightKg descendiente → reps descendiente → date descendiente → order descendiente
 */
function compareAttempts(a: BestSetResult, b: BestSetResult): number {
  if (a.weightKg !== b.weightKg) return a.weightKg - b.weightKg;
  if (a.reps !== b.reps) return a.reps - b.reps;
  const dateCmp = compareDateStrings(a.date, b.date);
  if (dateCmp !== 0) return dateCmp;
  return (a.order ?? 0) - (b.order ?? 0);
}

function isValidAttempt(attempt: LiftAttempt): boolean {
  return (
    !!attempt.exerciseId?.trim() && // ejercicioId no puede ser null o vacío
    !!attempt.date?.trim() && // fecha no puede ser null o vacía
    attempt.weightKg > 0 && // peso no puede ser menor o igual a 0
    attempt.reps > 0 // reps no puede ser menor o igual a 0
  );
}

function attemptToResult(attempt: LiftAttempt): BestSetResult {
  return {
    exerciseId: attempt.exerciseId,
    muscleCategory: attempt.muscleCategory,
    date: attempt.date,
    order: attempt.order,
    weightKg: attempt.weightKg,
    reps: attempt.reps,
  };
}

export class WorkoutScoringService {
  /**
   * Devuelve el mejor set por ejercicio.
   * Key = exerciseId
   */
  getBestSetByExercise(attempts: LiftAttempt[]): Map<string, BestSetResult> {
    const valid = attempts.filter(isValidAttempt); // filtra los intentos inválidos
    const byExercise = new Map<string, LiftAttempt[]>(); // agrupa los intentos por ejercicio

    // agrupar los intentos por ejercicio usando un mapa
    for (const a of valid) {
      const existing = byExercise.get(a.exerciseId); // obtiene los intentos del ejercicio
      if (!existing) {
        // si no hay intentos para el ejercicio, añadir el intento
        byExercise.set(a.exerciseId, [a]);
      } else {
        // si hay intentos para el ejercicio, añadir el intento
        existing.push(a);
      }
    }

    const result = new Map<string, BestSetResult>(); // resultado de los intentos por ejercicio usando un mapa
    for (const [exerciseId, list] of byExercise) {
      const best = list.reduce((acc, curr) => {
        const accResult = attemptToResult(acc);
        const currResult = attemptToResult(curr);
        return compareAttempts(currResult, accResult) > 0 ? curr : acc;
      });
      result.set(exerciseId, attemptToResult(best));
    }

    return result;
  }

  /**
   * En V1, PR = mejor set (misma regla).
   */
  getPRByExercise(attempts: LiftAttempt[]): Map<string, BestSetResult> {
    return this.getBestSetByExercise(attempts);
  }

  /**
   * Top N por categoría muscular a partir de los mejores sets por ejercicio.
   * Orden interno: weight desc, reps desc, date desc, order desc.
   */
  topNByCategory(
    bestByExercise: Map<string, BestSetResult>,
    n = 3,
  ): Record<MuscleCategory, BestSetResult[]> {
    const byCategory = new Map<MuscleCategory, BestSetResult[]>();

    for (const cat of MUSCLE_CATEGORIES) {
      byCategory.set(cat, []);
    }

    for (const result of bestByExercise.values()) {
      const list = byCategory.get(result.muscleCategory)!;
      list.push(result);
    }

    const output = {} as Record<MuscleCategory, BestSetResult[]>;

    for (const cat of MUSCLE_CATEGORIES) {
      const list = byCategory.get(cat)!;
      const sorted = [...list].sort((a, b) => -compareAttempts(a, b));
      output[cat] = sorted.slice(0, n);
    }

    return output;
  }
}
