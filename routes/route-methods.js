const express = require("express");
const{Reply, Post, validatePost}=require("../models/comment");
const{Signup, validateSignup}= require("../models/signup")
const router=express.Router();

router.get("/:postId", async (req, res) => {
    try {
        const posts = await Post.find();
        return res.send(posts);
    } catch(ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});
router.get("PLACEHOLDER", async (req, res) => {
    try {
        const profile = await Signup.find();
        return res.send(profile);
    } catch(ex) {

router.post("/", async (req, res) => {
    try {
        const { error } = validatePost(req.body);
        if (error) 
            return res.status(400).send(error);

        const post = new Post({
            postId: req.body.postId,
            text: req.body.text,
        });

        await post.save();

        return res.send(post);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
});

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

        await Comment.save();

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
            dislikes: req.body.dislikes,
        });

        post.replies.push(reply);

        await post.save();

        return res.send(post.replies);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


module.exports = router;
