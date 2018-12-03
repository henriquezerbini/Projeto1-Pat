$(document).ready(function () {
    var param = new URLSearchParams(window.location.search);
    var urlAcao;
    var id = param.get('id')
    if (param.has('id')) { // alteração
        // ok
    }
    else {
        alert("Pagina invalida");
        return 0;
    }
    
    $.ajax({
        url: '/animal/animal?id='+id,
        dataType: 'json',
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERROR') {
                console.log("erro", dados.data);
            }
            else {
                console.log(dados.data, dados.img)
                var painelAnimal = document.getElementById("animalSingle");
                var stringAcesso = document.getElementById("intencaoAceita");
                var  div = document.createElement('div');
                var liBotao = "";
                var divImg = ""
                var artigo;
                var nivelAcesso = "";
                var botaoAdotar = '<button class="tipoCategoria botaoBottom" onclick="intencaoAdotar('+ dados.data[0].idAnimal +');"><i class="fas fa-heart heart"></i> Intenção de Adoção</button>'
               // alert(dados.status );
                if(dados.status == "OKABERTO" ){
                    nivelAcesso = "";
                }
                else if (dados.status == "OKFINALIZADO"){
                    nivelAcesso = '<div class="alertaIntencao"> '+
                    '<h2>Esse animal ja foi adotado !</h2>' +
                    '</div>'
                    botaoAdotar = "";
                }
                else if(dados.status == "OKTEMINTENCAOSEUANIMAL"){
                    nivelAcesso = '<div class="alertaIntencao"> '+
                    '<h2>Ha intenções para adotar seu bichinho</h2>' +
                   ' <span>Libere suas informações para os usuarios que desejar.</span><br>' +
                   ' <i>Clica no nome do usuario para saber mais informações sobre o mesmo.</i>' +
                   ' <hr>' +
                   ' <table class="table table-sm">' +
                        '<thead>' +
                           ' <tr>' +
                                '<th>Nome</th>' +
                                '<th>Aprovar intenção</th>' +
                                '<th>Finalizar adoção</th>' +
                           ' </tr>' +
                        '</thead>' +
                        '<tbody>' 
                    for (var k=0;k<dados.dadosIntencao.length;k++){
                        var botoes;
                        if(dados.dadosIntencao[k].situacaoAdocao == 'E'){
                            botoes = ' <button class="okCorpo" onClick="aprovarIntencao('+ dados.dadosIntencao[k].idUsuario+',' + "'A'" + ');">Aprovar</button>'+
                            '<button class="alertaCorpo" onClick="aprovarIntencao('+ dados.dadosIntencao[k].idUsuario+',' + "'R'" + ');">Recusar</button>'
                        }
                        else if(dados.dadosIntencao[k].situacaoAdocao == 'A'){
                            botoes = '<span>Aprovado</span>'
                        }
                        else {
                            botoes = '<span>Rejeitado</span>'
                        }
                        console.log("entrou");
                        nivelAcesso = nivelAcesso + ' <tr>' +
                        '<td><a href="/usuario?user="'+ dados.dadosIntencao[k].user +'">'+ dados.dadosIntencao[k].nome +'</a></td>'+
                        '<td id="intencao'+dados.dadosIntencao[k].idUsuario+'">'+ botoes +
                        '</td>'+
                        '<td>'+
                            '<button class="okCorpo" onClick="finalizarAdocao('+ dados.dadosIntencao[k].idUsuario+',' + "'F'" + ');">Finalizar</button>'+
                        '</td>'+
                    '</tr>'
                    }
                    nivelAcesso = nivelAcesso +  '</tbody>' +
                    '</table>'+
                   ' <hr>'+
                    '<h5>Não esqueca de nos avisar quando a adoção tive sido feita atraves do botão <b>Finalizar</b>.</span>'+
                    ' </div>'
                }
                else if(dados.status == "OKFEZINTENCAO"){
                    nivelAcesso = '<div class="alertaIntencao">'+
                    '<h2>Sua intenção foi aceita!</h2>'+
                    '<span>Entre em contato com o atual dono do bichinho</span>'+
                    '<hr>'+
                    '<b>Nome:</b>' + dados.dadosIntencao[0].nome +' <br>'+
                    '<b>E-Mail:</b> ' + dados.dadosIntencao[0].email +'  <br>'+
                    '<i>Lembre-se de se identificar!</i>'+
               ' </div>'
                }

                stringAcesso.innerHTML = nivelAcesso;
  //////////////////              
                for(let i=0;i<dados.img.length;i++){
                    if(i==0){
                        divImg = divImg +  '<div class="carousel-item active ">'+
                        '<a href="#" onclick="imgGrande' + "('"  + dados.img[i].urlImg + "');" + '"><img class="d-block w-100" src="imgAnimal/thumb/'+ dados.img[i].urlImg +'" alt="Imagem'+ i +'"></a>'+
                    '</div>'
                   
                        liBotao = liBotao + '<li data-target="#carouselExampleIndicators" data-slide-to="'+ i +'" class="active"></li>';
                    }
                    else{
                        divImg = divImg +  '<div class="carousel-item ">'+
                        '<a href="#" onclick="imgGrande' + "('"  + dados.img[i].urlImg + "');" + '"><img class="d-block w-100" src="imgAnimal/thumb/'+ dados.img[i].urlImg +'" alt="Imagem'+ i +'"></a>'+
                    '</div>'
                   
                        liBotao = liBotao + '<li data-target="#carouselExampleIndicators" data-slide-to="'+ i +'"></li>';
                    }
                    
                }

                if(dados.data[0].sexo == "M"){
                    sexo = "Masculino";
                    artigo = "o";
                }
                else{
                    sexo = "Feminino";
                    artigo = "a";
                }
                document.title = "Buddy - Adote " + artigo + " "  + dados.data[0].nome;

///////////
                div.innerHTML = '<h2 class="float-left d-block"><i class="fas fa-paw mr-1"></i>'+ dados.data[0].nome +'</h2>' +
               '<div class=" clearfix"></div>'+
                '<div class="row no-gutters mt-2">'+
                    '<div class="col-md-4 col-12 ">'+
                       ' <div id="carouselExampleIndicators" class="animalBox carousel slide carousel-fade" data-ride="carousel">'+
                            '<ol class="carousel-indicators">'+ liBotao + 
                            '</ol>'+
                            '<div class="carousel-inner">'+ divImg +
                            '</div>'+
                            '<a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">'+
                                '<span class="carousel-control-prev-icon" aria-hidden="true"></span>'+
                                '<span class="sr-only">Anterior</span>'+
                            '</a>'+
                          '  <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">'+
                                '<span class="carousel-control-next-icon" aria-hidden="true"></span>'+
                               ' <span class="sr-only">Próximo</span>'+
                            '</a>'+
                        '</div>'+
                    '</div>'+
                   ' <div class="col-md-8 col-12">'+
                        '<div class="animalBoxTexto">'+
                            '<b>Sexo: </b><span>'+ sexo +'</span><br>'+
                            '<b>Idade: </b><span>'+ dados.data[0].idade +' anos</span><br>'+
                            '<b>Estado: </b><span>'+ dados.data[0].estado +' </span><br>'+
                            '<b>Cidade: </b><span>'+ dados.data[0].cidade +' </span><br>'+
                           ' <b>Tipo: </b><span>'+ primeiraMaiuscula(dados.data[0].tipo)  +'</span><br>'+
                            '<b>Cor: </b><span>'+ dados.data[0].cor +'</span><br>'+
                            '<b>Data: </b><span>'+ dados.data[0].dataDeCadastro.split("T")[0] +'</span><br>'+
                            '<b>Anunciante: </b>'+ dados.data[0].nomeUsuario +'<br>'+
                            '<b>Descrição: </b><span>'+ dados.data[0].descricao +'</span><br>'+
                            '<br>'+
                           ' Veja mais: <a href="/lista.html?tipo='+dados.data[0].tipo+'" class="tipoCategoria">'+ primeiraMaiuscula(dados.data[0].tipo) +'</a>'+ botaoAdotar + 
                        '</div>'+
                    '</div>'+
                '</div>'
                console.log(div);
                painelAnimal.append(div)
            }
        }
    });


        /*------------------------------------------------------------------------------------------
                                    Recupera Lista de comentarios do Animal
    *------------------------------------------------------------------------------------------*/

    $.ajax({
        url: '/animal/listaComentario?idAnimalDestino='+id,
        dataType: 'json',
        error: function (dados) {
            alert('Erro1: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERRO') {
                alert('Erro2: ' + dados.data);
                window.location.href = '/animal.html?id='+id;
            }
            console.log(dados.data);
            exibeComentarios(dados.data);
        }
    });


        $.ajax({
        url: '/animal/animal2?qtd=6',
        dataType: 'json',
        error: function (dados) {
            alert('Erro1: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERRO') {
                alert('Erro2: ' + dados.data);
            }
            console.log(dados.data);
             printarAnimais("vocePostaGostar", dados, 6)
        }
    });

});


function imgGrande(imgUrl){
    console.log(imgUrl);
    var imagem = document.getElementById("telaImgGrandeImagem");
    var tela = document.getElementById("telaImgGrande");

    imagem.src = "./imgAnimal/" + imgUrl;
    tela.style.display = "flex";

}

function esconderTela(){
    var tela = document.getElementById("telaImgGrande");
    tela.style.display = "none";

}

function intencaoAdotar(id){
    var confirma = confirm("Certeza que tem a intenção de adotar esse animalzinho?");
    if(confirma === false){
        return -1;
    }

    var input = {
        idAnimal: id
    };
    $.ajax({
        url: '/animal/intencao',
        type: 'post',
        data: input,
        error: function (dados) {
            alert('Erro1: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERROR') {
                alert('Erro: ' + dados.data);
              
            }
            else if (dados.status === 'SEMACESSO') {
                alert('Erro: ' + dados.data);
              
            }
            else {
                alert("Intenção feita com sucesso!!!!");
            }
        }
    });


    console.log(id);

}

function aprovarIntencao(idUsuario, operacao){
    var confirma = confirm("Tem certeza que deseja aprovar essa intenção?");
    if(confirma === false){
        return -1;
    }

    var param = new URLSearchParams(window.location.search);
    var id = param.get('id')
    dadosReq = {
        animal_idAnimal: id,
        usuario_idUsuario: idUsuario,
        operacao  : operacao
    };

    $.ajax({
        url: '/animal/aprovarIntencao',
        type: 'post',
        data: dadosReq,
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERROR') {
                console.log("erro", dados.data);
            }
            else {
                if(operacao == "A"){
                    document.getElementById("intencao" + idUsuario).innerHTML = "Aprovado";
                }
                else  if(operacao == "R"){
                    document.getElementById("intencao" + idUsuario).innerHTML = "Rejeitado";
                }       
            }
        }
     });

}

function finalizarAdocao(idUsuario, operacao){
    var confirma = confirm("Tem certeza que deseja aprovar essa intenção?");
    if(confirma === false){
        return -1;
    }

    var param = new URLSearchParams(window.location.search);
    var id = param.get('id')
    dadosReq = {
        animal_idAnimal: id,
        usuario_idUsuario: idUsuario,
        operacao  : operacao
    };

    $.ajax({
        url: '/animal/finalizarAdocao',
        type: 'post',
        data: dadosReq,
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERROR') {
                console.log("erro", dados.data);
            }
            else {
               alert(dados.data);
               location.reload();
            }
        }
     });

}




function novoComentario(){
    var form = document.formComentario;
    var param = new URLSearchParams(window.location.search);
    var id = param.get('id');
    var input = {
        idAnimalDestino : id,
        mensagem : form.comentarioEnviar.value
    };
    if(input.mensagem.length > 0 && input.mensagem.length < 201){
        console.log(input);
        $.ajax({
            url: '/animal/fazerComentario',
            type: 'post',
            data: input,
            error: function (dados) {
                alert('Erro1: ' + dados.data);
            },
            success: function (dados) {
                if (dados.status === 'ERRO') {
                    alert('Erro2: ' + dados.data);
                }
                else {
                    alert("Comentario publicado com sucesso!!!!");
                    window.location.href = '/animal.html?id='+id;
                }
            }
        });
    }
    else{
        alert("N eh possivel inserir mensagens vazias");
    }
}

function exibeComentarios(perguntas){
    for(var i = 0; i<perguntas.length;i++){
        var pergunta = perguntas[i];
        var resposta ;
        if(pergunta.resposta)
        {
            resposta = '<br><br>Resposta:<br>' + pergunta.resposta + '<br><br><a onclick="excluirResposta('+ pergunta.idComentario+')">Excluir Resposta</a>';
        }
        else{

            /*===========================================================================================
                                    SETANDO VALOR DE DADOS resposta
            ============================================================================================*/
            resposta =
                '<form id="formResponderComentario'+pergunta.idComentario+'" method="POST">'+
                    '<div class="">'+
                        '<textarea class="form-control" placeholder="Responder o comentario" name="respostaComentario" required maxlength="200"></textarea>'+
                    '</div>'+
                    '<br>'+
                    '<div class="">'+
                        '<button type="button" class="btn btn-success" onclick = "responderComentario('+pergunta.idComentario +');" >Responder</a>'+
                    '</div>'+
            '</form>'
            console.log(resposta);
            /*=========================================================================================*/
        }
        /*===========================================================================================
                            SETANDO VALOR DE DADOS PERGUNTA
        ============================================================================================*/
        var dadosPergunta = '<div class="row no-gutters comentarioSrc">' +
        '<div class="col-md-1 col-2" id="comentarioImg">' +
            '<a href="#" onclick="imgGrande("teste");"> <img src="./images/'+ pergunta.fotoPerfil+'" class=" img-fluid rounded-circle border border-dark w-75"></a>'+
        '</div>'+
        '<div class="col-md-11 col-10">'+
            '<div id="comentarioSrcTexto_'+pergunta.idUsuario+'">'+
                '<b>'+pergunta.nome+'</b>'+
                '<p>'+pergunta.mensagem+'</p>'+
            '</div>'+
            resposta+
        '</div>'+
        '<br>'+
        '<a onclick="excluirComentario('+ pergunta.idComentario+')">Excluir Comentario</a>'

    '</div>';
    /*===========================================================================================*/
        document.getElementById('perguntas').innerHTML += dadosPergunta;
    }
}

function responderComentario(idComentario){
    formName = "formResponderComentario" + idComentario;
    form = document.getElementById(formName);
    var param = new URLSearchParams(window.location.search);
    var id = param.get('id');
    console.log(form.respostaComentario.value);
    input = {
        resposta : form.respostaComentario.value,
        idComentario : idComentario,
        idAnimal : id
    };
    $.ajax({
        url: '/animal/respostaComentario',
        type: 'post',
        data: input,
        error: function (dados) {
            alert('Erro1: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERROR') {
                alert('Erro: ' + dados.data);
              
            }
            else if (dados.status === 'SEMACESSO') {
                alert('Sem acesso: ' + dados.data);
              
            }
            else {
                alert("Comentario respondido com sucesso!!!!");
                window.location.href = '/animal.html?id='+id;
            }
        }
    });
}

function excluirResposta(idComentario){
    var param = new URLSearchParams(window.location.search);
    var id = param.get('id');
    input = {
        idComentario : idComentario,
        idAnimal : id
    };
    $.ajax({
        url: '/animal/excluirResposta',
        type: 'post',
        data: input,
        error: function (dados) {
            alert('Erro1: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERROR') {
                alert('Erro: ' + dados.data);
              
            }
            else if (dados.status === 'SEMACESSO') {
                alert('Sem acesso: ' + dados.data);
              
            }
            else {
                alert("Resposta excluido com sucesso!!!!");
                window.location.href = '/animal.html?id='+id;
            }
        }
    });
}


function excluirComentario(idComentario){
    var param = new URLSearchParams(window.location.search);
    var id = param.get('id');
    input = {
        idComentario : idComentario,
        idAnimal : id
    };
    $.ajax({
        url: '/animal/excluirComentario',
        type: 'post',
        data: input,
        error: function (dados) {
            alert('Erro1: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERROR') {
                alert('Erro: ' + dados.data);
              
            }
            else if (dados.status === 'SEMACESSO') {
                alert('Sem acesso: ' + dados.data);
              
            }
            else {
                alert("Comentario excluido com sucesso!!!!");
                window.location.href = '/animal.html?id='+id;
            }
        }
    });
}