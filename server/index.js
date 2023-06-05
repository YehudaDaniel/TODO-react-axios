const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { baseUrl } = require('../constants');
const { Todos } = require('./model/Todos');
const { v4:uuidv4 } = require('uuid'); //generates a unique id


const app = express();
const PORT = 3080 || process.env.PORT;

const corsOptions = {
    origin: `${baseUrl.client}`,
    credentials: true
};


//changing express settings
//Tells express to parse the json data coming, into an object and be accessable via request.body
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

//using cookeParser and cors
app.use(cookieParser());

app.use(cors());

//Requests
app
    .get('/', cors(corsOptions), (req, res) => {
        res.send('Hello from todo router');
    })
    .get('/user', cors(corsOptions), (req, res) => {
        const userId = req.cookies?.userId || uuidv4();
        res.cookie("userId", userId).send({id: userId});
    })
    //getting todo list
    .get('/todos', cors(corsOptions), (req, res) => {
        res.send({ Todos });
    })
    //adding new todo
    .post('/todos', cors(corsOptions), (req, res) => {
        const userId = req.cookies?.userId;
        if(!userId) {
            res.status(403).end();
            return;
        }

        const { todo } = req.body;
        if(!todo) {
            res.status(400).json({ message: "Missing todo" }).end();
            return;
        }

        const { title } = todo;
        if(!title) {
            res.status(400).json({ message: "Bad Request" }).end();
            return;
        }

        const newTodo = {
            id: uuidv4(),
            title,
        }
        Todos.push(newTodo);
        res.send({ todo: newTodo }).status(200).end();
    })
    .post('/edit',cors(corsOptions), (req, res) => {
        const userId = req.cookies?.userId;
        if(!userId) {
            res.status(403).end();
            return;
        }

        const { todo } = req.body;
        if(!todo) {
            res.status(400).json({ message: "Missing todo" }).end();
            return;
        }

        const { id, done } = todo;
        if(!id || !done) {
            res.status(400).json({ message: "Bad Request" }).end();
            return;
        }

        const index = Todos.findIndex((todo) => todo.id === id);
        if(index === -1) {
            res.status(404).json({ message: "Todo not found" }).end();
            return;
        }

        Todos[index].done = done === "done" ? true : false;
        res.send({ Todos }).status(200).end();
    });



app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
});