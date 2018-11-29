function showMenu(){
    var menu = document.getElementById("menuAdmin");
    var conteudo = document.getElementById("conteudoAdmin");
    if(menu.style.display ===  "none"){
        menu.style.display =  "block";
        conteudo.classList.add("col-md-9");

    }
    else{
        menu.style.display =  "none";
        conteudo.classList.remove("col-md-9");

    }
    

}