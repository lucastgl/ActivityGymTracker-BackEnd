import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RunningModule } from './running/running.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // disponible en toda la app sin re-importar
    }),
    RunningModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
