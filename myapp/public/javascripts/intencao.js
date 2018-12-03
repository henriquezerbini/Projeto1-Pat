
$(document).ready(function () {
    var stringRota
   
    var param = new URLSearchParams(window.location.search);
    if (param.has("feitas") || param.has("recebidas") || param.has("feitasAprovadas") || param.has("feitasReprovadas")){
        
    }
    else{
        alert("Pagina Invalida");
        window.location.href = '/index.html';
    }
    if (param.has("feitas")){
        document.getElementById("tituloPagina").innerHTML = "Intenções Feitas"
        stringRota = "listaIntencoesFeitas?situacao=E"

    }
    else if (param.has("recebidas")){
        document.getElementById("tituloPagina").innerHTML = "Intenções Recebidas"
        stringRota = "listaIntencoesRecebidas?situacao=E"

    }
    else if (param.has("feitasAprovadas")){
        document.getElementById("tituloPagina").innerHTML = "Intenções Feitas Aprovadas"
        stringRota = "listaIntencoesFeitas?situacao=A"

    }
    else if (param.has("feitasReprovadas")){
        document.getElementById("tituloPagina").innerHTML = "Intenções Feitas Reprovadas"
        stringRota = "listaIntencoesFeitas?situacao=R"

    }

    $.ajax({
        url: '/usuario/' + stringRota,
        dataType: 'json',
        error: function (dados) {
            alert('Erro1: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERROR') {
                alert('Erro: ' + dados.data);
              
            }
            else {

               // console.log(dados);
               printarAnimaisIntencao("ultimosAnimais", dados, 6)
            }
        }
    });

    $.ajax({
        url: '/usuario/logado',
        dataType: 'json',
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'SEMACESSO') {
                document.write("<br>");
                alert("Você precisa estar logado")
                window.location.href = '/login.html';
            }
            else{
                var aux = document.getElementById("animaisCad");
            aux.href = "lista.html?id="+dados.data;
            }
            
        }
    });
    


});





function printarAnimaisIntencao(id, dados, qtd) {
    var linha = 12 / qtd;
    //onsole.log(dados.data);
    var tam = dados.data.length;
    // console.log(tam);
    //listar produtos
    // ultimosAnimais
    var painelAnimal = document.getElementById(id);
    var div, i, sexo, tipo, situacao, situacaoTexto;
    for (i = 0; i < tam; i++) {
        if(dados.data[i].situacaoAdocao == "A"){
            situacao = "tipoGato"
            situacaoTexto = "Aprovado"

        }
        else if(dados.data[i].situacaoAdocao == "E"){
            situacao = "tipoOutros"
            situacaoTexto = "Em analise"

        }
        else if(dados.data[i].situacaoAdocao == "R"){
            situacao = "tipoCachorro"
            situacaoTexto = "Rejeitado"

        }
        else {
            situacao = "tipoAves"
            situacaoTexto = "Finalizado"

        }


        if (dados.data[i].sexo == "M") {
            sexo = "Masculino";
        }
        else {
            sexo = "Feminino";
        }

        if (dados.data[i].tipo == "cachorro") {
            tipo = "tipoCachorro";
        }
        else if (dados.data[i].tipo == "gato") {
            tipo = "tipoGato";
        }
        else if (dados.data[i].tipo == "ave") {
            tipo = "tipoAves";
        }
        else {
            tipo = "tipoOutros";
        }
        var k;
        var urgente = '';
        //console.log(dados.data[i].situacao);
        if (dados.data[i].situacao == "true") {
            urgente = '';
        }


        div = document.createElement('div');
        div.innerHTML = '<div class="col-lg-' + linha + ' col-md-4 col-6">' +
            '<a href="/animal.html?id=' + dados.data[i].idAnimal + '">' +
            '<div class="animalBox">' +
            '<img src="imgAnimal/thumb/' + dados.data[i].urlImg + '">' +
            '<div class="situacaoAnimal tipoCategoria '+ situacao+'">'+ situacaoTexto +'</div>' + 
            '<div class="animalBoxTexto">' +
            '<b>Sexo: </b><span>' + sexo + '</span><br>' +
            '<b>Idade: </b><span>' + dados.data[i].idade + ' anos</span><br>' +
            '<span class="tipoCategoria ' + tipo + '">' + primeiraMaiuscula(dados.data[i].tipo) + '</span>' +
            urgente +
            '<span class="tipoCategoria float-right">+</span>' +
            ' </div>' +
            '</div>' +
            '</a>' +
            ' </div>'
        painelAnimal.append(div.firstChild)

    }

}






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