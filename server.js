const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/router/auth.js');

const app = express();

// Configuração do CORS mais completa
app.use(cors({
  origin: 'http://localhost:3000', // Ou a porta do seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rota de teste
app.get('/api/teste', (req, res) => {
  res.json({ message: "Rota de teste funcionando!" });
});

// Suas rotas de autenticação
app.use('/api/auth', authRoutes);

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});