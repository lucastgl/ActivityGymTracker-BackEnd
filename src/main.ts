import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina props no declaradas en el DTO
      forbidNonWhitelisted: true, // tira error si mandan props extra
      transform: true, // convierte payload a instancia del DTO
      transformOptions: {
        enableImplicitConversion: true, // convierte tipos básicos (string->number) si el DTO lo tipa
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
