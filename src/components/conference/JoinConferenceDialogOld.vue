<template>
    <el-dialog :visible.sync="visible"  :title="dialogTitle" width="500px" center class="custom-dialog">
        <el-form :model="form" :rules="rules" ref="formId" label-width="80px" @keyup.enter.native="submit" v-if="!needPassword">
            <el-form-item label="会议ID:" prop="sceneID">
                <el-input v-model="form.sceneID" placeholder=""></el-input>
            </el-form-item>
        </el-form>
        <el-form :model="confirmForm" :rules="rules" ref="formPassword" label-width="80px" @keyup.enter.native="confirmPassword"  v-else>
            <el-form-item label="会议密码:" prop="">
                <el-input type="password" v-model="confirmForm.scenePassword" placeholder=""></el-input>
            </el-form-item>
        </el-form>
        <div style="margin:20px 0 0 70px;">
        <el-checkbox v-model="microphoneAbility">开启麦克风</el-checkbox>
        <el-checkbox v-model="audioAbility">开启扬声器</el-checkbox>
        <el-checkbox v-model="videoAbility">开启摄像头</el-checkbox>
        </div>
        <span slot="footer" class="dialog-footer" style="display: block;text-align: right;">
            <el-button type="primary" @click="submit">确定</el-button>
            <el-button @click="closeDialog">取消</el-button>
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
            },
            rules: {
                sceneID: [{ required: true, message: '请输入会议ID', trigger: 'blur' }],
            },
            confirmForm: {
                scenePassword: '',
            },
            confirmRules: {
                scenePassword: [{ required: true, message: '请输入会议ID', trigger: 'blur' }],
            },
            needPassword: false,
            dialogTitle: '加入会议',
            audioAbility: 'false',
            videoAbility: 'false',
            microphoneAbility: 'false'
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
                                this.apiSDK.publishMemberJoinConferenceOfID(this.form.sceneID, this.audioAbility, this.videoAbility, this.microphoneAbility);
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
                    this.apiSDK.checkingConferencePassword(this.form.sceneID, this.confirmForm.scenePassword, res => {
                        if (res.Ret === 0) {
                            // 加入会议
                            this.apiSDK.publishMemberJoinConferenceOfID(this.form.sceneID, this.audioAbility, this.videoAbility, this.microphoneAbility);
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
            this.confirmForm.scenePassword = '';
            this.needPassword = false;
            this.dialogTitle = '加入会议';
            this.audioAbility = false;
            this.videoAbility = false;
            this.microphoneAbility = false;
            this.$refs.formId && this.$refs.formId.resetFields();
            this.$refs.formPassword && this.$refs.formPassword.resetFields();
        },
    }
}    
</script>