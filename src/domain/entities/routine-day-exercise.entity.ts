import { Id } from '../value-objects/id.vo';
import { SetType } from '../enums/set-type.enum';

export class RoutineDayExercise {
  constructor(
    public readonly id: Id,
    public readonly routineDayId: Id,
    public readonly exerciseId: Id,
    public readonly plannedSets: number,
    public readonly plannedSetsType: SetType,
    public readonly order: number,
    public readonly plannedDrops?: number,
  ) {}
}
