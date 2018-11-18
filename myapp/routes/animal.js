var express = require('express');
var router = express.Router();


var multer = require('multer');
var sharp = require('sharp');


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
                            sharp(req.files[i].path).resize(500, 500).toFile('public/imgAnimal/thumb/' + req.files[i].filename, function (err) {
                                if (err) {
                                    res.json({ status: 'ERRO', data: "Impossivel fazer upload de foto" });
                                }
                                else {
                                    console.log("nome", req.body.nome);
                                }
                            })
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
                console.log(rows);
               
                        res.json({ status: 'OK', data: rows});
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
    console.log(id);
    req.getConnection(function (err, connection) {
        var query = connection.query('SELECT * FROM animal WHERE idAnimal= ?', id, function (err, rows) {
            if (err){
                res.json({ status: 'ERROR', data: + err });
            }
            else if(rows == undefined || rows == "" ){
                res.json({ status: 'ERROR', data: + err });

            }
            else{
                var query = connection.query('SELECT urlImg FROM imagemAnimal WHERE  animal_idAnimal= ?', id, function (err2, rows2) {
                    if (err2){
                        res.json({ status: 'ERROR', data: + err });
                    }
                    else{
                        
                        res.json({ status: 'OK', data: rows, img: rows2 });
                        
                    }
                });
            }
        });
        if (err){
            res.json({ status: 'ERROR', data: + err });
        }
            
    });
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