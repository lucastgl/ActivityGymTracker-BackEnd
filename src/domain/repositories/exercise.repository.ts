import { Id } from '../value-objects/id.vo';
import { Exercise } from '../entities/exercise.entity';
import { MuscleCategory } from '../enums/muscle-category.enum';
import { Equipment } from '../enums/equipment.enum';
import { SideType } from '../enums/side-type.enum';

/**
 * Datos para crear un ejercicio (sin id, createdAt, updatedAt).
 */
export type CreateExerciseInput = {
  name: string;
  category: MuscleCategory;
  equipment: Equipment;
  sideType: SideType;
};

/**
 * Parcial para actualizar un ejercicio (solo campos editables).
 */
export type UpdateExercisePatch = Partial<{
  name: string;
  category: MuscleCategory;
  equipment: Equipment;
  sideType: SideType;
}>;

/**
 * Filtros para listar ejercicios.
 */
export type ExerciseListFilters = {
  category?: MuscleCategory;
  equipment?: Equipment;
  sideType?: SideType;
  isActive?: boolean;
};

/**
 * ExerciseRepository - Catálogo de ejercicios
 *
 * La BBDD de ejercicios es la base de rutinas y sesiones.
 * CRUD y filtros, con soft-delete (setActive).
 */
export interface ExerciseRepository {
  create(userId: Id, exercise: CreateExerciseInput): Promise<Exercise>;

  update(
    userId: Id,
    exerciseId: Id,
    patch: UpdateExercisePatch,
  ): Promise<Exercise | null>;

  findById(userId: Id, id: Id): Promise<Exercise | null>;

  list(userId: Id, filters?: ExerciseListFilters): Promise<Exercise[]>;

  setActive(userId: Id, id: Id, isActive: boolean): Promise<Exercise | null>;
}
