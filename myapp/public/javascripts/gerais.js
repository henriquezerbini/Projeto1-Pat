
function logoutJS() {
    $.ajax({
        url: '/usuario/logout',
        type: 'post',
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERRO') {
                // alert('Erro: ' + dados.data);
            }
            else {         
                window.location.href = '/login.html';
            }
        }
    });
}

function verificaAcesso(){
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
                return dados;
            }
        }
    });

}

function printarAnimais(id, dados, qtd) {
    var linha = 12 / qtd;
    //onsole.log(dados.data);
    var tam = dados.data.length;
    // console.log(tam);
    //listar produtos
    // ultimosAnimais
    var painelAnimal = document.getElementById(id);
    var div, i, sexo, tipo;
    for (i = 0; i < tam; i++) {
        if (dados.data[i].sexo == "M") {
            sexo = "Masculino";
        }
        else {
            sexo = "Feminino";
        }

        if (dados.data[i].tipo == "cachorro") {
            tipo = "tipoCachorro";
        }
        else if (dados.data[i].tipo == "gato") {
            tipo = "tipoGato";
        }
        else if (dados.data[i].tipo == "ave") {
            tipo = "tipoAves";
        }
        else {
            tipo = "tipoOutros";
        }
        var k;
        var urgente = '';
        //console.log(dados.data[i].situacao);
        if (dados.data[i].situacao == "true") {
            urgente = '<span class="tipoCategoria tipoUrgente">Urgente</span>';
        }


        div = document.createElement('div');
        div.innerHTML = '<div class="col-lg-' + linha + ' col-md-4 col-6">' +
            '<a href="/animal.html?id=' + dados.data[i].idAnimal + '">' +
            '<div class="animalBox">' +
            '<img src="imgAnimal/thumb/' + dados.data[i].urlImg + '">' +
            '<div class="animalBoxTexto">' +
            '<b>Sexo: </b><span>' + sexo + '</span><br>' +
            '<b>Idade: </b><span>' + dados.data[i].idade + ' anos</span><br>' +
            '<b>Estado: </b><span>' + dados.data[i].estado + '</span><br>' +
            '<span class="tipoCategoria ' + tipo + '">' + primeiraMaiuscula(dados.data[i].tipo) + '</span>' +
            urgente +
            '<span class="tipoCategoria float-right">+</span>' +
            ' </div>' +
            '</div>' +
            '</a>' +
            ' </div>'
        painelAnimal.append(div.firstChild)

    }

}

function primeiraMaiuscula(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function printarAnimaisSemUrgente(id, dados, qtd) {
    var linha = 12 / qtd;
    //onsole.log(dados.data);
    var tam = dados.data.length;
    // console.log(tam);
    //listar produtos
    // ultimosAnimais
    var painelAnimal = document.getElementById(id);
    var div, i, sexo, tipo;
    for (i = 0; i < tam; i++) {
        if (dados.data[i].sexo == "M") {
            sexo = "Masculino";
        }
        else {
            sexo = "Feminino";
        }

        if (dados.data[i].tipo == "cachorro") {
            tipo = "tipoCachorro";
        }
        else if (dados.data[i].tipo == "gato") {
            tipo = "tipoGato";
        }
        else if (dados.data[i].tipo == "ave") {
            tipo = "tipoAves";
        }
        else {
            tipo = "tipoOutros";
        }
        var k;
        var urgente = '';
        //console.log(dados.data[i].situacao);
        if (dados.data[i].situacao == "true") {
            urgente = '';
        }


        div = document.createElement('div');
        div.innerHTML = '<div class="col-lg-' + linha + ' col-md-4 col-6">' +
            '<a href="/animal.html?id=' + dados.data[i].idAnimal + '">' +
            '<div class="animalBox">' +
            '<img src="imgAnimal/thumb/' + dados.data[i].urlImg + '">' +
            '<div class="animalBoxTexto">' +
            '<b>Sexo: </b><span>' + sexo + '</span><br>' +
            '<b>Idade: </b><span>' + dados.data[i].idade + ' anos</span><br>' +
            '<b>Estado: </b><span>' + dados.data[i].estado + '</span><br>' +
            '<span class="tipoCategoria ' + tipo + '">' + primeiraMaiuscula(dados.data[i].tipo) + '</span>' +
            urgente +
            '<span class="tipoCategoria float-right">+</span>' +
            ' </div>' +
            '</div>' +
            '</a>' +
            ' </div>'
        painelAnimal.append(div.firstChild)

    }

}
