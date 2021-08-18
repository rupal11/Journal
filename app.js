//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose=require("mongoose");

mongoose.connect('mongodb://localhost:27017/journalDB', {useNewUrlParser: true, useUnifiedTopology: true});


const homeStartingContent = "Hello!, Welcome to Daily Journal a simple and easy to use website to store your daily journals. Plus you can edit, delete a post and change the color of heading. So what you are waiting for, click on 'Compose' to create a post.";
const aboutContentMe = "I am Rupal Das, an undergraduate pursuing computer Science and Engineering from Government Engineering College. This website ";

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const postSchema = new mongoose.Schema({
  title : String,
  content : String
});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const Post = mongoose.model("Post",postSchema);

app.get("/",function(req,res){

  Post.find({},function(err,foundposts){
    if(err)
     console.log(err);
    else
    res.render("home",{contentOfHome : homeStartingContent , postsArray : foundposts});
  });

});

app.get("/about",function(req,res){
  res.render("about",{contentOfAbout:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contentOfContact:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
  
})

app.get("/posts/:id",function(req,res){
  const requestedPostId=req.params.id;

  Post.findOne( {_id:requestedPostId} , function(err,foundPost){
    if(err){
      console.log(err);
    }
    if(foundPost){
      res.render("post",{
        title : foundPost.title ,
        body : foundPost.content,
        post_id : foundPost._id
      });
    }
    
  });
  
});



app.get("/edit/:id",function(req,res){
  const requestedPostId=req.params.id;
  Post.findOne( {_id:requestedPostId} , function(err,foundPost){
    if(err){
      console.log(err);
    }
    if(foundPost){
      res.render("edit",{
        title : foundPost.title ,
        body : foundPost.content,
        post_id : foundPost._id
      });
    }
    
  });

});

app.post("/compose",function(req,res){
 
  const post=new Post({
    title : req.body.composeTitle,
    content : req.body.composeText
  });
  post.save();
  res.redirect("/");

})

app.post("/edit",function(req,res){
 
  updatedTitle= req.body.composeTitle;
  updatedContent=req.body.composeText;
  id=req.body.postId;

  Post.findOneAndUpdate({_id : id },{ title : updatedTitle , content :updatedContent },function(err,updatedPost){
    if(err)
     console.log(err);
  }) ;
 
  res.redirect("/");

})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
