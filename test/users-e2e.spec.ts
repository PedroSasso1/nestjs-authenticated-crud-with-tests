import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { isUUID } from 'class-validator';

describe('Users (e2e)', () => {
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

  it('should', () => {
    expect(true).toBeTruthy();
  });

  it('should create user', async () => {
    const {
      body: { id },
    } = await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'user@email.com', password: '123456' })
      .expect(201);

    expect(isUUID(id, 4)).toBeTruthy();
  });

  it('should get user', async () => {
    const email = 'user@email.com';
    const password = '123456';
    const {
      body: { id },
    } = await request(app.getHttpServer())
      .post('/users')
      .send({ email, password })
      .expect(201);

    await request(app.getHttpServer())
      .get(`/users/${id}`)
      .send({ email, password })
      .expect(200, { id, email });
  });

  it('should get users', async () => {
    const email = 'user@email.com';
    const password = '123456';
    const {
      body: { id },
    } = await request(app.getHttpServer())
      .post('/users')
      .send({ email, password })
      .expect(201);

    await request(app.getHttpServer())
      .get(`/users`)
      .send({ email, password })
      .expect(200, [{ id, email }]);
  });
});
