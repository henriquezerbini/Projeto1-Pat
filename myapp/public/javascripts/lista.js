
$(document).ready(function () {
    $.ajax({
        url: '/animal/tiposDefinidos',
        dataType: 'json',
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERRO') {

            }
            else {
                var conteudo = document.getElementById("tipoAnimalCat");
                var len = dados.data.length;
                var content = "";
                var  div = document.createElement('div');
                for (var i = 0;i<len;i++){
                    content = content +  '<label class="textoCheck">'+  primeiraMaiuscula(dados.data[i].nomeTipo) +'<input type="checkbox" name="tipo" value="'+dados.data[i].nomeTipo +'">'+
                   '<span class="checkmark"></span> </label>'
                }
                div.innerHTML = content;

                conteudo.append(div);


            }
        }
    });

    var param = new URLSearchParams(window.location.search);
    console.log(param.toString());
    $.ajax({
        url: '/animal/animal2?'+param.toString(),
        dataType: 'json',
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERROR') {
                alert("erro", dados.data);
                     }
            else {
                printarAnimais("animaisLista", dados, 4)
                console.log(dados.qtd);
                paginas = document.getElementById("paginacao");
                pag = param.get("page");
                if(pag == undefined){
                    pag = 1;
                }
                else{
                    param.delete("page")
                    console.log(param.toString());
                }
                paginasString = "";
                console.log(pag);
                var qtds = Math.ceil(dados.qtd/12);
                for(var k=0;k<qtds; k++)
                    if((k+1) == pag){
                        paginasString = paginasString + '<li class="page-item disabled"><a class="page-link" href=lista.html?"'+param.toString() + '&page='+ (k+1) +'" tabindex="-1">'+(k+1)+'</a></li>'
                    }
                    else{
                        paginasString = paginasString + ' <li class="page-item"><a class="page-link"  href="lista.html?'+param.toString() + '&page='+ (k+1) +'">'+ (k+1) +'</a></li>'
                    }
                    paginas.innerHTML = paginasString
               }
               
        }
    });


});




function showSidebar(id, conteudo){
    var menu = document.getElementById(id);
    var conteudo = document.getElementById(conteudo);
    console.log(menu.style.width);
    if(menu.style.width ===  "0px"){
        
        menu.style.width = "100%";

    }
    else{
        menu.style.width = "0px";
    
        

    }
    

}