const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Autenticação', () => {
  it('deve registrar um novo usuário', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nome: 'Teste',
        email: 'teste@teste.com',
        senha: '123456',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.nome).toBe('Teste');
  });

  it('deve fazer login com credenciais válidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'teste@teste.com',
        senha: '123456',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('não deve fazer login com senha inválida', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'teste@teste.com',
        senha: 'senha_errada',
      });

    expect(res.status).toBe(401);
  });

  it('não deve registrar com email duplicado', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nome: 'Teste2',
        email: 'teste@teste.com',
        senha: '123456',
      });

    expect(res.status).toBe(400);
  });

  it('não deve registrar sem nome', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'semnome@teste.com',
        senha: '123456',
      });

    expect(res.status).toBe(400);
  });
});
