import { IsDateString } from 'class-validator';

/** Parámetro de fecha para operaciones de calendario (YYYY-MM-DD) */
export class CalendarDateParamDto {
  @IsDateString()
  date!: string;
}
