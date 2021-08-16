// Write your tests here
const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');
const Users = require('../api/users/users-model');

test('sanity', () => {
  expect(true).not.toBe(false)
});

describe('server.js', () => {
  beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
  });

  beforeEach(async () => {
    await db('users').truncate();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('[POST] /register', () => {
    it('returns new user', async() => {
      await request(server).post('/api/auth/register').send({ username: 'abcd', password: '1234' });
      const newUser = await db('users').where('username', 'abcd').first()
      expect(newUser).toMatchObject({ username: 'abcd' });
    });
    it('returns an error when user/pass not provided', async() => {
      const noUserRes = await request(server).post('/api/auth/register').send({ password: '1234' });
      const noPassRes = await request(server).post('/api/auth/register').send({ username: 'abcd' });
      expect(noUserRes).toMatchObject({ status: 500 });
      expect(noPassRes).toMatchObject({ status: 500 });
    });
  });

  describe('[POST] /login', () => {
    it('returns welcome message on valid credentials', async() => {
      await request(server).post('/api/auth/register').send({ username: 'abcd', password: '1234' });
      const res = await request(server).post('/api/auth/login').send({ username: 'abcd', password: '1234' });
      expect(res.body.message).toMatch(/welcome, abcd/i)
    });
    it('returns error message on invalid credentials', async() => {
      await request(server).post('/api/auth/register').send({ username: 'abcd', password: '1234' });
      const res = await request(server).post('/api/auth/login').send({ username: 'abcd', password: 'wrong' });
      expect(res.body.message).toMatch(/invalid credentials/i)
    });
  });

  describe('[GET] /jokes', () => {
    it('returns an array of jokes when authorized', async() => {
      await request(server).post('/api/auth/register').send({ username: 'abcd', password: '1234' });
      let res = await request(server).post('/api/auth/login').send({ username: 'abcd', password: '1234' });
      
      res = await request(server).get('/api/jokes').set('Authorization', res.body.token)
      expect(res.body).toMatchObject([
      { id: "0189hNRf2g", joke: "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."
      },
      { id: "08EQZ8EQukb", joke: "Did you hear about the guy whose whole left side was cut off? He's all right now."
      },
      { id: "08xHQCdx5Ed", joke: "Why didn’t the skeleton cross the road? Because he had no guts."
      }
      ])
    });
    it('returns an error when unauthorized', async() => {
      const res = await request(server).get('/api/jokes')
      expect(res.body.message).toMatch(/token required/i)
    });
  });


});
