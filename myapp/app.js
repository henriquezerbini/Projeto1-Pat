/*-----------------------------------------------------------------
                        Importa Módulos
-----------------------------------------------------------------*/
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressSession = require('express-session');
var sqliteStore = require('connect-sqlite3')(expressSession);
var connection = require('express-myconnection');
var mysql = require('mysql');


var app = express();

/*----------------------------------------------------------------
                      Engine Setup
----------------------------------------------------------------*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/*----------------------------------------------------------------
                        Criar Session
-----------------------------------------------------------------*/
app.use(expressSession({
  store: new sqliteStore,
  secret: 'X87sZ34', // informa a chave criptografica da sua session
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 semana
}));

/*----------------------------------------------------------------
                    Criar conexao com o BD
----------------------------------------------------------------*/
app.use(
  connection(mysql, {
    host: 'sql10.freemysqlhosting.net'
    , //servidor do banco mysql, se for local: localhost,
    user: 'sql10268154'
    , //usuario com permissao de conexao a base de dados
    password: '8emjZraSTD'
    , //senha de acesso ao banco
    port: 3306, //porta do mysql, normalmente 3306
    database: 'sql10268154' //nome da base de dados (esquema)
  }, 'pool')
);
/*----------------------------------------------------------------
                          Rotas
----------------------------------------------------------------*/
var animalRouter = require('./routes/animal');
app.use('/animal', animalRouter);

var usuarioRouter = require('./routes/usuario');
app.use('/usuario', usuarioRouter);



/*--------------------------------------------------------------*/
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/*---------------------------------------------------------------*/
module.exports = app;
