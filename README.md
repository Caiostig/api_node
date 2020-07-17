# Criação de uma API básica CRUD em Node, que utiliza Express, Mongodb, e faça autenticação.


## Bibliotecas utilizadas
* [Express](https://expressjs.com/pt-br/)
* [body-parser](https://github.com/expressjs/body-parser)
* [mongoose](https://mongoosejs.com/)
* [bcrypt](https://www.npmjs.com/package/bcrypt)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [nodemon](https://www.npmjs.com/package/nodemon)


## Banco de Dados como serviço
* MongoDB Atlas: [mongodb](https://www.mongodb.com/cloud/atlas)
* Ao fazer a conta, criar um Cluster Free


## Estrutura de organização do projeto

* Estrutura de Pastas:
    - `/middlewares` contem um arquivo para autenticação de endpoint
    - `/model` contém ...
    - `/Routes` contém ...
    - `/config` contém ...
    

## Setup

* Instalar dependencias do projeto com o comando padrão npm

```shell
npm install
```


## Rodar o projeto local

Para rodar o projeto, em `package.json`, rodar o script:

* Ambiente localhost:3000 (padrão)

```shell
npm run start
```


## Variáveis de ambiente

* Se for necessário adicionar novas variáveis, lembre-se de mapeá-las no arquivo `/.env`


## Pre-requisitos para rodar o projeto
* Instalar [NodeJS](http://nodejs.org/)



