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
    try {
        sequelize.authenticate();
        await sequelize.sync();
        let lists = req.body.todo_lists
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
    let lists = req.body.todo_lists
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
    let lists = req.body.todo_lists
    let isValid = true
    try {
        for (let list of lists) {
            let id = list.id;
            if (id === undefined) {
                res.status(400).send('Invalid Request. Please provide valid Id');
                isValid = false;
            }
            else {
                let row = await TodoList.findOne({ where: { id: id } });
                if (row) {
                    await TodoList.update({ title: list.title }, { where: { id: id } });
                    console.log(`${id} id list updated`);
                } else {
                    console.log('Row not found');
                }
            }
        }
        if (isValid) {
            res.status(200).send('Todo lists updated')
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }

});
//Create a todo item
app.post('/todoitem', async (req, res) => {
    try {
        sequelize.authenticate();
        await sequelize.sync();
        let todoItems = req.body.todo_items
        for (let item of todoItems) {
            let todoListId = item.todo_list_id;
            let content = item.content;
            let dueDate = item.due_date;
            let isCompleted = item.is_completed;
            if (todoListId === undefined || content === undefined || dueDate === undefined) {
                res.status(400).send(`Invalid request. Please provide valid Todo List Id, Content, Due Date`)
            }
            else {
                await TodoItem.create({ todo_list_id: todoListId, content: content, due_date: dueDate, is_completed: isCompleted });
            }

        }
        res.status(200).send('Todo item added')
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});
//Get todo item
app.get('/todoitem', async (req, res) => {
    try {
        let todoListId = req.body.todo_list_id
        if (todoListId === undefined) {
            res.status(400).send('Please provide valid Todo List Id');
        }
        else {
            allTodoItems = await TodoItem.findAll({ where: { todo_list_id: todoListId } });
            res.status(200).json(allTodoItems);
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});

//Delete todo items
app.delete('/todoitem', async (req, res) => {
    try {
        sequelize.authenticate();
        await sequelize.sync()
        let todoItems = req.body.todo_items
        for (let item of todoItems) {
            let id = item.id;
            let todoListId = item.todo_list_id;
            let row = await TodoItem.findOne({ where: { id: id, todo_list_id: todoListId } });
            if (row) {
                await row.destroy();
                console.log(`${id} id todo item deleted`);
            }
            else {
                console.log('Row not found');
            }
        }
        res.status(200).send('Todo items removed');
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});
//Update todo item
app.put('/todoitem', async (req, res) => {
    try {
        sequelize.authenticate();
        await sequelize.sync()
        let todoItems = req.body.todo_items
        let isValid = true
        for (let item of todoItems) {
            let id = item.id;
            let todoListId = item.todo_list_id;
            if (id === undefined || todoListId === undefined) {
                isValid = false
                res.status(400).send('Invalid request. Please provide valid values for Id and Todo List Id');
            }
            else {
                let row = await TodoItem.findOne({ where: { id: id, todo_list_id: todoListId } });
                if (row) {
                    let content = item.content;
                    let dueDate = item.due_date;
                    let isCompleted = item.is_completed;
                    let resp = await TodoItem.update({
                        content: content !== undefined ? content : row.content,
                        due_date: dueDate !== undefined ? dueDate : row.due_date,
                        is_completed: isCompleted !== undefined ? isCompleted : row.is_completed
                    },
                        { where: { id: id, todo_list_id: todoListId } });
                    console.log(`${id} id list updated`);
                } else {
                    console.log('Row not found');
                }
            }
        }
        if (isValid) {
            res.status(200).send('Todo items updated');
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
});

app.listen(PORT, HOST, () => {
    console.log(`Server started listening on ${PORT}`)
})