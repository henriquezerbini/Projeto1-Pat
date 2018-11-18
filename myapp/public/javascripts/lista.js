$(document).ready(function () {
    var param = new URLSearchParams(window.location.search);
    var urlAcao;
    var id = param.get('id')
    if (param.has('id')) { // alteração
       alert("ok");
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


                div.innerHTML = '<h2 class="float-left d-block"><i class="fas fa-paw mr-1"></i>'+ dados.data[0].nome +'</h2>' +
               '<div class=" clearfix"></div>'+
                '<div class="row no-gutters mt-2">'+
                    '<div class="col-md-4 col-12 ">'+
                       ' <div id="carouselExampleIndicators" class="animalBox carousel slide carousel-fade" data-ride="carousel">'+
                            '<ol class="carousel-indicators">'+
                               ' <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>'+
                            '</ol>'+
                            '<div class="carousel-inner">'+
                                '<div class="carousel-item active ">'+
                                    '<img class="d-block w-100" src="images/pp.jpg" alt="Primeiro Slide">'+
                                '</div>'+
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
                            '<b>Sexo: </b><span>Femea</span><br>'+
                            '<b>Idade: </b><span>80 anos</span><br>'+
                           ' <b>Tipo: </b><span>Cachorro</span><br>'+
                            '<b>Cor: </b><span>Preto</span><br>'+
                            '<b>Data: </b><span>18/11/2018</span><br>'+
                            '<b>Descrição: </b><span>'+ dados.data[0].descricao +'</span><br>'+
                            '<br>'+
                           ' <a href="#" class="tipoCategoria">Cachorro</a>'+
                           ' <button class="tipoCategoria botaoBottom"><i class="fas fa-heart heart"></i> Intenção de Adoção</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'
                console.log(div);
                painelAnimal.append(div)
            }
        }
    });

});