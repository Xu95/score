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
                        <el-form-item v-for="(item,index) in arr" :key="item.data.name" :label="'成果'+(index += 1)">
                            <a href="javascript:void(0);" @click="changeresult(item)">{{item.data.result_name ||
                                item.data.get('result_name')}}</a>
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
        taskquery: {
          task_name: '',
          time: '',
          result: {},
        },
        maxResultId: 0,
        delresult: [],
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
          time_detail: '',
          flag: 0,
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
        disables: false,
        isshow: false,
        index1: '',
        show1: true,
      }
    },
    created: function () {
      this.tasks.task_id = this.$route.params.task_id;
      this.tasks.task_name = this.$route.params.task_name;
      this.tasks.task_time = this.$route.params.time;
      this.taskquery.task_name = this.tasks.task_name;
      this.taskquery.time = this.tasks.task_time;
    },
    mounted: function () {
      let url = '/api/task/detail/' + this.taskId;
      console.log(url);
      this.$axios({
        url: '/api/task/detail/' + this.tasks.task_id,
        method: 'get',
      }).then((res) => {
        if(res.data.status === 304){
          this.$router.push({name:'error',params:{errorData:res.data.data}
          })
        }
        console.log(res.data);
        const result = res.data.data.results;
        for (let i in result) {
          if (result[i].result_id > this.maxResultId) this.maxResultId = parseInt(result[i].result_id);
          this.arr.push({data: result[i], flag: -1});
          console.log(this.arr);
        }
      }, (err) => {
        console.log(err);
      });
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
        console.log("uploadfile", file);
        const _file = file.file;
        this.refer = _file;
      },
      savegain() {
        if (this.save.result_name && this.save.result_detail && this.save.hour && this.save.time_detail && this.save.type_id) {
          this.gainshow = true;
          event.preventDefault();
          //this.refer = this.$refs.abc.value;
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
            formData.append('task_name', this.tasks.task_name);
            formData.append('result_id', this.maxResultId + 1);
            formData.append('time_id', this.maxResultId + 1);
          } else {
            formData = {
              result_name: this.save.result_name,
              result_detail: this.save.result_detail,
              hour: this.save.hour,
              time_detail: this.save.time_detail,
              type_id: this.save.type_id,
              refer: 'null',
              task_name: this.tasks.task_name,
              result_id: this.maxResultId + 1,
              time_id: this.maxResultId + 1,
            }
          }
          this.arr.push({data: formData, flag: 0});
          this.$refs.abc.value = '';
          this.refer = '';
          this.save = [{
            result_name: '',
            result_detail: '',
            hour: '',
            type_id: '',
            time_detail: '',
          }
          ];
          this.maxResultId += 1;
          this.error1 = false;
          this.check = true;
          this.show1 = true;
          this.show = false;
        } else {
          this.error1 = true;
        }
      },
      post1(data) {
        console.log("带文件上传");
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
        console.log("不带文件上传");
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
        if (!(this.save.result_name) && !(this.save.result_detail) && !(this.save.hour) && !(this.save.time_detail) && !(this.save.type_id)) {
          event.preventDefault();
          if (this.tasks.task_name !== this.taskquery.task_name || this.tasks.task_time !== this.taskquery.time) {
            this.$axios({
              url: '/api/task/edit',
              method: 'post',
              data: {
                task_id: this.tasks.task_id,
                task_name: this.tasks.task_name,
                time: this.tasks.task_time,
                user_name: this.name.loginuser,
                score: '0',
              }
            }).then((res) => {
              if(res.data.status === 304){
                this.$router.push({name:'error',params:{errorData:res.data.data}
                })
              }
            }).catch((err) => {
              console.log(err);
            })
          }
          if (this.delresult.length > 0) {
            for (let a in this.delresult) {
              console.log(a);
              let url = '/api/result/delete/' + this.delresult[a].data.task_id + '/' + this.delresult[a].data.result_id;
              console.log(url);
              this.$axios({
                url: url,
                method: 'get',
              }).then((res) => {
                if(res.data.status === 304){
                  this.$router.push({name:'error',params:{errorData:res.data.data}
                  })
                }
              }, (err) => {
                console.log(err);
              });
            }
          }
          const task_id = this.tasks.task_id;
          if (this.arr.length > 0) {
            for (let [index, a] of this.arr.entries()) {
              //未修改
              if (a.flag === -1) continue;

              //新增
              if (a.flag === 0) {
                if (a.data.hasOwnProperty('refer')) {
                  console.log(" 没有文件");
                  a.data.task_id = task_id;
                  this.post2(a.data).then((res) => {
                    if(res.data.status === 304){
                      this.$router.push({name:'error',params:{errorData:res.data.data}
                      })
                    }
                  })
                } else {
                  console.log(" 有文件");
                  a.data.append('task_id', task_id);
                  this.post1(a.data).then((res) => {
                    if(res.data.status === 304){
                      this.$router.push({name:'error',params:{errorData:res.data.data}
                      })
                    }
                  })
                }
              }
              //修改的成果
              if (a.flag === 1) {
                if (a.data.hasOwnProperty('refer') && this.isString(a.data.refer)) {
                  console.log(" 没有文件");
                  a.data.task_id = task_id;
                  this.post2(a.data).then((res) => {
                    if(res.data.status === 304){
                      this.$router.push({name:'error',params:{errorData:res.data.data}
                      })
                    }
                  })
                } else {
                  console.log(" 有文件");
                  a.data.append('task_id', task_id);
                  this.post1(a.data).then((res) => {
                    if(res.data.status === 304){
                      this.$router.push({name:'error',params:{errorData:res.data.data}
                      })
                    }
                  })
                }
              }

            }
          }
          this.$router.replace('/tasklist');
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
        if (item.data.refer === 'null' || item.data.hasOwnProperty('refer')) {
          this.save = {
            result_name: item.data.result_name,
            result_detail: item.data.result_detail,
            hour: item.data.hour,
            time_detail: item.data.time_detail,
            type_id: item.data.type_id,
            flag: item.flag,
          };
          if (item.data.refer === 'null') {
            this.refer = '';
          } else {
            this.refer = item.data.refer;
          }
        } else {
          this.save = {
            result_name: item.data.get('result_name'),
            result_detail: item.data.get('result_detail'),
            hour: item.data.get('hour'),
            time_detail: item.data.get('time_detail'),
            type_id: item.data.get('type_id'),
            flag: item.flag,
          };
          this.refer = item.data.get('myfile1');
        }
        console.log(this.refer);
        this.taskquery.result.result_name = this.save.result_name;
        this.taskquery.result.result_detail = this.save.result_detail;
        this.taskquery.result.hour = this.save.hour;
        this.taskquery.result.time_detail = this.save.time_detail;
        this.taskquery.result.type_id = this.save.type_id;
        this.taskquery.result.refer = this.save.refer;
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
          time_detail: '',
        };
        this.show = false;
        this.show1 = true;
      },
      change2() {
        this.isshow = false;
        if (this.save.result_name === this.taskquery.result.result_name && this.save.result_detail === this.taskquery.result.result_detail
          && this.save.hour === this.taskquery.result.hour && this.save.time_detail === this.taskquery.result.time_detail &&
          this.save.type_id === this.taskquery.result.type_id && this.isString(this.refer)) {
          this.cancelchange();
          return
        }
        if (this.save.result_name && this.save.result_detail && this.save.hour && this.save.time_detail && this.save.type_id) {
          this.gainshow = true;
          //this.index += 1;
          event.preventDefault();
          let formData, flag;
          console.log(this.refer);
          if (this.refer && !this.isString(this.refer)) {
            formData = new FormData();
            formData.append("myfile1", this.refer);
            formData.append('result_name', this.save.result_name);
            formData.append('result_detail', this.save.result_detail);
            formData.append('hour', this.save.hour);
            formData.append('time_detail', this.save.time_detail);
            formData.append('type_id', this.save.type_id);
            formData.append('task_name', this.tasks.task_name);
          } else {
            formData = {
              result_name: this.save.result_name,
              result_detail: this.save.result_detail,
              hour: this.save.hour,
              time_detail: this.save.time_detail,
              type_id: this.save.type_id,
              refer: 'null',
              task_name: this.tasks.task_name,
            }
          }
          if (this.save.flag === 0) flag = 0;//新增
          //编辑
          if (this.save.flag === -1) {
            flag = 1;
            if (this.refer && !this.isString(this.refer)) {
              formData.append('result_id', this.arr[this.index1].data.result_id);
              formData.append('time_id', this.arr[this.index1].data.time_id);
            } else {
              formData.result_id = this.arr[this.index1].data.result_id;
              formData.time_id = this.arr[this.index1].data.time_id;
            }
          }
          this.arr[this.index1].data = formData;
          this.arr[this.index1].flag = flag;
          console.log(this.arr[this.index1]);
          this.save = [{
            result_name: '',
            result_detail: '',
            hour: '',
            type_id: '',
            time_detail: '',
            flag: 0,
          }
          ];
          this.refer = '';
          this.error1 = false;
          this.check = true;
          this.show1 = true;
          this.show = false;
        } else {
          this.error1 = true;
        }
      },
      removeresult(item) {
        const index = this.arr.indexOf(item);
        if (index !== -1) {
          if (item.flag === -1 || item.flag === 1) {
            this.delresult.push({
              flag: 2, data: {
                task_id: this.tasks.task_id,
                result_id: item.data.result_id,
                time_id: item.data.time_id,
              }
            });
            this.error1 = false;
            this.check = true;
            this.show1 = true;
            this.show = false;
            console.log(this.delresult);
          }
          this.arr.splice(index, 1);
        }
      },
      close(done) {
        done();
      },
      renameRefer: function (row) {
        if (row.refer === 'null') return '无文件';
        return row.refer;
      },
      isString: function (str) {
        return (typeof str == 'string') && str.constructor === String;
      },
    }
  }
</script>

<style>

</style>
