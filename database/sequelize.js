const { Sequelize } = require('sequelize');
const { HOST, PORT, DB, USER, PWD } = require('../database/crendentials')
const pg = require('pg');
const sequelize = new Sequelize(DB, USER, PWD, {
    HOST,
    PORT,
    dialect: 'postgres',
    dialectModule: pg,
    logging: false
});

module.exports = {sequelize}