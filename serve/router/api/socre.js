// 成绩信息的添加=>管理员
// 成绩信息的编辑=>管理员
// 成绩信息的删除=>管理员
// 成绩信息的查看:管理员所有人的成绩信息,学生只能查看自己的信息

const express=require("express");
const router=express.Router();

const passport=require("passport");
const Score=require("../../models/Score");
const User=require("../../models/User");
const Course=require("../../models/Course");

router.get('/test',(req,res)=>{
  res.json("score worked");
});

router.get("/",passport.authenticate("jwt",{session:false}),(req,res)=>{
  const identity=req.user.identity;
  const isStudent=identity==="student";

  // console.log(isStudent);
  if(!isStudent){
    Score.find()
      .then(score=>{
        if(!score){
          res.status(404).json("没有任何内容");
        }
        res.json(score);
      })
      .catch(err=>{
        res.status(404).json(err);
      })
  }else{
    Score.find({userId:req.user.userId})
      .then(score=>{
        if(!score){
          res.status(404).json("没有任何内容");
        }
        res.json(score);
      })
      .catch(err=>{
        res.status(404).json(err);
      })
  }
});

// 这里要进行一下重复验证
router.post("/add",passport.authenticate("jwt",{session:false}),(req,res)=>{
  // 管理员添加成绩信息的时候必须userId存在，并且className存在
  // 并且在添加的时候要看score表中是否存在相同的课程cId和userId

  const scoreFields={};

  if(req.body.className) scoreFields.className=req.body.className;
  if(req.body.score) scoreFields.score=req.body.score;

  if(req.body.cId)  scoreFields.cId=req.body.cId;
  if(req.body.userId) scoreFields.userId=req.body.userId;

  User.findOne({userId:scoreFields.userId})
    .then(user=>{
      if(user){
        scoreFields.name=user.name;
        Course.findOne({cId:scoreFields.cId})
          .then(course=>{
            if(course){
              Score.findOne({cId:scoreFields.cId,userId:scoreFields.userId})
                .then(score=>{
                  if(score){
                    return res.status(400).json("该用户已经存在该门课程成绩");
                  }else{
                    scoreFields.courseName=course.courseName;
                    scoreFields.credit=course.credit;
                    scoreFields.getCredit=scoreFields.score/100.0*course.credit;
                    new Score(scoreFields).save()
                      .then(score=>{
                        res.json(score);
                      })
                  }
                });
            }else{
              return res.status(400).json("不存在该课程!!!请核对!!!");
            }
          })
      }else{
        return res.status(400).json("不存在该学生!!!,请核对Id!!!");
      }
    });
});

// 这里可以改成根据课程编号查询成绩信息
// router.get("/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
//   Course.findOne({_id:req.params.id})
//     .then(course=>{
//       if(!course){
//         res.status(404).json("没有任何内容");
//       }
//       res.json(course);
//     })
//     .catch(err=>{
//       res.status(404).json(err);
//     })
// });

router.post("/edit/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
  const scoreFields={};

  if(req.body.score) scoreFields.score=req.body.score;
  // scoreFields.getCredit=req.body.score/100.0

  Score.findOneAndUpdate(
    {_id:req.params.id},
    {$set:scoreFields},
    {new:true}
  ).then(score=>{
    Score.findByIdAndUpdate(
      {_id:req.params.id},
      {$set:{getCredit:score.score/100.0*score.credit}},
      {new:true}
    ).then((score)=>{
      res.json(score);
    });
  }).catch(err=>{
    res.json(err);
  })
});

router.delete("/delete/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
  Score.findOneAndDelete({_id:req.params.id})
    .then(score=>{
      score.save().then(score=>{
        res.json(score);
      })
        .catch(err=>{
          res.status(404).json(err);
        })
    })
    .catch(err=>{
      res.status(404).json(err);
    })
});

module.exports=router;
