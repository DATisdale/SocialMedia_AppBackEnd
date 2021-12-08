const { User, validateLogin, validateUser } = require("../models/user");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const{Reply, Post, validatePost} = require("../models/posts")

//* POST register a new user
router.post("/register", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).send(`Email ${req.body.email} already claimed!`);

    const salt = await bcrypt.genSalt(10);
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
      isAdmin: req.body.isAdmin,
    });

    await user.save();
    const token = user.generateAuthToken();
    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});
//* POST a valid login attempt
//! when a user logs in, a new JWT token is generated and sent if their email/password credentials are correct
router.post("/login", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send(`Invalid email or password.`);

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password.");

    const token = user.generateAuthToken();
    return res.send(token);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//* Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//* DELETE a single user from the database
router.delete("/:userId", [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(400)
        .send(`User with id ${req.params.userId} does not exist!`);
    await user.remove();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//*Create a post for user
router.post("/posts", [auth], async (req, res) => {
  try {
      const user = await User.findById(req.user._id);
      
      let post = new Post(req.body);
      const { error } = validatePost(req.body);
      if (error) 
          return res.status(400).send(error);
      user.posts.push(post);
      
      await user.save();
      return res.send(user);
  }   catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`)
  }
});


router.get("/posts/all", async (req, res) => {
  try {
      const users = await User.find()

      let posts = []
      users.map(user => posts.push({userId: user._id, posts: user.posts}));

      return res.send(posts);  

  } catch(ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//*Adding likes and dislikes
router.put("/:userId/posts/:postId", async (req, res) => {
  try {
      const user = await User.findById(req.params.userId);

      let thePost = user.posts.id(req.params.postId);

      thePost = {...thePost, ...req.body}

      await user.save()

      return res.send(thePost);
  }   catch (ex) {
          return res.status(500).send(`Internal Server Error: ${ex}`)
  }
});

//*Replying to posts
router.post("/:userId/posts/:postId/replies", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    let thePost = user.posts.id(req.params.postId);

    const reply = new Reply({
          text: req.body.text,
          likes: req.body.likes,
          dislikes: req.body.dislikes
      });

      thePost.replies.push(reply);

      await user.save();

      return res.send(thePost.replies);
  } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;
