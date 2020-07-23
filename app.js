const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()
const config = require('./config/config')

const url = config.bd_string;
const options = { reconnectTries: Number.MAX_VALUE, reconnectInterval: 500, poolSize: 5, useNewUrlParser: true };

mongoose.connect(url, options);
mongoose.set('useCreateIndex', true);

//Alguns eventos que ficam ouvindo o Banco, e nos avisando sobre algum ocorrido
mongoose.connection.on('error', (err) => {
    console.log('Erro na conexão com o banco de dados: ' + err);
})

mongoose.connection.on('disconnected', () => {
    console.log('Aplicação desconectada do Banco de Dados!');
})

mongoose.connection.on('connected', () => {
    console.log('Aplicação conectada no Banco de Dados!');
})

//Body-Parser - fazer um parser da requisição para um JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const indexRoute = require('./Routes/index')
const usersRoute = require('./Routes/users')

app.use('/', indexRoute);
app.use('/users', usersRoute);

app.listen(3000);

module.exports = app;