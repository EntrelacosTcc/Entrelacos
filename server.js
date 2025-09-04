const express = require('express');
const cors = require('cors'); 
const path = require('path');
const app = express();

// Configurar CORS
app.use(cors()); 

app.use((req, res, next) => {
  if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  }
  next();
});

// Middleware para configurar MIME types corretamente
app.use((req, res, next) => {
  const ext = path.extname(req.url);
  switch (ext) {
    case '.css':
      res.setHeader('Content-Type', 'text/css');
      break;
    case '.js':
      res.setHeader('Content-Type', 'application/javascript');
      break;
    case '.svg':
      res.setHeader('Content-Type', 'image/svg+xml');
      break;
    case '.png':
      res.setHeader('Content-Type', 'image/png');
      break;
    case '.jpg':
    case '.jpeg':
      res.setHeader('Content-Type', 'image/jpeg');
      break;
    case '.html':
      res.setHeader('Content-Type', 'text/html');
      break;
  }
  next();
});

// SERVIR ARQUIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname)));

// Servir AMBAS as pastas CSS
app.use('/css', express.static(path.join(__dirname, 'css')));        
app.use('/pages-css', express.static(path.join(__dirname, 'pages-css'))); 

app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/pages-html', express.static(path.join(__dirname, 'pages-html')));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas para páginas HTML
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/pages-html/fale-conosco.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages-html/fale-conosco.html'));
});

app.get('/pages-html/sobre.htmls', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages-html/sobre.html'));
});

app.get('/pages-html/ONGS.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages-html/ONGS.html'));
});

// rotas API
const faleconoscoRoutes = require('./routes/faleconosco');
app.use('/api/faleconosco', faleconoscoRoutes);

const SobreongsRoutes = require('./routes/sobreongs');
app.use('/api/Sobreongs', SobreongsRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Home: http://localhost:${PORT}/index.html`);
  console.log(`🔧 Health check: http://localhost:${PORT}/health`);
});