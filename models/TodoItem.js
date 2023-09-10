const { Model, DataTypes } = require('sequelize');
const {TodoList} = require('./TodoList')
const {sequelize}  = require('../database/sequelize')

class TodoItem extends Model { }

TodoItem.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    todo_list_id: {
        type: DataTypes.INTEGER,
        references:{
            model: 'todolists',
            key: 'id'
        },
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    due_date: {
        type: DataTypes.DATE,
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
},
    {
        sequelize,
        modelName: 'todoitems'
    });


module.exports = { TodoItem }
