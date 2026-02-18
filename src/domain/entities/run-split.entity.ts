import { Id } from '../value-objects/id.vo';

export class RunSplit {
  constructor(
    public readonly id: Id,
    public readonly runSessionId: Id,
    public readonly order: number,
    public readonly distanceKm: number,
    public readonly durationSec: number,
  ) {}
}
