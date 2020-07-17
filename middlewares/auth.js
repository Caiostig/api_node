//Middleware criado para salvar token, quando o usuário fazer requisições que exigem autenticação
const jwt = require('jsonwebtoken');
const config = require('../config/config');


//função que verifica o envio/validade do token
const auth = (req, res, next) => {
    const token_header = req.headers.auth;
    if(!token_header) return res.status(401).send({ error: 'Token não enviado' });

    jwt.verify(token_header, 'senha123', (err, decoded) => {
        console.log('Verificação')
        console.log(decoded)
        console.log(err)
        if (err) return res.status(401).send({ error: 'Token inválido' });
        res.locals.auth_data = decoded; //variavel auth_data
        return next();
    })
}

module.exports = auth;