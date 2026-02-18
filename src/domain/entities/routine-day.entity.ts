import { Id } from '../value-objects/id.vo';

export class RoutineDay {
  constructor(
    public readonly id: Id,
    public readonly routineId: Id,
    public readonly dayKey: string,
    public readonly order: number,
  ) {}
}
