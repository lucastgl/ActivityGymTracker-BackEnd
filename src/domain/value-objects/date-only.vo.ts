const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export class DateOnly {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static fromString(value: string): DateOnly {
    if (!DATE_ONLY_REGEX.test(value)) {
      throw new Error(
        `Invalid DateOnly format. Expected YYYY-MM-DD, got: ${value}`,
      );
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date: ${value}`);
    }
    return new DateOnly(value);
  }

  static fromDate(date: Date): DateOnly {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return new DateOnly(`${year}-${month}-${day}`);
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  equals(other: DateOnly): boolean {
    return this._value === other._value;
  }
}
