var express = require('express');
var router = express.Router();


var multer = require('multer');
// var sharp = require('sharp');


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
            //console.log("ok");
            //console.log("REQQ", req.files);
            // console.log("REQ", req.body);
            var i;
            //console.log(req.files.length);

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
                        // console.log("Erro ao cadastrar o animal!!!!");
                    }
                    else {
                        //  console.log("rows", rows);
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

                        //console.log(values);
                        connection.query(sql, [values], function (err, result) {
                            if (err) throw err;
                            // console.log("Number of records inserted: " + result.affectedRows);
                        });


                        res.json({ status: 'OK', data: 'Incluido com sucesso!' });
                    }

                });
            })
        }
    });


})



router.get('/animal', function (req, res, next) {
    var id = req.query.id;
    req.getConnection(function (err, connection) {
        var query = connection.query('SELECT idAnimal, usuario_idUsuario, animal.nome as nome, animal.idade as idade, raca, tipo, animal.sexo as sexo, cor, situacao, descricao, animal.dataDeCadastro as dataDeCadastro, cidade,estado, idUsuario, usuario.nome as nomeUsuario FROM animal, usuario WHERE usuario_idUsuario = idUsuario AND idAnimal= ?', id, function (err, rows) {
            if (err) {
                res.json({ status: 'ERROR', data: + err });
            }
            else if (rows == undefined || rows == "") {
                res.json({ status: 'ERROR', data: "Nao Existe esse Animal" });

            }
            else {
                var query = connection.query('SELECT urlImg FROM imagemAnimal WHERE animal_idAnimal= ?', id, function (err2, rows2) {
                    if (err2) {
                        res.json({ status: 'ERROR', data: + err2 });
                    }
                    else {
                        {
                            var query = connection.query('SELECT * FROM intencaoAdocao WHERE animal_idAnimal= ? AND situacaoAdocao = "F"', id, function (err3, rows3) {
                                if (err3) {
                                    res.json({ status: 'ERROR', data: + err3 });
                                }
                                else if (rows3[0] === undefined) {
                                    if (req.session.logado) { // usuario logado verificar se ele tem alguma intenção de adotar o animal
                                        var query = connection.query("SELECT usuario.nome as nome, usuario.user as user, usuario.idUsuario as idUsuario,  situacaoAdocao from intencaoAdocao,animal,usuario where idAnimal = intencaoAdocao.animal_idAnimal AND  intencaoAdocao.usuario_idUsuario = idUsuario AND animal_idAnimal= ? AND  animal.usuario_idUsuario = ?  ", [id, req.session.login], function (err4, rows4) {
                                            if (err4) {
                                                console.log(err4)
                                                res.json({ status: 'ERROR', data: + err4 });
                                            }
                                            else if (rows4[0] === undefined) { //usuario anunciante do animal NAO receeu intenção precisa verificar se o usuario nao FEZ a intenção
                                                var query = connection.query("SELECT usuario.nome as nome, usuario.user as user, usuario.email as email,  situacaoAdocao from intencaoAdocao,animal,usuario where idAnimal = intencaoAdocao.animal_idAnimal AND  animal.usuario_idUsuario = idUsuario AND animal_idAnimal= ? AND  intencaoAdocao.usuario_idUsuario = ?  AND intencaoAdocao.situacaoAdocao = 'A' ", [id, req.session.login], function (err5, rows5) {
                                                    if (err5) {
                                                        console.log(err5)
                                                        res.json({ status: 'ERROR', data: + err5 });
                                                    }
                                                    else if (rows5[0] === undefined) { // usuario nao faz intencao e nem é seu animal
                                                        res.json({ status: 'OKNORMAL', data: rows, img: rows2 });
                                                    }
                                                    else { //usuario fez intencao nesse animal
                                                        //console.log(rows);
                                                        res.json({ status: 'OKFEZINTENCAO', data: rows, img: rows2, dadosIntencao: rows5 });
                                                    }
                                                });
                                            }
                                            else { //usuario anunciante do animal receeu intenção
                                                //console.log(rows);
                                                res.json({ status: 'OKTEMINTENCAOSEUANIMAL', data: rows, img: rows2, dadosIntencao: rows4 });
                                            }
                                        });
                                    }
                                    else { // o usuario nao esta logado
                                        res.json({ status: 'OKNORMAL', data: rows, img: rows2 });
                                    }

                                }
                                else { // esta  finalizado
                                    res.json({ status: 'OKFINALIZADO', data: rows, img: rows2 });
                                }
                            });
                        }


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
        connection.query(queryString, function (err, rows) {
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

router.post('/intencao', function (req, res, next) {
    console.log(req.body, req.session.login);
    if (req.session.logado) {
        var inputInser = {
            usuario_idUsuario: req.session.login,
            animal_idAnimal: req.body.idAnimal,
            situacaoAdocao: "E"
        };
        req.getConnection(function (err, connection) {
            var query = connection.query('SELECT * FROM intencaoAdocao WHERE usuario_idUsuario = ? AND animal_idAnimal = ?', [inputInser.usuario_idUsuario, inputInser.animal_idAnimal], function (err, rows) {
                if (err) {
                    console.log("deu erro");
                    res.json({ status: 'ERROR', data: + err });
                }
                else if (rows[0] === undefined) {
                    console.log("deu certo");
                    var query = connection.query('INSERT INTO  intencaoAdocao SET ?', inputInser, function (err2, rows2) {
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
    var id = req.query.id
    var estado = req.query.estado
    var qtd = req.query.qtd;
    var page = req.query.page;
    var sexo = req.query.sexo;
    var tipo = req.query.tipo;
    var tipoString;
    var urgente = req.query.urgente;
    console.log(req.query);


    if (estado === undefined) {
        estado = "";
    }
    else if (estado === "todos") {
        estado = "";
    }
    else {
        estado = "AND estado = '" + estado + "'";
    }


    if (id === undefined) {
        id = "";
    }
    else if (id === "admin") {
        id = "AND usuario_idUsuario = " + req.session.login;
    }
    else {
        id = "AND usuario_idUsuario = " + id;
    }

    if (qtd === undefined) {
        qtd = 12;
    }
    if (page === undefined) {
        page = 1;
    }
    if (sexo === undefined) {
        sexo = ['M', 'F'];
    }
    if (urgente === undefined) {
        urgente = ['True', 'False'];
    }
    if (tipo === undefined) {
        tipoString = "";
    }
    else {
        tipoString = " AND (";
        if (Array.isArray(tipo)) {
            var i = 0;
            for (i = 0; i < tipo.length; i++) {
                tipoString = tipoString + "tipo = '" + tipo[i] + "'";
                if (i + 1 != tipo.length) {
                    tipoString = tipoString + " OR ";
                }
            }
        }
        else {
            tipoString = tipoString + "tipo = '" + tipo + "'";
        }
        tipoString = tipoString + ")";
    }

    req.getConnection(function (err, connection) {
        var query = connection.query('SELECT cidade, estado, animal.nome as nome, idAnimal ,animal.idade as idade, animal.tipo as tipo, animal.situacao as situacao, urlImg FROM animal,imagemAnimal, usuario where idAnimal = animal_idAnimal AND usuario_idUsuario = idUsuario ' + estado + ' AND sexo IN (?) AND situacao IN (?) ' + tipoString + ' ' + id + ' GROUP BY idAnimal ORDER BY animal.dataDeCadastro DESC LIMIT ' + qtd + ' OFFSET ' + (qtd * (page - 1)), [sexo, urgente], function (err, rows) {
            if (err) {
                //console.log("erro1")
                console.log(err);
                res.json({ status: 'ERROR', data: + err });
            }
            else {
                var query = connection.query('SELECT COUNT(*) as qtd FROM animal,imagemAnimal, usuario where idAnimal = animal_idAnimal AND usuario_idUsuario = idUsuario ' + estado + ' AND sexo IN (?) AND situacao IN (?) ' + tipoString + ' ' + id + ' GROUP BY idAnimal ORDER BY animal.dataDeCadastro DESC', [sexo, urgente], function (err2, rows2) {
                    if (err2) {
                        //console.log("erro1")
                        //console.log(err);
                        res.json({ status: 'ERROR', data: + err2 });
                    }
                    else {
                        //console.log(rows);

                        res.json({ status: 'OK', data: rows, qtd: rows2.length });
                    }
                });


            }
        });
        if (err) {
            // console.log("erro2")
            res.json({ status: 'ERROR', data: + err });
        }

    });


})


router.post('/finalizarAdocao', function (req, res, next) {
    if (req.session.logado) {
        var input = req.body;
        req.getConnection(function (err, connection) {
            connection.query("UPDATE intencaoAdocao SET situacaoAdocao = ? WHERE animal_idAnimal = ? AND usuario_idUsuario = ? ", [input.operacao, input.animal_idAnimal, input.usuario_idUsuario], function (err, rows) {
                if (err) {
                    console.log(err);
                    res.json({ status: 'ERROR', data: + err });
                }
                else {
                    connection.query("UPDATE intencaoAdocao SET situacaoAdocao = 'N' WHERE animal_idAnimal = ? AND usuario_idUsuario != ? ", [input.animal_idAnimal, input.usuario_idUsuario], function (err, rows) {
                        if (err) {
                            console.log(err);
                            res.json({ status: 'ERROR', data: + err });
                        }
                        else {
                            console.log(rows);
                            res.json({ status: 'OK', data: "Finalizado com sucesso!" });
                        }
                    });
                }
            });
        });

    }
    else {
        res.json({ status: 'SEMACESSO', data: 'Usuário precisa estar logado!' });
    }
});


router.post('/aprovarIntencao', function (req, res, next) {
    if (req.session.logado) {
        var input = req.body;
        req.getConnection(function (err, connection) {
            connection.query("UPDATE intencaoAdocao SET situacaoAdocao = ? WHERE animal_idAnimal = ? AND usuario_idUsuario = ? ", [input.operacao, input.animal_idAnimal, input.usuario_idUsuario], function (err, rows) {
                if (err) {
                    console.log(err);
                    res.json({ status: 'ERROR', data: + err });
                }
                else {
                    res.json({ status: 'OK', data: "Aprovado com sucesso!" });
                }
            });
        });

    }
    else {
        res.json({ status: 'SEMACESSO', data: 'Usuário precisa estar logado!' });
    }
});


router.get('/listaComentario', function (req, res, next) {
    console.log(req.query.idAnimalDestino);
    req.getConnection(function (err, connection) {
        connection.query('SELECT idComentario, comentario.idUsuario as idUsuario, idAnimalDestino, data,mensagem, resposta, nome, fotoPerfil FROM comentario,usuario WHERE comentario.idUsuario = usuario.idUsuario AND idAnimalDestino = ' + req.query.idAnimalDestino + ' ORDER BY idComentario DESC', function (err, rows) {
            if (err) {
                console.log(err);
                res.json({ status: 'ERROR', data: rows });
            }
            else {
                res.json({ status: 'OK', data: rows });
                console.log(rows);
            }
        });
        if (err) {
            res.json({ status: 'ERROR', data: err });
        }
    });
});
router.post('/fazerComentario', function (req, res, next) {
    input = {
        idUsuario: req.session.login,
        idAnimalDestino: req.body.idAnimalDestino,
        mensagem: req.body.mensagem
    }
    console.log(input);
    if (req.session.logado) {
        req.getConnection(function (err, connection) {

            connection.query('INSERT INTO comentario SET ?', input, function (err, rows) {
                if (err) {
                    res.json({ status: 'ERROR', data: 'Erro no insert' });
                    console.log('Erro ao inserir dados no sql');
                }
                else {
                    res.json({ status: 'OK', data: +rows });
                    console.log('Sucesso');
                }
            });
        })
    }
    else {
        res.json({ status: 'SEMACESSO', data: 'Usuário precisa estar logado!' });
    }
});

router.post('/excluirComentario', function (req, res, next) {
    if (req.session.logado) {
        req.getConnection(function (err, connection) {
            if (err) {
                res.json({ status: 'ERROR', data: +err });
            }
            else {
                console.log(req.body.idAnimal);
                connection.query('SELECT * FROM comentario WHERE idComentario = ' + req.body.idComentario, function (err, rows0) {
                    if (err) {
                        console.log("entrouAqui");
                        res.json({ status: 'ERROR', data: +err });
                    }
                    else {
                        if (rows0[0].idUsuario === req.session.login) {
                            connection.query('DELETE FROM comentario WHERE idComentario = "' + req.body.idComentario + '"', function (err, rows) {
                                if (err) {
                                    res.json({ status: 'ERROR', data: +err });
                                }
                                else {
                                    res.json({ status: 'OK', data: rows });
                                }
                            });
                        }
                        else {
                            res.json({ status: 'SEMACESSO', data: "VOCE NAO EH O DONO DO COMENTARIO" });
                        }
                    }
                });
            }
        });
    }
    else {
        res.json({ status: "SEMACESSO", data: "VOCE PRECISA ESTAR LOGADO" });
    }
});

router.post('/respostaComentario', function (req, res, next) {
    if (req.session.logado) {
        req.getConnection(function (err, connection) {
            if (err) {
                res.json({ status: 'ERROR', data: +err });
            }
            else {
                console.log(req.body.idAnimal);
                connection.query('SELECT * FROM animal WHERE idAnimal = ' + req.body.idAnimal, function (err, rows0) {
                    if (err) {
                        console.log("entrouAqui");
                        res.json({ status: 'ERROR', data: +err });
                    }
                    else {
                        if (rows0[0].usuario_idUsuario === req.session.login) {
                            connection.query('UPDATE comentario SET resposta = "' + req.body.resposta + '" WHERE idComentario = "' + req.body.idComentario + '"', function (err, rows) {
                                if (err) {
                                    res.json({ status: 'ERROR', data: +err });
                                }
                                else {
                                    res.json({ status: 'OK', data: rows });
                                }
                            });
                        }
                        else {
                            res.json({ status: 'SEMACESSO', data: "VOCE NAO EH O DONO DO ANUNCIO DA ADOCAO" });
                        }
                    }
                });
            }
        });
    }
    else {
        res.json({ status: "SEMACESSO", data: "VOCE PRECISA ESTAR LOGADO" });
    }
});

router.post('/excluirResposta', function (req, res, next) {
    if (req.session.logado) {
        req.getConnection(function (err, connection) {
            if (err) {
                res.json({ status: 'ERROR', data: +err });
            }
            else {
                console.log(req.body.idAnimal);
                connection.query('SELECT * FROM comentario WHERE idComentario = ' + req.body.idComentario, function (err, rows0) {
                    if (err) {
                        console.log("entrouAqui");
                        res.json({ status: 'ERROR', data: +err });
                    }
                    else {
                        if (rows0[0].idUsuario === req.session.login) {
                            connection.query('UPDATE comentario SET resposta = NULL WHERE idComentario = "' + req.body.idComentario + '"', function (err, rows) {
                                if (err) {
                                    res.json({ status: 'ERROR', data: +err });
                                }
                                else {
                                    res.json({ status: 'OK', data: rows });
                                }
                            });
                        }
                        else {
                            res.json({ status: 'SEMACESSO', data: "VOCE NAO EH O DONO DO ANUNCIO DA ADOCAO" });
                        }
                    }
                });
            }
        });
    }
    else {
        res.json({ status: "SEMACESSO", data: "VOCE PRECISA ESTAR LOGADO" });
    }
});





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