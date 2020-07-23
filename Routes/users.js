const express = require('express');
const router = express.Router();
const Users = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const auth = require('../middlewares/auth');


//Função auxiliar
const createUserToken = (userId) => {
    return jwt.sign({ id: userId }, config.jwt_pass, { expiresIn: config.jwt_expires_in });
}

// /users está com autenticação, precisa logar e pegar o token
// http://localhost:3000/users/auth com um email e login no body, me passa token para login
router.get('/', auth, async (req, res) => {
    try {
        const users = await Users.find({}); //"Users" é o nome do Schema
        return res.send(users);
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro na consulta de usuários' });
    }
});

router.post('/create', async (req, res) => {
    const { email, password } = req.body;
    if(!email && !password) return res.status(400).send({ error: 'E-mail e password obrigatórios' }); //tentar criar usuário sem e-mail/senha
    if(!email || !password) return res.status(422).send({ error: 'Faltam informações para processar' }); //tentar criar usuário sem e-mail/senha

    try {
        if (await Users.findOne({ email })) return res.status(400).send({ error: 'Usuário já foi registrado '}); //valida se o e-mail ja existe

        const user = await Users.create(req.body);
        user.password = undefined;
        return res.status(201).send({ user, token: createUserToken(user.id) }); //envia o usuário e token no /create
    }
    catch (err) {
        return res.status(500).send( {error: 'Erro ao buscar usuário' }); //valida erro na busca do email
    }
});

//Delete usuário. Para deletar passo o token
router.delete('/delete', auth, async (req, res) => { //req é o que chega, res é o que manda
    const { _id, email } = req.body;
    if(!email && !_id) return res.status(400).send({ error: 'E-mail e id são obrigatórios para remover o usuário!' });
    if(!email || !_id) return res.status(422).send({ error: 'Faltam informações para processar a remoção do usuário!' }); //tentar remover usuário sem incluir e-mail/senha

    try {
        const user = await Users.deleteOne({_id, email}); //"Users" é o nome do Schema
        if(user.deletedCount > 0) {
            return res.status(200).send({ message: 'Usuário excluído com sucesso' }); //envia o usuário no /delete 
        }
        return res.status(404).send({ error: 'Usuário não existe' });
    }
    catch (err) {
        return res.status(500).send( {error: 'Erro ao remover usuário' }); //valida erro ao tentar deletar do usuário
    }
}); 

//Update, para alterar senha
//endpoint para update - http://localhost:3000/users/update
router.put('/update', async (req, res) => {
    const { email, password } = req.body;
    if(!email && !password) return res.status(400).send({ error: 'E-mail e password obrigatórios' }); //tentar atualizar usuário sem e-mail e senha
    if(!email || !password) return res.status(422).send({ error: 'Faltam informações para processar' }); //tentar atualizar usuário sem e-mail ou senha

    try {
        const pass =  await bcrypt.hash(password, 10) //criptografa a senha e joga na variável pass como string
        const user = await Users.findOneAndUpdate({email}, {$set: { password: pass }}) //recebe a senha criptografada e faz um update no banco
        return res.status(201).send({ user, token: createUserToken(user.id) }); //envia o usuário e token no /update
    }
    catch (err) {
        console.log(err)
        return res.status(500).send( {error: 'Erro ao atualizar usuário' }); //valida erro na atualização da senha
    }
});

//endpoint de autenticação
//endpoint para login - http://localhost:3000/users/auth
router.post('/auth', async (req, res) => {
    const { email, password } = req.body;
    if (!email && !password) return res.status(400).send({ error: 'E-mail e password são obrigatórios para autenticar o usuário!' });
    if (!email || !password) return res.status(422).send({ error: 'Faltam informações para autenticação!' });

    try {
        const user = await Users.findOne({ email }).select('+password');
        if (!user) return res.status(400).send({ error: 'Usuário não registrado' });

        //vai criptografar a senha que o usuário envia, e comparar se é a mesma que foi criptografada do banco
        const pass_ok = await bcrypt.compare(password, user.password);

        if (!pass_ok) return res.status(401).send({ error: 'Erro ao autenticar usuário' });

        user.password = undefined; //não mostrar a senha criptografada no body do postman
        return res.send({ user, token: createUserToken(user.id) });
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro ao buscar usuário' });
    }
});

module.exports = router;