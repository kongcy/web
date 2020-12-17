<template>
    <div>
        <el-dialog :visible.sync="isVisible" title="指挥转发授权" width="400px" class="custom-dialog" @close="closeDialog">
            <div class="commandListBox">
                <div class="commandList">
                    <el-tree
                        ref="source_tree"
                        :data="treeData"
                        :props="defaultProps"
                        node-key="nodeId"
                        :render-content="renderContent"
                        show-checkbox
                        @node-click="handleNodeClick"
                        :check-strictly="true"
                        default-expand-all>
                    </el-tree>
                </div>
                <div class="authBtn" @click="startCommandAuthorize">开启授权</div>
            </div>
            <p class="authTitle"><span class="authTitle_span">已授权成员：</span><span class="authTitle_btn" v-if="authorizedList.length>0" @click="stopAllCommandAuthorize">全部关闭</span></p>
            <div class="authorizedListBox">
                <ul>
                    <li v-for='item in authorizedList' :key="item.id">
                        <span class="authorizedName" :title="item.name">{{item.name}}</span><span class="authorizedBtn" @click="stopCommandAuthorize(item)">关闭</span>
                    </li>
                </ul>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "CommandForwardAuthorizeDialog",
    data() {
        return {
            isVisible:false,
            treeData:[],
            defaultProps: {
                label: 'name',
                isLeaf: 'leaf'
            },
            authorizedList:[],
        }
    },
    methods:{
        showDialog(affairId,treeData) {
            this.isVisible = true;
            this.affairId = affairId;
            this.treeData=[];
            this.treeData = treeData;

            // 获取指挥转发授权列表
            this.apiSDK.queryCommandTransmitAuth(this.affairId);
            this.apiSDK.setReceiveCommandTransmitAuthCallBack((obj)=>{
                // console.log('获取指挥转发授权列表', JSON.stringify(obj));
                let arr = [];
                if( obj.length > 0 ){
                    obj.forEach(item=>{
                        arr.push({
                            name:item.destName,
                            id:item.destId,
                        });
                    });
                }
                this.authorizedList = arr;
            });
        },
        // 开启指挥转发授权
        startCommandAuthorize(){
            let checked = this.$refs.source_tree.getCheckedNodes()
            if (checked.length === 0) {
                this.$message({message: '请至少选择一名成员', type: 'warning'});
                return;
            }
             // 只能呼叫已加入成员
            if (checked.length === 1 && checked[0].inGroup == false) {
                this.$message({message: '请选择已加入成员', type: 'warning'});
                return;
            }
            let isAllOut = 0;
            checked.forEach((item)=>{
                if( item.inGroup === false ){
                    isAllOut += 1;
                }
            });
            if( isAllOut === checked.length ){
                this.$message({message: '请选择已加入成员', type: 'warning'});
                return;
            }
            let users = [];
            checked.forEach(item => {
                if( item.inGroup == true ){
                    users.push(item.id);
                }
            });
            this.apiSDK.startCommandTransmitAuth(this.affairId, users);
        },
        closeDialog(){
            this.isVisible = false;
        },
        // 停止指挥转发授权
        stopCommandAuthorize(item){
            let users = [];
            users.push(item.id);
            this.apiSDK.stopCommandTransmitAuth(this.affairId, users);
        },
        // 全部停止指挥转发授权
        stopAllCommandAuthorize(item){
            let users = [];
            this.authorizedList.forEach(item=>{
                users.push(item.id);
            });
            this.apiSDK.stopCommandTransmitAuth(this.affairId, users);
        },
        // 获取
        closeDialog(){
            this.isVisible = false;
        },
        renderContent(h, { node, data, store }) {
            return (
                <span class={"custom-tree-node " + data.nodeStatus} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                </span>
	        );
        },
        handleNodeClick(data, node, tree){
            if( data.nodeStatus != 'department' ) {
               node.checked = !node.checked;
            }
        },
    }
}
</script>

<style scoped>
.commandListBox{
    border:1px solid #ddd;
}
.commandListBox .commandList{
    height: 260px;
    overflow: auto;
}
.commandListBox .authBtn{
    width:100px;
    height: 38px;
    border:1px solid #ddd;
    border-radius: 4px;
    margin-left: 125px;
    text-align:center;
    line-height: 38px;
    cursor: pointer;
    margin-top: 10px;
    margin-bottom: 10px;
    background: #409EFF;
    color:#fff;
}
.authTitle{
    height:30px;
    line-height: 30px;
    margin: 10px 0;
}
.authTitle .authTitle_span{
    display: inline-block;
    font-weight: bold;
}
.authTitle .authTitle_btn{
    display: inline-block;
    float: right;
    width:74px;
    height: 30px;
    border:1px solid #ddd;
    border-radius: 4px;
    text-align:center;
    line-height: 30px;
    cursor: pointer;
    box-sizing: border-box;
}
.authorizedListBox{
    height: 244px;
    border:1px solid #ddd;
    overflow: auto;
}
.authorizedListBox ul{
    padding: 0;
    margin: 0;
}
.authorizedListBox ul li{
    list-style-type: none;
    text-align: left;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    padding-right: 10px;
}
li .authorizedName{
    display: inline-block;
    width:180px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:14px;
    line-height: 24px;
    vertical-align: middle;
    color: #333;
}
li .authorizedBtn{
    display: inline-block;
    float: right;
    width: 50px;
    height: 24px;
    border:1px solid #ddd;
    border-radius: 4px;
    text-align: center;
    line-height: 24px;
    cursor: pointer;
    margin-top: 8px;
}
</style>