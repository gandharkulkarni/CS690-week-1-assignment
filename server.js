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
            let row = await TodoList.findOne({ where: { id: id } });
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
//Create a todo item
app.post('/todoitem', async(req, res)=>{
    try{
        sequelize.authenticate();
        await sequelize.sync();
        let todoItems = req.body.items
        for(let item of todoItems){
            let todoListId = item.todoListId;
            let content = item.content;
            let dueDate = item.dueDate;
            let isComplete = item.isComplete;
            console.log(todoListId, content, dueDate, isComplete);
            await TodoItem.create({ todo_list_id: todoListId, content: content, due_date: dueDate, is_complete: isComplete });

        }
        res.status(200).send('Todo item added')
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});
//Get todo item
app.get('/todoitem', async(req, res)=>{
    try{
        let todoListId = req.body.todoListId
        console.log(todoListId)
        allTodoItems = await TodoItem.findAll({where: {todo_list_id: todoListId}});
        res.status(200).json(allTodoItems);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});

//Delete todo items
app.delete('/todoitem', async(req, res)=>{
    try{
        sequelize.authenticate();
        await sequelize.sync()
        let todoItems = req.body.todoItems
        for(let item of todoItems){
            let id = item.id;
            let todoListId = item.todoListId;
            let row = await TodoItem.findOne({ where: { id: id, todo_list_id: todoListId } });
            if(row){
                await row.destroy();
                console.log(`${id} id todo item deleted`);
            }
            else{
                console.log('Row not found');
            }
        }
        res.status(200).send('Todo Items removed');
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});

app.listen(PORT, HOST, () => {
    console.log(`Server started listening on ${PORT}`)
})