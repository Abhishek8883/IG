
const mongoose=require("mongoose");
const plm=require("passport-local-mongoose")

mongoose.connect("mongodb://localhost/sastaIG")
/* GET users listing. */
const userSchema=mongoose.Schema({
  email:String,
  name:String,
  username:String,
  password:String,
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'post',
    default:[]
  }],
  profilePic:[{
    type:String,
    default:"default.png"
  }],
  friendRequest:[{
    type:String,
    default:''
  }],
  friends:[{
    type:String,
    default:[]
  }],
  story:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'story',
    default:[]
  }]
})

userSchema.plugin(plm);
module.exports = mongoose.model("user",userSchema);
