/**
 * PrismaExerciseRepository - Implementación concreta de ExerciseRepository
 *
 * Implementa la interfaz del dominio usando Prisma como persistencia.
 * Usa ExerciseMapper para convertir Prisma ↔ Domain.
 *
 * El dominio define QUÉ hacer (ExerciseRepository); la infraestructura
 * define CÓMO (Prisma + SQL).
 */

import { Injectable } from '@nestjs/common';
import { Id } from '../../domain/value-objects/id.vo';
import { Exercise } from '../../domain/entities/exercise.entity';
import type {
  ExerciseRepository,
  CreateExerciseInput,
  UpdateExercisePatch,
  ExerciseListFilters,
} from '../../domain/repositories/exercise.repository';
import { PrismaService } from '../db/prisma.service';
import { ExerciseMapper } from '../mappers/exercise.mapper';

@Injectable()
export class PrismaExerciseRepository implements ExerciseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: Id, exercise: CreateExerciseInput): Promise<Exercise> {
    const created = await this.prisma.exercise.create({
      data: ExerciseMapper.toPrismaCreate(userId, exercise),
    });
    return ExerciseMapper.toDomain(created);
  }

  async update(
    userId: Id,
    exerciseId: Id,
    patch: UpdateExercisePatch,
  ): Promise<Exercise | null> {
    const existing = await this.prisma.exercise.findFirst({
      where: { id: exerciseId.value, userId: userId.value },
    });
    if (!existing) return null;
    const row = await this.prisma.exercise.update({
      where: { id: exerciseId.value },
      data: ExerciseMapper.toPrismaUpdate(patch),
    });
    return ExerciseMapper.toDomain(row);
  }

  async findById(userId: Id, id: Id): Promise<Exercise | null> {
    const row = await this.prisma.exercise.findFirst({
      where: { id: id.value, userId: userId.value },
    });
    return row ? ExerciseMapper.toDomain(row) : null;
  }

  async list(userId: Id, filters?: ExerciseListFilters): Promise<Exercise[]> {
    const rows = await this.prisma.exercise.findMany({
      where: {
        userId: userId.value,
        ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
        ...(filters?.category && { category: filters.category }),
        ...(filters?.equipment && { equipment: filters.equipment }),
        ...(filters?.sideType && { sideType: filters.sideType }),
      },
      orderBy: { name: 'asc' },
    });
    return rows.map((r) => ExerciseMapper.toDomain(r));
  }

  async setActive(userId: Id, id: Id, isActive: boolean): Promise<Exercise | null> {
    const existing = await this.prisma.exercise.findFirst({
      where: { id: id.value, userId: userId.value },
    });
    if (!existing) return null;
    const row = await this.prisma.exercise.update({
      where: { id: id.value },
      data: { isActive },
    });
    return ExerciseMapper.toDomain(row);
  }
}
