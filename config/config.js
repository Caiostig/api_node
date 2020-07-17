const env = process.env.NODE_ENV || 'dev'; //se não setar a variável NODE_ENV vou assumir que é ambiente de  desenvolvimento

const config = () => {
    switch (env) {
        case 'dev':
            return {
                bd_string: process.env.DB_HOST,
                jwt_pass: process.env.TOKEN_PASS_DEV,
                jwt_expires_in: process.env.EXPIRIES_TOKEN_DEV 
            };

        case 'hml':
            return {
                bd_string: process.env.DB_HOST,
                jwt_pass: process.env.TOKEN_PASS_HOM,
                jwt_expires_in: process.env.EXPIRIES_TOKEN_HOM
            };

        case 'prod':
            return {
                bd_string: process.env.DB_HOST,
                jwt_pass: process.env.TOKEN_PASS_PROD,
                jwt_expires_in: process.env.EXPIRIES_TOKEN_PROD
            };
    }
}

console.log(`Iniciando a API em ambiente ${env.toUpperCase()}`);

module.exports = config();