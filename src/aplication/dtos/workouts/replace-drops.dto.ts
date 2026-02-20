import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReplaceDropDto {
  @ApiProperty({ example: 1 }) @IsNumber() order!: number;
  @ApiProperty({ example: 15.0 }) @IsNumber() weightKg!: number;
  @ApiProperty({ example: 10 }) @IsNumber() reps!: number;
}

export class ReplaceDropsBodyDto {
  @ApiProperty({ type: [ReplaceDropDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReplaceDropDto)
  drops!: ReplaceDropDto[];
}
