var mongo = require('mongodb');

var conMongoDB = function(){
    var db = new mongo.Db('got',new mongo.Server('localhost',27017,{}),{});

    /*
    Para iniciar uma conexão, usamos os paâmetros, consecutivamente, nome do banco de dados (nessa caso got), parâmetros de conexão do banco(nesse caso é o .server, passando o endereço do servidor, porta e opções adicionais de conexão (sendo um objeto)) e por fim um objeto de configuração adicional para o banco de dados se necessário
    */

    return db;
}

module.exports = function(){
    return conMongoDB; //isso evita a abertura desnecessária do banco
}