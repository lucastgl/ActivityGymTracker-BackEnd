import { IsDateString } from 'class-validator';

export class ListMeasurementsQueryDto {
  @IsDateString()
  from!: string;

  @IsDateString()
  to!: string;
}
