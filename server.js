// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const admin = require('firebase-admin');
const db = require('./config/database'); // Certifique-se de ter isso

const app = express();

// CORS
app.use(cors());

// Limites para aceitar imagens grandes (ex: base64)
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ limit: '12mb', extended: true }));

// Middleware para headers MIME (opcional)
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

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'src')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/pages-html', express.static(path.join(__dirname, 'pages-html')));
app.use('/produtos-loja', express.static(path.join(__dirname, 'produtos-loja')));

// Rotas para páginas HTML
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/pages-html/fale-conosco.html', (req, res) => res.sendFile(path.join(__dirname, 'src/pages-html/fale-conosco.html')));
app.get('/pages-html/sobre.html', (req, res) => res.sendFile(path.join(__dirname, 'pages-html/sobre.html')));
app.get('/pages-html/ONGS.html', (req, res) => res.sendFile(path.join(__dirname, 'pages-html/ONGS.html')));
app.get('/pages-html/loja.html', (req, res) => res.sendFile(path.join(__dirname, 'pages-html/loja.html')));
app.get('/produto/:id_produto', (req, res) => res.sendFile(path.join(__dirname, 'src/produtos-loja/produto.html')));

// server.js - Adicione esta parte ANTES das rotas
console.log('🔄 Carregando rotas...');

// Rotas API
const produtoRoutes = require('./routes/produtoRoutes');
app.use('/api/produtos', produtoRoutes);
console.log('✅ Rotas de produtos carregadas');

const ongRoutes = require('./routes/ongRoutes');
app.use('/api/ong', ongRoutes);
console.log('✅ Rotas da ONG carregadas: /api/ong');

const perfilOngRoutes = require('./routes/perfilongRoutes');
app.use('/api/ong/profile', perfilOngRoutes);
console.log('✅ Rotas do perfil ONG carregadas: /api/ong/profile');

const profileRoutes = require('./routes/perfilusuario');
app.use('/api/profile', profileRoutes);
console.log('✅ Rotas de perfil usuário carregadas');

const usuarioRoutes = require('./routes/usuario');
app.use('/api/usuario', usuarioRoutes);
console.log('✅ Rotas de usuário carregadas');

// Healthcheck
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// Buscar produtos
app.get("/api/buscar", (req, res) => {
  const termo = req.query.q || "";
  const sql = `
    SELECT * FROM produto
    WHERE nome LIKE ? OR categoria LIKE ? OR descricao LIKE ?
  `;
  db.query(sql, [`%${termo}%`, `%${termo}%`, `%${termo}%`], (err, resultado) => {
    if (err) return res.status(500).json({ erro: "Erro no servidor" });
    res.json(resultado);
  });
});

// Fallback API 404
app.use('/api/*', (req, res) => {
  console.log(`Rota API não encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: `Rota ${req.method} ${req.originalUrl} não encontrada` });
});

// Iniciar servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Home: http://localhost:${PORT}/index.html`);
});
