<template>
  <div class="fillcontain">
    <div>
      <date-time-picker :filter-table-data="allTableData" @updata="getProfile" @selectData="selectDate" class="timePicker"></date-time-picker>

      <el-form
        :inline="true"
        ref="add_data">
        <el-form-item class="btnRight">
          <el-button type="primary" size ="small" icon="view" @click='handleAdd()' v-if="user.identity==='manager'">添加</el-button>
        </el-form-item>
      </el-form>

    </div>
    <div class="table_container">

      <div class="search">
        <div style="display: inline-block"> 搜索：</div>
        <el-input
          class="search_input"
          v-model="search"
          size="mini"
          placeholder="输入关键字搜索"/>
      </div>

      <el-table
        v-if="tableData.length > 0"
        :data='tables'
        max-height="450"
        border
        style="width: 100%"
        :summary-method="getSummaries"
        :show-summary="userIdentity">

        <el-table-column
          type="index"
          label="序号"
          align='center'
          width="70">
        </el-table-column>

        <el-table-column
          prop="time"
          label="创建时间"
          align='center'
          width="250"
          sortable>
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px"> {{scope.row.time | showDate}} </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="userId"
          label="学号"
          align='center'
          width="170">
        </el-table-column>

        <el-table-column
          prop="name"
          label="姓名"
          align='center'
          width="150">
        </el-table-column>

        <el-table-column
          prop="className"
          label="班级"
          align='center'
          width="180">
        </el-table-column>

        <el-table-column
          prop="cId"
          label="课程编号"
          align='center'
          width="170">
        </el-table-column>

        <el-table-column
          prop="courseName"
          label="课程名称"
          align='center'
          width="170">
        </el-table-column>

        <el-table-column
          prop="score"
          label="成绩"
          align='center'
          width="220">
          <template slot-scope="scope">
            <el-icon name="score"></el-icon>
            <span style="color:#00d053"> {{scope.row.score}} </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="credit"
          label="学分"
          align='center'
          width="170">
        </el-table-column>

        <el-table-column
          prop="getCredit"
          label="获得学分"
          align='center'
          width="170">
          <template slot-scope="scope">
            <el-icon name="getCredit"></el-icon>
            <span style="margin-left: 10px;color:#00d053"> {{scope.row.getCredit|changeCredit}} </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" prop="operation" fixed="right" align="center" width="200" v-if="user.identity==='manager'">
          <template slot-scope="scope">
            <el-button
              type="warning"
              size="small"
              icon="edit"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="small"
              type="danger"
              icon="delete"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <dialog-score :dialog="dialog" :form-data="formData" @updata="getProfile"></dialog-score>
  </div>
</template>

<script>
  import {formatDate,changeNumber} from "../common/utils";
  import DialogScore from '../components/DialogScore'
  import DateTimePicker from '../components/DateTimePicker'

  export default {
    name: "score",
    components:{
      DialogScore,
      DateTimePicker
    },
    data() {
      return{
        tableData:[],
        allTableData:[],
        search: '',
        dialog:{
          show:false,
          title:'',
          type:''
        },
        formData:{
          className:'',
          userId:'',
          cId:'',
          score:''
        }
      }
    },
    computed:{
      user(){
        return this.$store.getters.user;
      },
      userIdentity(){
        return this.$store.getters.user.identity === 'student';
      },
      tables () {
        const search = this.search;
        if (search) {
          // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
          // 注意： filter() 不会对空数组进行检测。
          // 注意： filter() 不会改变原始数组。
          return this.tableData.filter(data => {
            // some() 方法用于检测数组中的元素是否满足指定条件;
            // some() 方法会依次执行数组的每个元素：
            // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
            // 如果没有满足条件的元素，则返回false。
            // 注意： some() 不会对空数组进行检测。
            // 注意： some() 不会改变原始数组。
            return Object.keys(data).some(key => {
              // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
              // 该方法对大小写敏感！所以之前需要toLowerCase()方法将所有查询到内容变为小写。
              // return String(data[key]).toLowerCase().indexOf(search) > -1
              if(key==='userId'||key==='name'||key==='className'||key==='cId'||key==='courseName'){
                return String(data[key]).indexOf(search) > -1;
              }
            })
          })
        }
        return this.tableData;
      }
    },
    created() {
      this.getProfile();
    },
    methods: {
      getProfile() {
        // 获取表格数据
        this.axios.get("/api/score").then(res => {
          // console.log(res);
          this.tableData=res.data;
          this.allTableData=res.data;
        }).catch(err=>{
          console.log(err);
        });
      },

      selectDate(selectDate){
        this.tableData=selectDate;
      },

      handleAdd(){
        this.dialog={
          show:true,
          title:'添加成绩信息',
          type:'add'
        };
        this.formData={
          className:'',
          userId:'',
          cId:'',
          score:''
        }
      },

      handleEdit(index, row) {
        this.dialog={
          show:true,
          title:'编辑成绩信息',
          type:'edit'
        };
        this.formData={
          className:row.className,
          userId:row.userId,
          cId:row.cId,
          score:row.score,
          id:row._id
        }
      },

      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false,
          closeOnPressEscape:false,
          roundButton:true,
          center:true
        }).then(() => {
          this.axios.delete(`/api/score/delete/${row._id}`)
            .then(res=>{
              this.$message({
                type:'success',
                message:'删除成功'
              });
              this.getProfile();
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '汇总';
            return;
          }

          const values = data.map(item => Number(item[column.property]));
          if(index===8||index===9){
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] += ' 分';
            } else {
              sums[index] = '';
            }
          }
        });
        return sums;
      }
    },

    // filters是一个过滤器
    filters: {
      showDate: function (value) {
        // 时间戳是秒,Date()需要毫秒
        // 需要先将时间戳转换为Date对象
        let date = new Date(value/1000*1000);
        // h表示24小时制,H表示12小时制
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      },

      changeCredit:function (number) {
        return changeNumber(number);
      }
    }
  };
</script>
<style scoped>
  .fillcontain {
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
  }
  .btnRight {
    float: right;
    margin-top: 5px;
  }

  .search{
    float: right;
    margin:-13px 20px 0 0;
  }

  .search_input{
    margin-top: 10px;
  }

  .pagination {
    text-align: right;
    margin-top: 10px;
  }

  .timePicker{
    float: left;
  }
</style>