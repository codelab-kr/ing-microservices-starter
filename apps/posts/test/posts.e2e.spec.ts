import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsRepository } from '../src/posts.repository';
import { PostsModule } from '../src/posts.module';
import { Post } from '../src/models/post';

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let postsRepository: PostsRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Post],
          autoLoadEntities: true,
          synchronize: true,
        }),
        PostsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    postsRepository = moduleFixture.get<PostsRepository>(PostsRepository);

    await app.init();
  });

  beforeEach(async () => {
    await postsRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /posts', () => {
    it('200(OK)과 생성된 모든 유저 목록을 json 타입으로 응답한다', async () => {
      await postsRepository.save([
        { id: 1, title: 'Tei', content: 'Lee', userId: 2 },
        { id: 2, title: '태의', content: '이', userId: 2 },
      ]);

      const res = await request(app.getHttpServer()).get('/posts');

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

  describe('POST /posts', () => {
    it('유저를 생성하고, 201(Created)과 유저를 응답한다', async () => {
      const title = 'Tei';
      const content = 'Lee';
      const userId = 1;

      const res = await request(app.getHttpServer()).post('/posts').send({
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