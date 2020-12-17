<template>
    <el-dialog :visible.sync="visible"  title="会议信息" width="500px" center class="custom-dialog">
        <el-form v-if="data" label-width="100px">
            <el-form-item label="会议ID：" v-if="data.sceneType !== 0">
                <el-input type="text" v-model="data.sceneID" readonly id="conferenceInfoSceneID" class="copy-input" style="width:100px;"></el-input>
                <!-- <span id="conferenceInfoSceneID">{{}}</span> -->
                <el-button class="icon-copy" @click="copyID" title="复制会议ID"></el-button>
            </el-form-item>
            <el-form-item label="会议名称：">
                {{formateNoData(data.sceneName)}}
            </el-form-item>
            <el-form-item label="会议密码：">
                {{formateNoData(password)}}
                <!-- {{password === '' ? ''}} -->
                <el-button @click="showPassword"  :class="eyes.icon" :title="eyes.title"></el-button>
            </el-form-item>
            <el-form-item label="会议主席：">
                {{formateNoData(data.chairman)}}
            </el-form-item>
            <el-form-item label="简要描述：">
                <p style="border:1px solid #ddd;min-height: 40px;margin: 10px 0 0 0;padding: 0 5px;">{{formateNoData(data.desc)}}</p>
            </el-form-item>
        </el-form>
    </el-dialog>   
</template>
<script>
export default {
    name: 'ConferenceInfoDialog',
    data() {
        return {
            visible: false,
            data: null,
            password: '',
            eyes: {
                icon: 'icon-eyes',
                title: '显示'
            }
        }
    },
    methods: {
        showDialog(data) {
            this.visible = true;
            this.data = data;
        },
        closeDialog() {
            this.visible = false;
        },
        showPassword() {
            if (this.eyes.title === '显示') {
                this.password = this.data.password;
                this.eyes.icon = 'icon-eyes-close';
                this.eyes.title = '隐藏';
            } else {
                this.password = this.data.password ? '******' : '';
                this.eyes.icon = 'icon-eyes';
                this.eyes.title = '显示';
            }
        },
        copyID() {
            let $node = document.getElementById('conferenceInfoSceneID');
            $node.select();
            if(document.execCommand('copy', true)){
                this.$message({
                    type: 'success',
                    message: '已成功复制到剪贴板'
                });
            }
        },
        formateNoData(data) {
            if (data === '' || data === undefined) {
                return '无'
            } else {
                return data;
            }
        }
    }
}    
</script>
<style scoped>
.icon-eyes-close,
.icon-eyes,
.icon-copy{
    width: 24px;
    height: 24px;
    border: 0px;
    padding: 0;
    vertical-align: middle;
}
.icon-copy{
    background: url(../../../static/scene/ico_copy.png) no-repeat;
}
.icon-eyes{
    background: url(../../../static/scene/ico_eyes.png) no-repeat;
}
.icon-eyes-close{
    background: url(../../../static/scene/ico_eyes_close.png) no-repeat;
}
/deep/ .el-form-item{
    margin-bottom: 10px;
} 
/deep/.copy-input input{
    border: 0;
    padding: 0;
}
</style>