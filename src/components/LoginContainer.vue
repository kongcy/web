<template>
<div class="loginWrap">
  
  <!-- <div class="login"> -->
    <div class="header">
      <div class="logo">
        <span class="logo_icon"></span>
        <!-- <span class="line_icon"></span> -->
        <span class="logo_name">塔里木油田音视讯融合平台</span>
      </div>
      <!-- <div class="date">{{dateValue}}</div> -->
    </div>
    <div class="content">
      <el-tabs v-model="tabActive" type="card" @tab-click="tabChange" >
        <el-tab-pane label="账户登录" name="first" >
          <pwd-login />
        </el-tab-pane>
        <!-- <el-tab-pane v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6" label="人脸登录" name="second">
          <face-login ref="faceLogin" />
        </el-tab-pane> -->
      </el-tabs>
    </div>
    <!-- <div class="footer">{{xtxk.config.business.copyright}}</div> -->
  <!-- </div> -->
  </div>
</template>

<script>
import PwdLogin from "@/components/login/PwdLogin.vue";
import FaceLogin from "@/components/login/FaceLogin.vue";

export default {
  name: "LoginContainer",
  components: {
    PwdLogin,
    FaceLogin
  },
  data() {
    return {
      tabActive: "first",
      dateValue: ""
    };
  },
  mounted() {
    this.dateValue = this.showDateValue();
    this.apiSDK.onlyClose();
  },
  methods: {
    tabChange(tab) {
      if (tab.name === "second") {
        this.$refs.faceLogin.getUserMedia();
      }
    },
    showDateValue() {
      var strDate;
      var myDate = new Date();
      var myTime =
        myDate.getFullYear() +
        "年" +
        (myDate.getMonth() + 1) +
        "月" +
        myDate.getDate() +
        "日";
      var n_day = myDate.getDay();
      switch (n_day) {
        case 0:
          strDate = "星期日";
          break;
        case 1:
          strDate = "星期一";
          break;
        case 2:
          strDate = "星期二";
          break;
        case 3:
          strDate = "星期三";
          break;
        case 4:
          strDate = "星期四";
          break;
        case 5:
          strDate = "星期五";
          break;
        case 6:
          strDate = "星期六";
          break;
        case 7:
          strDate = "星期日";
          break;
      }
      return myTime + " " + strDate;
    },
  },
  destroyed(){
    
  }
};
</script>

<style scoped>
.loginWrap{
  position: absolute;
  top: 0;
  left: 0; 
  width: 100%;
  height: 100%;
  background: url(../../static/common/login_bg.png) no-repeat;
  background-size: 100% 100%;
  color: #fff;
}
.login {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 1280px;
  height: 800px;
  color: #fff;
}
.header {
  height: 80px;
}
.header .logo {
  float: left;
  margin-left: 45px;
  margin-top: 48px;
}
.header .logo .logo_icon {
  display: inline-block;
  /* width: 54px;
  height: 44px; */
  width: 60px;
  height: 60px;
  background: url(../../static/common/login_icon_u16.png) no-repeat;
  background-size: 60px;
  float: left;
  margin-top: -5px;
}
.header .logo .line_icon {
  display: inline-block;
  width: 2px;
  height: 44px;
  background: #fff;
  margin-left: 15px;
  margin-right: 30px;
  float: left;
}
.header .logo .logo_name {
  display: inline-block;
  height: 44px;
  font-size: 32px;
  letter-spacing: 5px;
  line-height: 39px;
  float: left;
  margin-top: 5px;
}
.header .date {
  float: right;
  margin-right: 60px;
  margin-top: 48px;
}
.footer {
  position: absolute;
  bottom: 30px;
  width: 100%;
  font-size: 12px;
  text-align: center;
  /* letter-spacing: 3px; */
  color: #fff;
  /* line-height: 36px; */
}
.content {
  position: absolute;
  /* top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%); */
  
  margin: auto;
  top:0px;
  /* left: 0px; */
  bottom: 0px;
  right:10%;
  width: 434px;
  height: 447px;
  /* margin: 90px auto; */
  /* box-shadow: 0 0 10px #fff; */
  background: url(../../static/login/login_bg.png) no-repeat center;
  color: #353535;
  box-shadow: 0px 4px 17px 1px rgba(0, 84, 209, 0.1);
  border-radius: 4px;
}
/deep/ .login-btn {
  width: 100%;
  height:61px;
  /* background-color: #0f5794; */
  background: url(../../static/login/loginbtn_bg.png) no-repeat center;
  background-size: 100% 61px;
  border-radius: 10px;
  border: 0;
  margin-top: 30px;
  font-size: 18px;
}
/deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav{
  border:none;
}
/deep/ .el-tabs--card > .el-tabs__header {
  height: 60px;
  border-bottom: 1px solid transparent;
  margin: 0;
  box-sizing: border-box;
}
/deep/ .el-tabs__nav {
  width: 100%;
}
/deep/ .el-tabs__nav-next,
.el-tabs__nav-prev {
  display: none;
}
/deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
  display: inline-block;
  /* width: 50%; */
  width: 110px;
  height: 60px;
  line-height: 60px;
  border-left: none;
  border-right: none;
  text-align: center;
  padding: 0;
  font-size: 30px;
    color: #40a5fa;
  /* color: #0f5794; */
  letter-spacing: 5px;
  /* margin: 0 70px; *//*账号登录和人脸识别登录时*/
  margin: 37px 156px;/*只有账户登录时*/
  /* font-weight: bold */
}

/deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  padding: 0px!important;/*只有账户登录时*/
  /* border-bottom: 3px solid #0f5794; */
  border-bottom: 3px solid transparent;
  
}
</style>
<style>
.login .el-checkbox,
.login .el-form-item__label,
.login .el-tabs__item {
  /* color: #fff; */
  color: #353535;
}
</style>