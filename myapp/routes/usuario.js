var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sitebuddy.mail@gmail.com',
    pass: 'jarubrocha'
  }
});


/*-------------------------------------------------------
                    CADASTRO
--------------------------------------------------------*/
router.post('/cadastraUsuario', function (req, res, next) {
    var input = req.body;
    console.log(input);
    req.getConnection(function (err0, connection) {
        connection.query("SELECT * FROM usuario WHERE user = ?", input.user, function (err, rows) {
            if (err) {
                res.json({ status: 'ERRO', data: + err });
            }
            else if (rows[0] === undefined) { //Quer dizer que o user esta disponivel
                var query = connection.query("SELECT * FROM usuario WHERE email = ?", input.email, function (err2, rows2) {
                    if (err2) {
                        res.json({ status: 'ERRO', data: +err2 });
                        console.log("Erro ao cadastrar o usuario!!!");
                    }
                    else if (rows2[0] === undefined) {
                        var query = connection.query("INSERT INTO usuario SET ?", input, function (err3, rows3) {

                            if (err3) {
                                res.json({ status: 'ERRO', data: +err3 });
                                console.log("Erro ao cadastrar o usuario!!!!");
                            }
                            else {
                                var mailOptions = {
                                    from: 'sitebuddy.mail@gmail.com',
                                    to: input.email,
                                    subject: 'Cadastro no BUDDY!!!!!',
                                    text: 'Óla, ' + input.nome +'!!!!\n Bem vindo ao buddy '
                                  };
                                  transporter.sendMail(mailOptions, function(error, info){
                                    if (error) {
                                      console.log(error);
                                    } else {
                                      console.log('Email sent: ' + info.response);
                                    }
                                  });
                                  res.json({ status: 'OK', data: 'Incluido com sucesso!' });
                                  console.log("Usuario inserido com sucesso!!!");
                            }
                        });
                    }
                    else{
                        res.json({status:'EMAILUSADO', data:+err2});
                    }
                });
            }
            else {
                res.json({ status: 'USERUSADO', data: +err })
            }
        });
    });
});

/*--------------------------------------------
                    LOGIN
--------------------------------------------*/
router.post('/login', function (req, res, next) {
    console.log("teste");
    var input = req.body;
    console.log(input);
    req.getConnection(function (err, connection) {
        connection.query("SELECT * FROM usuario WHERE user = ? AND senha = ?", [input.login, input.senha], function (err, rows) {
            if (err) {
                console.log(input.login);
                console.log(input.senha);
                res.json({ status: 'ERRO', data: + err });
            }
            else {
                if (rows[0] === undefined) {
                    console.log("tese3");
                    res.json({
                        status: 'ERRO',
                        data: 'Dados de login incorretos!'
                    });
                }
                else {
                    console.log(rows[0]);
                    if(rows[0].privilegio == "Admin"){
                        req.session.admin = true;
                    }
                    else{
                        req.session.admin = false;
                    }
                    req.session.logado = true;                  
                    req.session.login = rows[0].idUsuario;
                    res.json({
                        status: 'OK', data: 'Logado com sucesso!'
                    });
                }
            }
        });
    });
});



router.get('/logado', function (req, res, next) {
    if (req.session.logado) {
        /*
        req.getConnection(function (err, connection) {
            connection.query("SELECT user FROM usuario WHERE idUsuario = ? ",req.session.login, function (err, rows) {
                if (err) {
                    res.json({ status: 'ERRO', data: + err });
                }
                else {
                        res.json({status: 'OK', data: rows});
                    }               
            });
        });*/
        res.json({status: 'OK', data: req.session.login});
       
    }
    else {
        
        res.json({ status: 'SEMACESSO', data: 'Usuário precisa estar logado!' });
    }
});

router.post('/logout', function (req, res, next) {
    req.session.destroy(function (err) {
        if (err)
            res.json({ status: 'ERRO', data: + err });
        else
            res.json({ status: 'OK', data: 'Logout com sucesso!' });
    });
});


router.get('/qtdsIntencoes', function (req, res, next) {
    var qtd1, qtd2, qtd3
    req.getConnection(function (err, connection) {
        connection.query("SELECT COUNT(animal_idAnimal) as qtd FROM intencaoAdocao WHERE usuario_idUsuario = ? AND situacaoAdocao = 'E' ",req.session.login, function (err, rows) {
            if (err) {
                res.json({ status: 'ERRO', data: + err });
            }
            else {
                if (rows[0] === undefined) {
                   qtd1 =-1
                }
                else {
                    qtd1 =   rows[0].qtd;
                }
                connection.query("SELECT COUNT(animal_idAnimal) as qtd FROM intencaoAdocao WHERE usuario_idUsuario = ? AND situacaoAdocao = 'A'",req.session.login, function (err, rows2) {
                    if (err) {
                        //console.log(err);
                        res.json({ status: 'ERRO', data: + err });
                    }
                    else {
                        if (rows2[0] === undefined) {
                            qtd2 = -1
                        }
                        else {
                            qtd2 =   rows2[0].qtd;
                        }
                        connection.query("SELECT COUNT(animal_idAnimal) as qtd FROM intencaoAdocao, animal WHERE idAnimal = animal_idAnimal AND animal.usuario_idUsuario = ? AND situacaoAdocao = 'E'",req.session.login, function (err, rows3) {
                            if (err) {
                                //console.log(err);
                                res.json({ status: 'ERRO', data: + err });
                            }
                            else {
                                if (rows3[0] === undefined) {
                                    qtd3 = -1
                                }
                                else {
                                    //console.log(rows);
                                    qtd3 =   rows3[0].qtd;
                                }
                                res.json({ status: 'OK', qtd1:  qtd1, qtd2:qtd2, qtd3:qtd3 });
                            }
                        });
                    }

                });

            }
        });
    });

});



router.get('/listaIntencoesFeitas', function (req, res, next) {
    var situacao = req.query.situacao
    if(situacao == undefined){
        situacao = "";
    }
    else{
        situacao = "AND situacaoAdocao = '" + situacao + "'";
    }
    req.getConnection(function (err, connection) {
        connection.query("SELECT * FROM animal, imagemAnimal, intencaoAdocao WHERE idAnimal = imagemAnimal.animal_idAnimal AND idAnimal = intencaoAdocao.animal_idAnimal AND intencaoAdocao.usuario_idUsuario = ? "+ situacao + " GROUP BY idAnimal ORDER BY dataDeCadastro DESC ",req.session.login, function (err, rows) {
            if (err) {
                console.log(err);
                res.json({ status: 'ERROR', data: + err });
            }
            else {
                if (rows[0] === undefined) {
                    res.json({status: 'ERROR',data: "Nenhuma Intenção Feita" });
                }
                else {
                    //console.log(rows);
                    res.json({status: 'OK', data: rows});
                }
            }
        });
    });
});



router.get('/listaIntencoesRecebidas', function (req, res, next) {
    var situacao = req.query.situacao
    if(situacao == undefined){
        situacao = "";
    }
    else{
        situacao = "AND situacaoAdocao = '" + situacao + "'";
    }
    req.getConnection(function (err, connection) {
        connection.query("SELECT * FROM animal, imagemAnimal, intencaoAdocao WHERE idAnimal = imagemAnimal.animal_idAnimal AND idAnimal = intencaoAdocao.animal_idAnimal AND animal.usuario_idUsuario = ? "+ situacao + " GROUP BY idAnimal ORDER BY dataDeCadastro DESC ",req.session.login, function (err, rows) {
            if (err) {
                console.log(err);
                res.json({ status: 'ERROR', data: + err });
            }
            else {
                if (rows[0] === undefined) {
                    res.json({status: 'ERROR',data: "Nenhuma Intenção Feita" });
                }
                else {
                    //console.log(rows);
                    res.json({status: 'OK', data: rows});
                }
            }
        });
    });
});



/*----------------------------------------------------------*/
module.exports = router;
