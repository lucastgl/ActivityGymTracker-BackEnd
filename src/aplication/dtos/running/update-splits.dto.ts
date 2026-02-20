import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SplitInputDto {
  @IsNumber()
  order!: number;

  @IsNumber()
  distanceKm!: number;

  @IsNumber()
  durationSec!: number;
}

export class UpdateSplitsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SplitInputDto)
  splits!: SplitInputDto[];
}
