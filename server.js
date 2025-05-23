// server.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/router/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes); // OK

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
