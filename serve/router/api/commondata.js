const express=require("express");
const router=express.Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const passport=require('passport');
const formidable=require("formidable");

router.post('/rowing',passport.authenticate("jwt",{session:false}), (req, res)=> {
// router.post('/rowing', (req, res)=> {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, Current-Page');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  const readDir = fs.readdirSync(process.cwd()+"/assets/rowing");
  const data = {
    code:200,
    data:{
      readDir
    }
  };
  res.send(data);
});

module.exports=router;
