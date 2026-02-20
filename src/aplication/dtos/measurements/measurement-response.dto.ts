export class MeasurementResponseDto {
  id!: string;
  userId!: string;
  date!: string;
  weightKg!: number;
  deltaPctFat!: number;
  deltaPctMuscle!: number;
  note?: string;
  createdAt!: string;
}
