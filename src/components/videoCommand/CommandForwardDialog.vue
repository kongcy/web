<template>
    <div>
        <el-dialog :visible.sync="isVisible" title="指挥转发" width="1300px" class="custom-dialog" @close="closeDialog">
            <div class="videoForwardWrap">
                <div class="videoForwardLeft">
                    <!-- <div class="vfLeftTop">
                        <span>第1步，选择接收人员</span>
                        <span>第2步，选择可转发资源</span>
                    </div> -->
                    <div class="vfLeftMain">
                        <div class="vfLeftMain_UsersWrap">
                            <div class="vfTitle">第1步，选择接收人员</div>
                            <div class="vfUsersBox">
                                <!-- <person-tree ref="personTreeForward" :subscribeType="subscribeType" style="height: 590px;"/> -->
                                <el-tree
                                    ref="commandMemberTree_tree"
                                    :data="commandMemberTreeData"
                                    :props="defaultProps"
                                    node-key="nodeId"
                                    :render-content="renderContent"
                                    show-checkbox
                                    check-strictly
                                    :default-expand-all='true'
                                    >
                                </el-tree>

                            </div>
                        </div>
                        <div class="vfLeftMain_ResWrap">
                            <div class="vfTitle">第2步，选择可转发资源</div>
                            <div class="vfResBox">
                                <ul>
                                    <template v-for="item in mfResArr">
                                        <li :id="item.id" :key="item.id">
                                            <el-checkbox v-model="item.checked"></el-checkbox >
                                            <span class="point_icon"></span>
                                            <span class="point_name">{{item.name}}</span>
                                        </li>
                                    </template>
                                </ul>
                            </div>
                            <div class="vfBtnBox">
                                <el-button type="primary" class="btnCom" @click="handleConfirm">转发资源</el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="videoForwardRight">
                    <div class="vfRight_Top">
                        <div class="vfTableTitle">发出列表</div>
                        <div class="sendedTableBox">
                            <el-table :data="sendedTableData" height="297" border class="custom-table" style="width: 100%">
                                <el-table-column prop="resName" label="资源名" align="center" width="160">
                                </el-table-column>
                                <el-table-column prop="receiverName" label="接收用户" align="center">
                                </el-table-column>
                                <el-table-column v-if="userVersion" prop="sendTime" label="转发时间" align="center">
                                </el-table-column>
                                <el-table-column prop="status" label="状态" align="center" width="90">
                                    <template slot-scope="scope">
                                        <!-- <span v-if="scope.row.status === '0'" class="forward_statusIcon forward_waiting" title="等待接收"></span> -->
                                        <span v-if="scope.row.status === 0" class="forward_statusIcon forward_isForwarding" title="等待接收"></span>
                                        <span v-if="scope.row.status === 1" class="forward_statusIcon forward_successed" title="正在转发"></span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="operator" label="操作" align="center" width="60">
                                    <template slot-scope="scope" >
                                        <span  v-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion6">
                                            <span v-if="scope.row.status === 1" class="forward_operatIcon forward_stopForward" title="停止转发" @click="handleStopForward(scope.row)"></span>
                                            <span v-else class="forward_operatIcon forward_reForward" title="重新转发" @click="handleReForward(scope.row)"></span>
                                        </span>
                                        <span v-else-if="apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5">
                                             <span class="forward_operatIcon forward_stopForward" title="停止转发" @click="handleStopForward(scope.row)"></span>
                                        </span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <div class="vfRight_Bottom">
                        <div class="vfTableTitle">接收列表</div>
                        <div class="receivedTableBox">
                            <el-table :data="receivedTableData" height="297" class="custom-table" border style="width: 100%">
                                <el-table-column prop="resName" label="资源名" align="center" width="160">
                                </el-table-column>
                                <el-table-column prop="senderName" label="发送用户" align="center" >
                                </el-table-column>
                                <el-table-column v-if="userVersion" prop="receiveTime" label="接收时间" align="center">
                                </el-table-column>
                                <el-table-column prop="status" label="状态" align="center" width="90">
                                    <template slot-scope="scope">
                                        <!-- <span v-if="scope.row.status === '0'" class="forward_statusIcon forward_waiting" title="等待接收"></span> -->
                                        <span v-if="scope.row.status === 0" class="forward_statusIcon forward_isForwarding" title="等待接收"></span>
                                        <span v-if="scope.row.status === 1" class="forward_statusIcon forward_successed" title="正在转发"></span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="operator" label="操作" align="center" width="60">
                                    <template slot-scope="scope">
                                        <span class="forward_operatIcon forward_stopReceive" title="停止接收" @click="handleStopReceive(scope.row)"></span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import PersonTree from "@/components/home/selectRes/PersonTree.vue";
import Enum from "@/common/enum";
export default {
    name: "VideoForwardDialog",
    components: {
        PersonTree,
    },
    data() {
        return {
            isVisible:false,
            subscribeType: '',
            mfResArr:[],
            affairId:'',
            commandMemberTreeData:[],
            sendedTableData:[],
            receivedTableData:[],
            senderName:'',
            userVersion:this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5,
            defaultProps: {
                label: 'name',
                isLeaf: 'leaf'
            },
        }
    },
    methods:{
        showDialog(affairId,treeData) {
            let that = this;
            this.isVisible = true;
            this.affairId = affairId;
            this.commandMemberTreeData=[];
            this.commandMemberTreeData = treeData;

            this.mfResArr = [];
            this.getForwardResourceList();

            this.senderName = xtxk.cache.get("USER").userName;
            // 订阅转发信息
            this.apiSDK.subscribeTransmitStatus(affairId);
            this.sendedTableData = [];
            this.receivedTableData = [];
            // 推送转发列表
            this.apiSDK.setReceiveTransmitListCallback(function(obj){
                console.log('推送转发列表', JSON.stringify(obj));
                if(that.apiSDK.config.version === that.apiSDK.enumSDKVersion.SDKVersion5){
                    if(obj && obj.operate){
                        if('init' === obj.operate){
                            if(obj.sendList || obj.receiverList){
                                that.getInitTableData(obj.sendList,obj.receiverList);
                            }
                        }else if('add' === obj.operate){
                            if(obj.sendList || obj.receiverList){
                                that.getAddTableData(obj.sendList,obj.receiverList);
                            }
                        }else if('refresh' === obj.operate){
                            if(obj.sendList || obj.receiverList){
                                that.getRefreshTableData(obj.sendList,obj.receiverList);
                            }
                        }else if('remove' === obj.operate){
                            if(obj.sendList || obj.receiverList){
                                that.getRemoveTableData(obj.sendList,obj.receiverList);
                            }
                        }
                    }
                }else{
                    if( obj.sendList && obj.sendList.length ){
                        obj.sendList.forEach((item)=>{
                            that.sendedTableData.push({
                                resName:item.resourceName,
                                resId:item.resourceID,
                                resCh:item.resourceCh,
                                resType:item.resourceType,
                                receiverName:item.receiverName,
                                receiverId:item.receiverID,
                                status:item.status,
                                sendTime:item.dateTime,
                            });
                        });
                    }
                    // 接收列表
                    if( obj.receiverList && obj.receiverList.length ){
                        obj.receiverList.forEach((item)=>{
                            that.receivedTableData.push({
                                resName:item.resourceName,
                                resId:item.resourceID,
                                resCh:item.resourceCh,
                                resType:item.resourceType,
                                senderName:item.senderName,
                                senderId:item.senderID,
                                status:item.status,
                                receiveTime:item.dateTime,
                            });
                        });
                    }
                }
            });
        },

        // 获取可转发资源
        getForwardResourceList(){


            let that=this;

            let subscribeId = Enum.enumSubscribeType.transmit.subscribeBusinessStatus;
            this.apiSDK.getTransimitResources(subscribeId, function(obj){
                if( obj && obj.resources ){
                    obj.resources.forEach((item)=>{
                        that.mfResArr.push({
                            id:item.resId,
                            name:item.resName,
                            resCh:item.resCh,
                            resourceType:item.resType,
                            checked:false,
                        });
                    });
                }
            });
        },

        //获取初始化init转发列表的数据
        getInitTableData(sendList,receiverList){
            this.sendedTableData = [];
            this.receivedTableData = [];
            if( sendList && sendList.length ){
                sendList.forEach((item)=>{
                    this.sendedTableData.push({
                        resName:item.resourceName,
                        resId:item.resourceID,
                        resCh:item.resourceCh,
                        resType:item.resourceType,
                        receiverName:item.destName,
                        receiverId:item.destId,
                        senderId:item.senderID,
                        status:item.status,
                        sendTime:item.dateTime,
                    });
                });
            }
            // 接收列表
            if( receiverList && receiverList.length ){
                receiverList.forEach((item)=>{
                    this.receivedTableData.push({
                        resName:item.resourceName,
                        resId:item.resourceID,
                        resCh:item.resourceCh,
                        resType:item.resourceType,
                        senderName:item.senderName,
                        senderId:item.senderID,
                        receiverId:item.destId,
                        status:item.status,
                        receiveTime:item.dateTime,
                    });
                });
            }
        },

        //获取初始化add转发列表的数据
        getAddTableData(sendList,receiverList){
            if( sendList && sendList.length ){
                sendList.forEach((item)=>{
                    this.sendedTableData.push({
                        resName:item.resourceName,
                        resId:item.resourceID,
                        resCh:item.resourceCh,
                        resType:item.resourceType,
                        receiverName:item.destName,
                        receiverId:item.destId,
                        senderId:item.senderID,
                        status:item.status,
                        sendTime:item.dateTime,
                    });
                });
            }
            // 接收列表
            if( receiverList && receiverList.length ){
                if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6  ) {
                    receiverList.forEach((item)=>{
                        this.receivedTableData.push({
                            resName:item.resourceName,
                            resId:item.resourceID,
                            resCh:item.resourceCh,
                            resType:item.resourceType,
                            senderName:item.senderName,
                            senderId:item.senderID,
                            receiverId:item.destId,
                            status:item.status,
                            receiveTime:item.dateTime,
                        });
                    });
                } else if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 ) {
                        let isAdd = false;
                        let sine = receiverList[0];
                        if( this.receivedTableData.length ) {
                            isAdd = this.receivedTableData.some((it)=>{
                                return  it.resName === sine.resourceName && it.senderName === sine.senderName
                           })
                        }
                        !isAdd && this.receivedTableDataAdd(sine);
                }

                // 新增接收数据时， 刷新第2步的tree
                this.refreshTwoTree();
            }
        },
        receivedTableDataAdd (item) {
            this.receivedTableData.push({
                resName:item.resourceName,
                resId:item.resourceID,
                resCh:item.resourceCh,
                resType:item.resourceType,
                senderName:item.senderName,
                senderId:item.senderID,
                receiverId:item.destId,
                status:item.status,
                receiveTime:item.dateTime,
            });
        },
        //获取初刷新转发列表的数据
        getRefreshTableData(sendList,receiverList){
            if( sendList && sendList.length ){
                sendList.forEach((item)=>{
                    this.sendedTableData.forEach((it)=>{
                        if(it.senderId === item.senderID && it.receiverId === item.destId && it.resId === item.resourceID && it.resCh === item.resourceCh){
                            it.status = item.status;
                        }
                    })
                });
            }
            // 接收列表
            if( receiverList && receiverList.length ){
                receiverList.forEach((item)=>{
                    this.receivedTableData.forEach((it)=>{
                        if(it.senderId === item.senderID && it.receiverId === item.destId && it.resId === item.resourceID && it.resCh === item.resourceCh){
                            it.status = item.status;
                        }
                    })
                });
            }
        },

         getRemoveTableData(sendList,receiverList){
            if( sendList && sendList.length ){
                sendList.forEach((item)=>{
                    var index = this.sendedTableData.findIndex(it =>{
                        if(it.senderId === item.senderID && it.receiverId === item.destId && it.resId === item.resourceID && it.resCh === item.resourceCh){
                           return true;
                        }
                    });
                    index > -1 && this.sendedTableData.splice(index,1);
                });
            }
            // 接收列表
            if( receiverList && receiverList.length ){
                receiverList.forEach((item)=>{
                    var index = this.receivedTableData.findIndex(it =>{
                        if(it.senderId === item.senderID && it.receiverId === item.destId && it.resId === item.resourceID && it.resCh === item.resourceCh){
                           return true;
                        }
                    });
                    index > -1 && this.receivedTableData.splice(index,1);
                });
                // 新增接收数据时， 刷新第2步的tree
                this.refreshTwoTree();
            }
        },
        // 获取发出列表
        getSendedTableData(){
            this.sendedTableData = [];
        },
        // 获取接受列表
        getReceivedTableData(){
            this.receivedTableData = [];
        },
        // 转发资源按钮
        handleConfirm(){
            // console.log('-----------------videoForward------------------');
            // 接收用户
            //let resources = [];
            let receivers = [];
            let userCheckNodes = this.$refs.commandMemberTree_tree.getCheckedNodes();
            // console.log(JSON.stringify(userCheckNodes));
            userCheckNodes && userCheckNodes.forEach(item => {
                if( item.nodeStatus != "department" ){
                    /* resources.push({
                        resourceId : item.id,
                        resourceCh : item.resCh,
                        resName : item.name,
                        resType : item.resourceType,
                    }); */
                    receivers.push({
                        receiverName:item.name,
                        receiveId:item.id,
                    });
                }
            })
            // console.log(JSON.stringify(resources));
              if( receivers.length === 0 ){
                  this.$message({
                        message: '请选择接收用户',
                        type: 'warning'
                    });
                  return;
              }
            // 可转发资源
            // console.log(JSON.stringify(this.mfResArr));
            // let receivers = [];
            let resources = [];
            // receivers:[{receiveId:"XTTEST000034",receiverName:''}]
            this.mfResArr.forEach((item,index)=>{
                if( item.checked === true ){
                    /* receivers.push({
                        receiverName:item.name,
                        receiveId:item.id,
                    }); */
                    resources.push({
                        resourceId : item.id,
                        resourceCh : item.resCh,
                        resName : item.name,
                        resType : item.resourceType,
                    });
                }
            });
            // console.log(JSON.stringify(receivers));
            if( resources.length === 0 ){
                this.$message({
                    message: '请选择可转发资源',
                    type: 'warning'
                });
                return;
            }

            console.log('点击转发资源', { resources: resources, senderName: this.senderName, affairId: this.affairId });
            this.apiSDK.startTransmit(resources, receivers, this.senderName, this.affairId);
        },
        // 发出列表-停止转发
        handleStopForward(row){
            // console.log('发出列表-停止转发', this.sendedTableData);
            console.log('发出列表-停止转发', JSON.stringify(row));
            let resources = [];
            // resources:[{resId:'',resCh:'',resName:'',resType:""}...]
            resources.push({
                resId:row.resId,
                resCh:row.resCh,
                resName:row.resName,
                resType:row.resType,
            });
            // 发送者-停止转发
            this.apiSDK.stopTransmit(row.receiverId, resources, this.senderName, row.receiverName,row.senderId, this.affairId);
        },
        // 发出列表-重新转发
        handleReForward(row){
            // console.log(JSON.stringify(row));
            let resources = [];
            resources.push({
                resourceId : row.resId,
                resourceCh : row.resCh,
                resName : row.resName,
                resType : row.resType,
            });
            let receivers = [];
            receivers.push({
                receiverName:row.receiverName,
                receiveId:row.receiverId,
            });
            // 发送者-开始转发
            this.apiSDK.startTransmit(resources, receivers, this.senderName);
            this.refreshTwoTree();
        },
        // 接收列表-停止接收
        handleStopReceive(row){
            let resources = [];
            // resources:[{resId:'',resCh:'',resName:'',resType:""}...]
            resources.push({
                resId:row.resId,
                resCh:row.resCh,
                resName:row.resName,
                resType:row.resType,
            });
            console.log(JSON.stringify(resources));
            let affairId = '';
            // 接收者-停止转发
            this.apiSDK.stopTransmit(row.receiverId, resources, row.senderName,this.senderName, row.senderId, affairId);
        },
        // --------------- 暂未使用 ---------------
        // 接收者-接受转发
        acceptForward(){
            // resources:[{resId:'',resCh:'',resName:'',resType:""}...]
            this.apiSDK.acceptTransmit(resources, receiverId,senderName,receiverName);
        },
        closeDialog() {
            //清空
            this.commandMemberTreeData=[];
            // 取消订阅转发状态
            this.apiSDK.cancelSubscribeTransmit();
        },
        // 刷新 第2步 tree
        refreshTwoTree() {
            this.mfResArr = [];
            this.getForwardResourceList();
        },
        renderContent(h, { node, data, store }) {
            return (<span class={"custom-tree-node " + data.nodeStatus} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                </span>);
        },
    }
}
</script>

<style scoped>
.videoForwardWrap{
    overflow: hidden;
}
.videoForwardWrap .videoForwardLeft{
    display: inline-block;
    width:640px;
    height: 680px;
    float: left;
    /* border:1px solid pink; */
}
/* .videoForwardLeft .vfLeftTop{
    width:100%;
    height: 30px;
    line-height: 30px;
    background: #e9f3fa;
    border: 1px solid #c8cdd5;
    margin-bottom: 10px;
    box-sizing: border-box;
    text-align: left;
}
.videoForwardLeft .vfLeftTop span{
    display: inline-block;
    width: 300px;
    font-size: 14px;
    color: #4a8df0;
    padding-left: 5px;
} */
.videoForwardLeft .vfLeftMain{
    width: 100%;
    /* height: calc(100% - 40px); */
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
}
.videoForwardLeft .vfLeftMain .vfLeftMain_UsersWrap{
    display: inline-block;
    width: 300px;
    height: 100%;
    float: left;
    border: 1px solid #c8cdd5;
    box-sizing: border-box;
}
.vfLeftMain_UsersWrap .vfTitle{
    height: 40px;
    border-bottom: 1px solid #c8cdd5;
    box-sizing: border-box;
	background-color: #e9f3fa;
    font-size: 14px;
    color: #2e3c42;
    padding-left: 15px;
    line-height: 40px;
    text-align: left;
}
.vfLeftMain_UsersWrap .vfUsersBox{
    /* height: calc(100% - 90px); */
    height: calc(100% - 40px);
    /* border:1px solid pink; */
    box-sizing: border-box;
}
.videoForwardLeft .vfLeftMain .vfLeftMain_ResWrap{
     display: inline-block;
    width: 330px;
    height: 100%;
    float: right;
    border: 1px solid #c8cdd5;
    box-sizing: border-box;
}
.vfLeftMain_ResWrap .vfTitle{
    height: 40px;
    border-bottom: 1px solid #c8cdd5;
    box-sizing: border-box;
	background-color: #e9f3fa;
    font-size: 14px;
    color: #2e3c42;
    padding-left: 15px;
    line-height: 40px;
    text-align: left;
}
.vfLeftMain_ResWrap .vfResBox{
    height: calc(100% - 105px);
    margin-bottom: 5px;
    /* border-bottom:1px solid #c8cdd5; */
    box-sizing: border-box;
    overflow: auto;
}
.vfResBox ul{
    padding: 0;
    margin: 0;
}
.vfResBox ul li{
    list-style-type: none;
    text-align: left;
    height: 40px;
    line-height: 40px;
    padding-left: 15px;
}
.vfResBox ul li.active{
    background: #b1e0ff;
}
.vfResBox ul li .point_icon{
    display: inline-block;
    width: 20px;
    height: 20px;
    background:url("../../../static/resource_tree/person_online.png");
    background-repeat:no-repeat;
    background-size:cover;
    vertical-align: middle;
}
.vfResBox ul li .point_name{
    display: inline-block;
    max-width: 230px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:14px;
    line-height: 24px;
    vertical-align: middle;
    color: #666;
}
.vfLeftMain_ResWrap .vfBtnBox{
    height: 60px;
    line-height: 60px;
    text-align: center;
}
.videoForwardWrap .videoForwardRight{
    display: inline-block;
    width:600px;
    height: 680px;
    float: right;
    /* border:1px solid pink; */
}
.videoForwardRight .vfRight_Top{
    width: 100%;
    height: 335px;
    box-sizing: border-box;
}
.vfRight_Top .vfTableTitle{
    height: 36px;
    border: 1px solid #c8cdd5;
    border-bottom: none;
    box-sizing: border-box;
    font-size: 14px;
    color: #333;
    padding-left: 15px;
    line-height: 36px;
    text-align: left;
}
.vfRight_Top .sendedTableBox{
    height: calc(100% - 36px);
}
.videoForwardRight .vfRight_Bottom{
    width: 100%;
    height: 335px;
    box-sizing: border-box;
    margin-top: 10px;
}
.vfRight_Bottom .vfTableTitle{
    height: 36px;
    border: 1px solid #c8cdd5;
    border-bottom: none;
    box-sizing: border-box;
    font-size: 14px;
    color: #333;
    padding-left: 15px;
    line-height: 36px;
    text-align: left;
}
.vfRight_Bottom .receivedTableBox{
    height: calc(100% - 36px);
}

/deep/.videoForwardRight .el-table thead{
    height: 36px;
    border-color: #c8cdd5;
}
/deep/.videoForwardRight .el-table thead th{
    padding:0;
    background: #e9f3fa;
    font-family: 'MicrosoftYaHei';
	font-weight: normal;
}
/deep/.videoForwardRight .el-table tbody tr{
    /* padding:0; */
    height: 36px;
    color: #666;
    font-family: 'MicrosoftYaHei';
	font-size: 14px;
	font-weight: normal;
}
/deep/.videoForwardRight .el-table tbody tr td{
    padding:0;
}
.videoForwardRight .forward_statusIcon,
.videoForwardRight .forward_operatIcon {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-top: 6px;
}
/* .videoForwardRight .forward_waiting{
    background: url("../../../static/videoForward/forward_waiting.png") no-repeat;
    background-size:100% 100%;
} */
.videoForwardRight .forward_isForwarding{
    background: url("../../../static/videoForward/forward_isForwarding.png") no-repeat;
    background-size:100% 100%;
}
.videoForwardRight .forward_successed{
    background: url("../../../static/videoForward/forward_successed.png") no-repeat;
    background-size:100% 100%;
}
.videoForwardRight .forward_failed{
    background: url("../../../static/videoForward/forward_failed.png") no-repeat;
    background-size:100% 100%;
}
.videoForwardRight .forward_refused{
    background: url("../../../static/videoForward/forward_refused.png") no-repeat;
    background-size:100% 100%;
}
.videoForwardRight .forward_stopForward,
.videoForwardRight .forward_stopReceive{
    background: url("../../../static/videoForward/forward_stopForward.png") no-repeat;
    background-size:100% 100%;
    cursor:pointer;
}
.videoForwardRight .forward_reForward{
    background: url("../../../static/videoForward/forward_reForward.png") no-repeat;
    background-size:100% 100%;
    cursor:pointer;
}
</style>
