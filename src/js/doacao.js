class DoacaoItem extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const imagem = this.getAttribute('imagem');
        const imagemHTML = imagem 
            ? `<img src="${imagem}" alt="${this.getAttribute('titulo')}" class="doacao-img">`
            : `<div class="doacao-img"></div>`;

        this.innerHTML = `
        <div class="doacao">
            ${imagemHTML}
            <div class="pedidoDoacao">
                <span>${this.getAttribute('titulo')}</span>
                <p>${this.getAttribute('descricao')}</p>
                <button class="doacaoBtn" onclick="window.location.href='${this.getAttribute('link')}'">
                    Doar Agora
                </button>
            </div>
        </div>
        `;
    }
}

// Registrar componente apenas uma vez
if (!customElements.get('doacao-item')) {
    customElements.define('doacao-item', DoacaoItem);
}