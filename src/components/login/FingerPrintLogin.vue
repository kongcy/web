<template>
  <div class="finger-print">
    <div class="header">
        <p class="title">{{statusMsg[status].title}}</p>
        <p class="desc">{{statusMsg[status].desc}}</p>
    </div>
    <div class="content">
        <div :class="statusMsg[status].errImg">
            <div class="img"></div>
            <!-- <img src="../../../static/login/fingerprint_gray.png" /> -->
        </div>
        <div v-if="status === 2" class="error-img"></div>
    </div>
    <div class="footer">
        <div class="tips" v-if="status === 0">
            5s后切换到其他登录方式
        </div>
        <el-button v-if="status === 2" type="primary" size="large" @click="relogin">重新识别</el-button>
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
            status: 0,
            statusMsg: [
                { title: '指纹设备工作异常', desc: '请检查指纹设备或选择其他登录方式', errImg: 'finger-nodevice', resMsg: '' },
                { title: '请将手指按压在采集传感器上', desc: '', errImg: 'finger-img' },
                { title: '登录失败', desc: '请重新识别或采用其他方式登录', errImg: 'error-img' },
            ]
        }
    },
    mounted() {
    },
    methods: {
        // 登录
        loginWithFingerPrint() {
            let fingerPrint = '';
            this.apiSDK.loginWithFingerPrint(fingerPrint, (res) => {
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
    }
}
</script>
<style scoped>
/*p{margin: 8px 0;padding: 0;}*/
.finger-print{
    margin: 0 auto 40px;
    width: 430px;
    text-align: center;
}
.finger-print .header{
}
.finger-print .footer{
    margin-top: 8px;
}
.finger-print .title{
    
}
.finger-print .desc{
    line-height: 18px;
    font-size: 14px;
}
.finger-print .content{
    margin: 0 auto;
    width: 200px;
    height: 180px;
}
.finger-print .content .finger-img{
    height: 180px;
    background: url(../../../static/login/fingerprint.png) center no-repeat #ebebeb;
}
.finger-print .content .finger-img .img{

}
.finger-print .content .finger-nodevice{
    height: 180px;
    background: url(../../../static/login/fingerprint_gray.png) center no-repeat #ebebeb;
}
.finger-print .content .finger-nodevice .img{
    height: 180px;
    background: url(../../../static/login/icon_abnormal.png) center no-repeat;
}
.finger-print .content .error-img{
    width: 120px;
    height: 120px;
    margin: 0 auto;
    background: url(../../../static/login/icon_fail.png) center no-repeat;
}

.finger-print .tips{
    color: #999999;
    font-size: 14px;
}
</style>
