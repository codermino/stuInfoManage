const express = require("express");
const app=express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport=require("passport");

const user=require("./router/api/user");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/stuInfoManage', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{
  console.log("mongodb connect success");
}).catch(err=>{
  console.log(err);
});


// 环境变量要是设置了PORT，那么就用环境变量的PORT
const port=process.env.PORT||5000;

// passport的初始化
app.use(passport.initialize());
// 配置passport,将passport对象传递过去
require("./config/passport")(passport);

app.get('/', (req,res)=> {
  res.send("hello world");
});

app.use("/api/user",user);

app.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
});
