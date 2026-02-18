// domain/value-objects/id.vo.ts

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class Id {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static fromString(value: string): Id {
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID: ${value}`);
    }
    return new Id(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Id): boolean {
    return this._value === other._value;
  }
}
