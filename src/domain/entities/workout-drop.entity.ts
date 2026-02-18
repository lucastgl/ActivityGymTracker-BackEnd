import { Id } from '../value-objects/id.vo';

export class WorkoutDrop {
  constructor(
    public readonly id: Id,
    public readonly workoutSetId: Id,
    public readonly order: number,
    public readonly weightKg: number,
    public readonly reps: number,
  ) {}
}
