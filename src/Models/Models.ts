import mongoose, { Schema, model } from "mongoose";
import { MongoUrl } from "../config";

mongoose.connect(MongoUrl)

const UserSchema = new Schema({
    username : {
        type : String,
        unique : true
    },
    password : String
})

const ContentSchema = new Schema({
    title : String,
    link : String,
    type : String,
    userId : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required : true
    }
})

const HashedLinkSchema = new Schema({
    hash : String,
    userId : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required : true
    }
})
export const UserModel = model("User", UserSchema);
export const ContentModel = model("Content", ContentSchema);
export const LinkModel = model("Link", HashedLinkSchema);