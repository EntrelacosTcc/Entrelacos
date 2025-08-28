//slider (primeira parte )
var cont = 1;
document.getElementById('radio1').checked = true;

setInterval(() => {
    proximaImg();
}, 6000); //tempo de transição

function proximaImg() {
    cont++;
    if(cont > 2) cont = 1;
    document.getElementById('radio' + cont).checked = true;
}


// perguntas frequentes
function mostrarEsconder(id) {
    const conteudo = document.querySelector(id);
    //faz aparecer o texto ao clicar no +
    if (conteudo.style.maxHeight && conteudo.style.maxHeight !== "0px") {
        conteudo.style.maxHeight = "0px"; 
    } else {
        conteudo.style.maxHeight = conteudo.scrollHeight + "px"; 
    }
}
