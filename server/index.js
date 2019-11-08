const express = require("express");
const app=express();


// 环境变量要是设置了PORT，那么就用环境变量的PORT
const port=process.env.PORT||5000;

app.get('/', (req,res)=> {
  res.send("hello world");
});

app.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
});
