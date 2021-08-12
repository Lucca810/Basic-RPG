module.exports.index = function(app,req,res){
    res.render('index', {validacao:{}, dadosForm:{}});
}

module.exports.autenticar = function(app,req,res){

    var dadosForm = req.body;

    req.assert('usuario','Usuario não pdoe ser vazio').notEmpty();
    req.assert('senha','Senha não pode ser vazia').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.render('index', {validacao: erros, dadosForm: dadosForm});
        return;
    }

    var connection = app.config.conexao;
    var usuariosDAO = new app.app.models.usuariosDAO(connection);

    usuariosDAO.autenticar(dadosForm, req, res);

    //res.send('tudo certo');
}