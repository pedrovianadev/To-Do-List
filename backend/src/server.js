const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => console.log('MySQL conectado!'))
  .catch(err => console.error('Erro ao conectar:', err));

// Sincronizar models com o banco (cria as tabelas se não existirem)
sequelize.sync()
  .then(() => console.log('Tabelas sincronizadas!'));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
