const express = require('express');
const app = express();

app.get('/', (req, res) => {
    let obj = req.query;
    return res.send({message: `Método GET respondendo, enviando o nome ${obj.nome} e idade ${obj.idade}`});
});

app.post('/', (req, res) => {
    return res.send({message: 'Método POST respondendo'})
});

app.listen(3000);

module.exports = app;