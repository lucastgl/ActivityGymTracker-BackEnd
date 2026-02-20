import { Module } from '@nestjs/common';
import { GetRunByDateUseCase } from './get-run-by-date.use-case';
import { UpsertRunSessionUseCase } from './upsert-run-session.use-case';
import { GenerateSplitsFromDistanceUseCase } from './generate-splits-from-distance.use-case';
import { UpdateSplitsUseCase } from './update-splits.use-case';
import { CompleteRunUseCase } from './complete-run.use-case';
import { RevertRunToDraftUseCase } from './revert-run-to-draft.use-case';
import { RUN_REPOSITORY } from './run-repository.token';
import { RunningModule } from '../../../running/running.module';
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module';

@Module({
  imports: [RunningModule, InfrastructureModule],
  providers: [
    GetRunByDateUseCase,
    UpsertRunSessionUseCase,
    GenerateSplitsFromDistanceUseCase,
    UpdateSplitsUseCase,
    CompleteRunUseCase,
    RevertRunToDraftUseCase,
  ],
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
