const {
    Sequelize
} = require('sequelize');
const pg = require('pg');

module.exports = new Sequelize(

    process.env.DB_NAME, //name of db
    process.env.DB_USER, //Name user
    process.env.DB_PASSWORD, //user pass

    {
        dialect: 'postgres',
        dialectModule: pg,
        protocol: 'postgres',
        // dialectOptions: {
        //     ssl: {
        //         require: false,
        //         rejectUnauthorized: false // или true, в зависимости от конфигурации вашего сервера
        //     },d
        // },
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    }

);