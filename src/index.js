const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find((user) => {
    return user.username == username;
  });
  if (user) {
    request.username = user;
    request.idInUsers = indetifyIdUser(user);
    return next();
  }
  return response.status(404).json({
    error: "Mensagem do erro",
  });
}

function indetifyIdUser(user) {
  const idDataBaseUser = users.findIndex((userData) => userData.id === user.id);
  return idDataBaseUser;
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;
  console.log(
    users.find((user) => {
      return user.username === username;
    })
  );
  if (
    users.find((user) => {
      return user.username === username;
    })
  ) {
    return response.status(400).json({ error: "Mensagem do erro" });
  }
  const user = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: [],
  };
  users.push(user);
  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { username } = request;
  return response.status(201).json(username.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { username, idInUsers } = request;
  const { title, deadline } = request.body;
  const dataTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };
  users[idInUsers].todos.push(dataTodo);
  return response.status(201).json(dataTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { username, idInUsers } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const idTodoUser = users[idInUsers].todos.findIndex((todo) => todo.id === id);
  if (idTodoUser < 0) {
    return response.status(404).json({
      error: "Mensagem do erro",
    });
  }
  users[idInUsers].todos[idTodoUser].title = title;
  users[idInUsers].todos[idTodoUser].deadline = deadline;
  const todoAltered = users[idInUsers].todos[idTodoUser];
  return response.status(201).json(todoAltered);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
