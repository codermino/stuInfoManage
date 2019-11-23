<template>
  <div class="picker">
    <el-form
      :inline="true"
      ref="add_data"
      :model="search_data">
      <!-- 筛选-->
      <el-form-item label="投标时间筛选:">
        <el-date-picker
          v-model="search_data.startTime"
          type="datetime"
          placeholder="选择开始时间">
        </el-date-picker> --
        <el-date-picker
          v-model="search_data.endTime"
          type="datetime"
          placeholder="选择结束时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size ="small" icon="search" @click='handleSearch()'>筛选</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "DateTimePicker",
    data(){
      return{
        search_data: {
          startTime: "",
          endTime: ""
        },
        selectTableData:{}
      }
    },
    props:{
      filterTableData:{}
    },
    methods:{
      handleSearch(){
        // 筛选
        // 这里可以改进当右边的选择框为空的时候
        if(!this.search_data.startTime && !this.search_data.endTime){
          this.$emit('updata');
        } else if (!this.search_data.startTime || !this.search_data.endTime) {
          this.$message({
            type: "warning",
            message: "请选择时间区间"
          });
          this.$emit('updata');
        }else {
          // 获得选择的时间的时间戳
          const stime = this.search_data.startTime.getTime()/1000;
          const etime = this.search_data.endTime.getTime()/1000;

          this.selectTableData=this.filterTableData.filter(item=>{
            let time=item.time/1000;
            return time >= stime && time <= etime;
          });
          this.$emit("selectData",this.selectTableData);
        }
      }
    }
  }
</script>

<style scoped>

</style>