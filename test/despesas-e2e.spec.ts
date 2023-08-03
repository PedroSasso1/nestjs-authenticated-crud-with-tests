import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  createExpenseDtoMock,
  updateExpenseDtoMock,
} from './mocks/expenses.mocks';
import { isUUID } from 'class-validator';
import { Util } from '../src/util/util';

describe('Expenses (e2e)', () => {
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

  it('should create a despesa', async () => {
    const username = 'pedrosassom@outlook.com';
    const password = '123456';
    const {
      body: { id },
    } = await request(app.getHttpServer())
      .post('/users')
      .send({ email: username, password })
      .expect(201);

    const {
      body: { token },
    } = await request(app.getHttpServer())
      .post('/login')
      .send({ username, password })
      .expect(201);

    const {
      body: { id: despesaId },
    } = await request(app.getHttpServer())
      .post('/Expenses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({ ...createExpenseDtoMock, createdBy: id })
      .expect(201);

    expect(isUUID(despesaId, 4)).toBeTruthy();
  });

  it('should get a despesa', async () => {
    const username = 'user@email.com';
    const password = '123456';
    const {
      body: { id },
    } = await request(app.getHttpServer())
      .post('/users')
      .send({ email: username, password })
      .expect(201);

    const {
      body: { token },
    } = await request(app.getHttpServer())
      .post('/login')
      .send({ username, password })
      .expect(201);

    const createDto = { ...createExpenseDtoMock, createdBy: id };

    const {
      body: { id: despesaId },
    } = await request(app.getHttpServer())
      .post('/Expenses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(createDto)
      .expect(201);

    await request(app.getHttpServer())
      .get(`/Expenses/${despesaId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .expect(200, {
        id: despesaId,
        createdAt: createDto.createdAt,
        createdBy: createDto.createdBy,
        description: createDto.description,
        value: Util.formatNumberToCurrency(createDto.value),
      });
  });

  it('should get Expenses', async () => {
    const username = 'user@email.com';
    const password = '123456';
    const {
      body: { id },
    } = await request(app.getHttpServer())
      .post('/users')
      .send({ email: username, password })
      .expect(201);

    const {
      body: { token },
    } = await request(app.getHttpServer())
      .post('/login')
      .send({ username, password })
      .expect(201);

    const createDto = { ...createExpenseDtoMock, createdBy: id };

    const {
      body: { id: despesaId },
    } = await request(app.getHttpServer())
      .post('/Expenses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(createDto)
      .expect(201);

    await request(app.getHttpServer())
      .get(`/Expenses`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .expect(200, [
        {
          id: despesaId,
          createdAt: createDto.createdAt,
          createdBy: createDto.createdBy,
          description: createDto.description,
          value: Util.formatNumberToCurrency(createDto.value),
        },
      ]);
  });

  it('should remove a despesa', async () => {
    const username = 'user@email.com';
    const password = '123456';
    const {
      body: { id },
    } = await request(app.getHttpServer())
      .post('/users')
      .send({ email: username, password })
      .expect(201);

    const {
      body: { token },
    } = await request(app.getHttpServer())
      .post('/login')
      .send({ username, password })
      .expect(201);

    const createDto = { ...createExpenseDtoMock, createdBy: id };

    const {
      body: { id: despesaId },
    } = await request(app.getHttpServer())
      .post('/Expenses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(createDto)
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/Expenses/${despesaId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .expect(200);

    await request(app.getHttpServer())
      .get(`/Expenses`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .expect(200, []);
  });

  it('should update a despesa', async () => {
    const username = 'user@email.com';
    const password = '123456';
    const {
      body: { id },
    } = await request(app.getHttpServer())
      .post('/users')
      .send({ email: username, password })
      .expect(201);

    const {
      body: { token },
    } = await request(app.getHttpServer())
      .post('/login')
      .send({ username, password })
      .expect(201);

    const createDto = { ...createExpenseDtoMock, createdBy: id };

    const {
      body: { id: despesaId },
    } = await request(app.getHttpServer())
      .post('/Expenses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(createDto)
      .expect(201);

    await request(app.getHttpServer())
      .put(`/Expenses/${despesaId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(updateExpenseDtoMock)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/Expenses/${despesaId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .expect(200, {
        id: despesaId,
        createdAt: createDto.createdAt,
        createdBy: createDto.createdBy,
        description: updateExpenseDtoMock.description,
        value: Util.formatNumberToCurrency(updateExpenseDtoMock.value),
      });
  });
});
