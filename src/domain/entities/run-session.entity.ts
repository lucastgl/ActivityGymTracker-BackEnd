import { Id } from '../value-objects/id.vo';
import { DateOnly } from '../value-objects/date-only.vo';
import { SessionStatus } from '../enums/session-status.enum';

export class RunSession {
  constructor(
    public readonly id: Id,
    public readonly userId: Id,
    public readonly date: DateOnly,
    public readonly distanceKm: number,
    public readonly durationSec: number,
    public readonly status: SessionStatus,
    public readonly injuryMode: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly note?: string,
  ) {}
}
