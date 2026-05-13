const { Router } = require('express');
const TaskController = require('../controllers/TaskController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

const router = Router();

router.use(auth);

router.get('/', TaskController.listar);
router.get('/:id', TaskController.buscarPorId);
router.post(
  '/',
  [body('titulo').notEmpty().withMessage('Título é obrigatório')],
  TaskController.criar
);
router.put(
  '/:id',
  [body('titulo').notEmpty().withMessage('Título é obrigatório')],
  TaskController.atualizar
);
router.delete('/:id', TaskController.deletar);

module.exports = router;
