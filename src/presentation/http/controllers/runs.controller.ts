/**
 * INSTRUCTIVO - RunsController
 *
 * FUNCIÓN:
 *   Capa HTTP para sesiones de running. Las sesiones se identifican por fecha.
 *   Incluye generación de splits (parciales) a partir de distancia/duración.
 *
 * FLUJO:
 *   1. Validación DTO
 *   2. userId desde X-User-Id
 *   3. date desde path (YYYY-MM-DD)
 *   4. Para complete/revert/updateSplits: obtener runSessionId vía GET por fecha
 *   5. useCase.execute(...)
 *   6. Respuesta serializada
 *
 * RUTAS:
 *   GET    /runs/:date              - Obtener run por fecha
 *   PUT    /runs/:date              - Upsert sesión (distanceKm, durationSec, status, injuryMode, note)
 *   POST   /runs/splits/generate    - Generar splits (cálculo puro, sin persistir)
 *   PUT    /runs/:date/splits       - Reemplazar splits de la sesión
 *   POST   /runs/:date/complete     - Marcar completado
 *   POST   /runs/:date/revert       - Volver a borrador
 */

import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiParam,
} from '@nestjs/swagger';
import { Id } from '../../../domain/value-objects/id.vo';
import { DateOnly } from '../../../domain/value-objects/date-only.vo';
import { GetRunByDateUseCase } from '../../../aplication/use-cases/runs/get-run-by-date.use-case';
import { UpsertRunSessionUseCase } from '../../../aplication/use-cases/runs/upsert-run-session.use-case';
import { GenerateSplitsFromDistanceUseCase } from '../../../aplication/use-cases/runs/generate-splits-from-distance.use-case';
import { UpdateSplitsUseCase } from '../../../aplication/use-cases/runs/update-splits.use-case';
import { CompleteRunUseCase } from '../../../aplication/use-cases/runs/complete-run.use-case';
import { RevertRunToDraftUseCase } from '../../../aplication/use-cases/runs/revert-run-to-draft.use-case';
import {
  UpsertRunSessionDto,
  GenerateSplitsDto,
  UpdateSplitsDto,
  RunSessionResponseDto,
} from '../../../aplication/dtos/running';
import type { RunSessionDetail } from '../../../domain/repositories/run.repository';

const DEFAULT_USER_ID = '00000000-0000-4000-8000-000000000000';

@ApiTags('Runs')
@ApiHeader({ name: 'x-user-id', description: 'ID del usuario', required: false })
@Controller('runs')
export class RunsController {
  constructor(
    private readonly getRunByDate: GetRunByDateUseCase,
    private readonly upsertRunSession: UpsertRunSessionUseCase,
    private readonly generateSplitsFromDistance: GenerateSplitsFromDistanceUseCase,
    private readonly updateSplits: UpdateSplitsUseCase,
    private readonly completeRun: CompleteRunUseCase,
    private readonly revertRunToDraft: RevertRunToDraftUseCase,
  ) {}

  private userId(header: string | undefined) {
    return Id.fromString(header || DEFAULT_USER_ID);
  }

  @Post('splits/generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generar splits sugeridos (cálculo puro, sin persistir)' })
  @ApiResponse({ status: 200, description: 'Lista de splits calculados' })
  generateSplitsPreview(@Body() dto: GenerateSplitsDto) {
    return this.generateSplitsFromDistance.execute(
      dto.totalDistanceKm,
      dto.totalDurationSec,
    );
  }

  @Get(':date')
  @ApiOperation({ summary: 'Obtener sesión de run por fecha' })
  @ApiParam({ name: 'date', example: '2024-01-15', description: 'Fecha YYYY-MM-DD' })
  @ApiResponse({ status: 200, type: RunSessionResponseDto })
  async getByDate(
    @Headers('x-user-id') userIdHeader: string,
    @Param('date') date: string,
  ): Promise<RunSessionResponseDto | null> {
    const run = await this.getRunByDate.execute(
      this.userId(userIdHeader),
      DateOnly.fromString(date),
    );
    return run ? this.runToDto(run) : null;
  }

  @Put(':date')
  @ApiOperation({ summary: 'Crear o actualizar sesión de run por fecha' })
  @ApiParam({ name: 'date', example: '2024-01-15', description: 'Fecha YYYY-MM-DD' })
  @ApiResponse({ status: 200, type: RunSessionResponseDto })
  async upsertSession(
    @Headers('x-user-id') userIdHeader: string,
    @Param('date') date: string,
    @Body() dto: UpsertRunSessionDto,
  ): Promise<RunSessionResponseDto> {
    const session = await this.upsertRunSession.execute(
      this.userId(userIdHeader),
      DateOnly.fromString(date),
      dto,
    );
    return this.sessionToDto(session);
  }

  @Put(':date/splits')
  @ApiOperation({ summary: 'Reemplazar splits de la sesión de run' })
  @ApiParam({ name: 'date', example: '2024-01-15', description: 'Fecha YYYY-MM-DD' })
  @ApiResponse({ status: 200, description: 'Splits actualizados' })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  async replaceSplits(
    @Headers('x-user-id') userIdHeader: string,
    @Param('date') date: string,
    @Body() dto: UpdateSplitsDto,
  ) {
    const uid = this.userId(userIdHeader);
    const d = DateOnly.fromString(date);
    const run = await this.getRunByDate.execute(uid, d);
    if (!run) {
      throw new NotFoundException('No hay sesión de run para esta fecha.');
    }
    const splits = await this.updateSplits.execute(uid, run.id, dto.splits);
    return splits.map((s) => ({ id: s.id.value, order: s.order, distanceKm: s.distanceKm, durationSec: s.durationSec }));
  }

  @Post(':date/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar sesión de run como completada' })
  @ApiParam({ name: 'date', example: '2024-01-15', description: 'Fecha YYYY-MM-DD' })
  @ApiResponse({ status: 200, type: RunSessionResponseDto })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  async complete(
    @Headers('x-user-id') userIdHeader: string,
    @Param('date') date: string,
  ): Promise<RunSessionResponseDto | null> {
    const uid = this.userId(userIdHeader);
    const d = DateOnly.fromString(date);
    const run = await this.getRunByDate.execute(uid, d);
    if (!run) {
      throw new NotFoundException('No hay sesión para esta fecha.');
    }
    const session = await this.completeRun.execute(uid, run.id);
    return session ? this.sessionToDto(session) : null;
  }

  @Post(':date/revert')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revertir sesión de run a borrador' })
  @ApiParam({ name: 'date', example: '2024-01-15', description: 'Fecha YYYY-MM-DD' })
  @ApiResponse({ status: 200, type: RunSessionResponseDto })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  async revert(
    @Headers('x-user-id') userIdHeader: string,
    @Param('date') date: string,
  ): Promise<RunSessionResponseDto | null> {
    const uid = this.userId(userIdHeader);
    const d = DateOnly.fromString(date);
    const run = await this.getRunByDate.execute(uid, d);
    if (!run) {
      throw new NotFoundException('No hay sesión para esta fecha.');
    }
    const session = await this.revertRunToDraft.execute(uid, run.id);
    return session ? this.sessionToDto(session) : null;
  }

  private runToDto(r: RunSessionDetail): RunSessionResponseDto {
    return {
      ...this.sessionToDto(r),
      splits: r.splits.map((s) => ({
        id: s.id.value,
        order: s.order,
        distanceKm: s.distanceKm,
        durationSec: s.durationSec,
      })),
    };
  }

  private sessionToDto(s: { id: Id; userId: Id; date: { toString: () => string }; status: unknown; injuryMode: boolean; note?: string; distanceKm: number; durationSec: number; createdAt: Date; updatedAt: Date }): RunSessionResponseDto {
    return {
      id: s.id.value,
      userId: s.userId.value,
      date: typeof s.date === 'object' && 'toString' in s.date ? s.date.toString() : String(s.date),
      status: s.status as RunSessionResponseDto['status'],
      injuryMode: s.injuryMode,
      note: s.note,
      distanceKm: s.distanceKm,
      durationSec: s.durationSec,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      splits: [],
    };
  }
}
