const { Model, DataTypes } = require('sequelize');
const {sequelize} = require('../database/sequelize')

class TodoList extends Model { }

TodoList.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'todolists'
});


module.exports = { TodoList }; 