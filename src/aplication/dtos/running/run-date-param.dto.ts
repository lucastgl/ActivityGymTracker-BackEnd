import { IsDateString } from 'class-validator';

/** Parámetro de fecha para operaciones de run (YYYY-MM-DD) */
export class RunDateParamDto {
  @IsDateString()
  date!: string;
}
