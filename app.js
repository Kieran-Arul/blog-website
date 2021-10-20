// Import required modules
const express = require("express");
const mongoose = require("mongoose");

// ************************************************************************************

const homeContent = "Welcome to my Blog!";

const aboutContent = "I enjoy football and coding";

const contactContent = "Let's get in touch!";

// ************************************************************************************

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// ************************************************************************************

mongoose.connect("mongodb://localhost:27017/blogDB")
    .then(() => console.log("Connected to Blog DB"))
    .catch(() => console.log("Connection to Blog DB failed"));

// ************************************************************************************

const postSchema = new mongoose.Schema({

  title: String,
  content: String

});

const Post = mongoose.model("Post", postSchema);

// ************************************************************************************

app.get("/", (_, res) => {

  Post.find({}, (err, posts) => {

    res.render("home", {

      startingContent: homeContent,
      posts: posts

    });

  });

});

// ************************************************************************************

app.get("/compose", (_, res) => {

  res.render("compose");

});

// ************************************************************************************

app.post("/compose", (req, res) => {

  const post = new Post({

    title: req.body.postTitle,
    content: req.body.postBody

  });

  post.save()
      .then(() => res.redirect("/"))
      .catch(() => console.log("Error saving post"))

});

// ************************************************************************************

app.get("/posts/:postId", (req, res) => {

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, (err, post) => {

    res.render("post", {

      title: post.title,
      content: post.content

    });

  });

});

// ************************************************************************************

app.get("/about", (_, res) => {

  res.render("about", {

    aboutContent: aboutContent

  });

});

// ************************************************************************************

app.get("/contact", (_, res) => {

  res.render("contact", {

    contactContent: contactContent

  });

});

// ************************************************************************************

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
