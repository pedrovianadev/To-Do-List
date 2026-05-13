/**
 * @swagger
 * /api/tasks:
 *   get:
 *     tags: [Tarefas]
 *     summary: Listar todas as tarefas do usuário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pendente, concluida]
 *         description: Filtrar por status
 *       - in: query
 *         name: busca
 *         schema:
 *           type: string
 *         description: Buscar por título
 *     responses:
 *       200:
 *         description: Lista de tarefas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *
 *   post:
 *     tags: [Tarefas]
 *     summary: Criar uma nova tarefa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo]
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tarefa criada
 *       400:
 *         description: Dados inválidos
 *
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tarefas]
 *     summary: Buscar tarefa por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados da tarefa
 *       404:
 *         description: Tarefa não encontrada
 *
 *   put:
 *     tags: [Tarefas]
 *     summary: Atualizar uma tarefa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pendente, concluida]
 *     responses:
 *       200:
 *         description: Tarefa atualizada
 *       404:
 *         description: Tarefa não encontrada
 *
 *   delete:
 *     tags: [Tarefas]
 *     summary: Deletar uma tarefa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Tarefa deletada
 *       404:
 *         description: Tarefa não encontrada
 */

const { Task } = require('../models');
const { validationResult } = require('express-validator');

exports.listar = async (req, res) => {
  try {
    const where = { user_id: req.userId };

    if (req.query.status) {
      where.status = req.query.status;
    }

    if (req.query.busca) {
      where.titulo = { [require('sequelize').Op.like]: `%${req.query.busca}%` };
    }

    const tasks = await Task.findAll({ where, order: [['created_at', 'DESC']] });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar tarefas' });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });

    if (!task) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar tarefa' });
  }
};

exports.criar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }

    const { titulo, descricao } = req.body;
    const task = await Task.create({
      titulo,
      descricao,
      user_id: req.userId,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar tarefa' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }

    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });

    if (!task) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    const { titulo, descricao, status } = req.body;
    await task.update({ titulo, descricao, status });

    res.json(task);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar tarefa' });
  }
};

exports.deletar = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });

    if (!task) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    await task.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar tarefa' });
  }
};
