const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const CSSchema=new Schema({
  userId:{
    type:String,
    required:true
  },
  name:{
    type:String,
    required:true
  },
  className:{
    type:String,
    required:true
  },
  cId:{
    type:String,
    required:true
  },
  courseName:{
    type:String,
    required:true
  },
  score:{
    type:Number,
    required:true
  },
  credit:{
    type:Number,
    required:true
  },
  getCredit:{
    type:Number,
    required:true
  },
  time:{
    type:Date,
    default:Date.now
  }
});

module.exports=CS=mongoose.model('score',CSSchema);
