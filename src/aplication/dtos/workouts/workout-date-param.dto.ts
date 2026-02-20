import { IsDateString } from 'class-validator';

/** Parámetro de fecha para operaciones de workout (YYYY-MM-DD) */
export class WorkoutDateParamDto {
  @IsDateString()
  date!: string;
}
