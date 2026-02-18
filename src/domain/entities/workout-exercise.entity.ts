import { Id } from '../value-objects/id.vo';
import { OriginType } from '../enums/origin-type.enum';

export class WorkoutExercise {
  constructor(
    public readonly id: Id,
    public readonly workoutSessionId: Id,
    public readonly exerciseId: Id,
    public readonly origin: OriginType,
    public readonly order: number,
  ) {}
}
