import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddDayDto {
  @ApiProperty({ example: 'Lunes', description: 'Clave o nombre del día' })
  @IsString()
  @IsNotEmpty()
  dayKey!: string;

  @ApiProperty({ example: 1, description: 'Posición del día en la rutina' })
  @IsNumber()
  order!: number;
}
