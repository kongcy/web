<template>
    <div class="group">
        <p class="title" style="text-align:left;">【轮循监看】{{groupName}}</p>
        <div class="content">
            <el-tree
                ref="source_tree"
                :data="treeData"
                :props="defaultProps"
                node-key="nodeId"
                :render-content="renderContent"
                show-checkbox
                @node-click="handleNodeClick">
            </el-tree>
        </div>
        <div class="btn-group">

            <el-popover placement="top" trigger="hover" popper-class="split-popover" v-model="schemeVisible">
                <div class="">
                    <div class="scheme">
                        <div class="scheme-item" v-for="item in schemeData" :key="item.schemeId" @click="schemeChange(item)" :class="schemeValue == item.schemeId ? 'active':''">
                            <span :class="schemeValue == item.schemeId ? 'el-icon-check':''" class="icon"></span>
                            <span>{{item.schemeName}}</span>
                        </div>
                        <!-- <el-radio v-for="item in schemeData" v-model="schemeValue" label="item.schemeId">{{item.schemeName}}</el-radio> -->
                    </div>
                </div>
                
                <!-- <div class="custom-popover-footer" style="text-align:center">
                    <el-button type="primary" size="small" @click="createLoopDBGrpScheme">新建</el-button>
                    <el-button type="primary" :disabled="schemeData.length === 0" @click="switchLoopDBGrpScheme" size="small">应用</el-button>
                    <el-button @click="schemeVisible = false" size="small">取消</el-button>
                </div> -->
                <el-button v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6" 
                    slot="reference" type="text" title="显示方案" class="add-user" @click="schemeVisible = !schemeVisible">显示方案</el-button>
            </el-popover>

            <el-button type="text" title="退出分组" class="exit" @click="stopDBGrp">退出分组</el-button>
        </div>

        <scheme-manage-dialog ref="schemeManageDialog"  @refreshData="getScheme" />
    </div>
</template>

<script>
import SchemeManageDialog from '@/components/home/SchemeManageDialog.vue';
import Fun from "@/common/fun";
import Enum from "@/common/enum";

export default {
    name: 'LoopPlayPanel',
    components: {
        SchemeManageDialog
    },
    data () {
        return {
            chairmanInfo: {},
            isChairman: false,
            treeData: [],
            groupId: '',
            groupName: '',
            defaultProps: {
                label: 'name',
                isLeaf: 'leaf'
            },
            schemeVisible: false,
            schemeValue: '',
            schemeData: []
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        // 初始化数据
        initData(data) {
            console.log("轮循点播-初始化数据");
            // console.log(data)
            //{groupId:"",schemeId:"",operate:init/stop,resources:[{resourceId:"",resourceCh:"",resourceName:"",resourceType:具体参考enumResType}....],refresh:[]}
            if(data){
                let data_ = data.res;
                this.groupId = data_.groupId;
                this.groupName = data_.groupName || '';
                this.schemeValue = data_.schemeId || '';

                if( data_.operate === 'init' ){
                    this.clearTree();
                }

                if (data_.resources) {
                    this.checkTreeNode(data_.resources);
                }
            }
            this.getScheme();
        },
        //node判断
        checkTreeNode: function(list){
            let treeObj = this.$refs.source_tree;
            list.forEach((item, index) => {
                let nodeId = item.resourceId + "_" + (item.resourceCh || 0);

                //图标处理
                let resStatus = 0;
                if(item.status == Enum.enumMerberStatus.online) resStatus = 1;
                else if(item.status == Enum.enumMerberStatus.offline) resStatus = 0;
                let busStatus = 0;
                if(item.status == Enum.enumMerberStatus.playing) {resStatus = 1; busStatus = Enum.enumBussStatus.Playing;}
                let icon_ = Fun._getNodeStatus(item.resourceType, resStatus, busStatus, item.deviceType);

                const node = treeObj.getNode(nodeId);
                if(node){
                    //刷新
                    node.data.nodeStatus = icon_;
                }else{
                    //添加
                    let data = {
                        nodeId:         nodeId,
                        id:             item.resourceId,
                        name:           item.resourceName,
                        resourceType:   item.resourceType,
                        deviceType:     item.deviceType,
                        nodeStatus:     icon_
                    };
                    this.treeData.push(data)
                }                
            })
        },
        // 退出分组
        stopDBGrp() {
            this.apiSDK.stopDBGrp(this.groupId, true);
        },
        // 获取显示方案
        getScheme() {
            this.apiSDK.getDisplaySchemeBySchemeType(Enum.enumSchemeType.LocalLoopPlay, 1, 1024, res => {
                this.schemeData = res;
            });
        },
        // 显示方案选择
        schemeChange(item) {
            this.schemeValue = item.schemeId;
            this.apiSDK.switchLoopDBGrpScheme(this.groupId, this.schemeValue);
            this.schemeVisible = false;
        },
        //新建
        // createLoopDBGrpScheme() {
        //     this.$refs.schemeManageDialog.showDialog(Enum.enumSchemeType.LocalLoopPlay);
        // },
        // 应用
        // switchLoopDBGrpScheme() {
        //     if(!this.schemeValue){
        //         this.$message({
        //             message: "请选择方案",
        //             type: "warning"
        //         });
        //         return;
        //     }
        //     this.schemeVisible = false;
        //     this.apiSDK.switchLoopDBGrpScheme(this.groupId, this.schemeValue);
        // },
        //清空树
        clearTree(){
            //清空node
            let tempData = [];
            Object.assign(tempData, this.treeData);
            tempData.forEach(item => {
                let node = this.$refs.source_tree.getNode(item);
                node && this.$refs.source_tree.remove(node);
            });
            //清空data
            this.treeData.splice(0, this.treeData.length);
        },
        renderContent(h, { node, data, store }) {
            return (<span class={"custom-tree-node " + data.nodeStatus} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                </span>);
        },
        handleNodeClick(data, node, tree){
            if( data.nodeStatus != 'department' ) {
               node.checked = !node.checked;
            }
        }
    }
}
</script>
<style>
.split-popover{
	min-width: 0px !important;
	border: 1px solid #c2dff3;
	padding: 6px 12px;
}
</style>
<style scoped>
.group{
    position: relative;
    height: 100%;
}
.group .title{
    background-color: #e9f3fa;
    height: 24px;
    overflow: hidden;
    line-height: 24px;
    font-size: 12px;
    padding: 0 10px;
    color: #2e3c42;
    margin: 0;
}
.group .content{
    height: calc(100% - 125px);
    overflow: auto;
}
.group .btn-group{
    background-color: #e9f3fa;
    text-align: left;
    border-top: 1px solid #c1cfd6;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding-left: 3px;
}
.group .btn-group button{
    width: 58px;
    padding: 50px 0 0;
    color: #666;
    margin: 18px 8px;
    font-size: 12px;
}
.group .btn-group button:hover{
    color: #666;
}
.add-user{
    background: url(../../../../static/resPanelControl/add.png) no-repeat center top;
}
.add-user:hover{
    background: url(../../../../static/resPanelControl/add_hover.png) no-repeat center top;
}
.exit{
    background: url(../../../../static/resPanelControl/stop.png) no-repeat center top;
}
.exit:hover{
    background: url(../../../../static/resPanelControl/stop_hover.png) no-repeat center top;
}
.scheme {
    max-height: 250px;
    overflow: auto;
}
.scheme .scheme-item{
    display: block;
    padding: 5px 15px 5px 0px;
    cursor: pointer;
}
.scheme .scheme-item.active, .scheme .scheme-item:hover{
    color: #409EFF;
}
.scheme .scheme-item .icon{
    display: inline-block;
    width: 13px;
    color: #128bf1;
}
</style>
