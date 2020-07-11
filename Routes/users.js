const express = require('express');
const router = express.Router();
const Users = require('../model/user');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    Users.find({}, (err, data) => {
        if (err) return res.send({ error: 'Erro na consulta de usuários' });
        return res.send(data);
    });
});

router.post('/create', (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) return res.send({ error: 'Dados insuficientes' }); //tentar criar usuário sem e-mail/senha

    Users.findOne({email}, (err, data) => {
        if (err) return res.send({ error: 'Erro ao buscar usuário' }); //valida erro na busca do email
        if (data) return res.send({ error: 'Usuário já registrado' }); //valida se o e-mail ja existe

        Users.create(req.body, (err, data) => {
            if (err) return res.send({ error: 'Erro ao criar usuário' }); //Valida erro na criação do usuário

            data.password = undefined;
            return res.send(data); //se passou por todos os if, o usuário é criado
        });
    });
});

//endpoint de autenticação
router.post('/auth', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.send({ error: 'Dados insuficientes!' });

    Users.findOne({email}, (err, data) => {
        if (err) return res.send({ error: 'Erro ao buscar usuário' });
        if (!data) return res.send({ error: 'Usuário não registrado' });

        //vai criptografar a senha que o usuário envia, e comparar se é a mesma que foi criptografada do banco
        bcrypt.compare(password, data.password, (err, same) => {
            if (!same) return res.send({ error: 'Erro ao autenticar usuário' });
 
            data.password = undefined //não mostrar a senha criptografada no body do postman
            return res.send(data);
        })
    }).select('+password') //está obrigando a mostrar o password para compação

});

module.exports = router;