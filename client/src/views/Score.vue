<template>
  <div class="fillcontain">
    <div>
      <el-form
        :inline="true"
        ref="add_data">
        <el-form-item class="btnRight">
          <el-button type="primary" size ="small" icon="view" @click='handleAdd()' v-if="user.identity==='manager'">添加</el-button>
        </el-form-item>
      </el-form>

    </div>
    <div class="table_container">
      <el-table
        v-if="tableData.length > 0"
        :data='tableData'
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
  </div>
</template>

<script>
  import {formatDate,changeNumber} from "../common/utils";

  export default {
    name: "score",
    components:{
    },
    data() {
      return{
        tableData:[],
        search: ''
      }
    },
    computed:{
      user(){
        return this.$store.getters.user;
      },
      userIdentity(){
        return this.$store.getters.user.identity === 'student';
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
        }).catch(err=>{
          console.log(err);
        });
      },

      handleEdit(index, row) {
        console.log(index, row);
      },

      handleDelete(index, row) {
        console.log(index, row);
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
  }
  .pagination {
    text-align: right;
    margin-top: 10px;
  }
</style>