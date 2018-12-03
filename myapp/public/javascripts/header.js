$(document).ready(function () {
    $.ajax({
        url: '/usuario/logado',
        dataType: 'json',
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            var login = document.getElementById("loginBar")
            if (login != null) {
                if (dados.status === 'SEMACESSO') {
                    login.innerHTML = '<a href="/login.html" class="text-white">Login</a> | <a href="/signup.html" class="text-white">Cadastro</a>'

                }
                else {
                    login.innerHTML = '<a href="#" class="text-white" onclick="logoutJS();">Logout</a> | <a href="/logado.html" class="text-white">Minha Conta</a> ';
                }

            }
        }
    });
});

