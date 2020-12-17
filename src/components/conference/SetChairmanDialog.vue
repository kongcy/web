<template>
    <el-dialog :visible.sync="visible"  title="指定主持人" width="500px" center class="custom-dialog">
        <el-row :gutter="10">
            <el-col :span="18"><el-input v-model="searchName" /></el-col>
            <el-col :span="6"><el-button @click="search">搜索</el-button></el-col>
        </el-row>
        <div class="members" v-if="searchData.length">
            <div class="item" v-for="item in searchData" :key="item.key">
                <el-radio v-model="chairmanId" :label="item.resId">{{item.resName}}</el-radio>
            </div>
        </div>
        <div v-else><center style="margin-top: 10px;">暂无数据</center></div>
        <span slot="footer" class="dialog-footer" style="display: block;text-align: right;">
            <el-button type="primary" @click="publishSetChairmanRole">确定</el-button>
            <el-button @click="closeDialog">取消</el-button>
        </span>
    </el-dialog>
</template>
<script>
 export default {
    name: 'SetChairmanDialog',
    data() {
        return{
            visible: false,
            conferenceId: '',
            data: [],
            searchData: [],
            defaultProps: {
                nodeId: 'nodeId',
                label: 'name',
                isLeaf: 'leaf'
            },
            chairmanId: '',
            searchName: ''
        }
    },
    methods: {
        search() {
            if (this.searchName) {
                this.searchData = [];
                this.data.forEach(item => {
                    if (item.resName.indexOf(this.searchName) > -1) {
                        this.searchData.push(item);
                    }
                })
            } else {
                this.searchData = this.data;
            }
        },
        // 指定主席
        publishSetChairmanRole(sceneID, memberID) {
            this.apiSDK.publishSetChairmanRole(this.conferenceId, this.chairmanId);
            this.closeDialog();
        },
        showDialog(data) {
            this.visible = true;
            this.searchName = '';
            this.conferenceId = data.conferenceId;
            this.data = data.members;
            this.searchData = data.members;
            this.$nextTick(() => {
              xtxk.media.setDialogTop('指定主持人');
            });
        },
        closeDialog() {
            this.visible = false;
        },
        // 全选
        getCheckNode() {
            return this.$refs.tree.getCheckedKeys();
        },
        renderContent(h, { node, data, store }) {
            return (<span class={"custom-tree-node " + data.nodeStatus} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                    <span class={data.microphoneAbility ? "open-microphone" : "close-microphone"}></span>
                    <span class={data.audioAbility ? "open-audio" : "close-audio"}></span>
                    <span class={data.videoAbility ? "open-video" : "close-video"}></span>
                    <span on-click={(event) => {this.showMenu(node, data, event)}} class={isChairman ? "set" : "set-hide"}></span>
                </span>);
        },
    }
 }   
</script>
<style scoped>
.members{
    margin-top: 20px;
    min-height: 200px;
    overflow: auto;
}
.members .item{
    line-height: 20px;
}
</style>