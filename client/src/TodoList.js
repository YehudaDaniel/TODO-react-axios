import axios from 'axios';
import React, { useState } from 'react';
import "./TodoList.css";
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Grid,
    TextField,
    Button,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';

const TodoList = ({todos, addTodo, editTodo}) => { //todos are the list of todos, addTodo is the function to add a todo
    axios.defaults.withCredentials = true; //accepting cookies through requests

    const [newTitle, setNewTitle] = useState([]); //title of the new todo

    return (
        // container for centering the content
        <Container>
            <br />
            <Typography
                variant="h4"
                align="center"
                gutterBottom //adds margin bottom
                data-testid="todo-title"
            >
                TODO App
            </Typography>
            {
                todos.length === 0 ? (
                    // -------------- if no todos are available -------------------
                    <Typography
                        variant="body1" //default variant is body1 anyways
                        align="center"
                        data-testid="todo-notodos"
                    >
                        No todos available, Please add some todos.
                    </Typography>
                ) : (
                    <List 
                        data-testid="todo-list"
                    >
                        {
                            // -------------- if todos are available, generate them from the todos array -------------------
                            todos.map((todo) => (
                                <ListItem
                                    key={todo.id}
                                    disablePadding
                                    className={todo.done ? "done" : "todo"}
                                >
                                    <ListItemText 
                                        primary={todo.title}
                                        secondary={todo.author}
                                        data-testid={`todo-todo-${todo.id}`}
                                    />
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={todo.done ? "done" : "todo"}
                                        exclusive
                                        onChange={(event) => {
                                            editTodo(todo.id, event.target.value);
                                        }}
                                    >
                                        <ToggleButton value="done" >Done</ToggleButton>
                                        <ToggleButton value="todo" >TODO</ToggleButton>
                                    </ToggleButtonGroup>
                                </ListItem>
                            ))
                        }
                    </List>
                )
            }

            <Grid
                item
                xs={12} //sets the max width to 12 columns
            >
                <Typography variant="h4" data-testid="todo-addsection-title" >
                    Add your todo here
                </Typography>
                <TextField 
                    label="Title"
                    fullWidth //taking up the full width of the container
                    margin="normal"
                    data-testid="todo-addsection-newTitle"
                    onChange={(e) => {
                        setNewTitle(e.target.value);
                    }}
                    value={newTitle}
                />
                <Button
                    variant="outlined"
                    color="primary"
                    data-testid="todo-addsection-submitBtn"
                    onClick={(e) => {
                        addTodo(newTitle);
                        setNewTitle("");
                    }}
                >
                    SEND
                </Button>
            </Grid>
        </Container>
    );
};

export default TodoList;