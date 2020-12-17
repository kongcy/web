<template>
    <div>
      <!--  -->
      <el-card id="headerMenu" class="headerMenu" :class="{menuShow:isMenuShow}"  :body-style="{padding:'0'}">
        <!-- <div class="menuItemClass" v-show="showType=='normal' && this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6" v-on:click="showTypeChange('normal')">常规模式</div>
        <div class="menuItemClass" v-show="showType=='map' && this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6" v-on:click="showTypeChange('map')">地图模式</div>
        <div class="menuItemClass" v-on:click="terminalConfig">终端配置</div>
        <div class="menuItemClass" v-on:click="faceRegister" v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6">人脸采集</div>
        <div class="menuItemClass" v-on:click="modifyPWD" v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6">修改密码</div>
        <div class="menuItemClass" v-on:click="question" v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5">预留问题</div>
        <div class="menuItemClass" v-on:click="showDialog('changeUserDialog')" v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5">切换用户</div> -->
        <div class="menuItemClass" v-on:click="logout">退出系统</div>
      </el-card>

      <face-register-dialog ref="faceRegisterDialog"/>
      <terminal-config-dialog ref="terminalConfigDialog"/>
      <question-dialog ref="questionDialog"/>
      <logout-dialog ref="logoutDialog" />
      <change-user-dialog ref="changeUserDialog" />
      <modify-pwd-dialog ref="modifyPwdDialog" />
    </div>
</template>

<script>
import FaceRegisterDialog from '@/components/base/FaceRegisterDialog.vue'
import TerminalConfigDialog from '@/components/setting/TerminalConfigDialog.vue'
import QuestionDialog from '@/components/base/QuestionDialog.vue'
import ChangeUserDialog from '@/components/base/ChangeUserDialog.vue'
import LogoutDialog from '@/components/base/LogoutDialog.vue'
import ModifyPwdDialog from '@/components/base/ModifyPwdDialog.vue'

export default {
    name: 'HeaderMenu',
    components: {
      FaceRegisterDialog,
      TerminalConfigDialog,
      QuestionDialog,
      LogoutDialog,
      ChangeUserDialog,
      ModifyPwdDialog,
    },
    data () {
        return {
          isMenuShow: false,
          showType: ''
        };
    },
    methods: {
      showHeaderMenus(n){
       this.isMenuShow =n
       console.log(this.isMenuShow )
      },
      showDialog(name) {
        this.$refs[name].showDialog();
      },
      //显示模式
      showTypeChange(type){
        if(type == 'normal') {
          this.showType = 'map'
          this.$router.push({path: '/Home'})
        } else if(type == 'map') {
          this.showType = 'normal'
          this.$router.push({path: '/Map'})
        } else {
          let curPath = this.$route.path;
          if(curPath.indexOf('Home') > -1) this.showType = 'map'
          else if(curPath.indexOf('Map') > -1) this.showType = 'normal'
        }
      },
      //终端配置
      terminalConfig(){
        this.$refs.terminalConfigDialog.showDialog();
      },
      //人脸识别
      faceRegister(){
        this.$refs.faceRegisterDialog.showDialog();
      },
      //预留问题
      question(){
        this.$refs.questionDialog.showDialog();
      },
      //退出登录
      logout(){
        this.$refs.logoutDialog.showDialog();
      },
      // 修改密码
      modifyPWD() {
        this.$refs.modifyPwdDialog.showDialog();
      },
    },
    mounted(){
      this.showTypeChange();
      
      //点击其他地方隐藏右键菜单
      document.addEventListener('click', e => {
        //console.log(e.target)
        if(e.target.id != 'divHeaderRight_1' && e.target.className != 'el-card__body' && e.target.className !='icon-userphoto' && e.target.className !='el-icon-caret-bottom'){
          this.isMenuShow = false;
          this.$emit("changeActivedStatus",this.isMenuShow)
        }
      });
    },
}
</script>

<style scoped>
/deep/ .el-message-box__header{
  height: 43px;
  background-color: #0f5794;
  padding: 0;
  text-align: left;
}
  .headerMenu {
    position: fixed;
    z-index: 999;
    display: none;
    right: 10px;
    top: 60px;
  }

  .menuShow {
    display: block;
  }

  .menuItemClass {
    font-size: 14px;
    padding: 7px 20px;
    cursor: pointer;
    color:#333;
  }
    .menuItemClass:hover {
      background: #dbf0fe;
    }
</style>