import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PaymentModule } from '../src/payment.module';
import { PaymentRepository } from '../src/repositories/payment.repository';
import { DataSource } from 'typeorm';

describe('PaymentController (e2e)', () => {
  let app: INestApplication;
  let paymentRepository: PaymentRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PaymentModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    paymentRepository = moduleFixture.get<PaymentRepository>(PaymentRepository);
    const dataSource = app.get(DataSource);
    await dataSource.synchronize();
    await app.init();
  });

  afterAll(async () => {
    const dataSource = app.get(DataSource);
    if (dataSource) {
      await dataSource.dropDatabase();
      dataSource.destroy();
    }
    await app.close();
  });

  beforeEach(async () => {
    await paymentRepository.clear();
  });

  describe('GET /payment', () => {
    it('200(OK)과 생성된 모든 유저 목록을 json 타입으로 응답한다', async () => {
      await paymentRepository.save([
        { id: 1, title: 'Tei', content: 'Lee', userId: 2 },
        { id: 2, title: '태의', content: '이', userId: 2 },
      ]);

      const res = await request(app.getHttpServer()).get('/payment');

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      const { body } = res;
      expect(body).toStrictEqual([
        {
          id: 1,
          title: 'Tei',
          content: 'Lee',
          userId: 2,
          settings: null,
        },
        {
          id: 2,
          title: '태의',
          content: '이',
          userId: 2,
          settings: null,
        },
      ]);
    });
  });

  describe('PAYMENT /payment', () => {
    it('유저를 생성하고, 201(Created)과 유저를 응답한다', async () => {
      const title = 'Tei';
      const content = 'Lee';
      const userId = 1;

      const res = await request(app.getHttpServer()).post('/payment').send({
        id: 1,
        title: title,
        content: content,
        userId: userId,
      });

      expect(res.status).toBe(201);
      expect(res.type).toBe('application/json');
      const { body } = res;
      expect(body.title).toBe(title);
      expect(body.content).toBe(content);
      expect(body.userId).toBe(userId);
    });
  });
});
