import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoutineDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
