document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // ← IMPEDE O ENVIO PADRÃO
            
            // Coletar dados do formulário
            const formData = {
                nome: this.querySelector('[name="nome"]').value,
                email: this.querySelector('[name="email"]').value,
                telefone: this.querySelector('[name="telefone"]').value,
                assunto: this.querySelector('[name="assunto"]').value,
                mensagem: this.querySelector('[name="mensagem"]').value,
                origem: 'sobreNos/ONGs'
            };
            
            console.log('📤 Dados a enviar:', formData);
            
            // Mostrar loading
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            try {
                // Enviar via Fetch API
                const response = await fetch('/api/Sobreongs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                console.log('📥 Resposta do servidor:', data);
                
            } catch (error) {
                console.error('❌ Erro de conexão:', error);
                alert('❌ Erro ao enviar mensagem. Verifique o console para detalhes.');
            } finally {
                // Restaurar botão
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});