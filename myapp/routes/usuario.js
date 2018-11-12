var express = require('express');
var router = express.Router();

router.post('/cadastraUsuario', function (req, res, next) {
  var input = req.body;
  console.log(input);
  req.getConnection(function (err, connection) {
    var query = connection.query("INSERT INTO usuario SET ?", input, function (err, rows) {
      if (err) {
        res.json({   status: 'ERRO', data: +err });
        console.log("Erro ao cadastrar o usuario!!!!")
      }
      else res.json({ status: 'OK', data: 'Incluido com sucesso!' });
    })
  });
});

module.exports = router;
