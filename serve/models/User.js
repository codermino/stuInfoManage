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
  avatar:{
    type:String,
    default:'3ea6beec64369c2642b92c6726f1epng.png'
  },
  time:{
    type:Date,
    default:Date.now
  }
});

module.exports=User=mongoose.model('user',UserSchema);