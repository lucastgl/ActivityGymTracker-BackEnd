import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ReplaceDropDto {
  @IsNumber()
  order!: number;

  @IsNumber()
  weightKg!: number;

  @IsNumber()
  reps!: number;
}

export class ReplaceDropsBodyDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReplaceDropDto)
  drops!: ReplaceDropDto[];
}
