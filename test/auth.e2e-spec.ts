import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const testEmail = 'test1@test.com';
  const testPassword = 'testPassword';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a request to signup)', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: testEmail, password: testPassword })
      .expect(201)
      .then((response) => {
        const { id, email } = response.body;

        expect(id).toBeDefined();
        expect(email).toEqual(testEmail);
      });
  });

  it('signup as a new user then get the currenctly logged in user', async () => {
    const _request = request(app.getHttpServer())
      .post('/auth/signup')
      .send({ testEmail, testPassword })
      .expect(201);

    const cookie = _request.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/auth/user')
      .set('Cookie', cookie)
      .expect(200);
    expect(body.email).toEqual(testEmail);
  });
});
