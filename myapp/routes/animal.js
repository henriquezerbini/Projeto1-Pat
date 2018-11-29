var express = require('express');
var router = express.Router();


var multer = require('multer');
//var sharp = require('sharp');


var storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'public/imgAnimal/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

var upload = multer({ storage: storage }).array('fotos0', 5)


router.post('/cadastroAnimal', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            console.log("erro");
            res.json({ status: 'ERRO', data: "Impossivel fazer upload de foto" });
        }
        else {
            // conseguiu upar as fotos
            console.log("ok");
            console.log("REQQ", req.files);
            console.log("REQ", req.body);
            var i;
            console.log(req.files.length);

            var input = {
                usuario_idUsuario: req.session.login, // aprender como recuperar
                nome: req.body.nome,
                idade: req.body.idade,
                tipo: req.body.tipo,
                raca: req.body.raca,
                sexo: req.body.sexo,
                cor: req.body.cor,
                situacao: req.body.situacao,
                descricao: req.body.descricao
            };
            req.getConnection(function (err, connection) {
                var query = connection.query("INSERT INTO animal SET ?", input, function (err, rows) {

                    if (err) {
                        res.json({ status: 'ERRO', data: + err });
                        console.log("Erro ao cadastrar o animal!!!!");
                    }
                    else {
                        console.log("rows", rows);
                        var tam = req.files.length;
                        aniID = rows.insertId;

                        var sql = "INSERT INTO imagemAnimal  VALUES ?";
                        var values = new Array();
                        for (i = 0; i < tam; i++) {
                            var aux = [aniID, req.files[i].filename]
                            values.push(aux);
                            /*
                             sharp(req.files[i].path).resize(500, 500).toFile('public/imgAnimal/thumb/' + req.files[i].filename, function (err) {
                                 if (err) {
                                     res.json({ status: 'ERRO', data: "Impossivel fazer upload de foto" });
                                 }
                                 else {
                                     console.log("nome", req.body.nome);
                                 }
                             })
 
                            */
                        }

                        console.log(values);
                        connection.query(sql, [values], function (err, result) {
                            if (err) throw err;
                            console.log("Number of records inserted: " + result.affectedRows);
                        });


                        res.json({ status: 'OK', data: 'Incluido com sucesso!' });
                    }

                });
            })
        }
    });


})


router.get('/lista', function (req, res, next) {
    var qtd = req.query.qtd;
    var queryString = "SELECT DISTINCT `idAnimal`, `urlImg`,`usuario_idUsuario`, `nome`, `idade`, `raca`, `tipo`, `sexo`, `cor`, `situacao`, `descricao`, `dataDeCadastro` FROM `imagemAnimal`, `animal` WHERE `idAnimal` = `animal_idAnimal` GROUP BY `idAnimal`ORDER BY `dataDeCadastro` DESC LIMIT " + qtd;
    var sql = "SELECT * FROM `animal` ORDER BY `dataDeCadastro` DESC LIMIT " + qtd;
    var sql2 = "SELECT * FROM `imagemAnimal` JOIN (" + sql + ") sb ON `animal_idAnimal` IN (sb.idAnimal)"
    req.getConnection(function (err, connection) {
        var query = connection.query(queryString, function (err, rows) {
            if (err) {
                console.log("erro1")
                res.json({ status: 'ERROR', data: + err });
            }
            else {
                // console.log(rows);

                res.json({ status: 'OK', data: rows });
            }
        });
        if (err) {
            console.log("erro2")
            res.json({ status: 'ERROR', data: + err });
        }

    });

})

router.get('/animal', function (req, res, next) {
    var id = req.query.id;
    req.getConnection(function (err, connection) {
        var query = connection.query('SELECT * FROM animal WHERE idAnimal= ?', id, function (err, rows) {
            if (err) {
                res.json({ status: 'ERROR', data: + err });
            }
            else if (rows == undefined || rows == "") {
                res.json({ status: 'ERROR', data: + err });

            }
            else {
                var query = connection.query('SELECT urlImg FROM imagemAnimal WHERE animal_idAnimal= ?', id, function (err2, rows2) {
                    if (err2) {
                        res.json({ status: 'ERROR', data: + err });
                    }
                    else {

                        res.json({ status: 'OK', data: rows, img: rows2 });

                    }
                });
            }
        });
        if (err) {
            res.json({ status: 'ERROR', data: + err });
        }

    });
});


router.get('/tiposDefinidos', function (req, res, next) {
    var queryString = "SELECT nomeTipo FROM configTipo";
    req.getConnection(function (err, connection) {
        var query = connection.query(queryString, function (err, rows) {
            if (err) {
                console.log("erro1")
                res.json({ status: 'ERROR', data: + err });
            }
            else {
                console.log(rows);

                res.json({ status: 'OK', data: rows });
            }
        });
        if (err) {
            console.log("erro2")
            res.json({ status: 'ERROR', data: + err });
        }

    });

})

router.get('/listaCategorias', function (req, res, next) {
    var tipo = req.query.tipo;
    var sexo = req.query.sexo;
    var tipoString = "AND (";
    var sexoString = "AND (";
    var i;
    if (tipo != undefined) {
        if (Array.isArray(tipo)) {
            for (i = 0; i < tipo.length; i++) {
                tipoString = tipoString + "tipo = " + '"' + tipo[i] + '"';
                if (i != tipo.length - 1) {
                    tipoString = tipoString + " OR ";
                }

            }
            console.log(tipoString);

        }
        else {
            tipoString = tipoString + "tipo = " + '"' + tipo + '"';
            console.log(tipoString);
        }
        tipoString = tipoString + ")";

    }
    else {
        tipoString = "";
    }



    console.log(sexo, tipo);

    var queryString = "SELECT DISTINCT idAnimal, urlImg, usuario_idUsuario, nome, idade, raca, tipo, sexo, cor, situacao, descricao, dataDeCadastro FROM imagemAnimal, animal WHERE idAnimal = animal_idAnimal " +
        tipoString + " GROUP BY idAnimal ORDER BY dataDeCadastro DESC "
    console.log(queryString);
    req.getConnection(function (err, connection) {
        var query = connection.query(queryString, function (err, rows) {
            if (err) {
                console.log("erro1", err)
                res.json({ status: 'ERROR', data: + err });
            }
            else {
                console.log(rows);

                res.json({ status: 'OK', data: rows });
            }
        });
        if (err) {
            console.log("erro2")
            res.json({ status: 'ERROR', data: + err });
        }

    });

})




router.get('/listaAnimaisCategoria', function (req, res, next) {
    var qtd = req.query.qtd;
    var page = req.query.page;
    var queryString = "SELECT DISTINCT `idAnimal`, `urlImg`,`usuario_idUsuario`, `nome`, `idade`, `raca`, `tipo`, `sexo`, `cor`, `situacao`, `descricao`, `dataDeCadastro` FROM `imagemAnimal`, `animal` WHERE `idAnimal` = `animal_idAnimal` GROUP BY `idAnimal`ORDER BY `dataDeCadastro` DESC LIMIT " + qtd;
    var sql = "SELECT * FROM `animal` ORDER BY `dataDeCadastro` DESC LIMIT " + qtd;
    var sql2 = "SELECT * FROM `imagemAnimal` JOIN (" + sql + ") sb ON `animal_idAnimal` IN (sb.idAnimal)"
    req.getConnection(function (err, connection) {
        var query = connection.query(queryString, function (err, rows) {
            if (err) {
                console.log("erro1")
                res.json({ status: 'ERROR', data: + err });
            }
            else {
                //console.log(rows);

                res.json({ status: 'OK', data: rows });
            }
        });
        if (err) {
            console.log("erro2")
            res.json({ status: 'ERROR', data: + err });
        }

    });

})



router.post('/intencao', function (req, res, next) {
    console.log(req.body, req.session.login);
    if (req.session.logado) {
        var inputInser = {
            usuario_idUsuario: req.session.login,
            animal_idAnimal: req.body.idAnimal,
            situacaoAdocao: "E"
        };
        req.getConnection(function (err, connection) {
            var query = connection.query('SELECT * FROM `intenção de adoção` WHERE usuario_idUsuario = ? AND animal_idAnimal = ?', [inputInser.usuario_idUsuario, inputInser.animal_idAnimal], function (err, rows) {
                if (err) {
                    console.log("deu erro");
                    res.json({ status: 'ERROR', data: + err2 });
                }
                else if (rows[0] === undefined) {
                    console.log("deu certo");
                    var query = connection.query('INSERT INTO  `intenção de adoção` SET ?', inputInser, function (err2, rows2) {
                        if (err2) {
                            console.log("deu ero");
                            res.json({ status: 'ERROR', data: + err2 });
                        }
                        else {
                            console.log("deu certo");
                            res.json({ status: 'OK', data: "Intenção realizada com sucesso" });
                        }
                    });

                }
                else {
                    console.log("ja fez")
                    res.json({ status: 'ERROR', data: "Ja fez essa intenção" });
                }
            });



        });
    }
    else {
        res.json({ status: 'SEMACESSO', data: 'Usuário precisa estar logado!' });
    }

})


router.get('/animal2', function (req, res, next) {
    var qtd = req.query.qtd;
    var page = req.query.page;
    var sexo = req.query.sexo;
    var tipo = req.query.tipo;
    var tipoString;
    var urgente = req.query.urgente;
    console.log(tipo.length);
    if(qtd === undefined){
        qtd = 12;
    }
    if(page === undefined){
        page = 1;
    }
    if(sexo === undefined){
        sexo = ['M','F'];
    }
    if(urgente === undefined){
        urgente = "['True','False']";
    }
    if(tipo === undefined){
        tipoString = "";
    }
    else{
        tipoString = " AND (";
        if(Array.isArray(tipo))
        {
            var i=0;
            for(i=0;i<tipo.length;i++){
                tipoString = tipoString + "tipo = '" + tipo[i] + "'";
                if(i+1 != tipo.length){
                    tipoString = tipoString + " OR ";
                }
            }
        }
        else{
            tipoString = tipoString + "tipo = '" + tipo + "'";
        }
        tipoString = tipoString + ")";
    }

    req.getConnection(function (err, connection) {
        var query = connection.query('SELECT * FROM animal where sexo IN (?)'+tipoString+' ORDER BY dataDeCadastro DESC LIMIT '+qtd+' OFFSET '+(qtd*(page-1)),[sexo] , function (err, rows) {
            if (err) {
                console.log("erro1")
                console.log(err);
                res.json({ status: 'ERROR', data: + err });
            }
            else {
                console.log(rows);

                res.json({ status: 'OK', data: rows });
            }
        });
        if (err) {
            console.log("erro2")
            res.json({ status: 'ERROR', data: + err });
        }

    });


})




module.exports = router;



/* for(i=0;i<req.files.length;i++){
                console.log("REQ2323", req.files[i].path);
                sharp(req.files[i].path).resize(500, 500).toFile('public/imgAnimal/thumb/' + Date.now() + '-' + req.files[i].originalname,function(err){
                    if(err){
                        res.json({ status: 'ERRO', data: "Impossivel fazer upload de foto" });
                    }
                    else{
                        console.log("nome", req.body.nome);
                    }
                })
            }*/