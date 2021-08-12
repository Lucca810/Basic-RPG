module.exports.jogo = function(app,req,res){
    if(req.session.autorizado != true){
        res.render("index",{validacao: [{param: 'login', msg: 'Não pode acessar sem estar logado, faça login', value: ''}], dadosForm: {}})
        return;    
    }

    var msg = '';
    if(req.query.msg != ''){
        msg = req.query.msg;
    }

    var usuario = req.session.usuario;
    var casa = req.session.casa;

    var connection = app.config.conexao;
    var jogoDAO = new app.app.models.jogoDAO(connection);
    jogoDAO.iniciaJogo(usuario, casa, res, msg);

}

module.exports.sair = function(app,req,res){
    req.session.destroy(function(err){
        res.render('index',{validacao: {}, dadosForm: {}});
    });
}

module.exports.suditos = function(app,req,res){
    if(req.session.autorizado != true){
        res.render("index",{validacao: [{param: 'login', msg: 'Não pode acessar sem estar logado, faça login', value: ''}], dadosForm: {}})
        return;    
    }
    res.render('aldeoes');
}

module.exports.pergaminhos = function(app,req,res){
    if(req.session.autorizado != true){
        res.render("index",{validacao: [{param: 'login', msg: 'Não pode acessar sem estar logado, faça login', value: ''}], dadosForm: {}})
        return;    
    }

    var connection = app.config.conexao;
    var jogoDAO = new app.app.models.jogoDAO(connection);

    var usuario = req.session.usuario;

    jogoDAO.getAcoes(usuario,res);
}

module.exports.ordenar_acao_sudito = function(app,req,res){
    if(req.session.autorizado != true){
        res.render("index",{validacao: [{param: 'login', msg: 'Não pode acessar sem estar logado, faça login', value: ''}], dadosForm: {}})
        return;    
    }
    var dadosForm = req.body;

    req.assert('acao','A ação deve ser informada').notEmpty();
    req.assert('quantidade','A quantidade deve ser informada').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.redirect('jogo?msg=a');
        return;
    }

    var connection = app.config.conexao;
    var jogoDAO = new app.app.models.jogoDAO(connection);

    dadosForm.usuario = req.session.usuario;
    jogoDAO.acao(dadosForm);

    res.redirect('jogo?msg=b');
}

module.exports.revogar_acao = function(app,req,res){
    var urlQuery = req.query;
    var _id = urlQuery.id_acao;

    var connection = app.config.conexao;
    var jogoDAO = new app.app.models.jogoDAO(connection);

    jogoDAO.revogarAcao(_id,res);
}