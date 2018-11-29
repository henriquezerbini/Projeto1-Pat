
$(document).ready(function () {
    var param = new URLSearchParams(window.location.search);
    var urlAcao;
    var id = param.get('id')
    console.log(id);
    console.log(param.getAll('id'));

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
                    content = content +  '<label class="textoCheck">'+ dados.data[i].nomeTipo +'<input type="checkbox" name="tipo" value="'+ dados.data[i].nomeTipo +'">'+
                   '<span class="checkmark"></span> </label>'
                }
                div.innerHTML = content;

                conteudo.append(div);

            }
        }
    });


    $.ajax({
        url: '/animal/listaAnimaisCategoria?qtd=12&page=1;',
        dataType: 'json',
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERROR') {
                console.log("erro", dados.data);
                     }
            else {
                console.log(dados.data);
                var tam = dados.data.length;
                console.log(tam);
                //listar produtos
                var painelAnimal = document.getElementById("animaisLista");
                var div, i, sexo, tipo;
                for(i=0;i<tam;i++){
                    if(dados.data[i].sexo == "M"){
                        sexo = "Macho";
                    }
                    else{
                        sexo = "Femea";
                    }

                    if(dados.data[i].tipo == "Cachorro"){
                        tipo = "tipoCachorro";
                    }
                    else if(dados.data[i].tipo == "Gato"){
                        tipo = "tipoGato";
                    }
                    else if(dados.data[i].tipo == "Aves"){
                        tipo = "tipoAves";
                    }
                    else{
                        tipo = "tipoOutros";
                    }
                    var k;
                    

                    
                    div = document.createElement('div');
                    div.innerHTML = '<div class="col-lg-3 col-md-4 col-6">'+
                    '<a href="/animal.html?id='+ dados.data[i].idAnimal +'">'+
                        '<div class="animalBox">'+
                            '<img src="imgAnimal/thumb/'+dados.data[i].urlImg+'">'+
                            '<div class="animalBoxTexto">'+
                                '<b>Sexo: </b><span>'+ sexo +'</span><br>'+
                                '<b>Idade: </b><span>'+ dados.data[i].idade +' anos</span><br>'+
                                '<span class="tipoCategoria '+tipo+'">'+dados.data[i].tipo+'</span>'+
                                '<span class="tipoCategoria tipoUrgente">Urgente</span>'+
                                '<span class="tipoCategoria float-right">+</span>'+
                           ' </div>'+
                        '</div>'+
                    '</a>'+
               ' </div>'
                    painelAnimal.append(div.firstChild)

                }
        

               }
        }
    });


});



function pesquisarAnimal(){
    var sexos = "";
    var tipos = "";
   

    var sexo = document.pesquisar.sexo;
    var tipo = document.pesquisar.tipo;
    var i;

    for(i=0;i<sexo.length;i++){
        if(sexo[i].checked){
            sexos = sexos +"sexo="+ sexo[i].value +  "&";

        }
    }


    for(i=0;i<tipo.length;i++){
        if(tipo[i].checked){
            tipos = tipos + "tipo=" + tipo[i].value +  "&";
        }
    }
    console.log(sexos, tipos);
 
    $.ajax({
        url: '/animal/listaCategorias?' +sexos +tipos,
        dataType: 'json',
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERRO') {
               
            }
            else {
                
            }
        }
    });


}



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