var http = require ("http");
// importar o arquivo util
var util = require("./util.js");


http.createServer( function(request, response){
        response.writeHead(200,{'Content-type': 'text/plain'});
        console.log('teste');
        response.end('Hello World ' +  util.nomeFuncao());
    }
).listen(3600);
// normamlemnte em node porta 3600 (pode ser 8080,3300 qualquer uma que estiver livre)

//sempre que myudar precisa dar um restart no server
// se mudar um html css nao precisa MAS NO SERVIDO SIM !!!!!!!
