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
                        <span slot="title">任务列表</span>
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

            <el-col :span="15">
                <el-table :data="taskdata" :default-sort="{prop: 'id', order: 'descending'}" width="100%">
                    <el-table-column prop="id" label="编号" min-width="9%" sortable :sort-method="sortById">
                    </el-table-column>
                    <el-table-column prop="detail.taskname" label="任务名称" min-width="25%" sortable
                                     :sort-method="sortByName">
                    </el-table-column>
                    <el-table-column prop="detail.applicant_name" label="申请人" min-width="11%" sortable
                                     :sort-method="sortByApplicant">
                    </el-table-column>
                    <el-table-column prop="detail.time" label="启动时间" min-width="15%" sortable :sort-method="sortByTime">
                    </el-table-column>
                    <el-table-column prop="detail.score" label="评分" min-width="12%" :formatter="changescore"
                                     :sort-method="sortByScore">
                    </el-table-column>
                    <el-table-column property="status" label="功能区" min-width="13%">
                        <template slot-scope="scope">
                            <i class="el-icon-zoom-in"></i>
                            <el-button type="text" v-model="scope.row.status" style="color: #606266"
                                       @click="showDetail(scope.row)">查看详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>

            <el-col :span="6" style="margin-top: 6%">
                <div>
                    <el-button @click="addTask()" type="primary" style="width:220px">新建任务</el-button>
                    <div class="block">
                        <br/><br/><br/><br/>
                        <el-date-picker v-model="timedata1" type="date" placeholder="起始日期" format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"></el-date-picker>
                        <p></p>
                        <el-date-picker v-model="timedata2" type="date" placeholder="结束日期" format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"></el-date-picker>
                    </div>
                    <br/>
                    <el-button icon="el-icon-search" type="primary" style="width:220px"
                               @click=timeSearch(timedata1,timedata2)>查询
                    </el-button>
                </div>
            </el-col>
        </el-container>

        <!-- 查看任务详情 如果当前登录人员是任务的发布者可以对任务进行编辑 -->
        <el-dialog title="任务详情" :visible.sync="dialogVisible1" :before-close="close" width="30%">
    <span>
        <strong>任务名：</strong>{{ dialogdata.taskname }}<br/>
        <strong>申请人：&nbsp;</strong>{{ dialogdata.applicant_name}} &nbsp;&nbsp; <strong>启动时间：&nbsp; </strong>{{ dialogdata.time }}
    </span>
            <hr/>
            <el-row>
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <el-table :data="taskdetail">
                            <el-table-column label="成果详情" width="200px" prop="detail.result_detail" align="center">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <el-table :data="taskdetail">
                            <el-table-column label="工作时间" width="200px" prop="detail.hour" align="center">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <el-table :data="taskdetail">
                            <el-table-column label="工作类型" width="200px" prop="detail.type_name" align="center">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <el-table :data="taskdetail">
                            <el-table-column label="成果名" width="200px" prop="detail.result_name" align="center">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>
            <br/>
            <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="auditing()">确 定</el-button>
    <el-button @click="dialogVisible1 = false">取 消</el-button>
  </span>
        </el-dialog>

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
    data() {
      return {
        taskdata: [],
        taskdetail: [],
        taskId: '',
        timedata1: '',
        timedata2: '',
        dialogdata: {},

        name: JSON.parse(sessionStorage.getItem('username')),
        dialogVisible1: false,
        dialogVisible2: false,
        dialogVisible3: false,
        disables: true,

        newtask: {
          name: '',
          starttime: '',
        }
      }
    },
    created: function () {
      this.$axios({
        url: this.urlAddr+'/task/list/0',
        method: 'get',
      }).then((res) => {
        if (res.data.status === 304) {
          this.$router.push({
            name: 'error', params: {errorData: res.data.data}
          })
        }
        const tasklist = res.data.data.results;
        for (let i in tasklist) {
          this.taskdata.push({id: i, detail: tasklist[i]});
        }
      }, (err) => {
        console.log(err);
      });
      var name = JSON.parse(sessionStorage.getItem('username'));
      if (name.loginuser === this.auditName) {
        this.disables = false;
      }
    },
    methods: {
      taskedit() {
        if (this.disables === false) {
          this.$router.replace('/audit');
        } else {
          this.$message.error('当前用户没有操作权限');
        }
      },

      logout() {
        sessionStorage.setItem('username', '');
        this.$router.replace('/login');
      },
      auditing() {
        this.dialogVisible1 = false;
      },
      close(done) {
        done();
      },
      showDetail(row) {
        //console.log(row.detail.task_id);
        let url = 'TaskDetail';
        this.$router.replace({
          name: url,
          params: {
            task_id: row.detail.task_id,
            applicant_name: row.detail.applicant_name,
            task_name: row.detail.taskname,
            time: row.detail.time,
            score: row.detail.score,
          }
        })
      },
      addTask() {
        //this.dialogVisible2 = true;
        this.$router.replace('/addTask');
      },
      timeSearch(t1, t2) {
        if(!t1) t1 = '2000-01-01';
        if(!t2) t2 = '2100-01-01';
        let url = this.urlAddr+'/task/timeSearch/' + t1 + '/' + t2;
       // console.log(url);
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
          //console.log(this.taskdata);
        }, (err) => {
          console.log(err);
        });
      },
      changescore: function (row) {
        let name = row.detail.score;
        if (name === '0') {
          name = '未审核';
        }
       // console.log(name);
        return name;
      },
      sortByName: function (obj1, obj2) {
        let v1 = obj1.detail.taskname;
        let v2 = obj2.detail.taskname;
        return v1 - v2;
      },
      sortByApplicant: function (obj1, obj2) {
        let v1 = obj1.detail.applicant_name;
        let v2 = obj2.detail.applicant_name;
        return v1 - v2;
      },
      sortByTime: function (obj1, obj2) {
        let v1 = obj1.detail.time;
        let v2 = obj2.detail.time;
        return v1 - v2;
      },
      sortById: function (obj1, obj2) {
        let v1 = obj1.id;
        let v2 = obj2.id;
        return v1 - v2;
      },
      sortByScore: function (obj1, obj2) {
        let v1 = obj1.detail.score;
        let v2 = obj2.detail.score;
        return v1 - v2;
      },
    }
  };
</script>