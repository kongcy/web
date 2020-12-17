<template>
  <el-dialog :visible.sync="isVisible" title="退出系统" width="460px" class="custom-dialog loginOut-dialog" 
    :close-on-click-modal="false">
      <span>是否确认退出？</span>
    <div slot="footer" class="dialog-footer">
        <div style="text-align: center">
          <el-button type="primary" size="small" @click="handleConfirm">确定</el-button>
          <el-button class="no-background" size="small" @click="closeDialog">取消</el-button>
        </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "logoutDialog",
  data() {
    return {
      isVisible: false
    };
  },
  methods: {
    showDialog() {
      this.isVisible = true;
      this.$nextTick(() => {
          xtxk.media.setDialogTop('退出系统');
      });
    },
    closeDialog() {
      this.isVisible = false;
    },
    handleConfirm() {
      this.isVisible = false;
      this.$message.closeAll();
      this.$router.push("Login");
    }
  }
};
</script>

<style scoped>
.loginOut-dialog /deep/ .el-dialog{
  height: 240px;
}
.no-background{
    background: none;
    border: 1px solid #6B7C92;
    font-size: 14px;
    color: #ABB3C4;
}
.loginOut-dialog /deep/ .el-button+.el-button{
  margin-left: 24px;
} 
.custom-dialog /deep/ .el-dialog__body {
  text-align: center;
  margin-top: 23px;
  padding-bottom: 54px;
  font-size: 15px;
}
</style>