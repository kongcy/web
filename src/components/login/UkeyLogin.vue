<template>
  <div class="ukey">
        <div class="header">
            <img src="../../../static/login/Ukey.png" />
            <span>请插入Ukey</span>
        </div>

        <div class="content">
            <div class="password">
                <el-form :model="form" status-icon :rules="rules" ref="login" label-width="70px" @keyup.enter.native="login">
                    <el-form-item label="PIN码:" prop="password">
                        <el-input type="password" v-model="form.password" placeholder="请输入PIN码"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tips">
                请检查Ukey或选择其他登录方式
            </div>
        </div>
        
        <div class="footer">
            <el-button type="primary" :loading="loginLoading" @click="login" class="login-btn">提交</el-button>
        </div>

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
        return {
            form: {
                password: '',
            },
            rules: {
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
                ],
            },
            loginLoading: false
        }
    },
    mounted() {
    },
    methods: {
        // 登录
        login() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    this.loginLoading = true;
                    let ukey = '';
                    this.apiSDK.loginWithUKey(ukey, (res) => {
                        this.loginLoading = false
                        if(res && res.Ret === 0){
                            //store
                            this.$store.commit("updateUserinfo", {token:res.token, userID:res.data.userID, userName:res.data.userName});
                            xtxk.cache.set('USER', {token: res.token, userId: res.data.userID, userName:res.data.userName})
                            this.apiSDK.initUserInfo(res.data.userID, res.data.userName, res.token);
                            this.$router.push('Home');
                        } else if(res && res.Ret === 2){
                            this.$store.commit("updateUserinfo", {token:res.token, userID:res.data.userID, userName:res.data.userName});
                            xtxk.cache.set('USER', {token: res.token, userId: res.data.userID, userName:res.data.userName})
                            this.apiSDK.initUserInfo(res.data.userID, res.data.userName , res.token);
                            //抢占登录
                            this.$refs.controlDialog.showDialog("login");
                        } else {
                            if(res.Ret === 1){
                                this.$message({message: '登录失败', type: 'error'});
                            }
                        }
                    })
                }             
            })
        }
    }
}
</script>
<style scoped>
.ukey{
    margin: 25px auto 30px;
    width: 430px;
}
.ukey .header{
    text-align: center;
}
.ukey .header span,
.ukey .header img{
    vertical-align: middle;
}
.ukey .content{
    margin-top: 30px;
}
.ukey .content .password{
    padding: 30px 40px;
    width: 350px;
    height: 40px;
    background-color: #ebebeb;
}
.ukey .content .tips{
    margin-top: 8px;
    height: 18px;
    text-align: center;
    font-size: 14px;
}
.ukey .footer{
    text-align: center;
}
</style>
