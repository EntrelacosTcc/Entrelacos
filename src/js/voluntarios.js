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