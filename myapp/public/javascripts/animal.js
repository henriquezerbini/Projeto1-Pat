$(document).ready(function () {
    var param = new URLSearchParams(window.location.search);
    var urlAcao;
    var id = param.get('id')
    if (param.has('id')) { // alteração
        // ok
    }
    else {
        alert("Pagina invalida");
        return 0;
    }
    
    $.ajax({
        url: '/animal/animal?id='+id,
        dataType: 'json',
        error: function (dados) {
            alert('Erro: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERROR') {
                console.log("erro", dados.data);
            }
            else {
                console.log(dados.data, dados.img)
                var painelAnimal = document.getElementById("animalSingle");
                var  div = document.createElement('div');
                var liBotao = "";
                var divImg = ""
                var artigo;
                
                for(let i=0;i<dados.img.length;i++){
                    if(i==0){
                        divImg = divImg +  '<div class="carousel-item active ">'+
                        '<a href="#" onclick="imgGrande' + "('"  + dados.img[i].urlImg + "');" + '"><img class="d-block w-100" src="imgAnimal/thumb/'+ dados.img[i].urlImg +'" alt="Imagem'+ i +'"></a>'+
                    '</div>'
                   
                        liBotao = liBotao + '<li data-target="#carouselExampleIndicators" data-slide-to="'+ i +'" class="active"></li>';
                    }
                    else{
                        divImg = divImg +  '<div class="carousel-item ">'+
                        '<a href="#" onclick="imgGrande' + "('"  + dados.img[i].urlImg + "');" + '"><img class="d-block w-100" src="imgAnimal/thumb/'+ dados.img[i].urlImg +'" alt="Imagem'+ i +'"></a>'+
                    '</div>'
                   
                        liBotao = liBotao + '<li data-target="#carouselExampleIndicators" data-slide-to="'+ i +'"></li>';
                    }
                    
                }

                if(dados.data[0].sexo == "M"){
                    sexo = "Masculino";
                    artigo = "o";
                }
                else{
                    sexo = "Feminino";
                    artigo = "a";
                }
                document.title = "Buddy - Adote " + artigo + " "  + dados.data[0].nome;


                div.innerHTML = '<h2 class="float-left d-block"><i class="fas fa-paw mr-1"></i>'+ dados.data[0].nome +'</h2>' +
               '<div class=" clearfix"></div>'+
                '<div class="row no-gutters mt-2">'+
                    '<div class="col-md-4 col-12 ">'+
                       ' <div id="carouselExampleIndicators" class="animalBox carousel slide carousel-fade" data-ride="carousel">'+
                            '<ol class="carousel-indicators">'+ liBotao + 
                            '</ol>'+
                            '<div class="carousel-inner">'+ divImg +
                            '</div>'+
                            '<a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">'+
                                '<span class="carousel-control-prev-icon" aria-hidden="true"></span>'+
                                '<span class="sr-only">Anterior</span>'+
                            '</a>'+
                          '  <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">'+
                                '<span class="carousel-control-next-icon" aria-hidden="true"></span>'+
                               ' <span class="sr-only">Próximo</span>'+
                            '</a>'+
                        '</div>'+
                    '</div>'+
                   ' <div class="col-md-8 col-12">'+
                        '<div class="animalBoxTexto">'+
                            '<b>Sexo: </b><span>'+ sexo +'</span><br>'+
                            '<b>Idade: </b><span>'+ dados.data[0].idade +' anos</span><br>'+
                           ' <b>Tipo: </b><span>'+ dados.data[0].tipo +'</span><br>'+
                            '<b>Cor: </b><span>'+ dados.data[0].cor +'</span><br>'+
                            '<b>Data: </b><span>'+ dados.data[0].dataDeCadastro.split("T")[0] +'</span><br>'+
                            '<b>Descrição: </b><span>'+ dados.data[0].descricao +'</span><br>'+
                            '<br>'+
                           ' Veja mais: <a href="#" class="tipoCategoria">'+ dados.data[0].tipo +'</a>'+
                           '  <button class="tipoCategoria botaoBottom" onclick="intencaoAdotar('+ dados.data[0].idAnimal +');"><i class="fas fa-heart heart"></i> Intenção de Adoção</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'
                console.log(div);
                painelAnimal.append(div)
            }
        }
    });

});


function imgGrande(imgUrl){
    console.log(imgUrl);
    var imagem = document.getElementById("telaImgGrandeImagem");
    var tela = document.getElementById("telaImgGrande");

    imagem.src = "./imgAnimal/" + imgUrl;
    tela.style.display = "flex";

}

function esconderTela(){
    var tela = document.getElementById("telaImgGrande");
    tela.style.display = "none";

}

function intencaoAdotar(id){
    var confirma = confirm("Certeza que tem a intenção de adotar esse animalzinho?");
    if(confirma === false){
        return -1;
    }

    var input = {
        idAnimal: id
    };
    $.ajax({
        url: '/animal/intencao',
        type: 'post',
        data: input,
        error: function (dados) {
            alert('Erro1: ' + dados.data);
        },
        success: function (dados) {
            if (dados.status === 'ERROR') {
                alert('Erro: ' + dados.data);
              
            }
            else if (dados.status === 'SEMACESSO') {
                alert('Erro: ' + dados.data);
              
            }
            else {
                alert("Cadastro foi feito com sucesso!!!!");
            }
        }
    });


    console.log(id);

}