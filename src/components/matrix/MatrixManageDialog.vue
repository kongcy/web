<template>
    <div>
        <el-dialog :visible.sync="isVisible" title="矩阵设置" width="1100px"
            class="custom-dialog"
            :before-close="handleClose">
            <el-tabs v-model="activeName">
                <el-tab-pane label="矩阵订阅" name="MatrixSubscription">
                    <matrix-subscription></matrix-subscription>
                </el-tab-pane>
                <el-tab-pane label="矩阵同步" name="MatrixSynchronization">
                    <matrix-synchronization></matrix-synchronization>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>
<script>
import MatrixSubscription from '@/components/matrix/MatrixSubscription';
import MatrixSynchronization from '@/components/matrix/MatrixSynchronization';

export default {
    name: 'DecompilerManageDialog',
    components: {
        MatrixSubscription,
        MatrixSynchronization
    },
    data() {
        return {
            isVisible: false,
            activeName: 'MatrixSubscription'
        }
    },
    mounted() {
        
    },
    methods: {
        showDialog(type) {
            this.isVisible = true;
            this.activeName = type;
            this.$nextTick(() => {
              xtxk.media.setDialogTop('矩阵设置');
            });
        },
        handleClose() {
            this.isVisible = false;
            this.$emit('closeDialog', {})
        }
    }
}
</script>
<style scoped>
.custom-dialog /deep/ .el-tabs{
    border: 0;
}
</style>