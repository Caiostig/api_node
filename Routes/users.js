const express = require('express');
const router = express.Router();
const Users = require('../model/user');
const bcrypt = require('bcrypt');


router.get('/', async (req, res) => {
    try {
        const users = await Users.find({});
        return res.send(users);
    }
    catch (err) {
        return res.send({ error: 'Erro na consulta de usuários' });
    }
});

router.post('/create', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) return res.send({ error: 'Dados insuficientes' }); //tentar criar usuário sem e-mail/senha

    try {
        if (await Users.findOne({ email })) return res.send({ error: 'Usuário já foi registrado '}); //valida se o e-mail ja existe

        const user = await Users.create(req.body);
        user.password = undefined;
        return res.send(user);
    }
    catch (err) {
        return res.send( {error: 'Erro ao buscar usuário' }); //valida erro na busca do email
    }
});

    //endpoint de autenticação
router.post('/auth', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.send({ error: 'Dados insuficientes!' });

    try {
        const user = await Users.findOne({ email }).select('+password');
        if (!user) return res.send({ error: 'Usuário não registrado' });

        //vai criptografar a senha que o usuário envia, e comparar se é a mesma que foi criptografada do banco
        const pass_ok = await bcrypt.compare(password, user.password);

        if (!pass_ok) return res.send({ error: 'Erro ao autenticar usuário' });

        user.password = undefined; //não mostrar a senha criptografada no body do postman
        return res.send(user);
    }
    catch (err) {
        return res.send({ error: 'Erro ao buscar usuário' });
    }
});

module.exports = router;