import { Module } from '@nestjs/common';
import { CreateMeasurementUseCase } from './create-measurement.use-case';
import { GetLatestMeasurementUseCase } from './get-latest-measurement.use-case';
import { ListMeasurementsUseCase } from './list-measurements.use-case';
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [
    CreateMeasurementUseCase,
    GetLatestMeasurementUseCase,
    ListMeasurementsUseCase,
  ],
  exports: [
    CreateMeasurementUseCase,
    GetLatestMeasurementUseCase,
    ListMeasurementsUseCase,
  ],
})
export class MeasurementsModule {}
