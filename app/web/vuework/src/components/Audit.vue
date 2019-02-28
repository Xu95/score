<template>
 <div>
<el-container style="height: 100%; border: 1px solid #eee">
  <el-aside width="180px" style="background-color: rgb(238, 241, 246)">
    <el-menu style="height:100%" default-active="3">
        <el-menu-item index="0">
            <i></i>
            <span slot="title"></span>
        </el-menu-item>
        <el-menu-item index="1">
            <i></i>
            <span slot="title"><b>功能模块</b></span>
        </el-menu-item>
        <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <el-button type="text" style="color: #606266" @click="tasklist()">任务列表</el-button>
        </el-menu-item>
        <el-menu-item index="3">
            <i class="el-icon-edit"></i>
            <span slot="title">任务审计</span>
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
        <el-table-column prop="taskID" label="编号" width="80%">
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称" width="400%">
        </el-table-column>
        <el-table-column prop="taskUser" label="申请人" width="200%">
        </el-table-column>
        <el-table-column prop="taskTime" label="任务启动时间" width="200%">
        </el-table-column>
        <el-table-column prop="taskScore" label="评分" width="100%">
        </el-table-column>
        <el-table-column property="status" label="功能区" width="200%">
            <template slot-scope="scope">
                <i class="el-icon-zoom-in"></i>
                <el-button type="text" v-model="scope.row.status" style="color: #606266" @click="showDetail(scope.row)">查看详情</el-button>  
            </template>
        </el-table-column>         
      </el-table>
    </el-main>

</el-container>

<el-dialog title="任务详情" :visible.sync="dialogVisible" :before-close="close" width="30%">
    <span>
        <strong>任务名：</strong>{{ dialogdata.taskName }}<br/>
        <strong>申请人：&nbsp;</strong>{{ dialogdata.taskUser }} &nbsp;&nbsp; <strong>启动时间：&nbsp; </strong>{{ dialogdata.taskTime }}
    </span>
    <hr/>
    <el-row>
        <el-col :span="12">
            <div class="grid-content bg-purple">
                <el-table :data="taskdetail.resultdata">
                    <el-table-column label="成果详情" width="200px" prop="detail" align="center">
                    </el-table-column>
                </el-table>
            </div>
        </el-col>
        <el-col :span="12">
            <div class="grid-content bg-purple-light">
                <el-table :data="taskdetail.timedata"> 
                    <el-table-column label="工作时间" width="200px" prop="refer" align="center">
                    </el-table-column>   
                </el-table>
            </div>
        </el-col>
    </el-row>
    <br/>
    <span slot="footer" class="dialog-footer">
    <span><b>评分：</b><input v-model="taskScore" type="text"></span>&nbsp;&nbsp;  
    <el-button type="primary" @click="auditing()">确 定</el-button>
    <el-button @click="dialogVisible = false">取 消</el-button>
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
      padding: 0px;
      font-size: 15px;
  }
  input {     
      border-bottom: 1px solid #dbdbdb;
      border-top:0px;
      border-left:0px;
      border-right:0px;
      height: 30px;
      outline:none;
  }
  .el-dialog__footer {
    padding: 10px 20px 20px;
    text-align: left;
  }
</style>

<script>
  export default {
    data() {    
      return {
        taskdata: [], //存放未审批的数据   task表
        taskdetail:[
            {   
                resultdata: [], //存放未审批任务的详情数据  result表
                timedata: [], //存放未审批任务的时间详情   time表
            }  
        ],
        name: JSON.parse(sessionStorage.getItem('username')),
        dialogVisible: false,  //弹窗默认不可见
        dialogdata:{},  //该变量存放向dialog传递的数据

        taskScore:'', //该变量存放任务的分数
        taskId: '',  //该变量存放任务编号
      }
    },
    //提前加载数据 未审批的任务的详细信息
    created: function(){
        this.$http.get('static/data.json').then((res) =>{
            var data = res.data;
            console.log(data);
            this.taskdata = data;
        });
        this.$http.get('static/task.json').then((res) =>{
            var data = res.data;
            console.log(data);
            this.taskdetail.resultdata=data;
            this.taskdetail.timedata=data;
            console.log(this.taskdetail);
        });
    },
    methods: {
      //切换到任务列表模块
      tasklist(){
          this.$router.replace('/tasklist');
      },

      //注销
      logout(){
          sessionStorage.setItem('username','');
          this.$router.replace('/login');
      },

      //将任务评分后，修改数据库文件并关闭弹窗 刷新页面
      auditing(){
        //   this.$axios({
        //       url: '/api/task/score',
        //       method: 'post',
        //       data: this.qs.stringify({
        //           task_id: this.taskId,
        //           score: this.taskScore
        //       })
        //   }).then((res) => {
        //       router.go(0);
        // },(err)=>{
        //     console.log(err);
        // })
        this.dialogVisible = false
      },

      //点击出现弹窗 通过任务编号获取详细信息  time表
      showDetail(row){
          console.log(row);
          this.dialogdata = row;
          this.taskId=row.taskID;
        //   this.$axios({
        //       url: '/api/task/detail',
        //       method: 'post',
        //       data: this.qs.stringify({
        //           task_id: this.taskId
        //       })
        //   }).then((res) => {
        //       this.timedata = res.data;
        //   },(err)=>{
        //       console.log(err);
        //   })
          this.dialogVisible = true
      },

      //关闭弹窗
      close(done){
          done();
      },
    }
  };
</script>