var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/cadastraCliente', function (req, res, next) {
  var input = req.body;
  req.getConnection(function (err, connection) {
    var query = connection.query("INSERT INTO cliente SET ?", input, function (err, rows) {
      if (err) res.json({ status: 'ERRO', data: +err });
      else res.json({ status: 'OK', data: 'Incluido com sucesso!' });
    })
  });
});

module.exports = router;
