//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{useNewUrlParser:true});

const articleSchema={
    title:String,
    content:String
}

const Article = mongoose.model("Article",articleSchema); 

///////////////////////////////////////////Request targetting all articles/////////////////////////

app.route("/articles")
.get(async function(req,res){
    
        const foundArticles= await Article.find();
        res.send(foundArticles);
    
        

    }
)
.post(async function(req,res){
    console.log();
    console.log();

    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    })
    const result = await newArticle.save();
    if(result){
        res.send("Successfully added a new article.")
}else{
    res.send("Try again!!");
}
})
.delete(async function (req,res){
    
    const del = await Article.deleteMany();
    if(del){
        res.send("Successfully deleted the items.")
    }else{
        res.send("Try again!!!!");
    }
    
})

///////////////////////////////////////////Request targetting a specific article/////////////////////////
app.route("/articles/:articleTitle")
.get(async function(req,res){
    
    const foundArticle= await Article.findOne({title:req.params.articleTitle});
    if(foundArticle){
        res.send(foundArticle);
    }else{
        res.send("No matching articles found.")
    }
})
.put(function(req,res){
    const res2=Article.updateOne(
        {title:"req.params.articleTitle"},
        {title:req.body.title,content:req.body.content},
        {overwrite:true}//overwrites the default mongodb behaviour.
        );
    if(res2){
        res.send("Successfully updated.")
    }else{
        res.send("Try again!!!");
    }
})
.patch(function(req,res){
    const res3=Article.updateOne(
        {title:"req.params.articleTitle"},
        {$set:req.body}
        
        );
    if(res3){
        res.send("Successfully updated.")
    }else{
        res.send("Try again!!!");
    }
})
.delete(function(req,res){
    const res4= Article.deleteOne(
        {title:"req.params.articleTitle"},
    )
    if(res4){
        res.send("Successfully deleted.")
    }else{
        res.send("Try again!!!");
    }
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});