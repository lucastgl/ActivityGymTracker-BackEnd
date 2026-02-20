import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SplitInputDto {
  @ApiProperty({ example: 1 }) @IsNumber() order!: number;
  @ApiProperty({ example: 1.0 }) @IsNumber() distanceKm!: number;
  @ApiProperty({ example: 360 }) @IsNumber() durationSec!: number;
}

export class UpdateSplitsDto {
  @ApiProperty({ type: [SplitInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SplitInputDto)
  splits!: SplitInputDto[];
}
