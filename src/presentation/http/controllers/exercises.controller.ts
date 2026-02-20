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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiParam,
} from '@nestjs/swagger';
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

const DEFAULT_USER_ID = '00000000-0000-4000-8000-000000000000';

@ApiTags('Exercises')
@ApiHeader({ name: 'x-user-id', description: 'ID del usuario', required: false })
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
  @ApiOperation({ summary: 'Listar ejercicios', description: 'Devuelve todos los ejercicios del usuario con filtros opcionales' })
  @ApiResponse({ status: 200, type: [ExerciseResponseDto] })
  async list(
    @Headers('x-user-id') userIdHeader: string,
    @Query() query: ListExercisesQueryDto,
  ): Promise<ExerciseResponseDto[]> {
    const userId = Id.fromString(userIdHeader || DEFAULT_USER_ID);
    const filters = Object.keys(query).length > 0 ? query : undefined;
    const exercises = await this.listExercises.execute(userId, filters);
    return exercises.map((e) => this.toResponseDto(e));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear ejercicio' })
  @ApiResponse({ status: 201, type: ExerciseResponseDto })
  async create(
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: CreateExerciseDto,
  ): Promise<ExerciseResponseDto> {
    const userId = Id.fromString(userIdHeader || DEFAULT_USER_ID);
    const exercise = await this.createExercise.execute(userId, dto);
    return this.toResponseDto(exercise);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar ejercicio' })
  @ApiParam({ name: 'id', description: 'UUID del ejercicio' })
  @ApiResponse({ status: 200, type: ExerciseResponseDto })
  @ApiResponse({ status: 404, description: 'Ejercicio no encontrado' })
  async update(
    @Headers('x-user-id') userIdHeader: string,
    @Param('id') id: string,
    @Body() dto: UpdateExerciseDto,
  ): Promise<ExerciseResponseDto | null> {
    const userId = Id.fromString(userIdHeader || DEFAULT_USER_ID);
    const exerciseId = Id.fromString(id);
    const exercise = await this.updateExercise.execute(userId, exerciseId, dto);
    return exercise ? this.toResponseDto(exercise) : null;
  }

  @Post(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desactivar ejercicio (soft-delete)' })
  @ApiParam({ name: 'id', description: 'UUID del ejercicio' })
  @ApiResponse({ status: 200, type: ExerciseResponseDto })
  @ApiResponse({ status: 404, description: 'Ejercicio no encontrado' })
  async deactivate(
    @Headers('x-user-id') userIdHeader: string,
    @Param('id') id: string,
  ): Promise<ExerciseResponseDto | null> {
    const userId = Id.fromString(userIdHeader || DEFAULT_USER_ID);
    const exerciseId = Id.fromString(id);
    const exercise = await this.deactivateExercise.execute(userId, exerciseId);
    return exercise ? this.toResponseDto(exercise) : null;
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restaurar ejercicio desactivado' })
  @ApiParam({ name: 'id', description: 'UUID del ejercicio' })
  @ApiResponse({ status: 200, type: ExerciseResponseDto })
  @ApiResponse({ status: 404, description: 'Ejercicio no encontrado' })
  async restore(
    @Headers('x-user-id') userIdHeader: string,
    @Param('id') id: string,
  ): Promise<ExerciseResponseDto | null> {
    const userId = Id.fromString(userIdHeader || DEFAULT_USER_ID);
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
