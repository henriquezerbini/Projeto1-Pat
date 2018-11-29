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
    if (form.confirmPassword.value === form.password.value) {
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
                else if(dados.status === 'USERUSADO')
                {
                    alert('O usuario fornecido ja esta em uso!!!');
                }
                else if(dados.status === 'EMAILUSADO')
                {
                    alert('O email fornecido ja esta em uso!!!');
                }
                else {
                    alert("Cadastro foi feito com sucesso!!!!");
                    window.location.href = '/index.html';
                }
            }
        });
    }
    else{
        alert("As senhas fornecidas nao sao iguais!!!");
    }
}

