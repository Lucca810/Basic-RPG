var ObjectID = require('mongodb').ObjectID;

function jogoDAO(connection){
    this._connection = connection();
}

jogoDAO.prototype.gerarParametros = function(usuario){
    this._connection.open(function(err,mongoclient){
        mongoclient.collection("jogo", function(err, collection){
            collection.insert({usuario: usuario,
                               moeda: 15,
                               suditos: 10,
                               temor: Math.floor(Math.random(0,1) * 1000),
                               sabedoria: Math.floor(Math.random(0,1) * 1000),
                               comercio: Math.floor(Math.random(0,1) * 1000),
                               magia: Math.floor(Math.random(0,1) * 1000)}); //função de inserção de dados, bem simples
            mongoclient.close();//funciona quase como um acces, é bem sussa
        });// a função pede o parametro de collection que deve inserir e função de callback
    });//A função abre a conexão e pede uma função de callback
}

jogoDAO.prototype.iniciaJogo = function(usuario, casa, res, msg){
    this._connection.open(function(err,mongoclient){
        mongoclient.collection("jogo", function(err, collection){
            collection.find({usuario: usuario}).toArray(function(err,result){
                res.render('jogo', {img_casa: casa,jogo: result[0],msg: msg});
            }); //função para procurar, não foi necessário escrever tudo que deveria ser procurado, pois temos os mesmos parâtros no json, full kj / o .toArray transforma os itens encontrados em um array  
            mongoclient.close();//funciona quase como um acces, é bem sussa
        });// a função pede o parametro de collection que deve inserir e função de callback
    });//A função abre a conexão e pede uma função de callback
}

jogoDAO.prototype.acao = function(acao){
    this._connection.open(function(err,mongoclient){
        mongoclient.collection("acao", function(err, collection){
            var date = new Date();
            var tempo = null;
            switch(parseInt(acao.acao)){
                case 1: tempo = 1 * 60 * 60000;break;
                case 2: tempo = 2 * 60 * 60000;break;
                case 3: tempo = 5 * 60 * 60000;break;
                case 4: tempo = 5 * 60 * 60000;break;
            }
            acao.termino = date.getTime() + tempo;
            collection.insert(acao); //função de inserção de dados, bem simples
        });// a função pede o parametro de collection que deve inserir e função de callback
        mongoclient.collection("jogo", function(err, collection){
            var moedas = null;
            switch(parseInt(acao.acao)){
                case 1: moedas = -2 * acao.quantidade;break;
                case 2: moedas = -3 * acao.quantidade;break;
                case 3: moedas = -1 * acao.quantidade;break;
                case 4: moedas = -1 * acao.quantidade;break;
            }
            collection.update({usuario: acao.usuario},{$inc:{moeda: moedas}});//a chave inc faz um incremento, ou seja coma o valor ao valor atual no bancoq
        });
        mongoclient.close();
    });

}

jogoDAO.prototype.getAcoes = function(usuario,res){
    var date = new Date();
    var momentoAtual = date.getTime();
    this._connection.open(function(err,mongoclient){
        mongoclient.collection("acao", function(err, collection){
            collection.find({usuario: usuario, termino: {$gt: momentoAtual}}).toArray(function(err,result){
                res.render('pergaminhos',{acoes: result});
            }); 
            mongoclient.close();
        });
    });
}

jogoDAO.prototype.revogarAcao = function(_id,res){
    var date = new Date();
    var momentoAtual = date.getTime();
    this._connection.open(function(err,mongoclient){
        mongoclient.collection("acao", function(err, collection){
            collection.remove({_id: ObjectID(_id)},function(err,result){
                res.redirect('jogo?msg=d');
            });
            mongoclient.close();
        });
    });
}

module.exports = function(){
    return jogoDAO;
}