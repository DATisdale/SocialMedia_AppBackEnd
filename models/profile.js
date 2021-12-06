const mogoose=require("mongoose");
const Joi= require("joi");

const profileSchema= new mongoose.Schema(
    {
        username:{type: String, required: true},
        email:{type: String, required: true},
        password:{type:String, required: true},
        posts:[]
    }
)

function validateProfile(profile){
    const schema= Joi.object({
        username: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(2).max(50).required(),
        password: Joi.string().min(2).max(50).required(),
    });
    return schema.validate(profile);
}

const Profile = mongoose.model("profile", profileSchema);

module.exports.Profile=Profile;
module.exports.validateProfile=validateProfile;