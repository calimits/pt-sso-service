import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import AppDataSource from './config/data-source';
import connectDB from './config/connectDB';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await connectDB();
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
