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
        text:{type: String, required: true},
        likes:{type: Number, default: 0},
        dislikes:{type: Number, default: 0},
        replies:{type: [replySchema], default: []}
    }
)
function validatePost(post){
    const schema = Joi.object({
        text: Joi.string().required(),
    });
    return schema.validate(post);
}
const Post = mongoose.model("Post", postSchema);
const Reply = mongoose.model("Reply", replySchema);
module.exports.Reply = Reply;
module.exports.validatePost = validatePost;
module.exports.Post = Post;
module.exports.postSchema = postSchema