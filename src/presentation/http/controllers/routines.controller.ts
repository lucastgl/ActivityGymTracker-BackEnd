/**
 * INSTRUCTIVO - RoutinesController
 *
 * FUNCIÓN:
 *   Capa HTTP para el recurso "rutinas" (plantillas de entrenamiento).
 *   Las rutinas son plantillas con días y ejercicios planeados; la "activación"
 *   crea una sesión de workout para una fecha concreta.
 *
 * FLUJO:
 *   1. Validación DTO (ValidationPipe)
 *   2. userId desde X-User-Id
 *   3. Mapeo DTO → dominio (Id, DateOnly, etc.)
 *   4. useCase.execute(...)
 *   5. Entidad → RoutineResponseDto → JSON
 *
 * RUTAS:
 *   GET    /routines                    - Lista rutinas
 *   POST   /routines                    - Crear rutina
 *   GET    /routines/:id                 - Detalle (con days + exercises)
 *   PATCH  /routines/:id                - Actualizar rutina
 *   POST   /routines/:id/days            - Agregar día
 *   PATCH  /routines/:id/days/:dayId     - Actualizar día
 *   POST   /routines/:id/days/:dayId/exercises     - Agregar ejercicio al día
 *   PATCH  /routines/:id/days/:dayId/exercises/:exId - Actualizar ejercicio planeado
 *   POST   /routines/:id/activate        - Activar rutina para fecha (crea workout)
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { DateOnly } from '../../../domain/value-objects/date-only.vo';
import { ListRoutinesUseCase } from '../../../aplication/use-cases/routines/list-routines.use-case';
import { CreateRoutineUseCase } from '../../../aplication/use-cases/routines/create-routine.use-case';
import { GetRoutineDetailUseCase } from '../../../aplication/use-cases/routines/get-routine-detail.use-case';
import { UpdateRoutineUseCase } from '../../../aplication/use-cases/routines/update-routine.use-case';
import { AddRoutineDayUseCase } from '../../../aplication/use-cases/routines/add-routine-day.use-case';
import { UpdateRoutineDayUseCase } from '../../../aplication/use-cases/routines/update-routine-day.use-case';
import { AddExerciseToRoutineUseCase } from '../../../aplication/use-cases/routines/add-exercise-routine-day.use-case';
import { UpdateRoutineDayExerciseUseCase } from '../../../aplication/use-cases/routines/update-routine-day-exercise.use-case';
import { ActivateRoutineForDateUseCase } from '../../../aplication/use-cases/routines/activate-routine-for-date.use-case';
import {
  CreateRoutineDto,
  UpdateRoutineDto,
  AddDayDto,
  UpdateDayDto,
  AddDayExerciseDto,
  UpdateDayExerciseDto,
  ActivateRoutineForDateDto,
  RoutineResponseDto,
  RoutineDayResponseDto,
  RoutineDayExerciseResponseDto,
} from '../../../aplication/dtos/routines';
import type { RoutineDetail } from '../../../domain/repositories/routine.repository';

const DEFAULT_USER_ID = '00000000-0000-4000-8000-000000000000';

@Controller('routines')
export class RoutinesController {
  constructor(
    private readonly listRoutines: ListRoutinesUseCase,
    private readonly createRoutine: CreateRoutineUseCase,
    private readonly getRoutineDetail: GetRoutineDetailUseCase,
    private readonly updateRoutine: UpdateRoutineUseCase,
    private readonly addRoutineDay: AddRoutineDayUseCase,
    private readonly updateRoutineDay: UpdateRoutineDayUseCase,
    private readonly addExerciseToRoutine: AddExerciseToRoutineUseCase,
    private readonly updateRoutineDayExercise: UpdateRoutineDayExerciseUseCase,
    private readonly activateRoutineForDate: ActivateRoutineForDateUseCase,
  ) {}

  private userId(header: string | undefined) {
    return Id.fromString(header || DEFAULT_USER_ID);
  }

  @Get()
  async list(
    @Headers('x-user-id') userIdHeader: string,
  ): Promise<RoutineResponseDto[]> {
    const routines = await this.listRoutines.execute(this.userId(userIdHeader));
    return routines.map((r) => this.routineToDto(r));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: CreateRoutineDto,
  ): Promise<RoutineResponseDto> {
    const routine = await this.createRoutine.execute(this.userId(userIdHeader), dto);
    return this.routineToDto(routine);
  }

  @Get(':id')
  async getDetail(
    @Headers('x-user-id') userIdHeader: string,
    @Param('id') id: string,
  ): Promise<RoutineResponseDto | null> {
    const detail = await this.getRoutineDetail.execute(
      this.userId(userIdHeader),
      Id.fromString(id),
    );
    return detail ? this.routineDetailToDto(detail) : null;
  }

  @Patch(':id')
  async update(
    @Headers('x-user-id') userIdHeader: string,
    @Param('id') id: string,
    @Body() dto: UpdateRoutineDto,
  ): Promise<RoutineResponseDto | null> {
    const routine = await this.updateRoutine.execute(
      this.userId(userIdHeader),
      Id.fromString(id),
      dto,
    );
    return routine ? this.routineToDto(routine) : null;
  }

  @Post(':id/days')
  @HttpCode(HttpStatus.CREATED)
  async addDay(
    @Headers('x-user-id') userIdHeader: string,
    @Param('id') routineId: string,
    @Body() dto: AddDayDto,
  ): Promise<RoutineDayResponseDto> {
    const day = await this.addRoutineDay.execute(
      this.userId(userIdHeader),
      Id.fromString(routineId),
      dto,
    );
    return this.dayToDto(day);
  }

  @Patch(':id/days/:dayId')
  async updateDay(
    @Headers('x-user-id') userIdHeader: string,
    @Param('id') routineId: string,
    @Param('dayId') dayId: string,
    @Body() dto: UpdateDayDto,
  ): Promise<RoutineDayResponseDto | null> {
    const day = await this.updateRoutineDay.execute(
      this.userId(userIdHeader),
      Id.fromString(routineId),
      Id.fromString(dayId),
      dto,
    );
    return day ? this.dayToDto(day) : null;
  }

  @Post(':id/days/:dayId/exercises')
  @HttpCode(HttpStatus.CREATED)
  async addDayExercise(
    @Headers('x-user-id') userIdHeader: string,
    @Param('id') routineId: string,
    @Param('dayId') dayId: string,
    @Body() dto: AddDayExerciseDto,
  ): Promise<RoutineDayExerciseResponseDto> {
    const ex = await this.addExerciseToRoutine.execute(
      this.userId(userIdHeader),
      Id.fromString(routineId),
      Id.fromString(dayId),
      { ...dto, exerciseId: Id.fromString(dto.exerciseId) },
    );
    return this.dayExerciseToDto(ex);
  }

  @Patch(':id/days/:dayId/exercises/:exerciseId')
  async updateDayExercise(
    @Headers('x-user-id') userIdHeader: string,
    @Param('id') routineId: string,
    @Param('dayId') dayId: string,
    @Param('exerciseId') exerciseId: string,
    @Body() dto: UpdateDayExerciseDto,
  ): Promise<RoutineDayExerciseResponseDto> {
    const ex = await this.updateRoutineDayExercise.execute(
      this.userId(userIdHeader),
      Id.fromString(routineId),
      Id.fromString(dayId),
      Id.fromString(exerciseId),
      dto,
    );
    return this.dayExerciseToDto(ex);
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.CREATED)
  async activate(
    @Headers('x-user-id') userIdHeader: string,
    @Param('id') id: string,
    @Body() dto: ActivateRoutineForDateDto,
  ) {
    const date = DateOnly.fromString(dto.date);
    const session = await this.activateRoutineForDate.execute(
      this.userId(userIdHeader),
      Id.fromString(id),
      date,
    );
    return {
      sessionId: session.id.value,
      date: session.date.toString(),
      status: session.status,
    };
  }

  private routineToDto(r: { id: Id; userId: Id; name: string; isActive: boolean; notes?: string; createdAt: Date; updatedAt: Date }): RoutineResponseDto {
    return {
      id: r.id.value,
      userId: r.userId.value,
      name: r.name,
      isActive: r.isActive,
      notes: r.notes,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  }

  private routineDetailToDto(d: RoutineDetail): RoutineResponseDto {
    const base = this.routineToDto(d);
    base.days = d.days.map((day) => this.dayToDto(day));
    return base;
  }

  private dayToDto(d: { id: Id; routineId: Id; dayKey: string; order: number; exercises?: { id: Id; routineDayId: Id; exerciseId: Id; plannedSets: number; plannedSetsType: unknown; order: number; plannedDrops?: number }[] }): RoutineDayResponseDto {
    const out: RoutineDayResponseDto = {
      id: d.id.value,
      routineId: d.routineId.value,
      dayKey: d.dayKey,
      order: d.order,
      exercises: [],
    };
    if (d.exercises) {
      out.exercises = d.exercises.map((e) => this.dayExerciseToDto(e));
    }
    return out;
  }

  private dayExerciseToDto(e: { id: Id; routineDayId: Id; exerciseId: Id; plannedSets: number; plannedSetsType: unknown; order: number; plannedDrops?: number }): RoutineDayExerciseResponseDto {
    return {
      id: e.id.value,
      routineDayId: e.routineDayId.value,
      exerciseId: e.exerciseId.value,
      plannedSets: e.plannedSets,
      plannedSetsType: e.plannedSetsType as RoutineDayExerciseResponseDto['plannedSetsType'],
      order: e.order,
      plannedDrops: e.plannedDrops,
    };
  }
}
