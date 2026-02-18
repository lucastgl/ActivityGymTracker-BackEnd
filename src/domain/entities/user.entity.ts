import { Id } from '../value-objects/id.vo';

export class User {
  constructor(
    public readonly id: Id,
    public readonly email: string,
    public readonly createdAt: Date,
  ) {}
}
