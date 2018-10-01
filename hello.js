var http = require ("http");
// importar o arquivo util
var util = require("./util.js");

// criar conecao com sql
var mySQL = require("mysql");


// criar servidor web
http.createServer( function(request, response){
        response.writeHead(200,{'Content-type': 'text/plain'});
        console.log('teste');
        response.end('Hello World ' +  util.nomeFuncao());
    }
).listen(3600);
// normamlemnte em node porta 3600 (pode ser 8080,3300 qualquer uma que estiver livre)
// SEMPRE FAZER RETORNO DE JSON - response.json
// sempre que myudar precisa dar um restart no server
// se mudar um html css nao precisa MAS NO SERVIDO SIM !!!!!!!


//nodemon ele sozinho faz refresh -- npm -g nodemon

// criar banco de dados

var conMySQL = mySQL.createConnection({
    host: "esparta", // caminho
    port: 3306, // porta que esta conectado
    user: "patriciadados",
    password: "dados",
    database: "patricia" // nome da base de dados
});

var retornaDados = function(error, result){ // os dois parametros sao passados automaticamentes para a função 
    console.log(JSON.stringify(result));
}

// fazer consulta
var query = "SELECT * from pessoa";
conMySQL.query(query, retornaDados);
// retornaDados é uma função