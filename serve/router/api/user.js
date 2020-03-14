const express=require("express");
const router=express.Router();
const fs = require('fs');
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');
const passport=require('passport');
const formidable=require("formidable");

const User=require("../../models/User");

router.get('/test',(req,res)=>{
  res.json("user worked");
});

router.post('/register',(req,res)=>{
  // console.log(req.body);
  User.findOne({userId:req.body.userId})
    .then(user=>{
      if(user){
        return res.status(400).json("学号已经被注册!");
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
              throw err;
            }else{
              newUser.password=hash;
            }
            // return res.json(hash);
            newUser.save()
              .then(success=>{
                // return res.json('注册成功!!!');
                res.json(user)
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
                userId:user.userId,
                name:user.name,
                identity: user.identity,
                avatar: user.avatar
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
              return res.status(400).json("密码错误!!!");
            }
          });
      }else{
        return res.status(404).json("学号不存在!!!");
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

router.post('/avatar',passport.authenticate("jwt",{session:false}), (req, res)=> {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, Current-Page');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  const avatarFields={};
  let form = new formidable.IncomingForm();

  form.encoding = 'utf-8';
  form.uploadDir =process.cwd()+ "/assets/image/";
  // form.keepExtensions = true;
  form.maxFieldsSize = 2 * 1024 * 1024;

  const userId=req.user.userId;

  form.parse(req, function(err, fields, files) {
    const pieces = files.file.path.split(/[\s\\]+/);
    const hashname=pieces[pieces.length-1];
    if(files){
      User.findOneAndUpdate(
        {userId:userId},
        {$set:{avatar:hashname}},
        {new:true}
      ).then(user=>{
        res.status(200).json(hashname);
      });
    }
  });
});

router.post('/avatar2',passport.authenticate("jwt",{session:false}), (req, res)=> {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, Current-Page');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  const avatarFields={};
  let form = new formidable.IncomingForm();

  form.encoding = 'utf-8';
  form.uploadDir =process.cwd()+ "/assets/image/";
  form.maxFieldsSize = 2 * 1024 * 1024;
  // express的req中并没有req.user,这里的req.user.username应该是passport的authenticate方法中给req对象
  const userId = req.user.userId;

  form.parse(req, function (err, fields, files) {
    // console.log(files);
    const upload_file = files.file;
    const old_path = upload_file.path;
    const pieces = upload_file.path.split(/[\s\\]+/);
    const extension = upload_file.type.split(/[\s/]+/);
    // 获得图片的拓展名
    const extension_type = extension[extension.length - 1];
    //获得图片的hash的名字
    const hashname = pieces[pieces.length - 1] + '.' + extension_type;
    //得到上传图片的新名字
    const new_path = form.uploadDir + hashname;
    // console.log(new_path);
    //将图片改名
    fs.rename(old_path, new_path, async function (err) {
      if (err) {
        return res.send({code: 500, msg: '改名失败'});
      }
      const result2 = await User.findOneAndUpdate(
        {userId: userId},
        {$set: {avatar: hashname}},
        {new: true}
      );
      if (!result2) {
        return res.send({code: 500, msg: '修改头像失败'})
      }
      res.send({code: 200, data: {msg: '修改头像成功', avatar_name: hashname}});
    });
  });
});

module.exports=router;
