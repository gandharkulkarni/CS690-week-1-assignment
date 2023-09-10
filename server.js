const express = require('express')
const PORT = 7000
const HOST = 'localhost'
const app = express()
const bodyparser = require('body-parser')
const { TodoList } = require('./models/TodoList')
const { TodoItem } = require('./models/TodoItem')
const { sequelize } = require('./database/sequelize')


app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    res.status(200).send(`Hey there,
    Here's the list of api endpoints
    <br><br> GET: /todolist Get all of the TodoLists
    <br><br> POST: /todolist  Create a TodoList
    <br><br> DELETE: /todolist Delete a TodoList
    <br><br> POST: /todoitem Create a TodoItem for a specific list
    <br><br> GET: /todoitem Get all the TodoItem's in the TodoList
    <br><br> PUT: /todoitem Update a TodoItem and mark it as done
    <br><br> DELETE: /todolist Delete a TodoListItem
    `)
});
//Get todo lists
app.get('/todolist', async (req, res) => {
    try {
        sequelize.authenticate();
        await sequelize.sync();
        allTodoLists = await TodoList.findAll();
        res.status(200).json(allTodoLists);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong')
    }
});
//Create todo lists
app.post('/todolist', async (req, res) => {
    try{
    sequelize.authenticate();
    await sequelize.sync();
    let lists = req.body.TodoLists
    for (let list of lists) {
        let title = list.title;
        await TodoList.create({ title: title });
    }
    res.status(200).send('Todo list saved');
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong')
    }
});
//Delete todo list
app.delete('/todolist', async (req, res) => {
    sequelize.authenticate();
    await sequelize.sync()
    let lists = req.body.TodoLists
    try {
        for (let list of lists) {
            let id = list.id;
            row = await TodoList.findOne({ where: { id: id } });
            if (row) {
                await row.destroy()
                console.log(`${id} id list deleted`);
            } else {
                console.log('Row not found');
            }
        }
        res.status(200).send('Todo lists deleted')
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }

});
//Update todo list
app.put('/todolist', async (req, res) => {
    sequelize.authenticate();
    await sequelize.sync();
    let lists = req.body.TodoLists
    try {
        for (let list of lists) {
            let id = list.id;
            row = await TodoList.findOne({ where: { id: id } });
            if (row) {
                await TodoList.update({ title: list.title }, { where: { id: id } });
                console.log(`${id} id list updated`);
            } else {
                console.log('Row not found');
            }
        }
        res.status(200).send('Todo lists updated')
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }

});

app.listen(PORT, HOST, () => {
    console.log(`Server started listening on ${PORT}`)
})