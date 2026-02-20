import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRoutineDto {
  @ApiPropertyOptional({ example: 'Rutina B - Pull' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Notas actualizadas' })
  @IsOptional()
  @IsString()
  notes?: string;
}
