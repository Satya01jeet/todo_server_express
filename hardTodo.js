const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/todos", (req, res) => {
  try {
    fs.readFile("todos.json", "utf-8", (err, data) => {
      if (err) {
        return res.status(500).send(`Error reading file`);
      }
      if (data == "") {
        return res.json({});
      }
      res.json(JSON.parse(data));
    });
  } catch {
    console.log(err);
  }
});

app.post("/todos", (req, res) => {
  const newTodo = {
    id: Math.floor(Math.random() * 9000),
    task: req.body.task,
  };
  try {
    fs.readFile("todos.json", "utf8", (err, data) => {
      if (err) throw err;
      if (data == "") {
        var todos = [newTodo];
      } else {
        var todos = JSON.parse(data);
        todos.push(newTodo);
      }
      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if (err) throw err;
        res.status(201).json(newTodo);
      });
    });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) throw err;
    if (data == "") return res.send(`No todos to delete`);
    var todos = JSON.parse(data);
    const item = todos.find((todo) => todo.id == req.params.id);
    if (item == null) return res.status(500).send(`invalid id`);
    todos.splice(todos.indexOf(item), 1);
    console.log(todos);
    fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
      if (err) throw err;
      res.status(201).send(`Deleted successfully`);
    });
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3001,() => {
  console.log(`Server running...`)
});
