<template>
    <el-dialog :visible.sync="visible"  :title="dialogTitle" width="700px" center class="custom-dialog joinConference">
        <el-form :model="form" ref="formId" label-width="110px" @keyup.enter.native="submit" >
            <el-form-item label="加入会议" prop="sceneID">
                <el-input v-model="form.sceneID" placeholder="请输入会议ID/会议网关"></el-input>
            </el-form-item>
            <el-form-item label="会议密码" prop="">
                <el-input type="password" v-model="form.scenePassword" placeholder="请输入4-6位数字密码"></el-input>
            </el-form-item>
            <el-form-item label="我的入会名称" prop="">
                <el-input  v-model="form.userName" placeholder=""></el-input>
            </el-form-item>
            <p class="join-setting">入会设置</p>
            <el-form-item label="开启麦克风" prop="sceneID">
                <el-switch v-model="form.microphoneAbility" active-color="#3582eb" inactive-color="#bdc1c6"> </el-switch>
            </el-form-item>
            <el-form-item label="开启扬声器" prop="sceneID">
                <el-switch v-model="form.microphoneAbility" active-color="#3582eb" inactive-color="#bdc1c6"> </el-switch>
            </el-form-item>
            <el-form-item label="开启摄像头" prop="sceneID">
                <el-switch v-model="form.microphoneAbility" active-color="#3582eb" inactive-color="#bdc1c6"> </el-switch>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="display: block;text-align: center;">
            <el-button type="primary" @click="submit">确定</el-button>
            <el-button @click="closeDialog" class="no-background">取消</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    name: 'JoinConferenceDialog',
    data() {
        return {
            visible: false,
            form: {
                sceneID: '',
                scenePassword:'',
                userName:'',
                microphoneAbility:'false',
                audioAbility:'false',
                videoAbility:'false',
            },
            needPassword: false,
            dialogTitle: '加入会议',
        }
    },
    methods: {
        showDialog() {
            this.visible = true;
            this.$nextTick(() => {
                this.clear();
                xtxk.media.setDialogTop('加入会议');
            });
        },
        closeDialog() {
            this.visible = false;
        },
        submitID() {
            this.$refs['formId'].validate((valid) => {
                if (valid) {
                    this.apiSDK.checkingConferenceId(this.form.sceneID, res => {
                        if (res.Ret === 0) {
                            this.needPassword = res.needPassword;
                            if (!this.needPassword) {
                                this.apiSDK.publishMemberJoinConferenceOfID(this.form.sceneID, this.form.audioAbility, this.form.videoAbility, this.form.microphoneAbility);
                                this.closeDialog();
                            } else {
                                this.dialogTitle = '输入密码';
                            }
                        } else {
                            this.$message({
                                message: res.desc,
                                type: 'warning'
                            });
                        }
                    });
                }
            })
            
        },
        submitPassord() {
            this.$refs['formPassword'].validate((valid) => {
                if (valid) {
                    this.apiSDK.checkingConferencePassword(this.form.sceneID, this.form.scenePassword, res => {
                        if (res.Ret === 0) {
                            // 加入会议
                            this.apiSDK.publishMemberJoinConferenceOfID(this.form.sceneID, this.form.audioAbility, this.form.videoAbility, this.form.microphoneAbility);
                            this.closeDialog();
                        } else {
                            this.$message({ type: 'warning', message: res.desc});    
                        }
                    });
                }
            })
        },
        submit() {
            if (this.needPassword) {
                this.submitPassord();
            } else {
                this.submitID();
            }
        },
        clear() {
            this.form.sceneID = '';
            this.form.scenePassword = '';
            this.needPassword = false;
            this.dialogTitle = '加入会议';
            this.form.audioAbility = false;
            this.form.videoAbility = false;
            this.form.microphoneAbility = false;
            this.$refs.formId && this.$refs.formId.resetFields();
            this.$refs.formPassword && this.$refs.formPassword.resetFields();
        },
    }
}    
</script>
<style scoped>
.joinConference /deep/ .el-form-item__label{
    color: #d3dcf0;
}
/deep/ .el-input__inner{
    height: 32px;
    border-radius: 2px;
    background:none;
    outline: none;
    border: 1px solid #6B7C92;
    color: #D3DCF0;
}
.joinConference /deep/ .el-form-item__content{
    width: 222px;
    text-align: right;
}
.joinConference /deep/ .el-form-item{
    margin-bottom: 10px;
}
.joinConference /deep/ .el-form{
    width: 380px;
    margin-left: 50%;
    transform: translateX(-50%);
}
.join-setting{
    color: rgb(255, 255, 255);
    font-size: 16px;
    width: 110px;
    text-align: right;
    padding-right: 12px;
    box-sizing: border-box;
    height: 40px;
    line-height: 40px;
}
.joinConference /deep/ .el-dialog__footer{
    padding-top: 0px;
}
.joinConference .el-button{
    width: 88px;
    height: 32px;
    padding: 6px 20px;
    border-radius: 2px;
    margin-left: 24px;
}

/* 无背景按钮 */
.no-background{
    background: none;
    border: 1px solid #6B7C92;
    font-size: 14px;
    color: #ABB3C4;
}
</style>