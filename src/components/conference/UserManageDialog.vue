<template>
    <el-dialog :visible.sync="visible"  title="管理成员" width="500px" center class="custom-dialog">
        <el-tree
            ref="tree"
            node-key="id"
            default-expand-all
            :data="data"
            :props="defaultProps"
            show-checkbox>
        </el-tree>
        <el-button @click="publishMemberMicrophone" type="text">关闭麦克风</el-button>
        <el-button @click="publishMemberAudioAbility" type="text">关闭音频</el-button>
        <el-button @click="publishMemberVideoAbility" type="text">关闭视频</el-button>
        <!-- <el-button @click="removeMember" type="text">强退成员</el-button> -->
    </el-dialog>
</template>
<script>
 export default {
    name: 'UserManageDialog',
    data() {
        return {
            visible: false,
            conferenceId: '',
            data: [],
            defaultProps: {
                id: 'id',
                label: 'name',
                isLeaf: 'leaf'
            }
        }
    },
    methods: {
        // 主席,成员闭音
        publishMemberAudioAbility() {
            let memberIDs = this.getCheckNode();
            this.apiSDK.publishMemberAudioAbility(this.conferenceId, memberIDs, true);
        },
        // 主席,成员闭麦
        publishMemberMicrophone() {
            let memberIDs = this.getCheckNode();
            this.apiSDK.publishMemberMicrophone(this.conferenceId, memberIDs, true);
        },
        // 主席,成员关闭视频
        publishMemberVideoAbility() {
            let memberIDs = this.getCheckNode();
            this.apiSDK.publishMemberVideoAbility(this.conferenceId, memberIDs, true);
        },
        // 强退成员
        removeMember() {
            let memberIDs = this.getCheckNode();
            memberIDs = memberIDs.map(item => ({ userId: item }));
            this.apiSDK.removeMember(this.conferenceId, memberIDs);
        },
        showDialog(data) {
            this.data = [];
            this.visible = true;
            this.conferenceId = data.conferenceId;
            this.data.push({name: '全选', id: 'all', children: data.members});
            this.$nextTick(() => {
              xtxk.media.setDialogTop('管理成员');
            });
        },
        // 全选
        getCheckNode() {
            let data = this.$refs.tree.getCheckedKeys();
            let ind = data.findIndex(item => (item === 'all'));
            if (ind > -1) {
                data.splice(ind, 1);
            }
            return data;
        },
        // renderContent(h, { node, data, store }) {
        //     return (<span class={"custom-tree-node " + data.nodeStatus} >
        //             <span class="node-icon"></span>
        //             <span>{node.label}</span>
        //             <span class={data.microphoneAbility ? "open-microphone" : "close-microphone"}></span>
        //             <span class={data.audioAbility ? "open-audio" : "close-audio"}></span>
        //             <span class={data.videoAbility ? "open-video" : "close-video"}></span>
        //             <span on-click={(event) => {this.showMenu(node, data, event)}} class={isChairman ? "set" : "set-hide"}></span>
        //         </span>);
        // },
    }
 }   
</script>
<style scoped>

</style>