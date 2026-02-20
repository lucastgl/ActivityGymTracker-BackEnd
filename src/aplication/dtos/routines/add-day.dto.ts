import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddDayDto {
  @IsString()
  @IsNotEmpty()
  dayKey!: string;

  @IsNumber()
  order!: number;
}
