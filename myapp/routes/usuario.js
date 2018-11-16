var express = require('express');
var formidable = require('formidable');
var fs = require('fs');

var router = express.Router();
/*------------------------------------------------------
                UPLOAD IMG
------------------------------------------------------*/
router.post('/upload', function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.fileToUpload.path;
        var newpath = __basedir + "/public/images/uploads/userImages/"+ files.fileToUpload.name;
        console.log(newpath);
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.write('File uploaded and moved!');
            res.end();
        });
    });
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

                                res.json({ status: 'OK', data: 'Incluido com sucesso!' });
                                console.log("Usuario inserido com sucesso!!!");
                            }
                        });
                    }
                    else {
                        res.json({ status: 'EMAILUSADO', data: +err2 });
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
    console.log("test2e");
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
                    console.log("kkk");
                    req.session.logado = true;
                    req.session.admin = true;
                    req.session.login = input.login;
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
