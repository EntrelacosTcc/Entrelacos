function mostrarEsconder(id) {
    const conteudo = document.querySelector(id);

    if (conteudo.style.maxHeight && conteudo.style.maxHeight !== "0px") {
        conteudo.style.maxHeight = "0px"; 
    } else {
        conteudo.style.maxHeight = conteudo.scrollHeight + "px"; 
    }
}
