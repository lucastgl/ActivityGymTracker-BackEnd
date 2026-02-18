import { RunningSplitsService } from './running-splits.service';

/**
 * Tests unitarios para RunningSplitsService.
 *
 * | Test                                    | Qué verifica                                                    |
 * |-----------------------------------------|-----------------------------------------------------------------|
 * | genera splits 1km + remainder           | 5.5 km → 5 splits de 1 km + 1 de 0.5 km                        |
 * | genera solo splits de 1km              | 3 km → 3 splits de 1 km                                        |
 * | genera un solo split para < 1km         | 0.5 km → 1 split de 0.5 km                                     |
 * | retorna array vacío (distancias invál.) | 0, -1, NaN, Infinity → []                                      |
 * | no incluye remainder < 0.01             | 1.005 km → solo 1 split (remainder 0.005 se ignora)             |
 * | distribuye duración proporcionalmente   | Con totalDurationSec, suma de durationSec = total exacto        |
 * | totalDurationSec inválido               | 0, negativo o undefined → durationSec: 0 en todos               |
 * | clamp remainder a 0.99                  | Remainder limitado a 0.99 como máximo                          |
 */
describe('RunningSplitsService', () => {
  let service: RunningSplitsService;

  beforeEach(() => {
    service = new RunningSplitsService();
  });

  describe('generateSplits', () => {
    // 5.5 km → 5 splits de 1 km + 1 de 0.5 km
    it('genera splits 1km + remainder para distancia con decimales', () => {
      const result = service.generateSplits(5.5);

      expect(result).toHaveLength(6);
      expect(result.slice(0, 5)).toEqual(
        expect.arrayContaining([
          { order: 1, distanceKm: 1, durationSec: 0 },
          { order: 2, distanceKm: 1, durationSec: 0 },
          { order: 3, distanceKm: 1, durationSec: 0 },
          { order: 4, distanceKm: 1, durationSec: 0 },
          { order: 5, distanceKm: 1, durationSec: 0 },
        ]),
      );
      expect(result[5]).toEqual({
        order: 6,
        distanceKm: 0.5,
        durationSec: 0,
      });
    });

    // 3 km → 3 splits de 1 km
    it('genera solo splits de 1km cuando la distancia es entera', () => {
      const result = service.generateSplits(3);

      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { order: 1, distanceKm: 1, durationSec: 0 },
        { order: 2, distanceKm: 1, durationSec: 0 },
        { order: 3, distanceKm: 1, durationSec: 0 },
      ]);
    });

    // 0.5 km → 1 split de 0.5 km
    it('genera un solo split para distancia menor a 1km', () => {
      const result = service.generateSplits(0.5);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        order: 1,
        distanceKm: 0.5,
        durationSec: 0,
      });
    });

    // 0, -1, NaN, Infinity → []
    it('retorna array vacío para distancias inválidas', () => {
      expect(service.generateSplits(0)).toEqual([]);
      expect(service.generateSplits(-1)).toEqual([]);
      expect(service.generateSplits(NaN)).toEqual([]);
      expect(service.generateSplits(Infinity)).toEqual([]);
    });

    // 1.005 km → solo 1 split (remainder 0.005 se ignora)
    it('no incluye remainder cuando es menor a 0.01', () => {
      const result = service.generateSplits(1.005);

      expect(result).toHaveLength(1);
      expect(result[0].distanceKm).toBe(1);
    });

    // Con totalDurationSec, suma de durationSec = total exacto
    it('distribuye duración proporcionalmente cuando se pasa totalDurationSec', () => {
      const result = service.generateSplits(5.5, 1980);

      expect(result).toHaveLength(6);
      const totalDuration = result.reduce((sum, s) => sum + s.durationSec, 0);
      expect(totalDuration).toBe(1980);

      // 5.5km en 1980s: cada 1km ≈ 360s, 0.5km ≈ 180s
      expect(result[0].durationSec).toBeGreaterThan(0);
      expect(result[5].durationSec).toBeLessThan(result[0].durationSec);
    });

    // 0, negativo o undefined → durationSec: 0 en todos
    it('retorna durationSec 0 cuando totalDurationSec es inválido', () => {
      const result = service.generateSplits(3, 0);
      expect(result.every((s) => s.durationSec === 0)).toBe(true);

      const result2 = service.generateSplits(3, -100);
      expect(result2.every((s) => s.durationSec === 0)).toBe(true);

      const result3 = service.generateSplits(3);
      expect(result3.every((s) => s.durationSec === 0)).toBe(true);
    });

    // Remainder limitado a 0.99 como máximo
    it('clamp del remainder a 0.99 máximo', () => {
      const result = service.generateSplits(1.999);

      expect(result).toHaveLength(2);
      expect(result[1].distanceKm).toBeLessThanOrEqual(0.99);
    });
  });
});
