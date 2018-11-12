function cadastraUsuario() {
    var form = document.formSignup;
    var input = {
        nome: form.nome.value,
        idade: form.idade.value,
        user: form.username.value,
        email: form.email.value,
        senha: form.password.value,
        bairro: form.bairro.value,
        cep: form.cep.value,
        cidade: form.cidade.value,
        estado: form.estado.value,
        pais: form.pais.value,
        privilegio: 'normal',
        fotoPerfil: '/jaru.png'
    };
    $.ajax({
        url: '/usuario/cadastraUsuario',
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
            else {
                alert("Cadastro foi feito com sucesso!!!!");
                window.location.href = '/index.html';
            }
        }
    });
}

