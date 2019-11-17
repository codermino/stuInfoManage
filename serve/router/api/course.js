// 查询单个课程信息和所有课程信息=>学生，管理员
// 修改和删除课程信息=>管理员(删除和修改课程信息的时候需要对应更改学生成绩中的课程信息)
// 添加一个新的课程=>管理员

const express=require("express");
const router=express.Router();

const passport=require("passport");
const Course=require("../../models/Course");
const Score=require("../../models/Score");

router.get('/test',(req,res)=>{
  res.json("course worked");
});

router.get("/",passport.authenticate("jwt",{session:false}),(req,res)=>{
  Course.find()
    .then(course=>{
      if(!course){
        res.status(404).json("没有任何内容");
      }
      res.json(course);
    })
    .catch(err=>{
      res.status(404).json(err);
    })
});

router.post("/add",passport.authenticate("jwt",{session:false}),(req,res)=>{
  const courseFields={};

  if(req.body.cId)  courseFields.cId=req.body.cId;
  if(req.body.courseName) courseFields.courseName=req.body.courseName;
  if(req.body.credit) courseFields.credit=req.body.credit;
  if(req.body.teaName) courseFields.teaName=req.body.teaName;
  // 这里需要进行修改，有一个人选课就加一,暂时进行手动输入
  if(req.body.count) courseFields.count=req.body.count;

  new Course(courseFields).save()
    .then(course=>{
      res.json(course);
    })
});

router.get("/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
  Course.findOne({_id:req.params.id})
    .then(course=>{
      if(!course){
        res.status(404).json("没有任何内容");
      }
      res.json(course);
    })
    .catch(err=>{
      res.status(404).json(err);
    })
});

router.post("/edit/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
  const courseFields={};

  if(req.body.courseName) courseFields.courseName=req.body.courseName;
  if(req.body.teaName) courseFields.teaName=req.body.teaName;
  // 这里需要进行修改，有一个人选课就加一,暂时进行手动输入
  if(req.body.count) courseFields.count=req.body.count;

  Course.findOneAndUpdate(
    {_id:req.params.id},
    {$set:courseFields},
    {new:true}
  ).then(course=>{
    Score.findOne({cId:course.cId})
      .then(score=>{
        if(score){
          Score.findOneAndUpdate(
            {cId:course.cId},
            {$set:{courseName:course.courseName}},
            {new:true}
          ).then(()=>{
          }).catch(()=>{});
        }else{
          res.json("不存在该课程的成绩信息");
        }
      });
    res.json(course);
  }).catch(err=>{
    res.json(err);
  });

});

router.delete("/delete/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
  Course.findOneAndDelete({_id:req.params.id})
    .then(course=>{
      course.save().then(course=>{
        Score.deleteMany({cId:course.cId})
          .then(()=>{
            // console.log("删除成功");
          });
        res.json(course);
      })
        .catch(err=>{
          res.status(404).json(err);
        });
    })
    .catch(err=>{
      res.status(404).json(err);
    })
});

module.exports=router;
