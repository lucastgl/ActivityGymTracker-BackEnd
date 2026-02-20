/**
 * INSTRUCTIVO - WorkoutsController
 *
 * FUNCIÓN:
 *   Capa HTTP para sesiones de musculación ("ejercicios del día").
 *   Las sesiones se identifican por fecha. El workout se crea/actualiza
 *   por fecha; los ejercicios, sets y drops se gestionan por IDs.
 *
 * FLUJO:
 *   1. Validación DTO
 *   2. userId desde X-User-Id
 *   3. date desde path param (YYYY-MM-DD)
 *   4. Para operaciones que usan sessionId: primero GET por fecha para obtener IDs
 *   5. useCase.execute(...)
 *   6. Respuesta serializada
 *
 * RUTAS:
 *   GET    /workouts/:date                    - Obtener sesión por fecha
 *   PUT    /workouts/:date                    - Upsert metadata (status, injuryMode, note)
 *   POST   /workouts/:date/exercises          - Agregar ejercicio
 *   DELETE /workouts/:date/exercises/:exId    - Quitar ejercicio
 *   PUT    /workouts/:date/exercises/:exId/sets      - Upsert set
 *   PUT    /workouts/:date/exercises/:exId/sets/:setId/drops - Reemplazar drops
 *   POST   /workouts/:date/complete            - Marcar completado
 *   POST   /workouts/:date/revert              - Volver a borrador
 */

import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
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
import { GetWorkoutByDateUseCase } from '../../../aplication/use-cases/workouts/get-workout-by-date.use-case';
import { UpsertWorkoutSessionUseCase } from '../../../aplication/use-cases/workouts/upsert-workout-session.use-case';
import { AddExerciseToWorkoutUseCase } from '../../../aplication/use-cases/workouts/add-exercise-to-workout.use-case';
import { UpsertWorkoutSetUseCase } from '../../../aplication/use-cases/workouts/upsert-workout-set.use-case';
import { UpsertWorkoutDropsUseCase } from '../../../aplication/use-cases/workouts/upsert-workout-drops.use-case';
import { CompleteWorkoutUseCase } from '../../../aplication/use-cases/workouts/complete-workout.use-case';
import { RevertWorkoutToDraftUseCase } from '../../../aplication/use-cases/workouts/revert-workout-to-draft.use-case';
import { RemoveWorkoutExerciseUseCase } from '../../../aplication/use-cases/workouts/remove-workout-exercise.use-case';
import {
  UpsertWorkoutSessionDto,
  AddExerciseToWorkoutDto,
  UpsertWorkoutSetDto,
  ReplaceDropsBodyDto,
  WorkoutSessionResponseDto,
} from '../../../aplication/dtos/workouts';
import type { WorkoutSessionDetail } from '../../../domain/repositories/workout.repository';

const DEFAULT_USER_ID = '00000000-0000-4000-8000-000000000000';

@ApiTags('Workouts')
@ApiHeader({ name: 'x-user-id', description: 'ID del usuario', required: false })
@Controller('workouts')
export class WorkoutsController {
  constructor(
    private readonly getWorkoutByDate: GetWorkoutByDateUseCase,
    private readonly upsertWorkoutSession: UpsertWorkoutSessionUseCase,
    private readonly addExerciseToWorkout: AddExerciseToWorkoutUseCase,
    private readonly upsertWorkoutSet: UpsertWorkoutSetUseCase,
    private readonly upsertWorkoutDrops: UpsertWorkoutDropsUseCase,
    private readonly completeWorkout: CompleteWorkoutUseCase,
    private readonly revertWorkoutToDraft: RevertWorkoutToDraftUseCase,
    private readonly removeWorkoutExercise: RemoveWorkoutExerciseUseCase,
  ) {}

  private userId(header: string | undefined) {
    return Id.fromString(header || DEFAULT_USER_ID);
  }

  @Get(':date')
  @ApiOperation({ summary: 'Obtener sesión de workout por fecha' })
  @ApiParam({ name: 'date', example: '2024-01-15', description: 'Fecha YYYY-MM-DD' })
  @ApiResponse({ status: 200, type: WorkoutSessionResponseDto })
  async getByDate(
    @Headers('x-user-id') userIdHeader: string,
    @Param('date') date: string,
  ): Promise<WorkoutSessionResponseDto | null> {
    const workout = await this.getWorkoutByDate.execute(
      this.userId(userIdHeader),
      DateOnly.fromString(date),
    );
    return workout ? this.workoutToDto(workout) : null;
  }

  @Put(':date')
  @ApiOperation({ summary: 'Crear o actualizar metadata de sesión de workout' })
  @ApiParam({ name: 'date', example: '2024-01-15', description: 'Fecha YYYY-MM-DD' })
  @ApiResponse({ status: 200, type: WorkoutSessionResponseDto })
  async upsertSession(
    @Headers('x-user-id') userIdHeader: string,
    @Param('date') date: string,
    @Body() dto: UpsertWorkoutSessionDto,
  ): Promise<WorkoutSessionResponseDto> {
    const session = await this.upsertWorkoutSession.execute(
      this.userId(userIdHeader),
      DateOnly.fromString(date),
      dto,
    );
    return this.sessionToDto(session);
  }

  @Post(':date/exercises')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Agregar ejercicio a la sesión' })
  @ApiParam({ name: 'date', example: '2024-01-15', description: 'Fecha YYYY-MM-DD' })
  @ApiResponse({ status: 201, description: '{ id: uuid }' })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  async addExercise(
    @Headers('x-user-id') userIdHeader: string,
    @Param('date') date: string,
    @Body() dto: AddExerciseToWorkoutDto,
  ) {
    const uid = this.userId(userIdHeader);
    const d = DateOnly.fromString(date);
    const workout = await this.getWorkoutByDate.execute(uid, d);
    if (!workout) {
      throw new NotFoundException('No hay sesión para esta fecha. Usar PUT /workouts/:date primero.');
    }
    const ex = await this.addExerciseToWorkout.execute(
      uid,
      workout.id,
      Id.fromString(dto.exerciseId),
      dto.origin,
      dto.order,
    );
    return ex ? { id: ex.id.value } : null;
  }

  @Delete(':date/exercises/:exerciseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Quitar ejercicio de la sesión' })
  @ApiParam({ name: 'date', example: '2024-01-15', description: 'Fecha YYYY-MM-DD' })
  @ApiParam({ name: 'exerciseId', description: 'UUID del workout exercise' })
  @ApiResponse({ status: 200, description: '{ success: boolean }' })
  async removeExercise(
    @Headers('x-user-id') userIdHeader: string,
    @Param('date') date: string,
    @Param('exerciseId') exerciseId: string,
  ): Promise<{ success: boolean }> {
    const success = await this.removeWorkoutExercise.execute(
      this.userId(userIdHeader),
      Id.fromString(exerciseId),
    );
    return { success };
  }

  @Put(':date/exercises/:exerciseId/sets')
  @ApiOperation({ summary: 'Crear o actualizar un set en el ejercicio' })
  @ApiParam({ name: 'date', example: '2024-01-15', description: 'Fecha YYYY-MM-DD' })
  @ApiParam({ name: 'exerciseId', description: 'UUID del workout exercise' })
  @ApiResponse({ status: 200, description: '{ id: uuid }' })
  async upsertSet(
    @Headers('x-user-id') userIdHeader: string,
    @Param('date') date: string,
    @Param('exerciseId') exerciseId: string,
    @Body() dto: UpsertWorkoutSetDto,
  ) {
    const setInput = dto.id
      ? { ...dto, id: Id.fromString(dto.id) }
      : { type: dto.type, order: dto.order, weightKg: dto.weightKg, reps: dto.reps };
    const set = await this.upsertWorkoutSet.execute(
      this.userId(userIdHeader),
      Id.fromString(exerciseId),
      setInput,
    );
    return set ? { id: set.id.value } : null;
  }

  @Put(':date/exercises/:exerciseId/sets/:setId/drops')
  @ApiOperation({ summary: 'Reemplazar drops de un set (dropset)' })
  @ApiParam({ name: 'date', example: '2024-01-15', description: 'Fecha YYYY-MM-DD' })
  @ApiParam({ name: 'setId', description: 'UUID del workout set' })
  @ApiResponse({ status: 200, description: 'Lista de drops actualizados' })
  async replaceDrops(
    @Headers('x-user-id') userIdHeader: string,
    @Param('date') date: string,
    @Param('exerciseId') exerciseId: string,
    @Param('setId') setId: string,
    @Body() dto: ReplaceDropsBodyDto,
  ) {
    const drops = await this.upsertWorkoutDrops.execute(
      this.userId(userIdHeader),
      Id.fromString(setId),
      dto.drops,
    );
    return drops.map((d) => ({ id: d.id.value, order: d.order, weightKg: d.weightKg, reps: d.reps }));
  }

  @Post(':date/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar sesión de workout como completada' })
  @ApiParam({ name: 'date', example: '2024-01-15', description: 'Fecha YYYY-MM-DD' })
  @ApiResponse({ status: 200, type: WorkoutSessionResponseDto })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  async complete(
    @Headers('x-user-id') userIdHeader: string,
    @Param('date') date: string,
  ): Promise<WorkoutSessionResponseDto | null> {
    const uid = this.userId(userIdHeader);
    const d = DateOnly.fromString(date);
    const workout = await this.getWorkoutByDate.execute(uid, d);
    if (!workout) {
      throw new NotFoundException('No hay sesión para esta fecha.');
    }
    const session = await this.completeWorkout.execute(uid, workout.id);
    return session ? this.sessionToDto(session) : null;
  }

  @Post(':date/revert')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revertir sesión de workout a borrador' })
  @ApiParam({ name: 'date', example: '2024-01-15', description: 'Fecha YYYY-MM-DD' })
  @ApiResponse({ status: 200, type: WorkoutSessionResponseDto })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  async revert(
    @Headers('x-user-id') userIdHeader: string,
    @Param('date') date: string,
  ): Promise<WorkoutSessionResponseDto | null> {
    const uid = this.userId(userIdHeader);
    const d = DateOnly.fromString(date);
    const workout = await this.getWorkoutByDate.execute(uid, d);
    if (!workout) {
      throw new NotFoundException('No hay sesión para esta fecha.');
    }
    const session = await this.revertWorkoutToDraft.execute(uid, workout.id);
    return session ? this.sessionToDto(session) : null;
  }

  private workoutToDto(w: WorkoutSessionDetail): WorkoutSessionResponseDto {
    return {
      ...this.sessionToDto(w),
      exercises: w.exercises.map((e) => ({
        id: e.id.value,
        workoutSessionId: e.workoutSessionId.value,
        exerciseId: e.exerciseId.value,
        origin: e.origin,
        order: e.order,
        sets: e.sets.map((s) => ({
          id: s.id.value,
          type: s.type,
          order: s.order,
          weightKg: s.weightKg,
          reps: s.reps,
          drops: s.drops?.map((d) => ({
            id: d.id.value,
            order: d.order,
            weightKg: d.weightKg,
            reps: d.reps,
          })),
        })),
      })),
    };
  }

  private sessionToDto(s: { id: Id; userId: Id; date: { toString: () => string }; status: unknown; injuryMode: boolean; note?: string; sourceRoutineId?: Id; sourceRoutineDayId?: Id; createdAt: Date; updatedAt: Date }): WorkoutSessionResponseDto {
    return {
      id: s.id.value,
      userId: s.userId.value,
      date: typeof s.date === 'object' && 'toString' in s.date ? s.date.toString() : String(s.date),
      status: s.status as WorkoutSessionResponseDto['status'],
      injuryMode: s.injuryMode,
      note: s.note,
      sourceRoutineId: s.sourceRoutineId?.value,
      sourceRoutineDayId: s.sourceRoutineDayId?.value,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      exercises: [],
    };
  }
}
