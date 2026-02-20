/**
 * INSTRUCTIVO - ExercisesController
 *
 * FUNCIÓN:
 *   Capa HTTP para el recurso "ejercicios". Recibe requests, valida DTOs,
 *   delega al use case y devuelve la respuesta serializada.
 *
 * FLUJO DE CADA ENDPOINT:
 *   1. Validación: NestJS ValidationPipe valida el DTO automáticamente
 *      (body, query, params) según decoradores class-validator.
 *   2. userId: Se obtiene del header X-User-Id (en producción: JWT/session).
 *   3. Mapeo: DTO → tipos de dominio (Id, DateOnly, CreateExerciseInput, etc.)
 *   4. Ejecución: useCase.execute(userId, ...)
 *   5. Respuesta: entidad → ExerciseResponseDto → JSON
 *
 * RUTAS:
 *   GET    /exercises           - Lista con filtros (category, equipment, sideType, isActive)
 *   POST   /exercises           - Crear ejercicio
 *   PATCH  /exercises/:id       - Actualizar ejercicio
 *   POST   /exercises/:id/deactivate - Soft-delete
 *   POST   /exercises/:id/restore    - Restaurar
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Id } from '../../../domain/value-objects/id.vo';
import { CreateExerciseUseCase } from '../../../aplication/use-cases/exercises/create-exercise.use-case';
import { ListExercisesUseCase } from '../../../aplication/use-cases/exercises/list-exercises.use-case';
import { UpdateExerciseUseCase } from '../../../aplication/use-cases/exercises/update-exercise.use-case';
import { DeactivateExerciseUseCase } from '../../../aplication/use-cases/exercises/deactivate-exercise.use-case';
import { RestoreExerciseUseCase } from '../../../aplication/use-cases/exercises/restore-exercise.use-case';
import {
  CreateExerciseDto,
  UpdateExerciseDto,
  ListExercisesQueryDto,
  ExerciseResponseDto,
} from '../../../aplication/dtos/exercises';

@Controller('exercises')
export class ExercisesController {
  constructor(
    private readonly createExercise: CreateExerciseUseCase,
    private readonly listExercises: ListExercisesUseCase,
    private readonly updateExercise: UpdateExerciseUseCase,
    private readonly deactivateExercise: DeactivateExerciseUseCase,
    private readonly restoreExercise: RestoreExerciseUseCase,
  ) {}

  @Get()
  async list(
    @Headers('x-user-id') userIdHeader: string,
    @Query() query: ListExercisesQueryDto,
  ): Promise<ExerciseResponseDto[]> {
    const userId = Id.fromString(userIdHeader || '00000000-0000-4000-8000-000000000000');
    const filters = Object.keys(query).length > 0 ? query : undefined;
    const exercises = await this.listExercises.execute(userId, filters);
    return exercises.map((e) => this.toResponseDto(e));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: CreateExerciseDto,
  ): Promise<ExerciseResponseDto> {
    const userId = Id.fromString(userIdHeader || '00000000-0000-4000-8000-000000000000');
    const exercise = await this.createExercise.execute(userId, dto);
    return this.toResponseDto(exercise);
  }

  @Patch(':id')
  async update(
    @Headers('x-user-id') userIdHeader: string,
    @Param('id') id: string,
    @Body() dto: UpdateExerciseDto,
  ): Promise<ExerciseResponseDto | null> {
    const userId = Id.fromString(userIdHeader || '00000000-0000-4000-8000-000000000000');
    const exerciseId = Id.fromString(id);
    const exercise = await this.updateExercise.execute(userId, exerciseId, dto);
    return exercise ? this.toResponseDto(exercise) : null;
  }

  @Post(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivate(
    @Headers('x-user-id') userIdHeader: string,
    @Param('id') id: string,
  ): Promise<ExerciseResponseDto | null> {
    const userId = Id.fromString(userIdHeader || '00000000-0000-4000-8000-000000000000');
    const exerciseId = Id.fromString(id);
    const exercise = await this.deactivateExercise.execute(userId, exerciseId);
    return exercise ? this.toResponseDto(exercise) : null;
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(
    @Headers('x-user-id') userIdHeader: string,
    @Param('id') id: string,
  ): Promise<ExerciseResponseDto | null> {
    const userId = Id.fromString(userIdHeader || '00000000-0000-4000-8000-000000000000');
    const exerciseId = Id.fromString(id);
    const exercise = await this.restoreExercise.execute(userId, exerciseId);
    return exercise ? this.toResponseDto(exercise) : null;
  }

  private toResponseDto(exercise: {
    id: Id;
    userId: Id;
    name: string;
    category: unknown;
    equipment: unknown;
    sideType: unknown;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): ExerciseResponseDto {
    return {
      id: exercise.id.value,
      userId: exercise.userId.value,
      name: exercise.name,
      category: exercise.category as ExerciseResponseDto['category'],
      equipment: exercise.equipment as ExerciseResponseDto['equipment'],
      sideType: exercise.sideType as ExerciseResponseDto['sideType'],
      isActive: exercise.isActive,
      createdAt: exercise.createdAt.toISOString(),
      updatedAt: exercise.updatedAt.toISOString(),
    };
  }
}
