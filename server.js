const express = require('express');
const cors = require('cors'); 
const path = require('path');
const soap = require('soap'); // <- adiciona soap
const app = express();

// Configurar CORS
app.use(cors()); 

// Middleware para configurar MIME types corretamente
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

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Exemplo de pastas estáticas
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/pages-css', express.static(path.join(__dirname, 'pages-css'))); 
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/pages-html', express.static(path.join(__dirname, 'pages-html')));
app.use('/produtos-loja', express.static(path.join(__dirname, 'produtos-loja')));

// Rotas páginas HTML
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/src/pages-html/fale-conosco.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/pages-html/fale-conosco.html'));
});
app.get('/pages-html/sobre.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages-html/sobre.html'));
});
app.get('/pages-html/ONGS.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages-html/ONGS.html'));
});
app.get('/pages-html/loja.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages-html/loja.html'));
});
app.get('/produto/:id_produto', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/produtos-loja/produto.html'));
});

// rotas API externas
const faleconoscoRoutes = require('./routes/faleconosco');
app.use('/api/faleconosco', faleconoscoRoutes);

const SobreongsRoutes = require('./routes/sobreongs');
app.use('/api/Sobreongs', SobreongsRoutes);

const produtoRoutes = require('./routes/produtoRoutes');
app.use('/api/produtos', produtoRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// =================== ROTA FRETE ===================
const WSDL_URL = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?WSDL';
const CEP_ORIGEM = '01001000'; // seu CEP de origem
const SERVICO = '04014'; // SEDEX

app.post('/frete', async (req, res) => {
  const { cep } = req.body;

  if(!cep || cep.length !== 8){
    return res.json({ erro: "CEP inválido!" });
  }

  const args = {
    nCdServico: SERVICO,
    sCepOrigem: CEP_ORIGEM,
    sCepDestino: cep,
    nVlPeso: '1',
    nCdFormato: '1',
    nVlComprimento: '20',
    nVlAltura: '10',
    nVlLargura: '15',
    nVlDiametro: '0',
    sCdMaoPropria: 'N',
    nVlValorDeclarado: '0',
    sCdAvisoRecebimento: 'N'
  };

  try {
    const client = await soap.createClientAsync(WSDL_URL);
    const result = await client.CalcPrecoPrazoAsync(args);
    const servico = result[0].CalcPrecoPrazoResult.Servicos.cServico;

    res.json({ valor: servico.Valor, prazo: servico.PrazoEntrega });
  } catch (err) {
    console.error(err);
    res.json({ erro: "Erro ao calcular frete." });
  }
});
// ====================================================

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Home: http://localhost:${PORT}/index.html`);
  console.log(`🌐 Produto: http://localhost:${PORT}/produto/:id_produto`);
  console.log(`🔧 Health check: http://localhost:${PORT}/health`);
});
