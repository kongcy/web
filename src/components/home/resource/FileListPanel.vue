<template>
	<div style="height: 100%;">
        <div class="treeWrap">
	        <el-tree
		        :props="props"
		        :data="treeData"
                :load="loadNodeMainUser"
		        node-key="nodeId"
		        ref="main_fileList_tree"
		        lazy
		        :default-expanded-keys="expandedNodes"
		        :render-content="renderContent"
		        @node-click="handleNodeClick"
		        @node-contextmenu="handleNodeRightClick"
	        >
	        </el-tree>
        </div>
        <tree-right-menu ref="rightMenu"/>
    </div>
</template>

<script>
import TreeRightMenu from '@/components/home/resource/TreeRightMenu.vue'
import Enum from '@/common/enum'
import Fun from '@/common/fun'

export default {
    name: 'DeviceTree',
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
        // 文件频道回调
        setReceiveInformResourceStatusCallback(obj) {
            if (obj && obj.nodes) {
                let list = obj.nodes;
                if (list.length == 0) return;
                if (obj.operate === "add") {
                    this.treeData = Fun._initFileListTreeData(list);
                } else if (obj.operate === "status") {
                    Fun._refreshFileListTreeData(this.$refs.main_fileList_tree, list);
                }
            }
        },
        loadNodeMainUser(node, resolve) {
            let id = node.data.id;
            if(node.data.nodeStatus == 'department'){
                this.apiSDK.getFilesByChannelId(id, (res) => {
                    if (res) {
                        let list = res.map(item => {
                            return {
                                parentId: id,
                                resId: item.fileId,
                                resName: item.fileName,
                                isOnline: true,
                                isPlay: false,
                                resCh: 0
                            }
                        })
                        Fun._appendFileListTreeData(this.$refs.main_fileList_tree, list);
                        resolve(node.data.children);
                    } else {
                        resolve([]);
                    }
                });
                resolve([]);
            }
        },
        //单击事件--实现双击
        handleNodeClick(data, node, tree){
            if(this.currentNode.id == data.id && (new Date().getTime()-this.currentNode.time) < 250){
                if(this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6) {
                    Fun.startPlayDevice(this, data);
                } else {
                    if(data.nodeStatus=="filelist_online"){
                        Fun.startPlayDevice(this, data);
                    }else if(data.nodeStatus=="filelist_playing"){
                        Fun.stopPlayDevice(this.apiSDK, data);
                    }else if(data.nodeStatus=="filelist_offline"){
                        this.showremind("点播提示","设备不在线，不允许点播！")
                    }
                }
            }
            this.currentNode.id = data.id;
            this.currentNode.time = new Date().getTime();
            
            this.$refs.rightMenu.closeRightMenu();
        },
        //右键事件
        handleNodeRightClick(event, data, node, tree){
            if(this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6) {
                data.nodeStatus = 'filelist_online';
            }
            if (data.nodeStatus === 'filelist_online') {
                this.$refs.rightMenu.showRightMenu(event, data);
            }
        },
        //树行样式
        renderContent(h, { node, data, store }) {
            return (<span class={"custom-tree-node " + 'filelist_online'} >
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
                let node = this.$refs.main_device_tree.getNode(item);
                node && this.$refs.main_device_tree.remove(node);
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
.treeWrap{
    /* height: calc(100% - 40px); */
    height: 100%;
    overflow: auto;
}
</style>