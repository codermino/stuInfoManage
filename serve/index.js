const express = require("express");
const app=express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport=require("passport");
//使用cors进行跨域
// const cors = require('cors');

// app.all("*",function(req,res,next){
//   //设置允许跨域的域名，*代表允许任意域名跨域
//   res.header("Access-Control-Allow-Origin","*");
//   //允许的header类型
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
//   //跨域允许的请求方式
//   res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
//   if (req.method.toLowerCase() === 'options')
//     res.send(200);  //让options尝试请求快速结束
//   else
//     next();
// });

// app.use(function(req,res,next){
//   //如果在webpack里配置了代理，那么这些响应头都不要了
//   //只允许8080访问
//   res.header('Access-Control-Allow-Origin','http://localhost:8080');
//   //服务允许客户端发的方法
//   res.header('Access-Control-Allow-Methods','GET,POST,DELETE,PUT');
//   //服务器允许的请求头
//   res.header('Access-Control-Allow-Headers','Content-Type,Accept');
//   //跨域携带cookie  允许客户端把cookie发过来
//   res.header('Access-Control-Allow-Credentials','true');
//   //如果请求的方法是OPTIONS,那么意味着客户端只要响应头，直接结束响应即可
//   if(req.method === 'OPTIONS'){
//     res.end();
//   }else{
//     next();
//   }
// });

// app.use(cors());

// 引入路由
const user=require("./router/api/user");
const course=require("./router/api/course");
const socre=require("./router/api/socre");

// 配置body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/stuInfoManage', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
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

// 使用路由
app.use("/api/user",user);
// 前端跨域的时候是下面的代码的时候就可以使用这种形式
// app.use("/user",user);
app.use("/api/course",course);
app.use("/api/score",socre);
app.use('/api/static', express.static(__dirname + '/assets/image'));

app.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
});
