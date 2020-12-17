<template>
  <div>
  <el-dialog title="切换用户" :visible.sync="isVisible" width="550px" class="custom-dialog">
    <el-form :model="form" :rules="rules" ref="form" label-width="150px" style="margin-top:20px">
        <el-form-item label="登录方式" prop="enable">
          <el-select v-model="type" placeholder="请选择" style="width: 300px">
            <el-option label="账号登录" value="1"></el-option>
            <el-option label="人脸登录" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="帐号名称" prop="loginName">
          <el-input v-model="form.loginName" placeholder="请输入帐号" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="loginpwd">
          <el-input v-model="form.loginpwd" type="password" placeholder="请输入密码" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="validCode" >
          <el-row style="width: 300px">
            <el-col :span="16">
                <el-input v-model="form.validCode" placeholder="请输入验证码"></el-input>
            </el-col>
            <el-col :span="8">
                <img :src="verifyCodeImg" style="cursor:pointer" @click="getVerifyCode" width="100%" height="40" />
            </el-col>
          </el-row>
        </el-form-item>
    </el-form>
    <div v-if="type === '2'">
        
    </div>
    <div slot="footer" class="dialog-footer">
        <div style="text-align: center">
          <el-button type="primary" @click="LoginSwitch">保存</el-button>
          <el-button @click="isVisible = false">取消</el-button>
        </div>
    </div>
    </el-dialog>

    <control-dialog ref="controlDialog" />
  </div>
</template>

<script>
import ControlDialog from '@/components/login/ControlDialog.vue'

export default {
  inject: ['reload'],
  name: "ChangeUserDialog",
  components: {
      ControlDialog,
    },
  data() {
    return {
        isVisible: false,
        type: '1',
        form: {
            loginName: '',
            loginpwd: '',
            validCode: '',
        },
        rules: {
            loginName: [
                { required: true, message: '请输入账号', trigger: 'blur' },
                { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
            ],
            loginpwd: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
            ],
            validCode: [
                { required: true, message: '请输入验证码', trigger: 'blur' },
                { min: 1, max: 4, message: '长度为 4 个字符', trigger: 'blur' }
            ],
        },
        verifyCodeImg: ''
    };
  },
  methods: {
    showDialog() {
        this.isVisible = true;
        // 信息初始化
        this.initData();
        // this.data();
        this.getVerifyCode();
        this.$nextTick(() => {
            xtxk.media.setDialogTop('切换用户');
        });
    },
    // 初始化数据
    initData() {
        this.form = {
            loginName: '',
            loginpwd: '',
            validCode: '',
        },
        this.type = '1';
    },
    /**
   *用户切换
   * loginName:新的登录用户
   * loginpwd:新的登录用户密码
   * validCode:验证码
   * resp={Ret:'',token:'',data:{userID,userName,centerID}}
   */
    LoginSwitch() {
        this.$refs.form.validate(valid => {
            if (valid) {
                this.apiSDK.LoginSwitch(this.form.loginName, this.form.loginpwd, this.form.validCode, res => {
                    if(res && res.Ret == 0){
                        //store
                        this.$store.commit("updateUserinfo", {token:res.token, userID:res.data.userID, userName:res.data.userName});
                        xtxk.cache.set('USER', {token: res.token, userId: res.data.userID, userName:res.data.userName})
                        this.apiSDK.initUserInfo(res.data.userID, res.data.userName, res.token);
                        this.apiSDK.publishLeave(function(){});
                        this.reload();
                    } else if(res && res.Ret === 2){
                        this.$store.commit("updateUserinfo", {token:res.token, userID:res.data.userID, userName:res.data.userName});
                        xtxk.cache.set('USER', {token: res.token, userId: res.data.userID, userName:res.data.userName})
                        this.apiSDK.initUserInfo(res.data.userID, res.data.userName , res.token);
                        this.apiSDK.publishLeave(function(){});

                        //抢占登录
                        this.$refs.controlDialog.showDialog("change");
                      }  else {
                      this.$message({message: '登录失败', type: 'error'});
                      this.form.validCode = ''
                      this.getVerifyCode()
                  }
                })
            }
        })
    },
    // 获取验证码
    getVerifyCode() {
        this.verifyCodeImg = this.apiSDK.getValidCodeUrl();
    },
  }
};
</script>

<style scoped>

</style>