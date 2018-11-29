 $(document).ready(function () {

    $.ajax({
        url: '/animal/lista?qtd=6',
        dataType: 'json',
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERROR') {
                console.log("erro", dados.data);
                     }
            else {
                console.log(dados.data);
                var tam = dados.data.length;
                console.log(tam);
                //listar produtos
                var painelAnimal = document.getElementById("ultimosAnimais");
                var div, i, sexo, tipo;
                for(i=0;i<tam;i++){
                    if(dados.data[i].sexo == "M"){
                        sexo = "Masculino";
                    }
                    else{
                        sexo = "Feminino";
                    }

                    if(dados.data[i].tipo == "Cachorro"){
                        tipo = "tipoCachorro";
                    }
                    else if(dados.data[i].tipo == "Gato"){
                        tipo = "tipoGato";
                    }
                    else if(dados.data[i].tipo == "Aves"){
                        tipo = "tipoAves";
                    }
                    else{
                        tipo = "tipoOutros";
                    }
                    var k;
                    var urgente = '';
                    console.log(dados.data[i].situacao);
                    if(dados.data[i].situacao == "true"){
                        urgente = '<span class="tipoCategoria tipoUrgente">Urgente</span>';
                    }

                    
                    div = document.createElement('div');
                    div.innerHTML = '<div class="col-lg-2 col-md-4 col-6">'+
                    '<a href="/animal.html?id='+ dados.data[i].idAnimal +'">'+
                        '<div class="animalBox">'+
                            '<img src="imgAnimal/thumb/'+dados.data[i].urlImg+'">'+
                            '<div class="animalBoxTexto">'+
                                '<b>Sexo: </b><span>'+ sexo +'</span><br>'+
                                '<b>Idade: </b><span>'+ dados.data[i].idade +' anos</span><br>'+
                                '<span class="tipoCategoria '+tipo+'">'+dados.data[i].tipo+'</span>'+
                                urgente +
                                '<span class="tipoCategoria float-right">+</span>'+
                           ' </div>'+
                        '</div>'+
                    '</a>'+
               ' </div>'
                    painelAnimal.append(div.firstChild)

                }
        

               }
        }
    });



        $.ajax({
        url: '/animal/animal2?tipo=Gato&tipo=Cachorro&qtd=1&page=3',
        dataType: 'json',
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERRO'){
               // alert('Erro: ' + dados.data);
            }       
            else {
      
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


