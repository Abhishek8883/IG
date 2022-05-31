//  It contains the comment schema

const mongoose=require("mongoose");


mongoose.connect("mongodb://localhost/sastaIG")
/* GET users listing. */
const commentSchema=mongoose.Schema({
comment:String,
author:String,
commentLikes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user',
    default:[]
}],
post:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'post'
}
})

module.exports = mongoose.model("comment",commentSchema);
