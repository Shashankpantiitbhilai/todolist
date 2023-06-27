const express=require("express");
const app=express();
const mongoose=require("mongoose");
const _=require("lodash");
const date=require(__dirname + "/date.js");



app.use(express.static("public"));
const bodyParser=require("body-parser");
//app.use(bodyParser.urlencoded({extended:true}));

//const ObjectId = mongoose.Types.ObjectId;





mongoose.connect("mongodb+srv://shashankpant:25642399@cluster0.mbkd0tl.mongodb.net/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully to the MongoDB server')});
//creating a schema for our collection
 
const itemSchema=new mongoose.Schema({
  name:String
})

const listSchema=new mongoose.Schema({
  name:String,
  items:[itemSchema]
})
const List=mongoose.model("list",listSchema);
const Item=mongoose.model("Item",itemSchema);

const item1=new Item({
  name:"Eat",
})
const item2=new Item({
  name:"Sleep",
})
const item3=new Item({
  name:"Repeat",
})

const defaultItems=[item1,item2,item3];
//Item.insertMany(defaultItems);



app.get("/", function(req, res) {

//const day = date.getDate();
Item.find({})

      .then((result) => {
        if(result.length===0)
        {Item.insertMany(defaultItems);
           // console.log(result); // Log the result of the update operation      
        // Close the connection after the operation is done
        res.redirect("/");
      }
      else
      {
        res.render("list", {listtitle: "Today", xtraitem: result});
      }})

 

});


app.set('view engine', 'ejs');

app.post('/',function(req,res)
{
  const newitems=req.body.xtra;
  const listName=req.body.list;
  const item=new Item({
    name:newitems
  })

if(listName==="Today")
{
  item.save();
  res.redirect("/");
}
else{
  List.findOne({name:listName})//search for document
  .then((result) => {//found document 
    
  result.items.push(item);
    
    result.save();
    res.redirect("/"+ listName);})}})

    
   
   

 

app.post("/delete",function(req,res)
{
  const checkedItemId=req.body.checkbox;
  const listName=req.body.listName;
  if(listName==="Today"){


  Item.findOneAndDelete( checkedItemId )
  .then((result) => {
    console.log(result);
    res.redirect("/");
  })
  .catch((error) => {
    console.error(error);
    // Handle the error appropriately
  })}
  
  else{
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId.trim() } } }
    )
    .then((result) => {
    
      res.redirect("/"+listName);
    })
    .catch((error) => {
      console.error(error);
      // Handle the error appropriately
    })

  }
  
  
  });

  

app.get("/:topic",function(req,res)
{
  const parameter=_.capitalize(req.params.topic);
  List.findOne({name:parameter})
  .then((result) => {
    
    if(!result)
    {//if list does not exist then create a new list
      const list=new List({
      name: parameter,
      items:[]
  
    })
    
    list.save();
    res.redirect("/"+ parameter);

    
   //console.log("list does not exists");
    }
    else{
      res.render("list", {listtitle: result.name, xtraitem: result.items});
    
      
    }
  
  })
  .catch((error) => {
    console.error(error);
    // Handle the error appropriately
  });




  
})
app.listen(3000,function(){
   // console.log("server is running on port 3000");
})