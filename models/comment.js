const mongoose = require("mongoose");
const Joi = require("joi");

const replySchema = new mongoose.Schema(
    {
        text:{type: String, required: true},
        likes:{type: Number, default: 0},
        dislikes:{type: Number, default: 0},
    }
)

const postSchema = new mongoose.Schema(
    {
        postId:{type: String, require: true},
        text:{type: String, required: true},
        likes:{type: Number, default: 0},
        dislikes:{type: Number, default: 0},
        replies:{type: [replySchema], default: []}
    }
)

function validatePost(post){
    const schema = Joi.object({
        postId: Joi.string().min(2).max(50).required(),
        text: Joi.string().required(),
    });
    return schema.validate(post);
}

const Post = mongoose.model("Post", postSchema);
const Reply = mongoose.model("Reply", replySchema);

module.exports.Reply = Reply;
module.exports.validatePost = validatePost;
module.exports.Post = Post;