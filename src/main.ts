import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import connectDB from './config/connectDB';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  await connectDB();
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
