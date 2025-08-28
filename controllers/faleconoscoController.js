const Faleconosco = require('../models/faleconosco'); // ← Note o "c" minúsculo

exports.createMensagem = (req, res) => {
  console.log('📩 Dados recebidos:', req.body);
  
  const { nome, email, telefone, assunto, mensagem } = req.body;

  if (!nome || !email || !telefone || !assunto || !mensagem) {
    return res.status(400).json({ 
      success: false, 
      error: 'Todos os campos são obrigatórios' 
    });
  }

  Faleconosco.create({ nome, email, telefone, assunto, mensagem }, (err, insertId) => {
    if (err) {
      console.error('❌ Erro ao salvar contato:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      });
    }

    console.log('✅ Novo contato salvo. ID:', insertId);
    res.json({ 
      success: true, 
      message: 'Mensagem recebida com sucesso!',
      id_contato: insertId
    });
  });
};