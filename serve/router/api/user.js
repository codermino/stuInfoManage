const express=require("express");
const router=express.Router();
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');
const passport=require('passport');

const User=require("../../models/User");

router.get('/test',(req,res)=>{
  res.json("user worked");
});

router.post('/register',(req,res)=>{
  // console.log(req.body);
  User.findOne({userId:req.body.userId})
    .then(user=>{
      if(user){
        return res.json("用户Id已经存在！！！");
      }else {
        // res.json("register worked");
        const newUser=new User({
          name:req.body.name,
          userId:req.body.userId,
          password:req.body.password,
          identity: req.body.identity
        });

        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(newUser.password, salt, function(err, hash) {
            if(err){
              console.log(err);
            }else{
              newUser.password=hash;
            }
            // return res.json(hash);
            newUser.save()
              .then(success=>{
                return res.json('注册成功!!!');
              })
              .catch(err=>{
                console.log(err);
              });
          });
        });
      }
    }).catch(err=>{
    console.log(err);
  });
});

router.post('/login',(req,res)=>{
  User.findOne({userId:req.body.userId})
    .then(user=>{
      if(user){
        // console.log(user);
        bcrypt.compare(req.body.password, user.password)
          .then(match=>{
            if(match){
              // res.json("登录成功!!!");

              // 登录成功之后携带一个token
              const rule={
                id:user._id,
                name:user.name,
                identity: user.identity
              };

              // 第一个参数是一个规则，构成token
              // 第二个参数是起一个名字
              // 第三个参数是token的过期时间
              jwt.sign(rule, "secret", { expiresIn:3600 }, (err, token)=> {
                // console.log(token);
                res.json({
                  success:true,
                  token:"Bearer "+token
                })
              });
            }else {
              res.json("密码错误!!!");
            }
          });
      }else{
        res.json('用户名不存在!!!');
      }
    })
});


// 如果想要验证token则需要使用passport和passport-jwt
// 并且password需要在index中初始化和引入
router.get("/current",passport.authenticate("jwt",{session:false}),(req,res)=>{
  res.json({
    id:req.user.id,
    userId:req.user.userId,
    name:req.user.name,
    identity:req.user.identity
  });
});

module.exports=router;
