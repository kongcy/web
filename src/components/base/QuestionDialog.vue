<template>
  <el-dialog title="预留问题" :visible.sync="isVisible" width="550px" class="custom-dialog">
    <el-form :model="form" :rules="rules" ref="form" label-width="150px" style="margin-top:20px">
        <el-form-item label="启用问题验证" prop="enable">
          <el-switch v-model="form.enable" @change="enableQuestion"></el-switch>
          <span style="font-size:12px;color:#aaa;margin-left:10px">(用于抢占登录时身份验证)</span>
        </el-form-item>
        <el-form-item label="预留问题" prop="question">
          <el-input v-model="form.question" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="问题答案" prop="answer">
          <el-input v-model="form.answer" style="width: 300px"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <div style="text-align: center">
          <el-button type="primary" @click="handleConfirm">保存</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </div>
    </div>
    </el-dialog>
</template>

<script>
export default {
  name: "QuestionDialog",
  data() {
    return {
      isVisible: false,
      form: {
          questionId: 0,
          enable: false,
          question: '',
          answer: '',
        },
        rules: {
          question: [
            { required: true, message: '请输入问题', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
          ],
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
      this.$nextTick(() => {
          xtxk.media.setDialogTop('预留问题');
      });
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
            if(this.form.questionId){//编辑
              this.apiSDK.editQuestion(this.form.questionId, this.form.question, this.form.answer, function(obj){
                if(obj && obj.Ret == 0){
                  self.$message({message: '操作成功', type: 'success'});
                  self.isVisible = false;
                }else{
                  self.$message({message: '操作失败', type: 'error'});
                }
              });
            }else{//新增
              this.apiSDK.addQuestion(this.form.question, this.form.answer, function(obj){
                if(obj && obj.Ret == 0){
                  self.$message({message: '操作成功', type: 'success'});
                  self.isVisible = false;
                }else{
                  self.$message({message: '操作失败', type: 'error'});
                }
              });
            }
          } else {
            return false;
          }
      });
    },
    enableQuestion(flag){
      this.apiSDK.enableQuestion(flag, function(obj){

      });
    }
  }
};
</script>

<style scoped>

</style>