var crypto = require('crypto');

function usuariosDAO(connection){
    this._connection = connection();//adicionamos a conexão como uma propriedade da 'classe'
}

usuariosDAO.prototype.inserirUsuario = function(usuario){
    this._connection.open(function(err,mongoclient){
        mongoclient.collection("usuarios", function(err, collection){
            usuario.senha = crypto.createHash("md5").update(usuario.senha).digest("hex");//criptografa uma informação, espera o método de criptografia e o que deve ser criptografado
            collection.insert(usuario); //função de inserção de dados, bem simples
            mongoclient.close();//funciona quase como um acces, é bem sussa
        });// a função pede o parametro de collection que deve inserir e função de callback
    });//A função abre a conexão e pede uma função de callback
}

usuariosDAO.prototype.autenticar = function(usuario, req, res){
    this._connection.open(function(err,mongoclient){
        mongoclient.collection("usuarios", function(err, collection){
            usuario.senha = crypto.createHash("md5").update(usuario.senha).digest("hex");
            collection.find(usuario).toArray(function(err,result){
                if(result[0] != undefined){ //verifica se achou alguem com o loguin
                    req.session.autorizado = true; //vai abrir a variável de sessão chamada autorizado, todos sabemos o que a sessão faz kj
                    req.session.usuario = result[0].usuario;
                    req.session.casa = result[0].casa;
                    res.redirect("jogo");
                }else{
                    res.render("index",{validacao: [{param: 'login', msg: 'Usuário não foi encontrado', value: ''}], dadosForm: req.body})
                }
            }); //função para procurar, não foi necessário escrever tudo que deveria ser procurado, pois temos os mesmos parâtros no json, full kj / o .toArray transforma os itens encontrados em um array  
            mongoclient.close();//funciona quase como um acces, é bem sussa
        });// a função pede o parametro de collection que deve inserir e função de callback
    });//A função abre a conexão e pede uma função de callback
}

module.exports = function(){
    return usuariosDAO;
}