const express = require("express");
const app = express();
const crypto = require("crypto");
const { todo } = require("node:test");

app.use(express.json());

var todoList = [
  {
    title: "todoServer",
    completed: false,
    description: "complete this todo list server",
    id: "2222",
  },
  {
    title: "walk5k",
    completed: false,
    description: "complete 5k steps in the evening",
    id: "1111",
  },
];
app.get("/todos", (req, res) => {
  var todos = [];
  todoList.forEach((todo) => {
    todos.push(todo.title);
  });
  res.status(200).json(todos);
});

app.get("/todos/:id", (req, res) => {
  try {
    const item = todoList.find((item) => item.id === req.params.id);
    if (item == null) res.status(404).send(`ID not found`);
    res.status(200).json(item);
  } catch (err) {
    console.log(err);
  }
});

var generatedIds = new Set();

function generateId() {
  let id;
  do {
    id = Math.floor(1000 + Math.random() * 9000);
  } while (generatedIds.has(id));
  generatedIds.add(id);
  return "" + id;
}

app.post("/todos", (req, res) => {
  try {
    const item = req.body;
    const id = generateId();
    const todoObj = {
      title: item.title,
      completed: item.completed,
      description: item.description,
      id: id,
    };
    todoList.push(todoObj);
    console.log(todoList);
    res.status(201).json({ id: id });
  } catch {
    res.status(404).send();
  }
});

app.put("/todos/:id", (req, res) => {
  const updatedItem = req.body;
  try {
    const item = todoList.find((item) => item.id === req.params.id);
    if (item == null) res.status(404).send(`ID not found`);
    else {
      item.completed = updatedItem.completed;
      item.title = updatedItem.title;
      item.description = updatedItem.description;
      res.status(200).json(item);
    }
  } catch (err) {
    console.log(err);
  }
});

app.delete("/todos/:id", (req, res) => {
  try {
    const item = todoList.find((item) => item.id === req.params.id);
    if (item == null) res.status(404).send(`ID not found`);
    else {
      todoList.splice(todoList.indexOf(item), 1);
      res.status(200).json(todoList);
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => console.log(`Easy todo server running...`));
