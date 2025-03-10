const { Sequelize } = require("sequelize");
const dotenv= require('dotenv');
dotenv.config();

var database = process.env.DB_NAME;
var username = process.env.DB_USERNAME;
var password = process.env.DB_PASSWORD;

const sequelize = new Sequelize(
    database,
    username,
    password, {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: console.log,  
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = {sequelize};