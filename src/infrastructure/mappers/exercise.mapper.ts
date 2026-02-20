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
import type {
  CreateExerciseInput,
  UpdateExercisePatch,
} from '../../domain/repositories/exercise.repository';
import type { MuscleCategory } from '../../domain/enums/muscle-category.enum';
import type { Equipment } from '../../domain/enums/equipment.enum';
import type { SideType } from '../../domain/enums/side-type.enum';

/**
 * Fila Exercise de Prisma (estructura devuelta por findFirst/findMany).
 * Usa string para enums para aceptar tanto Prisma.$Enums como domain enums.
 */
interface PrismaExerciseRow {
  id: string;
  userId: string;
  name: string;
  category: string;
  equipment: string;
  sideType: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Data para prisma.exercise.create */
interface PrismaExerciseCreateData {
  user: { connect: { id: string } };
  name: string;
  category: MuscleCategory;
  equipment: Equipment;
  sideType: SideType;
}

/** Data para prisma.exercise.update */
interface PrismaExerciseUpdateData {
  name?: string;
  category?: MuscleCategory;
  equipment?: Equipment;
  sideType?: SideType;
}

export const ExerciseMapper = {
  toDomain(row: PrismaExerciseRow): Exercise {
    return new Exercise(
      Id.fromString(row.id),
      Id.fromString(row.userId),
      row.name,
      row.category as MuscleCategory,
      row.equipment as Equipment,
      row.sideType as SideType,
      row.isActive,
      row.createdAt,
      row.updatedAt,
    );
  },

  toPrismaCreate(
    userId: Id,
    input: CreateExerciseInput,
  ): PrismaExerciseCreateData {
    return {
      user: { connect: { id: userId.value } },
      name: input.name,
      category: input.category,
      equipment: input.equipment,
      sideType: input.sideType,
    };
  },

  toPrismaUpdate(patch: UpdateExercisePatch): PrismaExerciseUpdateData {
    const data: PrismaExerciseUpdateData = {};
    if (patch.name !== undefined) data.name = patch.name;
    if (patch.category !== undefined) data.category = patch.category;
    if (patch.equipment !== undefined) data.equipment = patch.equipment;
    if (patch.sideType !== undefined) data.sideType = patch.sideType;
    return data;
  },
};
