<template>
 <div>
<el-container style="height: 100%; border: 1px solid #eee">
  <el-aside width="180px" style="background-color: rgb(238, 241, 246)">
    <el-menu style="height:100%" default-active="2">
        <el-menu-item index="0">
            <i></i>
            <span slot="title"></span>
        </el-menu-item>
        <el-menu-item index="1">
            <i></i>
            <span slot="title">功能模块</span>
        </el-menu-item>
        <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">任务列表</span>
        </el-menu-item>
        <el-menu-item index="3">
            <i class="el-icon-edit"></i>
            <el-button type="text" style="color: #606266" @click="taskedit()" :disabled="disables">任务审计</el-button>
        </el-menu-item>
        <el-tooltip content="点击退出" placement="bottom">
            <el-menu-item index="4">
                <i class="el-icon-setting"></i>
                <el-button type="text" style="color: #606266" @click="logout()">{{ name.loginuser }}</el-button>
            </el-menu-item>
        </el-tooltip>
    </el-menu>
  </el-aside>
     
    <el-main>
      <el-table :data="taskdata">
        <el-table-column prop="taskID" label="编号" width="80">
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称" width="300">
        </el-table-column>
        <el-table-column prop="taskUser" label="申请人" width="100">
        </el-table-column>
        <el-table-column prop="taskTime" label="启动时间" width="100">
        </el-table-column>
        <el-table-column prop="taskScore" label="评分" width="80">
        </el-table-column>
        <el-table-column property="status" label="功能区" width="200">
            <template slot-scope="scope">
                <el-button type="text" v-model="scope.row.status" style="color: #606266" @click="dialogVisible = true">查看详情</el-button>  
            </template>
        </el-table-column>         
      </el-table>
    </el-main>
</el-container>

<el-dialog title="任务详情" :visible.sync="dialogVisible" :before-close="close" width="30%">
    <p>任务名：</p>
    <p>申请人：启动时间： </p>
    <el-table :data="taskdetail">
        <el-table-column label="成果详情" width="200" prop="name">
        </el-table-column>
        <el-table-column label="工作时间" width="200" prop="refer">
        </el-table-column>   
    </el-table>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="auditing()">确 定</el-button>
  </span>
</el-dialog>
</div> 
</template>


<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  .el-aside {
    color: #333;
  }
  .el-dialog__body {
      padding: 0px
  }
</style>

<script>
  export default {
    data() {    
      return {
        taskdata: [],
        taskdetail: [],
        name: JSON.parse(sessionStorage.getItem('username')),
        dialogVisible: false,
        disables:true
      }
    },
    created: function(){
        this.$http.get('static/data.json').then((res) =>{
            var data = res.data;
            console.log(data);
            this.taskdata = data;
        });
        this.$http.get('static/task.json').then((res) =>{
            var data = res.data;
            console.log(data);
            this.taskdetail=data;
        });
        var name= JSON.parse(sessionStorage.getItem('username'));
        if(name.loginuser == "litong"){
            this.disables = false;
        }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      taskedit(){
        this.$router.replace('/audit');
      },

      logout(){
          sessionStorage.setItem('username','');
          this.$router.replace('/login');
      },
      auditing(){
          this.dialogVisible = false;
      },
      close(done){
          done();
      }
    }
  };
</script>