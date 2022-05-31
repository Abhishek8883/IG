//  It contains the stroy schema


const mongoose=require("mongoose");


mongoose.connect("mongodb://localhost/sastaIG")
/* GET users listing. */
const storySchema=mongoose.Schema({
content:String,
author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
},
image:[{
    type:String,
    default:""
}],
date:{
    type:String,
    default:new Date().toDateString()
}
})

module.exports = mongoose.model("story",storySchema);
