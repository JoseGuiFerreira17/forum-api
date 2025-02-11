import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Create Account Controller (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /accounts', async () => {
    const responde = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'johndoen@example.com',
      password: 'password123',
    });

    const user = await prisma.user.findUnique({
      where: {
        email: 'johndoen@example.com',
      },
    });

    expect(responde.statusCode).toBe(201);
    expect(user).toBeTruthy();
  });
});
