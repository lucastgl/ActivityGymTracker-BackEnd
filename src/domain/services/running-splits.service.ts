import { Injectable } from '@nestjs/common';

export interface RunningSplitPartial {
  order: number;
  distanceKm: number;
  durationSec: number;
}

@Injectable()
export class RunningSplitsService {
  generateSplits(
    totalDistanceKm: number,
    totalDurationSec?: number,
  ): RunningSplitPartial[] {
    if (!Number.isFinite(totalDistanceKm) || totalDistanceKm <= 0) return [];

    const splits: RunningSplitPartial[] = [];
    const fullKm = Math.floor(totalDistanceKm); // parte entera de la distancia total

    // resto de la distancia total
    const rawRemainder = totalDistanceKm - fullKm;
    // resto de la distancia total redondeado a 2 decimales y clampeado entre 0 y 0.99
    const remainder = this.clamp(
      this.roundToTwoDecimals(rawRemainder),
      0,
      0.99,
    );

    // añadir splits para la parte entera de la distancia total
    for (let i = 0; i < fullKm; i++) {
      splits.push({ order: i + 1, distanceKm: 1, durationSec: 0 });
    }
    // añadir split para el resto de la distancia total si es mayor a 0.01
    if (remainder >= 0.01) {
      splits.push({ order: fullKm + 1, distanceKm: remainder, durationSec: 0 });
    }

    if (
      !Number.isFinite(totalDurationSec) ||
      totalDurationSec == null ||
      totalDurationSec <= 0
    ) {
      // si no se pasa el tiempo total, devolver los splits generados
      return splits;
    }

    // Distribución proporcional garantizando suma exacta = totalDurationSec
    const totalDist = totalDistanceKm;
    const allocated = splits.map((s) =>
      Math.floor((s.distanceKm / totalDist) * totalDurationSec),
    );
    const used = allocated.reduce((a, b) => a + b, 0);
    let diff = totalDurationSec - used;

    // repartir diff (segundos restantes) desde el último hacia atrás (o donde prefieras)
    for (let i = allocated.length - 1; i >= 0 && diff > 0; i--) {
      allocated[i] += 1;
      diff -= 1;
    }

    return splits.map((s, idx) => ({ ...s, durationSec: allocated[idx] }));
  }

  private roundToTwoDecimals(v: number) {
    return Math.round(v * 100) / 100;
  }
  private clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
  }
}
