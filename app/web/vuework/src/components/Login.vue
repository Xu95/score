<template>
    <div v-bind:style="note">
        <el-row style="margin-top:20%">
            <el-col :span="10">
                <el-input id="name" v-model="logindata.username" placeholder="请输入帐号">
                    <template slot="prepend">帐号</template>
                </el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10">
                <el-input id="password" v-model="logindata.password" type="password" placeholder="请输入密码">
                    <template slot="prepend">密码</template>
                </el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10">
                <el-button id="login" @click="login" style="width:100%" type="primary">登录</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  export default {
    inject: ['reload'],
    data() {
      return {
        logindata: {
          username: '',
          password: '',
        },
        note: {
          backgroundImage: 'url(' + require('../images/timg.jpg') + ')',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          height: '100%',
          width: '100%',
          position: 'fixed'
        },
        list: []
      }
    },
    methods: {
      async login() {
        //console.log(`username: ${this.logindata.username} password: ${this.logindata.password}`);
        this.$axios({
          url: this.urlAddr + '/user/login',
          method: 'post',
          data: {
            username: this.logindata.username,
            password: this.logindata.password,
          }
        }).then((res) => {
          if (res.data.status === 304) {
            this.$router.push({
              name: 'error', params: {errorData: res.data.data}
            })
          }
          if (res.data.status === 302) {
            alert('用户名或密码错误');
            this.reload();
          }
          if (res.data.status === 202) {
            console.log('login succeed!');
            const Data = {
              loginuser: res.data.data.username,
            };
            sessionStorage.setItem('username', JSON.stringify(Data));
            console.log('设置缓存完毕');
            this.$router.push({
              path: '/tasklist'
            })
          }
        }, (err) => {
          console.log(err);
        })

      }
    }
  }
</script>

<style>
    .el-row {
        margin-bottom: 20px;
        margin-left: 60%;
    }

    .el-row:last-child {
        margin-bottom: 0;
    }
</style>
