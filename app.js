const express=require('express');
const app=express();
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const _=require("lodash");

var workitems=[];

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine','ejs');

mongoose.connect("mongodb://127.0.0.1:27017/TodoListdb",{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

const itemSchema={
    name:String
}

const Item=mongoose.model("Item",itemSchema);

const item1= new Item({
    name:"Complete today's work"
})


const defaultItems=[item1];

const listSchema={
    name:String,
    items:[itemSchema]
}

const List=mongoose.model("List",listSchema);



app.get("/",function(req,res){
   
    
    Item.find()
    .then(function (items) {
      if(items.length===0){
        Item.insertMany(defaultItems)
        .then(function(){
           console.log("successfully added elements");
        });
        res.redirect("/");
      }
      else{
        res.render("list",{ListTitle:"Today",newListItems:items});
      }
    }) 
    .catch(function (err) {
      console.log(err);
});


    
app.get("/:customListName",function(req,res){
    const customListName=req.params.customListName;

    List.findOne({name:customListName})
    .then(function(foundList){
            if(!_.lowerCase(foundList)){
                //create a new list
               const list=new List({
                name:customListName,
                items:defaultItems
               });
               list.save();
                res.redirect("/"+customListName);
            }
            else{
                //show an existing list
                res.render("list",{ListTitle:_.startCase(_.lowerCase(foundList.name)),newListItems:foundList.items});
            }
    })
    .catch(function(err){
        console.log("error");
    });
  });
});


app.post("/",function(req,res){
    const itemName=req.body.newItem;
    const listName=_.lowerCase(req.body.listName);
    const item1=new Item({
        name:itemName
    });
     
    if(listName==="today"){
        item1.save();
        res.redirect("/");
    }
    else{
        List.findOne({name:listName})
        .then(function(foundItem){
             foundItem.items.push(item1);
             foundItem.save();
             res.redirect("/"+listName);
        })
        .catch(function(err){
            console.log("error");
        });
    }
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.Done;
    const listName=_.lowerCase(req.body.listName);

    if(listName==="today"){
    Item.deleteOne({_id : checkedItemId}) 
      .then(()=>{ res.redirect("/")});
    }
    else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}})
        .then(()=>{res.redirect("/"+listName)})
        .catch(function(err){
            console.log("error");
        });
    }
  });


app.listen(3000,function(){
    console.log("server started on port 3000");
});

