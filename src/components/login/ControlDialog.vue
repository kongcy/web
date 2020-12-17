<template>
  <div>
    <el-dialog title="抢占登录" :visible.sync="isVisible" width="550px" class="custom-dialog" 
      :close-on-click-modal="false"
      :append-to-body="true"
      :modal-append-to-body="false"
      >
      <div style="margin-top:0px;text-align:center">
        <div style="font-size:18px;color:#0f5794;font-weight:bold;">您的账号已在它处登录</div>
        <div style="margin-top:10px;">请选择处理方式</div>
      </div>

      <div style="margin-top:40px;text-align:center">
        <el-radio v-model="radioVal" label="0">非接管登录登入后，承接原有业务</el-radio>
      </div>
      <div style="margin-top:20px;text-align:center">
        <el-radio v-model="radioVal" label="1">接管登录从原处退出，在此处登录</el-radio>
      </div>

      <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleConfirm">确定</el-button>
          <el-button @click="closeDialog">取消</el-button>
      </div>
    </el-dialog>

    <answer-que-dialog ref="answerQueDialog" />
  </div>
</template>

<script>
import AnswerQueDialog from '@/components/login/AnswerQueDialog.vue'

export default {
  inject: ['reload'],
  name: "ControlDialog",
  components: {
      AnswerQueDialog,
    },
  data() {
    return {
      isVisible: false,
      radioVal: '0',
      type:'login',
    };
  },
  methods: {
    showDialog(type_) {
      this.isVisible = true;
      this.type = type_;
    },
    closeDialog() {
      if(this.type=="change"){
        this.$confirm("切换登录模式下取消将进入登录页面，是否取消？", "提示", {
          confirmButtonText: "确认",
          CancelButtonText:"取消",
          type: 'info',
          showClose: false,
          center: true
        }).then(() => {
          this.$router.push('Login');
        }).catch(() => {
          
        });
      }else{
        this.isVisible = false;
      }
    },
    handleConfirm() {
      var self = this;
      this.apiSDK.getQuestion(function(obj){
        if(obj && obj.length > 0){
          if(obj[0].enable){
            //问题
            self.$refs.answerQueDialog.showDialog();
            return;
          }else{
            self.LoginWithMandatory();
          }
        }else{
           self.LoginWithMandatory();
        }
      });
    },
    /**
     * 登录能力，抢占式登录
     * loginType:0为接管登录，1为重新登录
     * resp ={Ret:1,token:'',data:{userID,userName,centerID}}
     */
    LoginWithMandatory(){
      this.apiSDK.LoginWithMandatory(this.radioVal, (res) => {
        if(res && res.Ret === 0){
            //store
            this.$store.commit("updateUserinfo", {token:res.token, userID:res.data.userID, userName:res.data.userName});
            xtxk.cache.set('USER', {token: res.token, userId: res.data.userID, userName:res.data.userName})
            this.apiSDK.initUserInfo(res.data.userID, res.data.userName, res.token);
            

            if(this.type == "login"){
              this.$router.push('Home');
            }else if(this.type == "change"){
              this.apiSDK.publishLeave(res => {
                this.reload();
              });
            }
        } else {
            this.$message({message: '登录失败', type: 'error'});
        }
      })
    },
  }
};
</script>

<style scoped>
.dialog-footer {
  margin-top: 20px;
  margin-bottom: 30px;
  text-align: center;
}
</style>