import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aumenta o limite de payload para 10MB (ajuste conforme necessário)
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  app.useGlobalPipes(new ValidationPipe());
  // Habilitar CORS
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
