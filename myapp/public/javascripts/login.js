function logar() {
    var form = document.formLogin;
    var input = {
        login: form.user.value,
        senha: form.senha.value
    };
    $.ajax({
        url: '/usuario/login',
        type: 'post',
        data: input,
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERRO') {
               // alert('Erro: ' + dados.data);
                $("#alertaLogin").addClass("show");
                $("#alertaLogin").removeClass("close");
            }
            else {
                window.location.href = '/logado.html';
            }
        }
    });
}

 $(document).ready(function () {
    $.ajax({
        url: '/usuario/logado',
        dataType: 'json',
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'SEMACESSO') {
               // alert('Erro: ' + dados.data);
            }
            else {
                window.location.href = '/index.html';
            }
        }
    });

});


