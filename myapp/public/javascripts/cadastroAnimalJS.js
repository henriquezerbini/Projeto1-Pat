function cadastraAnimal() {
    var form = document.formSignup;
    var input = {
        usuario_idUsuario: 4, // aprender como recuperar
        nome: form.nomeAnimal.value,
        idade: form.idadeAnimal.value,
        tipo: form.tipoAnimal.value,
        raca: form.racaAnimal.value,
        sexo: form.sexoAnimal.value,
        cor: form.corAnimal.value,
        situacao: form.situacaoAnimal.value
    };
    console.log(input);
    $.ajax({
        url: '/animal/cadastroAnimal',
        type: 'post',
        data: input,
        error: function (dados) {
            alert('Erro1: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERRO') {
                alert('Erro2: ' + dados.data);
                $("#alertaLogin").addClass("show");
                $("#alertaLogin").removeClass("close");
            }
            else if(dados.status === 'SEMACESSO'){
                alert("Voce precisa estar logado para efetuar essa operacao!!!");
                window.location.href = '/login.html';
            }
            else {
                alert("Cadastro foi feito com sucesso!!!!");
                window.location.href = '/index.html';
            }
        }
    });
}
