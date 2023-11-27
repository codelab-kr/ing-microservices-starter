import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  TypeOrmModule,
  // TypeOrmModuleOptions,
  // TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { StarsRepository } from '../src/stars.repository';
import { StarsModule } from '../src/stars.module';
// import { TypeOrmConfigService } from '@app/common';
// import * as path from 'path';
import { Star } from '../src/star.entity';

// class MockTypeOrmConfigServer implements TypeOrmOptionsFactory {
//   createTypeOrmOptions(): TypeOrmModuleOptions {
//     return {
//       type: 'sqlite',
//       database: ':memory:',
//       synchronize: true,
//       dropSchema: true,
//       entities: [Star],
//       autoLoadEntities: true,
//     };
//   }
// }

// const mockTypeOrmConfigService = new MockTypeOrmConfigServer();

const curruntPath = process.cwd(); // path.resolve('./');

console.log('curruntPath', curruntPath);

describe('StarsController (e2e)', () => {
  let app: INestApplication;
  let starsRepository: StarsRepository;

  beforeAll(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   imports: [StarsModule],
    // })
    //   .overrideProvider(TypeOrmConfigService)
    //   .useValue(mockTypeOrmConfigService)
    //   .compile();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'test',
          password: 'testtest',
          database: 'test',
          entities: [Star],
          autoLoadEntities: true,
          synchronize: true,
        }),
        StarsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    starsRepository = moduleFixture.get<StarsRepository>(StarsRepository);

    await app.init();
  });

  beforeEach(async () => {
    await starsRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /stars', () => {
    it('200(OK)과 생성된 모든 유저 목록을 json 타입으로 응답한다', async () => {
      await starsRepository.save([
        { id: 1, firstName: 'Tei', lastName: 'Lee', isActive: true },
        { id: 2, firstName: '태의', lastName: '이', isActive: true },
      ]);

      const res = await request(app.getHttpServer()).get('/stars');

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      const { body } = res;
      expect(body).toStrictEqual([
        {
          id: 1,
          firstName: 'Tei',
          lastName: 'Lee',
          isActive: true,
        },
        {
          id: 2,
          firstName: '태의',
          lastName: '이',
          isActive: true,
        },
      ]);
    });
  });

  describe('POST /stars', () => {
    it('유저를 생성하고, 201(Created)과 유저를 응답한다', async () => {
      const firstName = 'Tei';
      const lastName = 'Lee';

      const res = await request(app.getHttpServer()).post('/stars').send({
        id: 1,
        firstName: firstName,
        lastName: lastName,
        isActive: true,
      });

      expect(res.status).toBe(201);
      expect(res.type).toBe('application/json');
      const { body } = res;
      expect(body.firstName).toBe(firstName);
      expect(body.lastName).toBe(lastName);
      expect(body.isActive).toBe(true);
    });
  });
});
