const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      nome: 'Usuario Teste',
      email: 'user@teste.com',
      senha: '123456',
    });
  token = res.body.token;
});

describe('Tarefas', () => {
  let taskId;

  it('deve criar uma nova tarefa', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Minha tarefa' });

    expect(res.status).toBe(201);
    expect(res.body.titulo).toBe('Minha tarefa');
    expect(res.body.status).toBe('pendente');
    taskId = res.body.id;
  });

  it('deve listar todas as tarefas', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('deve buscar tarefa por ID', async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(taskId);
  });

  it('deve atualizar uma tarefa', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Tarefa atualizada', status: 'concluida' });

    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe('Tarefa atualizada');
    expect(res.body.status).toBe('concluida');
  });

  it('deve deletar uma tarefa', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it('não deve criar tarefa sem título', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it('não deve acessar sem token', async () => {
    const res = await request(app).get('/api/tasks');

    expect(res.status).toBe(401);
  });
});
