/**
 * InfrastructureModule - Módulo de infraestructura
 *
 * Proporciona:
 * - PrismaModule (PrismaService)
 * - Implementaciones concretas de repositorios (Prisma*Repository)
 *
 * Los use-case modules importan este módulo y reciben los repos
 * vía inyección (tokens). Para usar stubs en desarrollo sin BD,
 * no importar InfrastructureModule y usar los stubs en cada módulo.
 */

import { Module } from '@nestjs/common';
import { PrismaModule } from './db/prisma.module';
import { PrismaExerciseRepository } from './repositories/prisma-exercise.repository';
import { PrismaRoutineRepository } from './repositories/prisma-routine.repository';
import { PrismaWorkoutRepository } from './repositories/prisma-workout.repository';
import { PrismaRunRepository } from './repositories/prisma-run.repository';
import { PrismaMeasurementRepository } from './repositories/prisma-measurement.repository';
import { EXERCISE_REPOSITORY } from '../aplication/use-cases/exercises/exercise-repository.token';
import { ROUTINE_REPOSITORY } from '../aplication/use-cases/routines/routine-repository.token';
import { WORKOUT_REPOSITORY } from '../aplication/use-cases/workouts/workout-repository.token';
import { RUN_REPOSITORY } from '../aplication/use-cases/runs/run-repository.token';
import { MEASUREMENT_REPOSITORY } from '../aplication/use-cases/measurements/measurement-repository.token';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaExerciseRepository,
    PrismaRoutineRepository,
    PrismaWorkoutRepository,
    PrismaRunRepository,
    PrismaMeasurementRepository,
    { provide: EXERCISE_REPOSITORY, useClass: PrismaExerciseRepository },
    { provide: ROUTINE_REPOSITORY, useClass: PrismaRoutineRepository },
    { provide: WORKOUT_REPOSITORY, useClass: PrismaWorkoutRepository },
    { provide: RUN_REPOSITORY, useClass: PrismaRunRepository },
    { provide: MEASUREMENT_REPOSITORY, useClass: PrismaMeasurementRepository },
  ],
  exports: [
    EXERCISE_REPOSITORY,
    ROUTINE_REPOSITORY,
    WORKOUT_REPOSITORY,
    RUN_REPOSITORY,
    MEASUREMENT_REPOSITORY,
  ],
})
export class InfrastructureModule {}
