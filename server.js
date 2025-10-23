const express = require('express');
const cors = require('cors'); 
const path = require('path');
const helmet = require('helmet');           // 🛡 Segurança headers
const xss = require('xss-clean');           // 🛡 Limpeza XSS
const rateLimit = require('express-rate-limit'); // 🛡 Limite de requisições
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();                 // Variáveis de ambiente

const app = express();

// ======== SEGURANÇA ========

// Headers de segurança
app.use(helmet());

// Limpar inputs para prevenir XSS
app.use(xss());

// Cookies
app.use(cookieParser());

// Sessões
app.use(session({
  secret: process.env.SESSION_SECRET || 'chave_super_secreta',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true } // se usar HTTPS, coloque true
}));

// Limite de tentativas (rate limit) - pode ajustar /login depois
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,                  // 100 requisições por IP
  message: "Muitas requisições, tente novamente mais tarde."
});
app.use(limiter);

// ======== CORS ========
app.use(cors()); 

// ======== Body parser ========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======== Configuração MIME Types ========
app.use((req, res, next) => {
  const ext = path.extname(req.url);
  switch (ext) {
    case '.css': res.setHeader('Content-Type', 'text/css'); break;
    case '.js': res.setHeader('Content-Type', 'application/javascript'); break;
    case '.svg': res.setHeader('Content-Type', 'image/svg+xml'); break;
    case '.png': res.setHeader('Content-Type', 'image/png'); break;
    case '.jpg':
    case '.jpeg': res.setHeader('Content-Type', 'image/jpeg'); break;
    case '.html': res.setHeader('Content-Type', 'text/html'); break;
  }
  next();
});

// ======== Arquivos estáticos ========
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, "src")));
app.use('/css', express.static(path.join(__dirname, 'css')));        
app.use('/pages-css', express.static(path.join(__dirname, 'pages-css'))); 
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/pages-html', express.static(path.join(__dirname, 'pages-html')));
app.use('/produtos-loja', express.static(path.join(__dirname, 'produtos-loja')));

// ======== Rotas HTML ========
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/src/pages-html/fale-conosco.html', (req, res) => res.sendFile(path.join(__dirname, 'src/pages-html/fale-conosco.html')));
app.get('/pages-html/sobre.html', (req, res) => res.sendFile(path.join(__dirname, 'pages-html/sobre.html')));
app.get('/pages-html/ONGS.html', (req, res) => res.sendFile(path.join(__dirname, 'pages-html/ONGS.html')));
app.get('/pages-html/loja.html', (req, res) => res.sendFile(path.join(__dirname, 'pages-html/loja.html')));
app.get('/produto/:id_produto', (req, res) => res.sendFile(path.join(__dirname, 'src/produtos-loja/produto.html')));

// ======== Rotas API ========
const faleconoscoRoutes = require('./routes/faleconosco');
app.use('/api/faleconosco', faleconoscoRoutes);

const SobreongsRoutes = require('./routes/sobreongs');
app.use('/api/Sobreongs', SobreongsRoutes);

const produtoRoutes = require('./routes/produtoRoutes');
app.use('/api/produtos', produtoRoutes);

// ======== Health check ========
app.get('/health', (req, res) => res.json({ status: 'OK', message: 'Servidor funcionando' }));

// ======== Iniciar servidor ========
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(` Servidor rodando na porta ${PORT}`);
  console.log(` Home: http://localhost:${PORT}/index.html`);
  console.log(` Produto: http://localhost:${PORT}/produto/:id_produto`);
  console.log(` Health check: http://localhost:${PORT}/health`);
});
