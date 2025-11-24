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


app.use((req, res, next) => {
  if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  }
  next();
});

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

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/produto", (req, res) => {
  res.sendFile(path.join(__dirname, "produtos-loja", "produto.html"));
});

// servir estáticos (ajuste caminhos se necessário)
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'src')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/pages-html', express.static(path.join(__dirname, 'pages-html')));
app.use('/produtos-loja', express.static(path.join(__dirname, 'produtos-loja')));

// Rotas para páginas HTML
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
    // FALE-CONOSCO
app.get('src/pages-html/fale-conosco.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/pages-html/fale-conosco.html'));
});
    // SOBRE
app.get('/pages-html/sobre.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages-html/sobre.html'));
});
    // ONGS
app.get('/pages-html/ongs.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages-html/ongs.html'));
});
app.get('/pages-html/loja.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages-html/loja.html'));
});
app.get('/produto/:id_produto', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/produtos-loja/produto.html'));
});


const sobreongsRoutes = require('./routes/sobreongs');
app.use('/api/Sobreongs', sobreongsRoutes);

const faleconoscoRoutes = require('./routes/faleconosco');
app.use('/api/faleconosco', faleconoscoRoutes);

const produtoRoutes = require('./routes/produtoRoutes');
app.use('/api/produtos', produtoRoutes);

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

app.get("/api/buscar", (req, res) => {
  const termo = req.query.q || "";

  const sql = `
    SELECT * FROM produto
    WHERE nome LIKE ?
       OR categoria LIKE ?
       OR descricao LIKE ?
  `;

  db.query(
    sql,
    [`%${termo}%`, `%${termo}%`, `%${termo}%`],
    (err, resultado) => {
      if (err) return res.status(500).json({ erro: "Erro no servidor" });
      res.json(resultado);
    }
  );
});


// Iniciar servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Home: http://localhost:${PORT}/index.html`);

});
