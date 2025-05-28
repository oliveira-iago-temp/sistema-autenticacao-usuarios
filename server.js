// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./src/router/auth');

const app = express();
app.use(cors());
app.use(express.json());

// API
app.use('/api', authRoutes);

// Serve arquivos estáticos do React
app.use(express.static(path.join(__dirname, 'build')));

// Fallback para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Inicia o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
