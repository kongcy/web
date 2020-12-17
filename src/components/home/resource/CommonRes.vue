<template>
	<div class="treeBox noSearchBox" style="text-align:center">
        <div class="treeWrap">
	        <el-tree
		        :props="props"
		        :data="treeData"
		        node-key="nodeId"
		        ref="main_common_tree"
		        lazy
		        show-checkbox
		        :default-expanded-keys="expandedNodes"
		        :render-content="renderContent"
		        @node-click="handleNodeClick"
		        @node-contextmenu="handleNodeRightClick"
	        >
	        </el-tree>
        </div>
        <tree-right-menu ref="rightMenu" />
    </div>
</template>

<script>
import TreeRightMenu from '@/components/home/resource/TreeRightMenu.vue'
import Enum from '@/common/enum'
import Fun from '@/common/fun'

export default {
    name: 'CommonTree',
    components: {
        TreeRightMenu
    },
    data () {
        return {
            props: {
                label: 'name',
                isLeaf: 'leaf'
            },
            treeData: [],//整个树data
            expandedNodes: [],//默认张开的id集合
            currentNode: {
                id: null,
                time: null,//点击时间
            }
        };
    },
    mounted() {

    },
    methods: {
        // 常用资源回调
        setReceiveInformResourceStatusCallback(obj) {
            if (obj && obj.nodes) {
                var list = obj.nodes;
                if (list.length == 0) return;
                if (obj.operate === "init") {
                    this.initResourceStatus(obj.subscribeId, list);
                }else if (obj.operate === "add") {
                    this.addResourceStatus(obj.subscribeId, list);
                } else if (obj.operate === "refresh") {
                    this.refreshResourceStatus(obj.subscribeId, list);
                } else if (obj.operate === "remove") {
                	this.removeResourceStatus(obj.subscribeId, list);
                }
            }
        },
        // operate: init
        initResourceStatus(subscribeId, list) {
            // 订阅资源状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResources) {
                if (this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6) {
                    this.treeData = Fun._initCommonTreeData(list);
                }
                
                if (this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5) {
                    Fun._appendCommonTreeData(this.$refs.main_common_tree, list);
                }
            // 根据关键字订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResourcesByKey) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            // 根据资源状态订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResourcesByStatus) {
                this.clearTree();
                this.treeData = Fun._initCommonTreeData(list);
            } 
        },
        // operate: add
        addResourceStatus(subscribeId, list) {
            // 订阅资源状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResources) {
                Fun._appendCommonTreeData(this.$refs.main_common_tree,list);
            // 根据关键字订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResourcesByKey) {
                Fun._appendCommonTreeData(this.$refs.main_common_tree,list);
            // 根据资源状态订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResourcesByStatus) {
                Fun._appendCommonTreeData(this.$refs.main_common_tree,list);
            } 
        },
        // operate: refresh
        refreshResourceStatus(subscribeId, list) {
            // 订阅用户状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResources) {
                Fun._refreshCommonTreeData(this.$refs.main_common_tree, list);
            // 根据关键字订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResourcesByKey) {
                Fun._refreshCommonTreeData(this.$refs.main_common_tree, list);
            // 根据资源状态订阅用户状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResourcesByStatus) {
                Fun._refreshCommonTreeData(this.$refs.main_common_tree, list);
            }
        },
        // operate: remove
        removeResourceStatus(subscribeId, list) {
            // 订阅资源状态
            if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResources) {
                Fun._removeCommonTreeData(this.$refs.main_common_tree, list);
            // 根据关键字订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResourcesByKey) {
                Fun._removeCommonTreeData(this.$refs.main_common_tree, list);
            // 根据资源状态订阅常用资源状态
            } else if (subscribeId == Enum.enumSubscribeType.main.subscribeCommonResourcesByStatus) {
                Fun._removeCommonTreeData(this.$refs.main_common_tree, list);
            } 
        },
        //单击事件--实现双击
        handleNodeClick(data, node, tree){
            if(this.currentNode.id == data.id && (new Date().getTime()-this.currentNode.time) < 250){
                if(data.resourceType==1){
                    if(data.nodeStatus=="device_online"){
                        Fun.startPlayDevice(this, data);
                    }else if(data.nodeStatus=="device_playing"){
                        Fun.stopPlayDevice(this.apiSDK, data);
                    }else if(data.nodeStatus=="device_offline"){
                        this.showremind("点播提示","设备不在线，不允许点播！")
                    }
                }
                if(data.resourceType==0){
                    if(data.nodeStatus=="person_online"){
                        Fun.startPlayPerson(this, data);
                    }else if(data.nodeStatus=="person_playing"){
                        Fun.stopPlayPerson(this.apiSDK, data);
                    }else if(data.nodeStatus=="person_offline"){
                        this.showremind("点播提示","人员不在线，不允许点播！")
                    }else if(data.nodeStatus=="person_fault"){
                        this.showremind("点播提示","人员绑定设备异常，不允许点播！")
                    }
                }
            }
            
            this.currentNode.id = data.id;
            this.currentNode.time = new Date().getTime();
            
            this.$refs.rightMenu.closeRightMenu();
            if( data.nodeStatus != 'department' ) {
               node.checked = !node.checked;
            }
        },
        //右键事件
        handleNodeRightClick(event, data, node, tree){
            this.$refs.rightMenu.showRightMenu(event, data, "common");
        },
        //树行样式
        renderContent(h, { node, data, store }) {
            return (<span class={"custom-tree-node " + data.nodeStatus} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                </span>);
        },
        //清空树
        clearTree(){
            //清空node
            var tempData = [];
            Object.assign(tempData, this.treeData);
            tempData.forEach(item => {
                let node = this.$refs.main_common_tree.getNode(item);
                node && this.$refs.main_common_tree.remove(node);
            });
            //清空data
            this.treeData.splice(0, this.treeData.length);
        },
        showremind(title,message){
            this.$notify({
                    title: title,
                    message: message,
                    type: 'warning',
                  });
        },
    },
}
</script>

<style scoped>
.treeBox{
    height: 100%;
}
.noSearchBox .treeWrap{
    height: calc(100% - 0px);
    overflow: auto;
}
</style>