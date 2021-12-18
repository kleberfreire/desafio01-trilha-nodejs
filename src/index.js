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
    request.user = user;
    request.idInUsers = indetifyIdUser(user);
    return next();
  }
  return response.status(404).json({ message: "User does not exist" });
}

function indetifyIdUser(user) {
  const idDataBaseUser = users.findIndex((userData) => userData.id === user.id);
  return idDataBaseUser;
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;
  users.push({
    id: uuidv4(),
    name: name,
    username: username,
    todos: [],
  });
  return response.json({ message: "user created" });
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user, idInUsers } = request;
  const { title, done, deadline } = request.body;
  users[idInUsers].todos.push({
    id: uuidv4(),
    title,
    done,
    deadline: new Date(deadline),
    created_at: new Date(),
  });
  return response.json({ message: "todo created on success" });
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
