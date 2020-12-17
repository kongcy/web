<template>
  <el-dialog title="抢占登录" :visible.sync="isVisible" width="550px" class="custom-dialog" 
      :close-on-click-modal="false"
      :append-to-body="true"
      :modal-append-to-body="false"
      >
    <div style="margin-top:0px;text-align:center">
        <div style="font-size:18px;color:#0f5794;font-weight:bold;">请填写预留问题的答案</div>
      </div>

    <el-form :model="form" :rules="rules" ref="form" label-width="150px" style="margin-top:50px">
        <el-form-item label="预留问题：" prop="question">
          <!-- <el-input v-model="form.question" style="width: 350px"></el-input> -->
          <span>{{form.question}}</span>
        </el-form-item>
        <el-form-item label="问题答案：" prop="answer">
          <el-input v-model="form.answer" style="width: 300px"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确定</el-button>
        <el-button @click="closeDialog">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "AnswerQueDialog",
  data() {
    return {
      isVisible: false,
      form: {
          questionId: 0,
          enable: false,
          question: '天王盖迪挂',
          answer: '',
        },
        rules: {
          answer: [
            { required: true, message: '请输入答案', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
          ],
        },
    };
  },
  methods: {
    showDialog() {
      this.isVisible = true;
      
      var self = this;
      this.apiSDK.getQuestion(function(obj){
        if(obj && obj.length > 0){
          self.form.questionId = obj[0].QuestionId;
          self.form.enable = obj[0].enable;
          self.form.question = obj[0].QuestionName;
        }
      });
    },
    closeDialog() {
      this.isVisible = false;
    },
    handleConfirm() {
      var self = this;
      
      this.$refs.form.validate((valid) => {
          if (valid) {
            this.apiSDK.validateQuestion(this.form.questionId, this.form.answer, function(obj){
                if(obj && obj.Ret == 0){
                  self.isVisible = false;
                  self.$parent.LoginWithMandatory();
                }else{
                  self.$message({message: '答案错误', type: 'error'});
                }
              });
          } else {
            return false;
          }
      });
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