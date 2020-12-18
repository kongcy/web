<template>
  <div style="padding: 30px 40px 0px;">
        <el-form style="display: none;" :model="form" status-icon :rules="rules" ref="login" label-width="100px" @keyup.enter.native="login">
            <el-form-item label="账号名称" prop="username">
                <el-input class="accounts" v-model="form.username" autofocus="autofocus"></el-input>
            </el-form-item>
            <el-form-item label="登录密码" prop="password">
                <el-input type="password" v-model="form.password"></el-input>
            </el-form-item>

            <el-row>
                <el-col :span="18"><el-checkbox v-model="remberMe" style="margin-left: 30px;">记住密码</el-checkbox></el-col>
                <el-col :span="6"  style="text-align: right;" ><div style="cursor: pointer; font-size: 14px;" @click="download"><i class="el-icon-download" ></i>组件下载</div></el-col>
            </el-row>
            <center>
                <el-button type="primary" :loading="loginLoading" @click="login" class="login-btn">登录</el-button>
            </center>
        </el-form>

        <control-dialog ref="controlDialog" />
  </div>
</template>

<script>
import ControlDialog from '@/components/login/ControlDialog.vue'

export default {
    name: 'PwdLogin2',
    components: {
      ControlDialog,
    },
    data() {
        return {
            form: {
                username: '',
                password: '',
                verifyCode: 'aaaa'
            },
            rules: {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
                ],
                verifyCode: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                    { min: 4, max: 4, message: '长度为 4 个字符', trigger: 'blur' }
                ]
            },
            remberMe: false,
            verifyCode: 'aaaa',
            loginLoading: false
        }
    },
    mounted() {
        this.getUserAndPsw();
        // this.getVerifyCode();
        // this.getRemberMe();
    },
    methods: {
        getUserAndPsw(){
            let url = window.location.href.split('?')[1];
            localStorage.setItem('url', url);
            let vars = url.split('&'); // 去掉问号, 问号为第一个字符
            for( let i = 0; i < vars.length; i++ ){
                let pair = vars[i].split('=');
                if( pair[0] === 'userName' ){ xtxk.cache.set('AutomaticPlayUsername', { userName: pair[1]}) }
                else if( pair[0] === 'passWord' ){ xtxk.cache.set('AutomaticPlayPassword', { passWord: pair[1]}) }
                else if( pair[0] === 'ip' ){ xtxk.cache.set('AutomaticPlayIp', { ip: pair[1]}) }
                else if( pair[0] === 'strategeId' ){ xtxk.cache.set('AutomaticPlayStrategeId', { strategeId: pair[1]})  }
                else if( pair[0] === 'resourceId' ){ xtxk.cache.set('AutomaticPlayResourceId', { resourceId: pair[1]}) }
                else if( pair[0] === 'NVRDeviceId' ){ xtxk.cache.set('AutomaticPlayNVRDeviceId', { NVRDeviceId: pair[1]}) }
            }
            console.log('url获取的用户', this.form.username);
            this.unifyRegister();
        },
        // 中油 统一登录
        unifyRegister(){
            let tilimu = this.apiSDK.config.talimu;
            let userName = xtxk.cache.get('AutomaticPlayUsername').userName;
            let ydm;
            let array = userName.split('.');
            if( array ) {
               ydm = array[1];
               this.form.username = array[0];
            };
            let data = {
                ydm: ydm,
                userName: userName,
                passWord: decodeURIComponent(xtxk.cache.get('AutomaticPlayPassword').passWord),
                ip: tilimu.ip
            };
            let that = this;
            this.apiSDK.userLogin(data, obj => {
                if( obj.code == 1 && obj.data ) {
                    console.log('统一登录返回------', obj);
                    // xtxk.cache.set('unifyRegister', obj);
                    // 将手机号保存在本地
                    xtxk.cache.set('yhsjhm',  obj.data.yhsjhm );
                    xtxk.cache.set('yhidym',  obj.data.yhid );
                    xtxk.cache.set('dwsx',  obj.data.dwsx );
                    that.login('play');
                } else {
                    // console.log('统一登录失败------', obj);
                    that.$message({message: '登录失败: ' + obj.msg, type: 'error'});
                }
            });
        },
        // 登录
        login(type) {
            console.log('登录');
            // this.$refs.login.validate(valid => {
            //     if (valid) {
            //         this.remberMeChange(this.remberMe)
            //         this.loginLoading = true
                    this.apiSDK.loginWithAccount(xtxk.cache.get('AutomaticPlayUsername').userName, xtxk.cache.get('AutomaticPlayPassword').passWord, 'aaaa', (res) => {
                        // this.loginLoading = false
                        if(res && res.Ret == 0){
                            //store
                            this.$store.commit("updateUserinfo", {token:res.token, userID:res.data.userID, userName:res.data.userName});
                            xtxk.cache.set('USER', {token: res.token, userId: res.data.userID, userName:res.data.userName, validTime:res.validTime})
                            this.apiSDK.initUserInfo(res.data.userID, res.data.userName, res.token);
                            // if(type === 'play'){
                            this.$router.push('Play/AutomaticPlay');
                            // } else {
                            //   this.$router.push('Home');
                            // }

                        } else if(res && res.Ret == 2){
                            this.$store.commit("updateUserinfo", {token:res.token, userID:res.data.userID, userName:res.data.userName});
                            xtxk.cache.set('USER', {token: res.token, userId: res.data.userID, userName:res.data.userName})
                            this.apiSDK.initUserInfo(res.data.userID, res.data.userName , res.token);
                            //抢占登录
                            this.$refs.controlDialog.showDialog("login");
                        } else {
                            this.form.verifyCode = ''
                            this.getVerifyCode()

                            if(res.Ret == -2){
                                this.$message({message: '该账号已在别处登录', type: 'error'});
                            } else if(res.Ret == -12){
                                this.$message({message: '该账号已被锁定', type: 'error'});
                            } else if (res.Ret == -4) {
                                this.$message({message: '服务异常', type: 'error'});
                            } else if (res.Ret == -10) {
                                this.$message({message: '密码错误', type: 'error'});
                            } else if (res.Ret == -11) {
                                this.$message({message: '没有权限', type: 'error'});
                            } else {
                                this.$message({message: '登录失败', type: 'error'});
                            }

                        }
                    })
            //     }             
            // })
        },
        // 获取验证码
        getVerifyCode() {
            this.verifyCode = this.apiSDK.getValidCodeUrl();
        },
        // 记住密码
        remberMeChange(val) {
            if (val) {
                let obj = {username: this.form.username, password: this.form.password, checked: val}
                xtxk.cache.set('REMBERME', obj, 'localStorage')
            } else {
                xtxk.cache.remove('REMBERME', 'localStorage')
            }
        },
        getRemberMe() {
            let remberMe = xtxk.cache.get('REMBERME', 'localStorage')
            if (remberMe !== undefined) {
                if (remberMe.checked) {
                    this.form.username = remberMe.username
                    this.form.password = remberMe.password
                    this.remberMe = remberMe.checked
                }
            }
        },
        // 下载
        download() {
            let rootPath = window.location.href
            let ind = rootPath.indexOf("#")
            rootPath = ind > -1 ? rootPath.substring(0, ind) : rootPath

            const pluginFilePath =  rootPath + `/static/BrowserPlugin/PlayerPluginOpengl.msi`
            window.open(pluginFilePath, "_self");
        }
    }
}
</script>
<style scoped>
/deep/ .el-form-item__label {
    font-size: 14px;
    font-weight: bold
}
/deep/ .el-form-item__label:before {
    content: none !important
}
</style>
