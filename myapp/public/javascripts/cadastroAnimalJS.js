
$(document).ready(function () {
    $.ajax({
        url: '/usuario/logado',
        dataType: 'json',
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'SEMACESSO') {
                window.location.href = '/index.html';
            }
        }
    });


    $.ajax({
        url: '/animal/tiposDefinidos',
        dataType: 'json',
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERROR') {
                alert("erro", err);
                window.location.href = '/index.html';
            }
            else {
                var div = document.getElementById("tipoAnimal");
                var conteudo = document.createElement('div');
                var conteudoHtml = "";
                var i;

                conteudoHtml = 'Tipo:' +
                    '<select class="custom-select mr-sm-2"name="tipoAnimal">' +
                    '<option value="estadoInvalido" selected disabled>Selecione o tipo do animal</option>"'

                for (i = 0; i < dados.data.length; i++) {
                    conteudoHtml = conteudoHtml + '<option value="' + dados.data[i].nomeTipo + '">' + dados.data[i].nomeTipo + '</option>'
                }
                conteudoHtml = conteudoHtml + '</select>';
                conteudo.innerHTML =  conteudoHtml;
                div.append(conteudo);
            
            }
        }
    });





});








function cadastraAnimal() {

    
    var requisicao = false;
    var formPost = document.formSignup;
    var input = {
        usuario_idUsuario: 0, // aprender como recuperar
        nome: formPost.nomeAnimal.value,
        idade: formPost.idadeAnimal.value,
        tipo: formPost.tipoAnimal.value,
        raca: formPost.racaAnimal.value,
        sexo: formPost.sexoAnimal.value,
        cor: formPost.corAnimal.value,
        situacao: formPost.situacaoAnimal.value,
        descricao: formPost.descricao.value
    };




    var ii;
    var dadosReq = new FormData();
    
  if (formPost.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        formPost.classList.add('was-validated');
        return 0;
    }

    for (i = 0; i < fotosID; i++) {
        if (formPost.fotos0[i].files[0]) {
            var arquivo0 = formPost.fotos0[i].files[0];
            console.log("size", formPost.fotos0[i].files[0].size);
            dadosReq.append("fotos0", arquivo0);
        }

    }
    dadosReq.append("usuario_idUsuario", 0);
    dadosReq.append("nome", formPost.nomeAnimal.value);
    dadosReq.append("idade", formPost.idadeAnimal.value);
    dadosReq.append("tipo", formPost.tipoAnimal.value);
    dadosReq.append("raca", formPost.racaAnimal.value);
    dadosReq.append("sexo", formPost.sexoAnimal.value);
    dadosReq.append("cor", formPost.corAnimal.value);
    dadosReq.append("situacao", formPost.situacaoAnimal.value);
    dadosReq.append("descricao", formPost.descricao.value);



 
  
    $.ajax({
        url: '/animal/cadastroAnimal',
        type: 'post',
        data: dadosReq,
        processData: false,
        contentType: false,
        error: function (dados) {
            alert('Erro1: ' + dados.data);
        },
        success: function (dados) {
            alert('OK: ' + dados.data);
        }
    });
}

var fotosID = 1;



function foto() {
    if (fotosID < 5) {
        var formulario = document.getElementById("fotosAba");

        var div = document.createElement('div');
        div.innerHTML = '<input type="file" name="fotos0" class="form-control-file" accept="image/*" >';
        var radio = div.firstChild;


        console.log(formulario);
        formulario.append(radio);
        fotosID++;

    }
    else {
        alert("Uploade maximo de 5 fotos");
    }

}

