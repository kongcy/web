<template>
    <el-dialog :visible.sync="visible"  title="发起会议" width="700px" center class="custom-dialog start-meetimg" @closed="closeDialog">
        <!-- <el-tabs v-model="tabsActive" class="no-border">
            <el-tab-pane label="发言会议" name="speakConference">
                <speak-conference ref="speakConference"></speak-conference>
            </el-tab-pane>
            <el-tab-pane label="讨论会议" name="talkConference">
                <talk-conference ref="talkConference"></talk-conference>
            </el-tab-pane>
        </el-tabs> -->
        <div class="box-center">
            <div class="type-item">
                <span class="lable">会议类型</span>
                <div class="control-div">
                    <el-radio v-model="meetingType" label="1">快速会议</el-radio>
                    <el-radio v-model="meetingType" label="2">预约会议</el-radio>
                </div>
            </div>
            <div class="type-item" v-if="tabsActive == 'speakConference'">
                <speak-conference ref="speakConference"></speak-conference>
            </div>
            <div class="type-item" v-else>
                <talk-conference ref="talkConference"></talk-conference>
            </div>
        </div>
        <span slot="footer" class="dialog-footer" style="display: block;">
            <el-button type="primary" @click="startConference">开启</el-button>
            <el-button class="no-background" @click="closeDialog">关闭</el-button>
        </span>
    </el-dialog>
</template>
<script>
import SpeakConference from "@/components/conference/SpeakConference.vue";
import TalkConference from '@/components/conference/TalkConference.vue';
export default {
    name: 'ConferenceSceneDialog',
    components: {
        SpeakConference,
        TalkConference
    },
    data() {
        return {
            tabsActive: 'speakConference',
            visible: false,
            meetingType:'1',
        }
    },
    methods: {
        showDialog(data,byTempalte) {
            this.visible = true;
            this.$nextTick(() => {
            //   xtxk.media.setDialogTop('开启会议');
                if(byTempalte){
                    data.byTempalte = byTempalte;
                    this.$refs.speakConference.init(data, 'temp');
                }else{
                    this.$refs.speakConference.init(data, 'temp');
                }
            });
        },
        closeDialog() {
            this.visible = false;
            this.tabsActive = 'speakConference';
            this.$refs.speakConference.show();
            // this.$refs.talkConference.show();
        },
        startConference() {
            this.$refs[this.tabsActive].startConference().then(() => {
                this.closeDialog();
            });
        },
    }
}
</script>
<style scoped>
.box-center{
    height: 621px;
    padding: 0px 130px;
}
.control-div{
    display: inline-block;
    height: 32px;
}
/* redio样式 */
/deep/ .el-radio{
    margin-right: 90px;
}
/deep/ .el-radio:last-child {
    margin-right: 0;
}
/deep/ .el-radio__input.is-checked .el-radio__inner {
    /* border-color: #409EFF;
    background: none; */
    border:none;
    background:url(../../../static/common/redio_active.png) no-repeat center;
}
/deep/ .el-radio__inner {
    /* border-color: #6B7C92;
    background: none; */
    width:20px;
    height:20px;
    border:none;
    background:url(../../../static/common/redio_no.png) no-repeat center;
}
/deep/ .el-radio__inner::after {
    /* border-radius: 50%;*/
    background:url(../../../static/common/redio_active.png) no-repeat center;
    /* background-color: #409EFF;  */
}
.base-point /deep/ .el-radio__inner::after {
    width: 8px;
    height: 8px;
}
/deep/ .el-radio__input.is-checked+.el-radio__label {
    color: #d3dcf0;
}
/deep/ .el-radio__label{
    color: #d3dcf0;
    padding-left: 0px;
}

.type-item{
    width: 100%;

}
.type-item .lable{
    display: inline-block;
    width: 148px;
}
.type-item /deep/ .el-textarea__inner{
    background: none;
    border: solid 1px #6b7c92;
    border-radius: 0px;
    color: #d3dcf0;
}

.start-meetimg .el-button{
    width: 88px;
    height: 32px;
    padding: 6px 20px;
    border-radius: 2px;
    margin-left: 24px;
}
.start-meetimg /deep/ .el-button.no-background:focus,.start-meetimg /deep/ .el-button.no-background:hover{
    color: #ABB3C4;
    border-color: #c6e2ff;
    background: none;
}
/deep/ .el-tree-node__content:hover {
    background-color: #2f4977;
}
/deep/ .el-tree-node:focus>.el-tree-node__content{
    background-color: #2f4977;
}
</style>
