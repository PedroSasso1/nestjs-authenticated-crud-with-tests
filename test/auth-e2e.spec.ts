import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should login and hit an authenticated route', async () => {
    const username = 'user@email.com';
    const password = '123456';
    await request(app.getHttpServer())
      .post('/users')
      .send({ email: username, password })
      .expect(201);

    const {
      body: { token },
    } = await request(app.getHttpServer())
      .post('/login')
      .send({ username, password })
      .expect(201);

    await request(app.getHttpServer())
      .get('/expenses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .expect(200);
  });

  it('should return unauthorized', async () => {
    await request(app.getHttpServer())
      .get('/expenses')
      .set({
        Authorization: `Bearer invalidToken`,
      })
      .expect(401);
  });
});
