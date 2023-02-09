const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine','ejs');

app.use(bodyparser.urlencoded({extended:true}));

app.use(express.static("public"));
mongoose.set({strictQuery: true});
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser: true});


const todolistSchema = new mongoose.Schema({
    name : String
});

const TodoList = new mongoose.model("todolist",todolistSchema);

const item1 = new TodoList({
    name : "Welcome To Your ToDo-List"
});
const item2 = new TodoList({
    name : "Hit + to Save the work"
});
const item3 = new TodoList({
    name : "<-- Hit this to Depricate"
});

const Defaultitems = [item1,item2,item3];






app.get("/",function(req,res){
    TodoList.find({},function(err,result){

        if(result.length ===0){
            TodoList.insertMany(Defaultitems,function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("SAVED")
                }
                });
                res.redirect("/");
        }else{
            res.render("list",{listTitle : "Today", TodoList: result });
        }
        
    
    });
    
});




app.post("/",function(req,res){

    const itemName = req.body.work;
    const item = new TodoList({
        name : itemName
    });

    item.save();
    res.redirect("/");
   
});



app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;

    TodoList.deleteOne({_id : checkedItemId}, function (err) {
      if (!err) {
        console.log("Success");
        res.redirect("/");
      }
    });
  });




app.get("/work",function(req,res){
    res.render("list",{listTitle: "Work List", Newitem: workitems});
});

app.post("/work",function(req,res){
    let workitem = req.body.work;
    TodoList.push(workitem);
    res.redirect("/");
})



app.get("/about",function(req,res){
    res.render("about");
})

app.listen(300,function(){
    console.log("server started on port 300");
});