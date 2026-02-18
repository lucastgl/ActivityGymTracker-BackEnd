import { Id } from '../value-objects/id.vo';
import { SetType } from '../enums/set-type.enum';

export class WorkoutSet {
  constructor(
    public readonly id: Id,
    public readonly workoutExerciseId: Id,
    public readonly type: SetType,
    public readonly order: number,
    public readonly weightKg?: number,
    public readonly reps?: number,
  ) {}
}
