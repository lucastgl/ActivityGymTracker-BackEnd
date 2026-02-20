import { IsDateString } from 'class-validator';

/** Fecha en formato YYYY-MM-DD */
export class ActivateRoutineForDateDto {
  @IsDateString()
  date!: string;
}
