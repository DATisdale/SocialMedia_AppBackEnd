const express = require("express");
const{Reply, Post, validatePost}=require("../models/posts");
const{Signup, validateSignup}= require("../models/signup");
const { User } = require("../models/user");
const router=express.Router();
router.get("/:postId", async (req, res) => {
    try {
        const posts = await Post.find();
        return res.send(posts);
    } catch(ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find();
        return res.send(posts);
    } catch(ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});
// router.post("/:userId/posts", async (req, res) => {
//     try {
//         const user = await User.findById(req.params.userId);
        
//         let post = new Post(req.body);
//         const { error } = validatePost(req.body);
//         if (error) 
//             return res.status(400).send(error);
//         user.posts.push(post);
        
//         await user.save();
//         return res.send(user);
//     }   catch (ex) {
//         return res.status(500).send(`Internal Server Error: ${ex}`)
//     }
//     const user = await User.findById(req.params.userId);
//     let post = new Post(req.body);
//     user.posts.push(post);
//     await user.save;
//     return res.send(user);
// });
router.put("/:postId", async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                ...req.body
            },
            { new: true }
        );
        if (!post)
            return res.status(400).send(`The post requested does not exist.`)
        return res.send(post);
    }   catch (ex) {
            return res.status(500).send(`Internal Server Error: ${ex}`)
    }
});
router.post("/:postId/replies", async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        const reply = new Reply({
            text: req.body.text,
            likes: req.body.likes,
            dislikes: req.body.dislikes
        });
        post.replies.push(reply);
        await post.save();
        return res.send(post.replies);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});
module.exports = router;