import { Id } from '../value-objects/id.vo';
import { DateOnly } from '../value-objects/date-only.vo';

export class BodyMeasurement {
  constructor(
    public readonly id: Id,
    public readonly userId: Id,
    public readonly date: DateOnly,
    public readonly weightKg: number,
    public readonly deltaPctFat: number,
    public readonly deltaPctMuscle: number,
    public readonly createdAt: Date,
    public readonly note?: string,
  ) {}
}
