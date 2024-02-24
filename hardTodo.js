const express = require('express')
const fs = require('fs')
const app = express()

app.use(express.json())

app.get('/todos',(req,res) => {
    try{
        fs.readFile('todos.json','utf-8',(err,data) => {
            if(err){
                return res.status(500).send(`Error reading file`)
            }
            if(data == ""){
                return res.json({});
            }
            res.json(JSON.parse(data))
        })
    }catch{
        console.log(err)
    }
})

app.post('/todos', (req, res) => {
    const newTodo = {
      id: Math.floor(Math.random() * 9000),
      title: req.body.title,
      description: req.body.description
    };
    fs.readFile("todos.json", "utf8", (err, data) => {
      if (err) throw err;
      if(data == ""){
        var todos = [newTodo];
      }
      else{
        var todos = JSON.parse(data)
        todos.push(newTodo)
      }
      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if (err) throw err;
        res.status(201).json(newTodo);
      });
    });
  });

  app.delete('/todos/:id',(req,res) => {
    fs.readFile('todos.json','utf-8',(err,data)=>{
        if(err) throw err;
        if(data == '') return res.send(`No todos to delete`)
        var todos = JSON.parse(data)
        const item = todos.find((todo) => todo.id == req.params.id)
        if(item == null) return res.status(500).send(`invalid id`)
        todos.splice(todos.indexOf(item),1);
        console.log(todos)
        fs.writeFile('todos.json', JSON.stringify(todos), (err) => {
            if (err) throw err;
            res.status(201).send(`Deleted successfully`)
        })
    })
  })

app.listen(3001)