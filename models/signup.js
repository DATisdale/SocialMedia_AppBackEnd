const mongoose=require("mongoose");
const Joi= require("joi");

const signupSchema= new mongoose.Schema(
    {
        username:{type: String, required: true},
        firstName:{type: String, required: true},
        lastName:{type: String, required: true},
        email:{type: String, required: true},
        birthday:{type: String, required: true},
        password:{type:String, required: true}
    }
)

function validateSignup(signup){
    const schema= Joi.object({
        username: Joi.string().min(2).max(50).required(),
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(2).max(50).required(),
        birthday: Joi.string().min(2).max(50).required(),
        password: Joi.string().min(2).max(50).required(),
    });
    return schema.validate(signup);
}

const Signup = mongoose.model("Signup", signupSchema);

module.exports.Signup=Signup;
module.exports.validateSignup=validateSignup;