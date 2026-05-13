const express = require('express');
require('dotenv').config();
const { sequelize } = require('./models');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
    .then(() => console.log('MySQL conectado!'))
    .catch(err => console.error('Erro ao conectar MySQL:', err));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
