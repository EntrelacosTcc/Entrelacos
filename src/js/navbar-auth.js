// navbar-auth.js
import { auth } from "./firebase.js";

// Função para buscar perfil do usuário
async function fetchUserProfile() {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const token = await user.getIdToken();
    const response = await fetch('http://localhost:3002/api/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
}

// Função para atualizar o navbar
async function updateNavbar() {
  const authItem = document.getElementById('auth-item');
  const enterButton = document.getElementById('enter-button');
  
  if (!authItem || !enterButton) return;

  const user = auth.currentUser;
  
  if (user) {
    try {
      const profile = await fetchUserProfile();
      if (profile) {
        const firstName = profile.nome ? profile.nome.split(' ')[0] : 'Usuário';
        
        enterButton.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; padding: 5px;">
            <img src="${profile.foto || '../assets/img/default-avatar.png'}" 
                 alt="Foto do perfil" 
                 style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 2px solid #fff;">
            <span style="color: #333; font-weight: 500;">${firstName}</span>
          </div>
        `;
        
        // Muda o link para o perfil
        const authLink = authItem.querySelector('a');
        if (authLink) {
          authLink.href = "../perfil-users/perfilusuario.html";
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar navbar:', error);
    }
  }
}

// Ouvir mudanças no estado de autenticação
auth.onAuthStateChanged((user) => {
  updateNavbar();
});

// Atualizar navbar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
});