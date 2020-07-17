const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.get('/', auth, (req, res) => {
    console.log(res.locals.auth_data); //informação do ID do usuário no BD que faz requisições
    return res.send({message: `Informação importante, usários não autorizados não devem receber`});
});

router.post('/', (req, res) => {
    return res.send({message: `Tudo ok com o método POST da raiz`});
});


module.exports = router;