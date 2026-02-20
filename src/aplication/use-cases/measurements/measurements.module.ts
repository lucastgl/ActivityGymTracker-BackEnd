import { Module } from '@nestjs/common';
import { CreateMeasurementUseCase } from './create-measurement.use-case';
import { GetLatestMeasurementUseCase } from './get-latest-measurement.use-case';
import { ListMeasurementsUseCase } from './list-measurements.use-case';
import { MEASUREMENT_REPOSITORY } from './measurement-repository.token';
import { PrismaMeasurementRepository } from '../../../infrastructure/repositories/prisma-measurement.repository';
import { PrismaModule } from '../../../infrastructure/db/prisma.module';
import { MeasurementsController } from '../../../presentation/http/controllers/measurements.controller';

/**
 * MeasurementsModule - Feature module de mediciones corporales
 *
 * - providers: use cases + binding MEASUREMENT_REPOSITORY → PrismaMeasurementRepository
 * - controllers: MeasurementsController
 */
@Module({
  imports: [PrismaModule],
  providers: [
    CreateMeasurementUseCase,
    GetLatestMeasurementUseCase,
    ListMeasurementsUseCase,
    { provide: MEASUREMENT_REPOSITORY, useClass: PrismaMeasurementRepository },
  ],
  controllers: [MeasurementsController],
  exports: [
    CreateMeasurementUseCase,
    GetLatestMeasurementUseCase,
    ListMeasurementsUseCase,
  ],
})
export class MeasurementsModule {}
