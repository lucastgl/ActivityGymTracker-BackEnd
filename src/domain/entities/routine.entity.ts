import { Id } from '../value-objects/id.vo';

export class Routine {
  constructor(
    public readonly id: Id,
    public readonly userId: Id,
    public readonly name: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly notes?: string,
  ) {}
}
