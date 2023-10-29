import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = mongoose.Schema({
    username : {type : String , unique : true},
    name : String,
    password : String,
});

userSchema.plugin(passportLocalMongoose);


const User = new mongoose.model("User" , userSchema);

export default User;