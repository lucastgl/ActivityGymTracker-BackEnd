/**
 * MAPPER: Exercise (Prisma ↔ Domain)
 *
 * Responsabilidad: convertir entre el modelo de Prisma (tabla Exercise)
 * y la entidad de dominio Exercise.
 *
 * - toDomain: Prisma → Domain (para lecturas)
 * - toPrismaCreate: CreateExerciseInput → data para prisma.exercise.create
 * - toPrismaUpdate: UpdateExercisePatch → data para prisma.exercise.update
 *
 * El dominio no conoce Prisma; la infraestructura adapta.
 */

import { Id } from '../../domain/value-objects/id.vo';
import { Exercise } from '../../domain/entities/exercise.entity';
import type { CreateExerciseInput, UpdateExercisePatch } from '../../domain/repositories/exercise.repository';
import type { Exercise as PrismaExercise, Prisma } from '@prisma/client';

export const ExerciseMapper = {
  toDomain(row: PrismaExercise): Exercise {
    return new Exercise(
      Id.fromString(row.id),
      Id.fromString(row.userId),
      row.name,
      row.category as Exercise['category'],
      row.equipment as Exercise['equipment'],
      row.sideType as Exercise['sideType'],
      row.isActive,
      row.createdAt,
      row.updatedAt,
    );
  },

  toPrismaCreate(userId: Id, input: CreateExerciseInput): Prisma.ExerciseCreateInput {
    return {
      user: { connect: { id: userId.value } },
      name: input.name,
      category: input.category,
      equipment: input.equipment,
      sideType: input.sideType,
    };
  },

  toPrismaUpdate(patch: UpdateExercisePatch): Prisma.ExerciseUpdateInput {
    const data: Prisma.ExerciseUpdateInput = {};
    if (patch.name !== undefined) data.name = patch.name;
    if (patch.category !== undefined) data.category = patch.category;
    if (patch.equipment !== undefined) data.equipment = patch.equipment;
    if (patch.sideType !== undefined) data.sideType = patch.sideType;
    return data;
  },
};
