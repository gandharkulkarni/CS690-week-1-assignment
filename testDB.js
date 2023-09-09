const { sequelize } = require('./database/sequelize')
const { TodoList}  = require('./models/TodoList')
const {TodoItem} = require('./models/TodoItem')
async function connectToDB() {
    try {

        await sequelize.authenticate();
        // Sync all models that are not in the database 
        await sequelize.sync()
        const firstToDoList = await TodoList.create({ title: 'Test list' })

        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

connectToDB();