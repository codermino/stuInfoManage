const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const CSSchema=new Schema({
  cId:{
    type:String,
    required:true
  },
  courseName:{
    type:String,
    required:true
  },
  teaName:{
    type:String,
    required:true
  },
  credit:{
    type:Number,
    required:true
  },
  count:{
    type:Number,
    default:0
  },
  time:{
    type:Date,
    default:Date.now
  }
});

module.exports=CS=mongoose.model('course',CSSchema);
