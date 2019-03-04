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
                        <el-button type="text" style="color: #606266" @click="getTaskList()">任务列表</el-button>
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
            <el-main direction="vertical" style="margin-right: 30%;margin-left: 20%">
                <div>
                    <el-form ref="tasks" :model="tasks" :rules="rules" label-width="80px" label-position="right"
                             style="width:500px">
                        <el-form-item label="任务名称" prop="task_name">
                            <el-input v-model="tasks.task_name"></el-input>
                        </el-form-item>
                        <el-form-item label="启动时间" prop="task_time">
                            <el-date-picker v-model="tasks.task_time" type="date" placeholder="选择日期"
                                            style="width:420px">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-alert v-if="error" title="请填写内容" type="error" center
                                      show-icon>
                            </el-alert>
                        </el-form-item>
                    </el-form>
                    <el-form style="width:500px;margin-left:50px">
                        <el-form-item v-for="(item,index) in arr" :key="item.name" :label="'成果'+(index += 1)">
                            <a href="javascript:void(0);" @click="changeresult(item)">{{item.result_name ||
                                item.get('result_name')}}</a>
                            <el-button style="margin-left:20px" type="text" @click.prevent="removeresult(item)">删除
                            </el-button>
                        </el-form-item>
                        <el-form-item v-if="show1">
                            <el-button type="primary" @click="addResult()">成果添加</el-button>
                            <el-button type="primary" @click="change()" v-if="check&&!isshow">提交任务</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <el-form ref="save" :model="save" :rules="rules" label-width="80px" v-if="show" label-position="right"
                         style="width:500px">
                    <el-form-item label="成果名" prop="result_name">
                        <el-input v-model="save.result_name"></el-input>
                    </el-form-item>
                    <el-form-item label="成果描述" prop="result_detail">
                        <el-input v-model="save.result_detail"></el-input>
                    </el-form-item>
                    <el-form-item label="参考" prop="refer">
                        <el-upload ref="abc" class="upload-demo" :http-request="uploadfile">
                            <el-button ref="bbc" size="small" style="width:420px" v-if="!refer">上传参考文件</el-button>
                            <el-button ref="bbc" size="small" style="width:420px" v-if="refer">已有参考文件点击修改</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="工作类型">
                        <el-select v-model="save.type_id" placeholder="请选择" style="width:420px">
                            <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value">
                                <span style="float: right">{{ item.label }}</span>
                                <span style="float: left; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="工作时间" prop="hour">
                        <el-input v-model="save.hour"></el-input>
                    </el-form-item>
                    <el-form-item label="工时描述" prop="time_detail">
                        <el-input v-model="save.time_detail" type="textarea"></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="change2()" v-if="isshow">完成修改</el-button>
                    <el-button type="primary" @click="cancelchange()" v-if="isshow">取消修改</el-button>
                    <el-button type="primary" @click="savegain(this)" v-if="!isshow">提交成果</el-button>
                    <el-button type="primary" @click="cancelchange()" v-if="!isshow">取消</el-button>
                </el-form>
                <el-alert v-if="error1" title="请填写表格" type="error" center show-icon>
                </el-alert>
            </el-main>
        </el-container>
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
        tasks: {
          task_id: '',
          task_name: '',
          task_time: '',
          results: [],
          refer: '',
        },
        arr: [],
        name: JSON.parse(sessionStorage.getItem('username')),
        type: [{
          value: '1',
          label: '分析'
        }, {
          value: '2',
          label: '设计'
        }, {
          value: '3',
          label: '开发'
        }, {
          value: '4',
          label: '测试'
        }, {
          value: '5',
          label: '运维'
        }, {
          value: '6',
          label: '支持'
        }, {
          value: '7',
          label: '培训'
        }],
        save: {
          result_name: '',
          result_detail: '',
          hour: '',
          type_id: '',
          type_name: '',
          time_detail: '',
        },
        rules: {
          task_name: [
            {required: true, message: '请输入任务名', trigger: 'blur'},
          ],
          task_time: [
            {required: true, message: '请选择日期', trigger: 'blur'},
          ],
          result_name: [
            {required: true, message: '请输入成果名', trigger: 'blur'},
          ],
          hour: [
            {required: true, message: '请输入工作时间', trigger: 'blur'},
          ],
          time_detail: [
            {required: true, message: '请输入时间描述', trigger: 'blur'},
          ],
          result_detail: [
            {required: true, message: '请输入描述', trigger: 'blur'},
          ],
        },
        refer: '',
        show: false,
        gainshow: false,
        error: false,
        error1: false,
        check: false,
        disables: true,
        isshow: false,
        index1: '',
        show1: true,
      }
    },
    created: function () {
      if (this.name.loginuser == "余盛季") {
        this.disables = false;
      }
    },
    methods: {
      getTaskList() {
        this.$router.replace('/tasklist');
      },
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
      uploadfile(file) {
        console.log("uploadfile", file)
        const _file = file.file;
        this.refer = _file;
      },
      savegain() {
        if (this.save.result_name && this.save.result_detail && this.save.hour && this.save.time_detail) {
          this.gainshow = true;
          this.index += 1;
          event.preventDefault();
          //this.refer = this.$refs.abc.value;
          let formData;
          let formData1;
          console.log(this.refer);
          if (this.refer) {
            formData = new FormData();
            formData.append("myfile1", this.refer);
            formData.append('result_name', this.save.result_name);
            formData.append('result_detail', this.save.result_detail);
            formData.append('hour', this.save.hour);
            formData.append('time_detail', this.save.time_detail);
            formData.append('type_id', this.save.type_id);
            formData.append('type_name', this.save.type_name);
            formData.append('task_name', this.tasks.task_name);
          } else {
            formData = {
              result_name: this.save.result_name,
              result_detail: this.save.result_detail,
              hour: this.save.hour,
              time_detail: this.save.time_detail,
              type_id: this.save.type_id,
              type_name: this.save.type_name,
              refer: 'null',
              task_name: this.tasks.task_name,
            }
          }
          this.arr.push(formData);
          this.$refs.abc.value = '';
          this.refer = '';
          this.save = [{
            result_name: '',
            result_detail: '',
            hour: '',
            type_id: '',
            type_name: '',
            time_detail: '',
          }
          ];
          this.error1 = false;
          this.check = true;
          this.show1 = true;
          this.show = false;
        } else {
          this.error1 = true;
        }
        console.log(this.$refs);
      },
      post1(data) {
        console.log("jjbb");
        return this.$axios({
          contentType: false,
          processData: false,
          // dataType: "html",//返回整合HTML
          // dataType: "json",//返回json格式设置
          url: '/api/result/edit',
          method: 'post',
          data: data,
        })
      },
      post2(data) {
        console.log("jjbb");
        return this.$axios({
          //contentType: 'multipart/form-data',
          //processData: false,
          // dataType: "html",//返回整合HTML
          // dataType: "json",//返回json格式设置
          url: '/api/result/edit',
          method: 'post',
          data: data,
        })
      },
      change() {
        if (!(this.save.result_name) && !(this.save.result_detail) && !(this.save.hour) && !(this.save.time_detail)) {
          event.preventDefault();
          this.$axios({
            url: '/api/task/increase',
            method: 'post',
            data: {
              task_name: this.tasks.task_name,
              user_name: this.name.loginuser,
              score: '0',
              time: this.tasks.task_time,
            }
          }).then((res) => {
            if (res.data.status === 304) {
              this.$router.push({
                name: 'error', params: {errorData: res.data.data}
              })
            }
            const task_id = res.data.data.taskid
            console.log("tasksave succeed");
            if (this.arr.length > 0) {
              for (let [index, a] of this.arr.entries()) {
                console.log(a);
                if (a.hasOwnProperty('refer')) {
                  console.log(" 没有文件");
                  a.task_id = task_id;
                  a.result_id = index + 1;
                  a.time_id = index + 1;
                  this.post2(a).then((res) => {
                    if (res.data.status === 304) {
                      this.$router.push({
                        name: 'error', params: {errorData: res.data.data}
                      })
                    }
                  })
                } else {
                  console.log(" 有文件");
                  a.append('task_id', task_id);
                  a.append('result_id', index + 1);
                  a.append('time_id', index + 1);
                  this.post1(a).then((res) => {
                    if (res.data.status === 304) {
                      this.$router.push({
                        name: 'error', params: {errorData: res.data.data}
                      })
                    }
                  })
                }
              }
            }
            this.$router.replace('/tasklist');
          }, (err) => {
            console.log(err);
          });
        } else {
          this.error1 = true;
        }
      },
      addResult() {
        if (this.tasks.task_name && this.tasks.task_time) {
          this.refer = '';
          this.show = true;
          this.error = false;
          this.show1 = false;
        } else {
          this.error = true;
          this.show = false;
        }
      },
      changeresult(item) {
        console.log(item);
        if (this.tasks.task_name && this.tasks.task_time) {
          this.show = true;
          this.error = false;
          this.show1 = false;
        } else {
          this.error = true;
          this.show = false;
        }
        if (item.refer === 'null') {
          this.save = {
            result_name: item.result_name,
            result_detail: item.result_detail,
            hour: item.hour,
            time_detail: item.time_detail,
            type_id: item.type_id,
            type_name: item.type_name,
          };
        } else {
          this.save = {
            result_name: item.get('result_name'),
            result_detail: item.get('result_detail'),
            hour: item.get('hour'),
            time_detail: item.get('time_detail'),
            type_id: item.get('type_id'),
            type_name: item.get('type_name'),
          };
          this.refer = item.get('myfile1');
          console.log(this.refer);
        }
        this.index1 = this.arr.indexOf(item);
        this.isshow = true;
        this.show = true;
        this.show1 = false;
      },
      cancelchange() {
        this.isshow = false;
        this.save = {
          result_name: '',
          result_detail: '',
          hour: '',
          type_id: '',
          type_name: '',
          time_detail: '',
        }
        this.show = false;
        this.show1 = true;
      },
      change2() {
        this.isshow = false;
        if (this.save.result_name && this.save.result_detail && this.save.hour && this.save.time_detail) {
          this.gainshow = true;
          //this.index += 1;
          event.preventDefault();
          let formData;
          console.log(this.refer);
          if (this.refer) {
            formData = new FormData();
            formData.append("myfile1", this.refer);
            formData.append('result_name', this.save.result_name);
            formData.append('result_detail', this.save.result_detail);
            formData.append('hour', this.save.hour);
            formData.append('time_detail', this.save.time_detail);
            formData.append('type_id', this.save.type_id);
            formData.append('type_name', this.save.type_name);
            formData.append('task_name', this.tasks.task_name);
          } else {
            formData = {
              result_name: this.save.result_name,
              result_detail: this.save.result_detail,
              hour: this.save.hour,
              time_detail: this.save.time_detail,
              type_id: this.save.type_id,
              type_name: this.save.type_name,
              refer: 'null',
              task_name: this.tasks.task_name,
            }
          }
          this.arr[this.index] = formData;
          this.refer = '';
          this.save = [{
            result_name: '',
            result_detail: '',
            hour: '',
            type_id: '',
            type_name: '',
            time_detail: '',
          }
          ];
          this.error1 = false;
          this.check = true;
          this.show1 = true;
          this.show = false;
        } else {
          this.error1 = true;
        }
      },
      removeresult(item) {
        const index = this.arr.indexOf(item)
        if (index !== -1) {
          this.arr.splice(index, 1)
        }
      },
      close(done) {
        done();
      },
      renameRefer: function (row) {
        if (row.refer === 'null') return '无文件';
        return row.refer;
      }
    }
  }
</script>

<style>

</style>
