function mostrarEsconder(id) {
    const conteudo = document.querySelector(id);
    //faz aparecer o texto ao clicar no +
    if (conteudo.style.maxHeight && conteudo.style.maxHeight !== "0px") {
        conteudo.style.maxHeight = "0px"; 
    } else {
        conteudo.style.maxHeight = conteudo.scrollHeight + "px"; 
    }
}
