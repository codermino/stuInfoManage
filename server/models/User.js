const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const UserSchema=new Schema({
  name:{
    type:String,
    required:true
  },
  userId:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  identity:{
    type:String,
    required:true
  },
  time:{
    type:Date,
    default:Date.now
  }
});

module.exports=User=mongoose.model('user',UserSchema);
