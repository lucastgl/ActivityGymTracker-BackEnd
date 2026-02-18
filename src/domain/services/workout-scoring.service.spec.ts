// Test unitarios para el servicio de scoring de entrenamientos
// Se comprueba el comportamiento de las siguientes funciones:
// - getBestSetByExercise
// - getPRByExercise
// - topNByCategory

import {
  WorkoutScoringService,
  LiftAttempt,
  BestSetResult,
  MUSCLE_CATEGORIES,
} from './workout-scoring.service';
import { MuscleCategory } from '../enums/muscle-category.enum';

// describe para el servicio de scoring de entrenamientos
describe('WorkoutScoringService', () => {
  let service: WorkoutScoringService;

  beforeEach(() => {
    service = new WorkoutScoringService();
  });

  const baseAttempt = (overrides: Partial<LiftAttempt> = {}): LiftAttempt => ({
    exerciseId: 'ex-1',
    muscleCategory: MuscleCategory.CHEST,
    date: '2025-01-15',
    weightKg: 80,
    reps: 10,
    ...overrides,
  });

  describe('getBestSetByExercise', () => {
    it('elige mayor peso', () => {
      const attempts: LiftAttempt[] = [
        baseAttempt({ weightKg: 70, reps: 10 }),
        baseAttempt({ weightKg: 90, reps: 8 }),
        baseAttempt({ weightKg: 80, reps: 12 }),
      ];
      const result = service.getBestSetByExercise(attempts);
      expect(result.get('ex-1')).toEqual(
        expect.objectContaining({ weightKg: 90, reps: 8 }),
      );
    });

    it('empate peso -> mayor reps', () => {
      const attempts: LiftAttempt[] = [
        baseAttempt({ weightKg: 80, reps: 8 }),
        baseAttempt({ weightKg: 80, reps: 12 }),
        baseAttempt({ weightKg: 80, reps: 10 }),
      ];
      const result = service.getBestSetByExercise(attempts);
      expect(result.get('ex-1')).toEqual(
        expect.objectContaining({ weightKg: 80, reps: 12 }),
      );
    });

    it('empate peso+reps -> mayor date', () => {
      const attempts: LiftAttempt[] = [
        baseAttempt({ weightKg: 80, reps: 10, date: '2025-01-10' }),
        baseAttempt({ weightKg: 80, reps: 10, date: '2025-01-20' }),
        baseAttempt({ weightKg: 80, reps: 10, date: '2025-01-15' }),
      ];
      const result = service.getBestSetByExercise(attempts);
      expect(result.get('ex-1')).toEqual(
        expect.objectContaining({ date: '2025-01-20' }),
      );
    });

    it('empate peso+reps+date -> mayor order', () => {
      const attempts: LiftAttempt[] = [
        baseAttempt({
          weightKg: 80,
          reps: 10,
          date: '2025-01-15',
          order: 1,
        }),
        baseAttempt({
          weightKg: 80,
          reps: 10,
          date: '2025-01-15',
          order: 3,
        }),
        baseAttempt({
          weightKg: 80,
          reps: 10,
          date: '2025-01-15',
          order: 2,
        }),
      ];
      const result = service.getBestSetByExercise(attempts);
      expect(result.get('ex-1')).toEqual(expect.objectContaining({ order: 3 }));
    });

    it('ignora attempts inválidos', () => {
      const attempts: LiftAttempt[] = [
        baseAttempt({ weightKg: 80, reps: 10 }),
        baseAttempt({ weightKg: 0, reps: 10 }),
        baseAttempt({ weightKg: 80, reps: 0 }),
        baseAttempt({ weightKg: -5, reps: 10 }),
        baseAttempt({ exerciseId: '', weightKg: 80, reps: 10 }),
        baseAttempt({ date: '', weightKg: 80, reps: 10 }),
      ];
      const result = service.getBestSetByExercise(attempts);
      expect(result.size).toBe(1);
      expect(result.get('ex-1')).toEqual(
        expect.objectContaining({ weightKg: 80, reps: 10 }),
      );
    });

    it('no muta el input array', () => {
      const attempts: LiftAttempt[] = [baseAttempt({ weightKg: 80, reps: 10 })];
      const original = JSON.stringify(attempts);
      service.getBestSetByExercise(attempts);
      expect(JSON.stringify(attempts)).toBe(original);
    });
  });

  describe('getPRByExercise', () => {
    it('en V1 es alias de getBestSetByExercise', () => {
      const attempts: LiftAttempt[] = [baseAttempt({ weightKg: 100, reps: 5 })];
      const best = service.getBestSetByExercise(attempts);
      const pr = service.getPRByExercise(attempts);
      expect(pr.get('ex-1')).toEqual(best.get('ex-1'));
    });
  });

  describe('topNByCategory', () => {
    it('devuelve top3 por categoría y mantiene orden', () => {
      const bestByExercise = new Map<string, BestSetResult>([
        [
          'ex-1',
          {
            exerciseId: 'ex-1',
            muscleCategory: MuscleCategory.CHEST,
            date: '2025-01-15',
            weightKg: 100,
            reps: 10,
          },
        ],
        [
          'ex-2',
          {
            exerciseId: 'ex-2',
            muscleCategory: MuscleCategory.CHEST,
            date: '2025-01-14',
            weightKg: 95,
            reps: 12,
          },
        ],
        [
          'ex-3',
          {
            exerciseId: 'ex-3',
            muscleCategory: MuscleCategory.CHEST,
            date: '2025-01-13',
            weightKg: 90,
            reps: 8,
          },
        ],
        [
          'ex-4',
          {
            exerciseId: 'ex-4',
            muscleCategory: MuscleCategory.CHEST,
            date: '2025-01-12',
            weightKg: 85,
            reps: 6,
          },
        ],
        [
          'ex-5',
          {
            exerciseId: 'ex-5',
            muscleCategory: MuscleCategory.LEG,
            date: '2025-01-15',
            weightKg: 150,
            reps: 5,
          },
        ],
      ]);

      const result = service.topNByCategory(bestByExercise, 3);

      expect(result.CHEST).toHaveLength(3);
      expect(result.CHEST[0].weightKg).toBe(100);
      expect(result.CHEST[1].weightKg).toBe(95);
      expect(result.CHEST[2].weightKg).toBe(90);

      expect(result.LEG).toHaveLength(1);
      expect(result.LEG[0].exerciseId).toBe('ex-5');

      for (const cat of MUSCLE_CATEGORIES) {
        expect(result).toHaveProperty(cat);
        expect(Array.isArray(result[cat])).toBe(true);
      }

      expect(result.ARM).toEqual([]);
      expect(result.SHOULDER).toEqual([]);
      expect(result.BACK).toEqual([]);
    });

    it('respeta orden weight desc, reps desc, date desc, order desc', () => {
      const bestByExercise = new Map<string, BestSetResult>([
        [
          'a',
          {
            exerciseId: 'a',
            muscleCategory: MuscleCategory.ARM,
            date: '2025-01-10',
            order: 1,
            weightKg: 50,
            reps: 10,
          },
        ],
        [
          'b',
          {
            exerciseId: 'b',
            muscleCategory: MuscleCategory.ARM,
            date: '2025-01-15',
            order: 2,
            weightKg: 50,
            reps: 10,
          },
        ],
        [
          'c',
          {
            exerciseId: 'c',
            muscleCategory: MuscleCategory.ARM,
            date: '2025-01-15',
            order: 3,
            weightKg: 50,
            reps: 10,
          },
        ],
      ]);

      const result = service.topNByCategory(bestByExercise, 3);

      expect(result.ARM[0].order).toBe(3);
      expect(result.ARM[1].order).toBe(2);
      expect(result.ARM[2].order).toBe(1);
    });
  });
});
