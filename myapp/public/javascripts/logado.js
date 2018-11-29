$(document).ready(function () {
    $.ajax({
        url: '/usuario/logado',
        dataType: 'json',
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'SEMACESSO') {
                var login = document.getElementById("loginBar");
                login.innerHTML = '<a href="/login.html" class="text-white">Login</a> | <a href="/signup.html" class="text-white">Cadastro</a>'
            }
            else {
                var login = document.getElementById("loginBar");
                login.innerHTML = '<a href="#" class="text-white" onclick="logoutJS();">Logout</a> | Ola ' + dados.data;         
            }
        }
    });
});
