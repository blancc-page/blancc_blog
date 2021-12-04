// require expresss and set up express app
const express = require("express");
const app = express();

const paginate = require("jw-paginate");

// require all middle-wear
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

// require DB
const mongoose = require("mongoose");


// connect to mongoose 
mongoose.connect('mongodb+srv://blancc:killa911G@blancccluster.9m6ww.mongodb.net/ablogDB', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log("Successfully connected to ablogDB!")
});

// create ablogSchema
const blogPostSchema = new mongoose.Schema({
  img: String,
  title: String,
  author: String,
  date: String,
  content: String
});

// create model
const BlogPost = mongoose.model("BlogPost", blogPostSchema);
const FtBlogPost = mongoose.model("FtBlogPost", blogPostSchema);

// declare the starting paragraphs of each page
// const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
// const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
// const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// sets the browser's view engine to ejs 
app.set('view engine', 'ejs');

// sets the express app to use bodyparser
app.use(bodyParser.urlencoded({extended: true}));

// tells the server to look for static files in the public folder
app.use(express.static("public"));
app.use('/blogposts', express.static('public'))
app.use('/ftblogposts', express.static('public'))

// app.get("/", function(req, res) {
//   res.render("home");
// });



const blogPosts = [];
const ftBlogPosts =[];


  BlogPost.countDocuments().then((count_documents) => {
    count = paginate(count_documents);
    }).catch((err) => {
      console.log(err.Message);
    });


// var heading = "";

app.get("/", function (req,res) {
  const current = "current";
  const heading = " - Home";

  FtBlogPost.find({}, function(err, ftBlogPosts){
    if(!err){
      ftBlogPosts.push(ftBlogPosts);
    }else {
      console.log(err);
    }

  BlogPost.find({}).exec(function(err, blogPosts){
    if(!err){
      blogPosts.push(blogPosts);
    }else {
      console.log(err);
    }
    res.render("home", {count: count, BlogPost: BlogPost, blogPosts: blogPosts, ftBlogPosts: ftBlogPosts, heading: heading, current: current, _:_});
    });
  });
});

app.get("/category", function(req, res) {
  const heading = " - Categories"
  const current = "current";
  res.render("category", {current: current, heading: heading});
});

app.get("/contact", function(req, res) {
  const heading = " - Contact";
  const current = "current";
  res.render("contact", {heading: heading, current: current});
});

app.get("/about", function(req, res) {
  const current = "current";
  const heading = " - About" 
  res.render("about", {heading: heading, current: current});
});

app.get("/style-guide", function(req, res) {
  const heading = " - Styles"
  const current = "current";
  res.render("style-guide", {current: current, heading: heading});
});

app.get("/compose", function(req, res) {
  const heading = " - Standard Compose";
  const current = "current";
  res.render("compose", {heading: heading, current: current});
});

app.post("/compose", function(req, res){

  const blogPostDocument = new BlogPost({
    img: req.body.inputUrl,
    title: req.body.inputBlog,
    author: req.body.inputAuth,
    date: new Date().toLocaleDateString('en-GB',{weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    content: req.body.content,
  });

  blogPostDocument.save(function(err){
    if(!err){
      res.redirect("/");
    } else{
      console.log(err);
    }
  });
});

app.get("/composeft", function(req, res) {
  const heading = " - Featured Compose"
  const current = "current";
  res.render("composeft",{heading: heading, current: current});
});

app.post("/composeft", function(req, res){

  const ftBlogPostDocument = new FtBlogPost({
    img: req.body.ftInputUrl,
    title: req.body.ftInputBlog,
    author: req.body.ftInputAuth,
    date: new Date().toLocaleDateString('en-GB',{weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    content: req.body.ftContent,
  });

  ftBlogPostDocument.save(function(err){
    if(!err){
      res.redirect("/");
    } else{
      console.log(err);
    }
  });
});

app.get("/ftblogposts/:ftblogPostId", function(req, res){

  const requestedPostId = req.params.ftblogPostId;

  FtBlogPost.findOne({_id: requestedPostId}, function(err, ftBlogPost){
    const current = "current";
    const heading = " - " + ftBlogPost.title;

    res.render("post", {
      img: ftBlogPost.img,
      title: ftBlogPost.title,
      author: ftBlogPost.author,
      date: ftBlogPost.date,
      content: ftBlogPost.content,
      heading : heading, 
      current: current
    });
  });
});

app.get("/blogposts/:blogPostId", function(req, res){

  const requestedPostId = req.params.blogPostId;

  BlogPost.findOne({_id: requestedPostId}, function(err, blogPost){
    const current = "current";
    const title = "" 
    const heading = " - " + blogPost.title;

    res.render("post", {
      img: blogPost.img,
      title: blogPost.title,
      author: blogPost.author,
      date: blogPost.date,
      content: blogPost.content,
      heading: heading, 
      current: current
    });
  });
});

app.get("/edit" , function(req, res){
  const heading = " - Edit Standard Compose";
  const current = "current";
  res.render("edit", {heading: heading, current: current});
});

app.post("/edit", function(req, res){

  const postId = req.body.inputId;

  BlogPost.findByIdAndUpdate(postId, { img: req.body.inputUrl, title: req.body.inputBlog, author: req.body.inputAuth, content: req.body.content}). exec();

  res.redirect("/");

});

app.get("/ftedit" , function(req, res){
  const heading = " - Edit Featured Compose";
  const current = "current";
  res.render("editft", {heading: heading});
});

app.post("/ftedit", function(req, res){

  const postId = req.body.inputId;

  FtBlogPost.findByIdAndUpdate(postId, { img: req.body.inputUrl, title: req.body.inputBlog, author: req.body.inputAuth, content: req.body.content}). exec();

  res.redirect("/");

});

app.get("/delete" , function(req, res){
  const heading = " - Delete Standard Post";
  const current = "current";
  res.render("delete", {heading: heading});
});

app.post("/delete", function(req,res){
  const postId = req.body.inputId;

  BlogPost.findByIdAndDelete(postId, function(err, docs){
    if(!err){
      console.log("Deleted: ", docs);
      res.redirect("/");
    } else {
      console.log(err)
    }
  })
});

app.get("/deleteft" , function(req, res){
  const heading = " - Delete Featured Post";
  res.render("deleteft", {heading: heading});
});

app.post("/deleteft", function(req,res){

  const postId = req.body.ftInputId;

  FtBlogPost.findByIdAndDelete(postId, function(err, docs){
    if(!err){
      console.log("Deleted: ", docs);
      res.redirect("/");
    } else {
      console.log(err)
    }
  })
});

let port = process.env.PORT;

if (port === null || port == ""){
  port == 3000;
}

app.listen(port, function() {
    console.log("Server started on port 3000");
  });
  

  