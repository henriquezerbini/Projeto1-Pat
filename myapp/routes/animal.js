var express = require('express');
var router = express.Router();

router.post('/cadastroAnimal', function (req, res, next) {
    if (req.session.logado) {
        var input = req.body;
        console.log(input);
        req.getConnection(function (err, connection) {
            var query = connection.query("INSERT INTO animal SET ?", input, function (err, rows) {

                if (err) {
                    res.json({ status: 'ERRO', data: +err });
                    console.log("Erro ao cadastrar o animal!!!!");
                }
                else {

                    res.json({ status: 'OK', data: 'Incluido com sucesso!' });
                    console.log("Animal inserido com sucesso!!!");
                }

            })
        });
    }
    else{
        res.json({ status: 'SEMACESSO', data: 'Usuário precisa estar logado!' });
    }
});


module.exports = router;
