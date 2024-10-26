import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    }
}, {timestamps:true})

postSchema.index({createdAt:-1})
postSchema.index({_id: 1})

export default mongoose.model("Post", postSchema)