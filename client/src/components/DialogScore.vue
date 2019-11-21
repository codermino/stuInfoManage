<template>
  <div class="dialog-fund">
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false">

      <el-form
        ref="form"
        :model="formData"
        :rules="form_rules"
        label-width="120px"
        style="margin:10px;width:auto;">

        <el-form-item prop='userId' label="学号:">
          <el-input type="userId" v-model="formData.userId"></el-input>
        </el-form-item>

        <el-form-item label="班级:" >
          <el-select v-model="formData.className" placeholder="班级">
            <el-option
              v-for="(formtype, index) in format_type_list"
              :key="index"
              :label="formtype" :value="formtype"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop='cId' label="课程编号:">
          <el-input type="cId" v-model="formData.cId"></el-input>
        </el-form-item>

        <el-form-item prop='score'  label="分数:">
          <el-input type="score" v-model="formData.score"></el-input>
        </el-form-item>

        <el-form-item  class="text_right">
          <el-button @click="dialog.show = false">取 消</el-button>
          <el-button type="primary" @click='onSubmit("form")'>提  交</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "DialogScore",
    data(){
      let checkNumber = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('学号不能为空'));
        }
        setTimeout(() => {
          if (Number.isNaN(value)) {
            callback(new Error('请输入正确的学号(11位数字)'));
          } else {
            const numberLen=value.length;
            if (numberLen !== 11) {
              callback(new Error('请输入正确的学号(11位数字)'));
            } else {
              callback();
            }
          }
        }, 500);
      };
      let checkScore = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('成绩不能为空'));
        }
        setTimeout(() => {
          if (Number.isNaN(value)) {
            callback(new Error('请输入正确的分数(0-100之间数字)'));
          } else {
            const score=Number.parseFloat(value);
            if (score<0||score>100) {
              callback(new Error('请输入正确的分数(0-100之间数字)'));
            } else {
              callback();
            }
          }
        }, 500);
      };
      return{
        formData:{
          className:'',
          userId:'',
          cId:'',
          score:''
        },
        format_type_list: [
          "计科1701",
          "计科1702",
          "计科1703",
          "计科1704",
        ],
        form_rules: {
          userId: [
            {required:true,validator: checkNumber, trigger:"blur"}
          ],
          className:[
            {required:true,triggerEvent:"change"}
          ],
          score:[
            { required: true, message: '请输入正确的分数(0-100之间数字)', trigger: ['blur',"change"] ,validator: checkScore},
          ],
          cId: [
            {required:true, message: '请输入课程编号',trigger:"blur"}
          ]
        }
      }
    },
    props: {
      dialog: Object
    },
    methods: {
      onSubmit(form) {
        this.$refs[form].validate(valid => {
          if (valid) {
            // console.log(this.formData);
            //表单数据验证完成之后，提交数据;

            // 传递给后端接口的formData就是req.body
            this.axios.post(`/api/score/add`, this.formData).then(res => {
              // 操作成功
              this.$message({
                message: "保存成功！",
                type: "success"
              });
              // 隐藏dialog
              this.dialog.show = false;
              // 让页面进行一次刷新
              this.$emit("updata");
            });
          }
        });
      }
    }
  };
</script>

