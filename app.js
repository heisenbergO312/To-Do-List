const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const Date1=require(__dirname+"/date.js");

var items=["Buy Food","Do Work"];
var workItems=[];
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine','ejs');

app.get("/",function(req,res){
   
    var c=Date1.getDate();
    
    res.render("list",{ListTitle:c,newListItems:items});
    // console.log(items.length);
    
    
})

app.post("/",function(req,res){
    //console.log(req.body);
    var item=req.body.newItem;
    if(req.body.button==="Work"){
        workItems.push(item);
        res.redirect("/work");
    }
    else{
    items.push(item);
    res.redirect("/");
    }

})

app.post("/delete", function(req,res) {
    if(req.body.button2==="Work"){
        workItems.pop();
        res.redirect("/work");
    }
    else{
    items.pop();
    res.redirect("/");
    }
  });

app.get("/work",function(req,res){
   res.render("list",{ListTitle:"Work list",newListItems:workItems});

});

app.post("/work",function(req,res){
    console.log(req.body);
   let item=req.body.newItem;
   res.redirect("/work");
})

app.listen(3000,function(){
    console.log("server started on port 3000");
});

