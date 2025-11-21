// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const admin = require('firebase-admin');


const app = express();

// CORS
app.use(cors());

// limites para aceitar imagens base64
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ limit: '12mb', extended: true }));

// MIME middleware (opcional)
app.use((req, res, next) => {
  const ext = path.extname(req.url);
  if (ext) {
    switch (ext) {
      case '.css': res.setHeader('Content-Type', 'text/css'); break;
      case '.js': res.setHeader('Content-Type', 'application/javascript'); break;
      case '.svg': res.setHeader('Content-Type', 'image/svg+xml'); break;
      case '.png': res.setHeader('Content-Type', 'image/png'); break;
      case '.jpg':
      case '.jpeg': res.setHeader('Content-Type', 'image/jpeg'); break;
      case '.html': res.setHeader('Content-Type', 'text/html'); break;
    }
  }
  next();
});

// servir estáticos (ajuste caminhos se necessário)
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'src')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/pages-html', express.static(path.join(__dirname, 'pages-html')));
app.use('/produtos-loja', express.static(path.join(__dirname, 'produtos-loja')));

// rotas API
const profileRoutes = require('./routes/perfilusuario');
app.use('/api/profile', profileRoutes);

// outros endpoints que você já tem (ex.: usuario, produtos...)
const usuarioRoutes = require('./routes/usuario');
app.use('/api/usuario', usuarioRoutes);

// health
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// fallback api 404
app.use('/api/*', (req, res) => {
  console.log(`Rota API não encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: `Rota ${req.method} ${req.originalUrl} não encontrada` });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
