import { Module } from '@nestjs/common';
import { GetRunByDateUseCase } from './get-run-by-date.use-case';
import { UpsertRunSessionUseCase } from './upsert-run-session.use-case';
import { GenerateSplitsFromDistanceUseCase } from './generate-splits-from-distance.use-case';
import { UpdateSplitsUseCase } from './update-splits.use-case';
import { CompleteRunUseCase } from './complete-run.use-case';
import { RevertRunToDraftUseCase } from './revert-run-to-draft.use-case';
import { RUN_REPOSITORY } from './run-repository.token';
import { PrismaRunRepository } from '../../../infrastructure/repositories/prisma-run.repository';
import { PrismaModule } from '../../../infrastructure/db/prisma.module';
import { RunningModule } from '../../../running/running.module';
import { RunsController } from '../../../presentation/http/controllers/runs.controller';

/**
 * RunsModule - Feature module de sesiones de running
 *
 * - providers: use cases + binding RUN_REPOSITORY → PrismaRunRepository
 * - imports: RunningModule (para generación de splits)
 * - controllers: RunsController
 * - exports RUN_REPOSITORY (usado por CalendarModule)
 */
@Module({
  imports: [PrismaModule, RunningModule],
  providers: [
    GetRunByDateUseCase,
    UpsertRunSessionUseCase,
    GenerateSplitsFromDistanceUseCase,
    UpdateSplitsUseCase,
    CompleteRunUseCase,
    RevertRunToDraftUseCase,
    { provide: RUN_REPOSITORY, useClass: PrismaRunRepository },
  ],
  controllers: [RunsController],
  exports: [
    GetRunByDateUseCase,
    UpsertRunSessionUseCase,
    GenerateSplitsFromDistanceUseCase,
    UpdateSplitsUseCase,
    CompleteRunUseCase,
    RevertRunToDraftUseCase,
    RUN_REPOSITORY,
  ],
})
export class RunsModule {}
