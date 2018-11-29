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
                    console.log("teste3");
                    res.json({
                        status: 'ERRO',
                        data: 'Dados de login incorretos!'
                    });
                }
                else {
                    console.log(rows[0]);
                    req.session.logado = true;
                    req.session.admin = true;
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
        res.json({ status: 'OK', data: req.session.login });
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





/*----------------------------------------------------------*/
module.exports = router;
