import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MeasurementResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() userId!: string;
  @ApiProperty({ example: '2024-01-15' }) date!: string;
  @ApiProperty() weightKg!: number;
  @ApiProperty() deltaPctFat!: number;
  @ApiProperty() deltaPctMuscle!: number;
  @ApiPropertyOptional() note?: string;
  @ApiProperty() createdAt!: string;
}
