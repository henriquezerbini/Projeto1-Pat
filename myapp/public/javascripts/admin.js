$(document).ready(function () {
    $.ajax({
        url: '/usuario/logado',
        dataType: 'json',
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'SEMACESSO') {
                document.write("<br>");
                alert("Você precisa estar logado")
                window.location.href = '/login.html';
            }
            else{
                var aux = document.getElementById("animaisCad");
            aux.href = "lista.html?id="+dados.data;
            $.ajax({
                url: '/animal/animal2?id=admin&qtd=6',
                dataType: 'json',
                error: function (dados) {
                    alert('Erro1: ' + dados.data);
                },
                success: function (dados) {
                    if (dados.status === 'ERROR') {
                        alert('Erro2: ' + dados.data);
                      
                    }
                    else {
                  
                       // console.log(dados);
                       printarAnimaisSemUrgente("ultimosAnimais", dados, 6)
                    }
                }
            });
            }
            
        }
    });

    
    $.ajax({
        url: '/usuario/qtdsIntencoes',
        dataType: 'json',
        error: function (dados) {
            alert('Erro1: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERROR') {
                alert('Erro: ' + dados.data);
              
            }
            else {
                console.log(dados);
                document.getElementById("intencoesFeitas").innerHTML = dados.qtd1
                document.getElementById("intencoesFeitasAprovadas").innerHTML = dados.qtd2
                document.getElementById("intencoesRecebidas").innerHTML = dados.qtd3
            }
        }
    });



   


});



function showMenu(){
    var menu = document.getElementById("menuAdmin");
    var conteudo = document.getElementById("conteudoAdmin");
    if(menu.style.display ===  "none"){
        menu.style.display =  "block";
        conteudo.classList.add("col-md-9");

    }
    else{
        menu.style.display =  "none";
        conteudo.classList.remove("col-md-9");

    }
    

}