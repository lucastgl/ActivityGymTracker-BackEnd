import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListMeasurementsQueryDto {
  @ApiProperty({ example: '2024-01-01', description: 'Fecha inicio YYYY-MM-DD' })
  @IsDateString()
  from!: string;

  @ApiProperty({ example: '2024-01-31', description: 'Fecha fin YYYY-MM-DD' })
  @IsDateString()
  to!: string;
}
