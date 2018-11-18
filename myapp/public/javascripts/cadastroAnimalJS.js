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
    for(i=0;i<fotosID;i++){
        if(formPost.fotos0[i].files[0]){
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

    

    alert("sss");
    if (formPost.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        formPost.classList.add('was-validated');
        return 0;
      }
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

var fotosID =1;



function foto(){
    if(fotosID<5){
    var formulario = document.getElementById("fotosAba");

    var div= document.createElement('div');
div.innerHTML= '<input type="file" name="fotos0" class="form-control-file" accept="image/*" >';
var radio= div.firstChild;


    console.log(formulario);
    formulario.append(radio);
    fotosID++;

    }
    else{
        alert("Uploade maximo de 5 fotos");
    }
    
}

