import { useEffect, useState } from 'react';
import baseUrl from './constants';
import TodoList from './TodoList';
import {BrowserRouter, Router, Route, Routes} from 'react-router-dom';
import axios from 'axios';

const App = () => {
  axios.default.withCredentials = true; // accepting cookies through requests

  //creating states for user and todos
  const [userId, setUserId] = useState([]);
  const [todos, setTodos] = useState([]);

  //hooks to control the states data and changes
  useEffect(() => {
    getTodos(); //calling these functions once when the document is loaded
    getUser();
  }, []); //giving no dependencies to useEffect so that it runs only once


  //function for useEffect using axios to send requests to the server
  const getTodos = () => {
    axios
      .get(`${baseUrl}/todos`)
      .then(({ data }) => setTodos(data.Todos)) //TODO: check if this works
      .catch(err => console.error(err));
  };

  //using it as a prop to TodoList component
  const addTodo = (title) => {
    axios
      .post(
          `${baseUrl}/todos`,
          {
            todo: { title, done: false }, //data to be sent by post
          },
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            }
          }
      )
      .then((res) => {
        setTodos([...todos, res.data.todo]);
      })
      .catch(err => console.error(err));

      console.log('addTodo function called');
  };

    //editing the button
    const editTodo = (id, done) => {
      axios
        .post(
            `${baseUrl}/edit`,
            {
              todo: {id, done} , //data to be sent by post
            },
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              }
            }
        )
        .then((res) => {
          setTodos([...res.data.Todos]);
        })
        .catch(err => console.error(err));
    };

  //function for useEffect using axios to send requests to the server
  const getUser = () => {
    axios
      .get(`${baseUrl}/user`)
      .then((res) => {
        setUserId(res.data.id);
      })
      .catch(err => console.error(err));
  };


  //returning the components
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<TodoList todos={todos} addTodo={addTodo} editTodo={editTodo} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );

};


export default App;
