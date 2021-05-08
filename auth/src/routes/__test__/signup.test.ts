import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  request(app)
    .post('/api/users/signup')
    .send({
      // The body of the request
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201); // The status code we expect on the response
});

it('returns a 400 with an invalid email', async () => {
  request(app)
    .post('/api/users/signup')
    .send({
      // The body of the request
      email: 'test',
      password: 'password',
    })
    .expect(400); // The status code we expect on the response
});

it('returns a 400 with an invalid password', async () => {
  request(app)
    .post('/api/users/signup')
    .send({
      // The body of the request
      email: 'test@test.com',
      password: '1',
    })
    .expect(400); // The status code we expect on the response
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'asdff',
    })
    .expect(400);
});
