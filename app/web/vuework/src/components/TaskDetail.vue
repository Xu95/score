<template>
    <div>
        <el-container style="height: 100%; border: 1px solid #eee">
            <el-col :span="3" style="background-color: rgb(238, 241, 246)">
                <el-menu style="height:100%" default-active="2">
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
                        <el-button type="text" style="color: #606266" @click="getTaskList">任务列表</el-button>
                    </el-menu-item>
                    <el-menu-item index="3" :disabled="disables">
                        <i class="el-icon-edit"></i>
                        <el-button type="text" style="color: #606266" @click="taskedit()">任务审计</el-button>
                    </el-menu-item>
                    <el-tooltip content="点击退出" placement="bottom">
                        <el-menu-item index="4">
                            <i class="el-icon-setting"></i>
                            <el-button type="text" style="color: #606266" @click="logout()">{{ name.loginuser }}
                            </el-button>
                        </el-menu-item>
                    </el-tooltip>
                </el-menu>
            </el-col>

            <el-col :span="20">
                <el-table :data="taskdetail" :default-sort="{prop: 'detail.result_id', order: 'descending'}"
                          align="center">
                    <el-table-column prop="detail.result_id" label="编号" width="80%" sortable align="center">
                    </el-table-column>
                    <el-table-column prop="detail.result_name" label="成果名称" width="150%" sortable align="center">
                    </el-table-column>
                    <el-table-column prop="this.taskquery.applicant_name" label="申请人" width="130%" sortable
                                     align="center"
                                     :formatter="changeName">
                    </el-table-column>
                    <el-table-column prop="detail.type_name" label="工作类型" width="100%" align="center">
                    </el-table-column>
                    <el-table-column prop="detail.time_detail" label="工时详细" width="200%" sortable align="center">
                    </el-table-column>
                    <el-table-column label="参考" width="300%" prop="refer" align="center"
                                     :formatter="renameRefer"></el-table-column>
                    <el-table-column prop="detail.score" label="评分" width="100%" :formatter="changescore"
                                     align="center"></el-table-column>
                    <el-table-column property="status" label="功能区" width="160%" align="center">
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button type="info" v-model="scope.row.status" style="color: #606266"
                                           v-if="flag"
                                           @click="deleteResult(scope.row)">删除
                                </el-button>
                                <el-button type="primary" v-model="scope.row.status" style="color: #606266"
                                           v-if="flag"
                                           @click="editTask()">编辑
                                </el-button>
                                <el-button type="text" v-model="scope.row.status" style="color: #606266"
                                           v-if="!flag"
                                           @click="showDetail(scope.row)">无法编辑
                                </el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>

            <el-col :span="6" style="margin-top: 6%">
                <div>
                    <el-button @click="addTask()" type="primary" style="width:220px">新建任务</el-button>
                    <br><br><br>
                    <el-button @click="editTask()" type="primary" style="width:220px" v-if="flag">新建成果</el-button>
                </div>
            </el-col>
        </el-container>

        <!-- 新增任务 -->
        <el-dialog title="新增任务" :visible.sync="dialogVisible2" :before-close="close" width="30%">
            <p><b>任务名称：</b><input v-model="newtask.name" type="text"></p>
            <p><b>启动时间：</b><input v-model="newtask.starttime" type="text"></p>
            <p><b>成果展示：</b><input v-model="newtask.refer" type="text" placeholder="请输入链接"></p>
            <span slot="footer" class="dialog-footer">
    <el-button @click="addresult()" type="primary" circle>成果添加</el-button>
    <el-button @click="dialogVisible2 = false">取 消</el-button>
    <el-button type="primary" @click="auditing()">确 定</el-button>
  </span>
        </el-dialog>

        <!-- 新增任务成果 -->
        <el-dialog title="新增任务" :visible.sync="dialogVisible3" :before-close="close" width="30%">
            <p><b>成果名：</b><input v-model="newtask.name" type="text"></p>
            <p><b>参考：</b><input v-model="newtask.starttime" type="text"></p>
            <p><b>描述：</b><input v-model="newtask.refer" type="text" placeholder="请输入链接"></p>
            <p><b>工作时间：</b><input v-model="newtask.starttime" type="text"></p>
            <p><b>时间描述：</b><input v-model="newtask.starttime" type="text"></p>
            <span slot="footer" class="dialog-footer">
    <el-button @click="addresult()" type="primary" circle>成果添加</el-button>
    <el-button @click="dialogVisible2 = false">取 消</el-button>
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

    input {
        border-bottom: 1px solid #dbdbdb;
        border-top: 0px;
        border-left: 0px;
        border-right: 0px;
        height: 30px;
        outline: none;
    }
</style>

<script>
  export default {
    inject: ['reload'],
    data() {
      return {
        taskdetail: [],
        taskquery: {
          task_id: '',
          task_name: '',
          applicant_name: '',
          time: ''
        },
        timedata1: '',
        timedata2: '',
        dialogdata: {},
        name: JSON.parse(sessionStorage.getItem('username')),
        dialogVisible1: false,
        dialogVisible2: false,
        dialogVisible3: false,
        flag: false,
        disables: true,
        newtask: {
          name: '',
          starttime: '',
        }
      }
    },
    created: function () {
      if (this.name.loginuser == "余盛季") {
        this.disables = false;
      }
    },
    mounted: function () {
      this.taskquery.task_id = this.$route.params.task_id;
      this.taskquery.task_name = this.$route.params.task_name;
      this.taskquery.applicant_name = this.$route.params.applicant_name;
      this.taskquery.time = this.$route.params.time;
      let check = this.$route.params.score;
      console.log(`the socre : ${this.$route.params.score}`);
      if (this.name.loginuser === this.taskquery.applicant_name && check === '0') this.flag = true;
      let url = this.urlAddr+'/task/detail/' + this.taskId;
      console.log(url);
      this.$axios({
        url: this.urlAddr+'/task/detail/' + this.taskquery.task_id,
        method: 'get',
      }).then((res) => {
        if (res.data.status === 304) {
          this.$router.push({
            name: 'error', params: {errorData: res.data.data}
          })
        }
        const result = res.data.data.results;
        for (let i in result) {
          this.taskdetail.push({id: i, detail: result[i]});
        }
      }, (err) => {
        console.log(err);
      });
    },
    methods: {
      taskedit() {
        if (this.disables === false) {
          this.$router.replace('/audit');
        } else {
          this.$message.error('当前用户没有操作权限');
        }
      },
      editTask() {
        this.$router.replace({
          name: 'EditTask',
          params: {
            task_id: this.taskquery.task_id,
            task_name: this.taskquery.task_name,
            time: this.taskquery.time,
          }
        })
      },
      logout() {
        sessionStorage.setItem('username', '');
        this.$router.replace('/login');
      }
      ,
      auditing() {
        this.dialogVisible1 = false;
      }
      ,
      close(done) {
        done();
      }
      ,
      addTask() {
        //this.dialogVisible2 = true;
        this.$router.replace('/addTask');
      }
      ,
      timeSearch(t1, t2) {
        let url = this.urlAddr+'/task/timeSearch/' + t1 + '/' + t2;
        console.log(url);
        this.$axios({
          url: this.urlAddr+'/task/timeSearch/' + t1 + '/' + t2,
          method: 'get',
        }).then((res) => {
          if (res.data.status === 304) {
            this.$router.push({
              name: 'error', params: {errorData: res.data.data}
            })
          }
          this.taskdata = [];
          const result = res.data.data.results;
          for (let i in result) {
            this.taskdata.push({id: i, detail: result[i]});
          }
          console.log(this.taskdata);
        }, (err) => {
          console.log(err);
        });
      },
      changescore: function (row) {
        let name = row.detail.score;
        if (name === '0') {
          name = '未审核';
        }
        console.log(name);
        return name;
      },
      getTaskList: function () {
        this.$router.replace('/tasklist');
      },
      changeName: function () {
        return this.taskquery.applicant_name;
      },
      deleteResult: function (row) {
        let url = this.urlAddr+'/result/delete/' + this.taskquery.task_id + '/' + row.detail.result_id;
        console.log(url);
        console.log(row);
        this.$axios({
          url: url,
          method: 'get',
        }).then((res) => {
          if (res.data.status === 304) {
            this.$router.push({
              name: 'error', params: {errorData: res.data.data}
            })
          }
        }, (err) => {
          console.log(err);
        });
        this.reload();
      },
      renameRefer: function (row) {
        if (row.detail.refer === 'null') return '无文件';
        return row.detail.refer;
      },
    }
  };
</script>