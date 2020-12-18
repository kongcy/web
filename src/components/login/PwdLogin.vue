<template>
  <div style="padding: 50px 40px 0px;">
        <el-form :model="form" status-icon :rules="rules" ref="login" label-width="100px" @keyup.enter.native="login">
            <el-form-item  prop="username">
                <el-input placeholder="请输入账号名称" class="accounts" v-model="form.username" autofocus="autofocus" :class="unificationLogin ? 'unificationLoginInput': ''">
                        <i slot="prefix" class="el-input__icon el-icon-users"></i>
                </el-input>
                <!-- <el-input class="accounts" v-model="form.username" autofocus="autofocus"></el-input> -->
                <el-select v-if="unificationLogin" v-model="selectAreaModel" placeholder="请选择" size='mini' class="selectArea">
                    <el-option
                    v-for="item in selectAreaData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
             
            <el-form-item  prop="password">
                <el-input placeholder="请输入登录密码" type="password" v-model="form.password">
                    <i slot="prefix" class="el-input__icon el-icon-password"></i>
                </el-input>
                <!-- <el-input type="password" v-model="form.password"></el-input> -->
            </el-form-item>
            <!-- <el-row>
                <el-col :span="17">
                    <el-form-item label="验证码" prop="verifyCode">
                        <el-input v-model="form.verifyCode" maxlength="4"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <img :src="verifyCode" style="cursor:pointer" @click="getVerifyCode" width="100%" height="40" />
                </el-col>
            </el-row> -->

            <el-row>
                <el-col :span="7"><el-checkbox v-model="unificationLogin">统一认证</el-checkbox></el-col>
                <el-col :span="11"><el-checkbox v-model="remberMe">记住密码</el-checkbox></el-col>               
                <el-col :span="6"  style="text-align: right;" ><div style="cursor: pointer; font-size: 14px;color:#fff;" @click="download"><i class="el-icon-download" ></i>组件下载</div></el-col>
            </el-row>
            <center>
                <!-- @click="login" -->
                <el-button type="primary" :loading="loginLoading" @click="estimateLogin"  class="login-btn">登&nbsp;录</el-button>
            </center>
        </el-form>

        <control-dialog ref="controlDialog" />
  </div>
</template>

<script>
import ControlDialog from '@/components/login/ControlDialog.vue'

export default {
    name: 'PwdLogin',
    components: {
      ControlDialog,
    },
    data() {
        let checkUsrName=(rule,value,callback)=>{
            const regUserName=/^[0-9a-zA-Z_]{1,}$/;
            if(regUserName.test(value)){
                return callback();
            }
            callback(new Error("账号包含英文字母、数字、下划线"))
        }
        return {
            form: {
                username: '',
                password: '',
                verifyCode: 'aaaa'
            },
            rules: {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' },
                    { validator:checkUsrName, trigger: 'blur' }
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
            unificationLogin: false,
            verifyCode: 'aaaa',
            loginLoading: false,
            selectAreaData: [
                { label: '塔里木', value: 'tlm' },
                { label: '塔西南', value: 'txn' },
                { label: '乙方单位', value: 'ptr' },
            ],
            selectAreaModel: ''
        }
    },
    mounted() {
        this.getVerifyCode();
        this.getRemberMe();
    },
    methods: {
        estimateLogin(){
            if( this.unificationLogin ){
                console.log('ssss', this.selectAreaModel);
                xtxk.cache.set('ydm',  this.selectAreaModel );
                // 判断是否统一登录
                this.unifyRegister();
            } else {
                this.login();
            }
        },
        // 中油 统一登录
        unifyRegister(){
            let tilimu = this.apiSDK.config.talimu;
            let data = {
                ydm: xtxk.cache.get('ydm'),
                userName: this.form.username + '.' + xtxk.cache.get('ydm'),
                passWord: decodeURIComponent(this.form.password),
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
                    that.login();
                } else {
                    // console.log('统一登录失败------', obj);
                    that.$message({message: '登录失败: ' + obj.msg, type: 'error'});
                }
            });
        },
        // 登录
        login() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    this.remberMeChange(this.remberMe)
                    this.loginLoading = true;
                    this.apiSDK.loginWithAccount(this.form.username, this.form.password, 'aaaa', (res) => {
                        this.loginLoading = false
                        if(res && res.Ret == 0){
                            //store
                            this.$store.commit("updateUserinfo", {token:res.token, userID:res.data.userID, userName:res.data.userName});
                            xtxk.cache.set('USER', {token: res.token, userId: res.data.userID, userName:res.data.userName, validTime:res.validTime})
                            this.apiSDK.initUserInfo(res.data.userID, res.data.userName, res.token);
                            this.noPluginLogin(this.form.username)
                            this.$router.push('Home');
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

                            // if(res.Ret === 0) {
                            //     this.$message({message: '登录失败', type: 'error'});
                            // } else if (res.Ret == -1) {
                            //     this.$message({message: '参数异常', type: 'error'});
                            // } else if (res.Ret == -2) {
                            //     this.$message({message: 'Token验证失败', type: 'error'});
                            // } else if (res.Ret == -3) {
                            //     this.$message({message: 'Token过期', type: 'error'});
                            // } else if (res.Ret == -4) {
                            //     this.$message({message: '服务异常', type: 'error'});
                            // } else if (res.Ret == -9) {
                            //     this.$message({message: '用户不存在', type: 'error'});
                            // } else if (res.Ret == -10) {
                            //     this.$message({message: '密码错误', type: 'error'});
                            // } else if (res.Ret == -11) {
                            //     this.$message({message: '没有权限', type: 'error'});
                            // }else{
                            //     this.$message({message: '登录失败', type: 'error'});
                            // }
                        }
                    })
                }             
            })
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
        },
        // 免插登录
        noPluginLogin(account){
            this.apiSDK.noPluginLogin(account,(res)=>{
                console.log('免插登录==========', res )
                if( res && res.code ) {
                  this.apiSDK.playType = res.code
                };
            })
        },
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

/deep/ .el-form-item__content{
    margin-left:0px!important;
}

.el-form input{
    outline: none;
    background: none;
    border: 0;
    box-shadow:inset 0 0 0 1000px #f7f7f7!important
}
.el-form /deep/ .el-input__inner{
    background-color: #08174a!important;
    color:#fff!important;
    box-shadow: inset 0 0 0 1000px #08174a!important;
    border:1px solid #22599c;
    height: 60px;
    -webkit-text-fill-color: #fff!important;
}

.el-form /deep/ .el-input__inner:hover,
.el-form /deep/ .el-input__inner:focus{
      border:1px solid #3390b4;
      background-color: #08174a!important;
       box-shadow: inset 0 0 0 1000px #091a4d!important;
      /* box-shadow: inset 0 0 6px 0.5px #3390b4!important; */
       -webkit-text-fill-color: #fff!important;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active{
  box-shadow: inset 0 0 0 1000px #08174a!important;
  border:1px solid #3390b4;
  -webkit-text-fill-color: #fff!important;
}

.el-icon-users{
    background: url(../../../static/login/login_user.png) center no-repeat ;
}
.el-icon-password{
     background: url(../../../static/login/login_password.png) center no-repeat ;
}
/deep/ .el-checkbox__label{
    color:#fff;
}
/deep/ .el-checkbox__inner{
    background: transparent;
}
.unificationLoginInput {
    width: calc(100% - 150px);
}
.selectArea {
    float: right;
}
/deep/ .selectArea input {
    width: 150px;
}
</style>
