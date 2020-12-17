<template>
    <el-dialog 
        :visible.sync="isVisible" 
        class="custom-dialog"
        title="修改密码" 
        width="550px">
        <el-form ref="form" status-icon :model="form" :rules="rules" label-width="150px">
            <!-- <el-form-item label="当前用户：">
                {{ curUser.userName }}
            </el-form-item> -->
            <el-form-item prop="oldPassword" label="旧密码">
                <el-input type="password" v-model="form.oldPassword" auto-complete="off" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item prop="newPassword" label="新密码">
                <el-input type="password" v-model="form.newPassword" auto-complete="off" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item prop="surePassword" label="确认密码">
                <el-input type="password" v-model="form.surePassword" auto-complete="off" style="width: 300px"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleConfirm">保存</el-button>
            <el-button @click="closeDialog">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
    name: 'ModifyPwdDialog',
    data() {
        var validateSurePwd = (rule, value, callback) => {
            if (value === '') {
                callback(new Error("请输入确认密码"))
            } else if (value != this.form.newPassword) {
                callback(new Error("确认密码应与新密码一致"))
            } else {
                callback()
            }
        };
        return {
            isVisible: false,
            curUser: {},
            form: {
                oldPassword: '',
                newPassword: '',
                surePassword: ''
            },
            rules: {
                oldPassword: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' },
                    { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
                ],
                surePassword: [
                    { validator: validateSurePwd, required: true, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        showDialog() {
            this.isVisible = true;
            this.$nextTick(() => {
                xtxk.media.setDialogTop('修改密码');
            });
            this.curUser = xtxk.cache.get('USER');
        },
        closeDialog() {
            this.isVisible = false;
            this.resetData();
        },
        handleConfirm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.apiSDK.modifyUserPwd(this.form.oldPassword, this.form.newPassword, res => {
                        if (res.Ret == '0') {
                            this.closeDialog();
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                        } else {
                            this.$message({
                                message: '修改失败',
                                type: 'error'
                            });
                        }
                    })
                }
            })
        },
        resetData() {
            this.form = {
                oldPassword: '',
                newPassword: '',
                surePassword: ''
            }
        }
    }
}
</script>
<style scoped>
.dialog-footer {
    text-align: center;
}
</style>