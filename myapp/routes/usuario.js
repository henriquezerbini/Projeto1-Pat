var express = require('express');
var router = express.Router();

/*-------------------------------------------------------
                    CADASTRO
--------------------------------------------------------*/
router.post('/cadastraUsuario', function (req, res, next) {
  var input = req.body;
  console.log(input);
  req.getConnection(function (err, connection) {
    var query = connection.query("INSERT INTO usuario SET ?", input, function (err, rows) {

      if (err) {
        res.json({ status: 'ERRO', data: +err });
        console.log("Erro ao cadastrar o usuario!!!!");
      }
      else {

        res.json({ status: 'OK', data: 'Incluido com sucesso!' });
        console.log("Usuario inserido com sucesso!!!");
      }

    })
  });
});

/*--------------------------------------------
                    LOGIN
--------------------------------------------*/
router.post('/login', function(req, res, next) {
  console.log("test2e");
  var input = req.body;
  console.log(input);
  req.getConnection(function (err, connection) {
      connection.query("SELECT * FROM usuario WHERE user = ? AND senha = ?", [input.login , input.senha], function (err, rows) {
          if (err) {
              console.log(input.login);
              console.log(input.senha );
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
                      status: 'OK', data:'Logado com sucesso!'
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
