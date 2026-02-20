/**
 * INSTRUCTIVO - MeasurementsController
 *
 * FUNCIÓN:
 *   Capa HTTP para mediciones corporales (peso, % grasa, % músculo).
 *   Usado por informes y para valores por defecto en intervalos.
 *
 * FLUJO:
 *   1. Validación DTO
 *   2. userId desde X-User-Id
 *   3. Mapeo DTO → dominio (DateOnly para create y list)
 *   4. useCase.execute(...)
 *   5. BodyMeasurement → MeasurementResponseDto → JSON
 *
 * RUTAS:
 *   POST   /measurements       - Crear medición
 *   GET    /measurements/latest - Última medición
 *   GET    /measurements       - Listar por rango (?from=YYYY-MM-DD&to=YYYY-MM-DD)
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { Id } from '../../../domain/value-objects/id.vo';
import { DateOnly } from '../../../domain/value-objects/date-only.vo';
import { CreateMeasurementUseCase } from '../../../aplication/use-cases/measurements/create-measurement.use-case';
import { GetLatestMeasurementUseCase } from '../../../aplication/use-cases/measurements/get-latest-measurement.use-case';
import { ListMeasurementsUseCase } from '../../../aplication/use-cases/measurements/list-measurements.use-case';
import {
  CreateMeasurementDto,
  ListMeasurementsQueryDto,
  MeasurementResponseDto,
} from '../../../aplication/dtos/measurements';

const DEFAULT_USER_ID = '00000000-0000-4000-8000-000000000000';

@ApiTags('Measurements')
@ApiHeader({ name: 'x-user-id', description: 'ID del usuario', required: false })
@Controller('measurements')
export class MeasurementsController {
  constructor(
    private readonly createMeasurement: CreateMeasurementUseCase,
    private readonly getLatestMeasurement: GetLatestMeasurementUseCase,
    private readonly listMeasurements: ListMeasurementsUseCase,
  ) {}

  private userId(header: string | undefined) {
    return Id.fromString(header || DEFAULT_USER_ID);
  }

  @Get('latest')
  @ApiOperation({ summary: 'Obtener última medición corporal' })
  @ApiResponse({ status: 200, type: MeasurementResponseDto })
  async getLatest(
    @Headers('x-user-id') userIdHeader: string,
  ): Promise<MeasurementResponseDto | null> {
    const measurement = await this.getLatestMeasurement.execute(
      this.userId(userIdHeader),
    );
    return measurement ? this.toDto(measurement) : null;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar medición corporal' })
  @ApiResponse({ status: 201, type: MeasurementResponseDto })
  async create(
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: CreateMeasurementDto,
  ): Promise<MeasurementResponseDto> {
    const data = { ...dto, date: DateOnly.fromString(dto.date) };
    const measurement = await this.createMeasurement.execute(
      this.userId(userIdHeader),
      data,
    );
    return this.toDto(measurement);
  }

  @Get()
  @ApiOperation({ summary: 'Listar mediciones por rango de fechas' })
  @ApiResponse({ status: 200, type: [MeasurementResponseDto] })
  async list(
    @Headers('x-user-id') userIdHeader: string,
    @Query() query: ListMeasurementsQueryDto,
  ): Promise<MeasurementResponseDto[]> {
    const measurements = await this.listMeasurements.execute(
      this.userId(userIdHeader),
      DateOnly.fromString(query.from),
      DateOnly.fromString(query.to),
    );
    return measurements.map((m) => this.toDto(m));
  }

  private toDto(m: { id: Id; userId: Id; date: { toString: () => string }; weightKg: number; deltaPctFat: number; deltaPctMuscle: number; note?: string; createdAt: Date }): MeasurementResponseDto {
    return {
      id: m.id.value,
      userId: m.userId.value,
      date: typeof m.date === 'object' && 'toString' in m.date ? m.date.toString() : String(m.date),
      weightKg: m.weightKg,
      deltaPctFat: m.deltaPctFat,
      deltaPctMuscle: m.deltaPctMuscle,
      note: m.note,
      createdAt: m.createdAt.toISOString(),
    };
  }
}
