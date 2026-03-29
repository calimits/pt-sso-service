import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from "../app.module";
import { randomUUID } from 'crypto';
import { CreateUserDto } from '../features/auth/dtos/CreateUserDto';
import AppDataSource from '../config/data-source';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await AppDataSource.initialize();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe('POST auth/register', () => {
    const uuid: string = randomUUID();
    const user: CreateUserDto = {email: `${uuid}@gmail.com`, password: uuid};

    it("Should register one user succesfully", async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(user);
      
    });
  })
});
