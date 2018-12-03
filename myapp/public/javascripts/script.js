 $(document).ready(function () {
        $.ajax({
        url: '/animal/animal2?qtd=6',
        dataType: 'json',
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERRO'){
               // alert('Erro: ' + dados.data);
            }       
            else {
                printarAnimais("ultimosAnimais", dados, 6)
      
            }
        }
    });
    $.ajax({
        url: '/animal/animal2?qtd=6&urgente=true',
        dataType: 'json',
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERRO'){
               // alert('Erro: ' + dados.data);
            }       
            else {
                printarAnimais("ultimosUrgentes", dados, 6)
      
            }
        }
    });

    

});

function logoutJS(){
    $.ajax({
        url: '/usuario/logout',
        type: 'post',
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERRO'){
               // alert('Erro: ' + dados.data);
            }       
            else {
               // alert(dados.data);
                window.location.href = '/login.html';
            }
        }
    });
}


