const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const app = express();

mongoose.connect("mongodb://localhost/blogApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

const User = mongoose.model("User", { username: String, password: String });
const Post = mongoose.model("Post", { title: String, content: String, author: String });

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  Post.find({}, (err, posts) => res.render("home", { posts }));
});
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/new", (req, res) => req.session.user ? res.render("new") : res.redirect("/login"));

app.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  const user = new User({ username: req.body.username, password: hashed });
  user.save(() => res.redirect("/login"));
});

app.post("/login", (req, res) => {
  User.findOne({ username: req.body.username }, async (err, user) => {
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      req.session.user = user;
      res.redirect("/");
    } else res.send("Login failed");
  });
});

app.post("/new", (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.session.user.username,
  });
  post.save(() => res.redirect("/"));
});

app.listen(3000, () => console.log("Server running on port 3000"));