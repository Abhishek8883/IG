//  It contains the post schema


const mongoose=require("mongoose");


mongoose.connect("mongodb://localhost/sastaIG")
/* GET users listing. */
const postSchema=mongoose.Schema({
content:String,
image:[{
    type:String,
    default:""
}],
author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
},
date:{
    type:String,
    default:new Date().toDateString()
},
likes:[{
    type:String,
    default:[]
}],
comments:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'comment'
}]
})

module.exports = mongoose.model("post",postSchema);
