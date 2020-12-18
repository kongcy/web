<template>
  <div id="divResourceArea" width="412px">
      
    <!-- 资源显示区域 -->
    <div class="tabWrap" style="height:100%">
        <el-tabs v-model="activeName" class="tabWrap_tabs" :before-leave="changeActiveName">
        <!-- <el-tabs v-model="activeName" class="tabWrap_tabs"> -->
            <el-tab-pane v-for="(item, index) in editableTabs" :label="item.title" :name="item.name" :key="item.name" style="height:100%;width:412px;">
                <component :is="item.content" :ref="item.ref" :treeId="item.treeId" v-on="$listeners"></component>
            </el-tab-pane>
        </el-tabs>
        <!-- 巡查管理按钮 -->
       <div class="btn-stratege" v-show="activeName == 'SearchStratege'" @click="showStartege" ref="SearchStratege"></div>
       <div class="title-bg"></div> 
    </div>
  
    <temproary-conference-dialog ref="temproaryConference" />
    <conference-scene-dialog ref="conferenceScene"></conference-scene-dialog>
    <!-- 五阶段会议修改 -->
    <temproary-command-dialog ref="temproaryCommand" />

    <!-- 设备资源树筛选弹出框 -->
    <!-- <div class="popperBox cs" v-show="isTreeItemShow">
        <el-checkbox-group v-model="checkedItems" @change="handleCheckedChange(TreeItem)">
          <el-checkbox v-for="item in TreeItem.content" :label="item.id" :key="item.text">{{item.text}}</el-checkbox>
        </el-checkbox-group>
      
        <div class="poperBoxfoot">
            <el-button type="primary" plain size="small">确定</el-button>
            <div class="clearbtn">
              <el-checkbox :indeterminate="TreeItem.isIndeterminate" v-model="TreeItem.checkAll" @change="handleCheckAllChange(TreeItem)">全选</el-checkbox>
                <el-button type="text" ><i class="icon-clear"></i>清空</el-button>
            </div>
           
        </div>
        
    </div> -->
  </div>
</template>

<script>
import EquipementRes from "@/components/home/resource/EquipementRes.vue";
// import PersonTree from "@/components/home/resource/PersonTree.vue";
// import DeviceTree from "@/components/home/resource/DeviceTree3.vue";
import SearchStratege from "@/components/home/resource/SearchStratege.vue";
// import CommonRes from "@/components/home/resource/CommonRes.vue";
// import FileList from "@/components/home/resource/FileListPanel.vue";
import ConferenceDiscuss from "@/components/conference/ConferenceDiscussActived.vue";
import VideoPanel from "@/components/home/resource/ConferencePanel.vue";
import GroupCallPanel from "@/components/home/resource/GroupCallPanel.vue";
import LoopPlayPanel from "@/components/home/resource/LoopPlayPanel.vue";
import VideoSearch from "@/components/home/resource/VideoSearch.vue";
import VideoCommandPanel from "@/components/videoCommand/VideoCommandPanel.vue";
import TemproaryConferenceDialog from "@/components/conference/TemproaryConferenceDialog.vue";
import ConferenceSceneDialog from "@/components/conference/ConferenceSceneDialog.vue";
import TemproaryCommandDialog from "@/components/videoCommand/TemproaryCommandDialog.vue";
import Enum from "@/common/enum";
import Fun from '@/common/fun'

export default {
  name: "ResourceContainer",
  components: {
    // PersonTree,
    // DeviceTree,
    EquipementRes,
    SearchStratege,
    // CommonRes,
    // FileList,
    VideoPanel,
    ConferenceDiscuss,
    GroupCallPanel,
    LoopPlayPanel,
    VideoSearch,
    VideoCommandPanel,
    TemproaryConferenceDialog,
    TemproaryCommandDialog,
    ConferenceSceneDialog,
  },
  data() {
    return {
      activetabName:'',
      activeName: "EquipementRes",
      
      editableTabs: [
       {
          title: '设备资源',
          name: 'EquipementRes',
          content: 'EquipementRes',
          ref: 'equipementRes',
          treeId: 'MainDevicesStatus'
        },
        {
          title: '视频巡查',
          name: 'SearchStratege',
          content: 'SearchStratege',
          ref: 'searchStratege',
          treeId: 'MainDevicesStatus'
        }
      ],
      searchV:["123","456"],
      checkedItems:[],//设备资源树筛选数据
      isTreeItemShow:false,//设备资源树筛选框是否显示
      TreeItem:[],//设备资源树筛选数据

   };
  },
  mounted() {
    this.activetabName=xtxk.cache.get('activeName');

    // 分组呼叫状态推送回调
    this.apiSDK.setInformGroupCallStatusCallback(res => {
      if (res && res.operate === 'stop') {
        this.deletePanel('GroupCallPanel')
      } else {
        this.addPanel({res: res}, {title: '分组呼叫', name: 'GroupCallPanel'});
      }
    });
    // 分组点播
    this.apiSDK.setInformDBGrpStatusCallback(res => {
      if (res && res.operate === 'stop') {
        this.deletePanel('LoopPlayPanel')
      } else {
        this.addPanel({res: res}, {title: '轮循监看', name: 'LoopPlayPanel'});
      }
    });

    //告警时的事件处理
    this.$root.$on('alarmEvent', (data) => {
      //1、树节点标红
      this.$refs.equipementRes[0].$refs.deviceTree[0]&& this.$refs.equipementRes[0].$refs.deviceTree[0].setDeviceAlarmStatusByTip(data.locationId, data.deviceId);
    })
  },
  methods: {
    initTree: function() {
        this.$refs.equipementRes[0]&& this.$refs.equipementRes[0].initTree();
      // this.$nextTick(() => {
      //   const self = this;
      //   const organId = "";
      //   let subjectId = 0;
      
        // //获取设备组织结构
        // this.apiSDK.getOrganizationDevice(organId, Enum.enumSubscribeType.main.subscribeOrganizationDevice, subjectId, function(obj){
        //   //console.log(obj);
        //   self.$refs.deviceTree[0]&& self.$refs.deviceTree[0].setReceiveInformAddDepartmentCallback(obj);
        // });
        //   // 资源状态回调
        // this.apiSDK.setReceiveResourceStatusQueryCallback("main", function(obj) {
        //   self.$refs.deviceTree[0]&&self.$refs.deviceTree[0].setReceiveInformResourceStatusCallback(obj);
        // });
        // //获取视频巡查分组
        // // self.$refs.searchStratege[0] && self.$refs.searchStratege[0].getBusTableData();
     // })
    },
    //全部离线
    offline(){
       this.$refs.equipementRes[0]&& this.$refs.equipementRes[0].offline();
        //  Fun.transformTreeToArray(this.$refs.deviceTree[0].treeData).forEach(item => {
        //     if(item.resourceType==1){
        //         item.nodeStatus="device_offline"
        //     }
        // });
    },
    //菜单单击
    tabClickHandler(tab){
    },
    // // 去重
    // reduce(array) {
    //     let object = {}
    //     return array.reduce((total, item) => {
    //         object[item.nodeId] ? '' : object[item.nodeId] = true && total.push(item)
    //         return total
    //     }, [])
    // },
    // /**
    //  * @param  {String} resType [需返回的数据，默认为所有]
    //  * @return {Array}          [description]
    //  */
    // mergeResourceData() {
    //   let nodes = [];
    //   if(this.activeName == "PersonTree"){
    //     nodes = this.$refs.personTree[0].$refs.main_user_tree.getCheckedNodes();
    //   }else if(this.activeName == "DeviceTree"){
    //     nodes = this.$refs.deviceTree[0].$refs.main_device_tree.getCheckedNodes();
    //   } else if(this.activeName == "CommonRes"){
    //     nodes = this.$refs.commonRes[0].$refs.main_common_tree.getCheckedNodes();
    //   }
    //   return this.reduce(nodes);
    // },
    // //批量点播
    // startPlays(){
    //   var targetNodesP = [];
    //   var targetNodesD = [];

    //   var nodes = this.mergeResourceData();
    //   for( var i=0;i<nodes.length;i++ ){
    //     if( nodes[i].nodeStatus == "person_online" ){
    //       targetNodesP.push(nodes[i]);
    //     }
    //     if( nodes[i].nodeStatus == "device_online" || nodes[i].nodeStatus == 'channel_online'){
    //       targetNodesD.push(nodes[i]);
    //     }
    //   }
    //   if( targetNodesP.length + targetNodesD.length == 0 ){
    //     var content = '请选择在线空闲的资源发起点播';
    //     this.$message({message: content, type: 'warning'})
    //     return;
    //   }
    //   Fun.startPlayRess(this, targetNodesP.concat(targetNodesD));
    // },
    // //批量呼叫
    // startCalls(){
    //   var targetNodes = [];

    //   var nodes = this.mergeResourceData();
    //   for( var i=0; i<nodes.length; i++ ){
    //     if( nodes[i].nodeStatus == "person_online"  || nodes[i].nodeStatus == "person_playing" ){
    //       targetNodes.push(nodes[i]);
    //     }
    //   }
    //   if( targetNodes.length == 0 ){
    //     this.$message({message: '请选择在线人员发起呼叫', type: 'warning'});
    //   } else if (targetNodes.findIndex(item => item.id === xtxk.cache.get("USER").userId) != -1) {
    //     this.$message({message: '不能选择自己', type: 'warning'})
    //   } else{
    //     Fun.startCallRess(this, targetNodes, xtxk.cache.get("USER").userName)
    //   }
    // },
    // 
    // openDialog(dialogName) {
    //     this.$refs[dialogName].showDialog();
    // },
    // // 开启临时指挥
    // startTemproaryVideo(dialogName, mediaType) {
    //     let nodes = this.mergeResourceData();
    //     if (nodes.length == 0) {
    //       if(this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5){
    //         this.$message({message: '请至少选择一名参与用户', type: 'warning'})
    //         return
    //       }
    //     }
    //     let ind = nodes.findIndex(item => item.id === xtxk.cache.get("USER").userId);
    //     if (ind > -1) {
    //         nodes.splice(ind, 1);
    //         // this.$message({message: '不能选择自己', type: 'warning'})
    //         // return
    //     }
    //     this.$refs[dialogName].showDialog(nodes, 'temp', mediaType)
    // },
    // // 删除面板
    // deletePanel(name) {
    //   let index = this.editableTabs.findIndex(item => item.ref === name)
    //   if (index !== -1) {
    //     if(this.activetabName=='Monitor'){
    //       this.activeName='DeviceTree'
    //     }else{
    //       this.activeName = 'PersonTree'
    //     }
        
    //     this.editableTabs.splice(index, 1)
    //   }
    // },
    // // 添加面板
    // addPanel(data, panel) {
    //   let index = this.editableTabs.findIndex(item => item.ref === panel.name)
    //   if (index === -1 && data && data.res && data.res.operate == "init") {
    //     this.editableTabs.unshift({
    //         title: panel.title,
    //         name: panel.name,
    //         content: panel.name,
    //         ref: panel.name
    //     })
    //     this.activeName = panel.name
    //   }

    //   this.$nextTick(() => {
    //     this.$refs[panel.name][0] && this.$refs[panel.name][0].initData(data, index === -1)
    //   })
    // },

    // 查询协同列表
    // getCoordinateCommand(){
    //   this.$refs.VideoCommandPanel[0].$refs.CommandCoordinateDialog.getCoordinateCommandResources();
    // },
    // 查询协调列表
    // getConcert(){
    //   this.$refs.VideoCommandPanel[0].$refs.CommandConcertDialog.initTable();
    // },
    
    //wxx.11.17
    //设备资源筛选框
    // searchValuChangeFun(value){
    //   this.isTreeItemShow=true;
    //   this.searchV=value;
    //   this.TreeItem=value;
    // },
     //子选项checkbox change时
    // handleCheckedChange(list,index) {
    //     let checkedCount = this.checkedItems.length;
    //     list.checkAll = checkedCount === list.content.length;
    //     list.isIndeterminate = checkedCount > 0 && checkedCount < list.content.length;
    // },
    //全选checkbox change时
    // handleCheckAllChange(val,index){
    //   let arr=val.content.map(vl=>vl.id);
    //   this.checkedItems = val.checkAll ? arr : [];
    //   val.isIndeterminate = false;
    // },
    //弹出 视频巡查管理页面
    showStartege(){ 
      this.$refs.searchStratege[0].$refs.rightMenu.$refs.strategeInfoDialog.showDialog()
    },
    //切换标签 之前的钩子 若返回 false 或者返回 Promise 且被 reject，则阻止切换
     changeActiveName(activeName, oldActiveName){
       return true
      // let msg = ''
      // if(oldActiveName == 'SearchStratege'){
      //   msg = '切换界面会导致巡查停止，是否继续'
      // }else if(oldActiveName == 'EquipementRes'){
      //   msg = '切换界面会导致点播停止，是否继续'
      // }
      // return new Promise((resolve,reject) => {
      //   this.$confirm(msg, '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'info'
      //     }).then(() => {
      //       resolve();
      //       this.activeName = activeName;
      //       if(oldActiveName == 'SearchStratege'){
      //         this.$refs.searchStratege[0].stopAll()
      //       }else if(oldActiveName == 'EquipementRes'){
      //         this.$refs.equipementRes[0].$refs.deviceTree[0].stopAll();
      //       }
      //     }).catch(() => {      
      //       reject();  
      //     });
      // })
    },
  }

};
</script>
<style>
.tabMenu-popover{
  min-width: 90px !important;
  border: 1px solid #c2dff3;
}
</style>
<style scoped>
#divResourceArea {
  position: relative;
  float: left;
  padding: 0px;
  width: 412px;
  height: 100%;
  background-size: 100% 100%;
}
.title-bg{
  position: absolute;
  top:0px;
  left:0;
  width: 125px;
  height: 4px;
  z-index: 300;
  background: url(../../../static/main/screen/title_bg_4.png) no-repeat center;
  background-size: 125px 4px;
}
#divTimeBox {
  width: 100%;
  height: 40px;
  overflow: hidden;
  border-bottom: 1px solid #c2dff3;
  background-color: #dbf0fe;
  box-sizing: border-box;
}
#divTimeBox1 {
  width: 130px;
  padding: 0px 10px;
  float: left;
  border-right: 1px solid #c2dff3;
  text-align: center;

}
#divTimeBox2 {
  width: 129px;
  padding: 0 10px;
  float: left;
  text-align: center;
}

#divDeviceNav,
#divCommonNav,
#divRecordListNav,
#divFileListNav {
  float: left;
  padding: 0px;
  margin-left: 0px;
  border: 0px;
  width: 80px;
  height: 40px;
  color: #666;
  text-align: center;
  line-height: 40px;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: transparent;
  cursor: pointer;
}

.menubutn {
  position: absolute;
  right: 5px;
  top: 12px;
  padding: 0px;
  border: 0px;
  width: 16px;
  height: 16px;
  color: #666;
  text-align: center;
  background-image: url(../../../static/main/res/menu.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-color: transparent;
  cursor: pointer;
}
#divResourceOperate {
  width: 100%;
  height: 40px;
  padding: 0px;
  margin: 0px;
  background-color: #e9f3fa;
  border-bottom: 1px solid #c2dff3;
    box-sizing: border-box;
}
#divResourceOperate > input {
  cursor: pointer;
}
#btnRecord {
  float: left;
  width: 40px;
  margin-left: 5px;
  height: 40px;
  outline: none;
  border-width: 0px;
  background-image: url(../../../static/main/res/shipin-default.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-color: transparent;
}
#btnRecord:hover {
  float: left;
  width: 40px;
  margin-left: 5px;
  height: 40px;
  outline: none;
  border-width: 0px;
  background-image: url(../../../static/main/res/shipin-click.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-color: transparent;
}
#btnCall {
  float: left;
  background-image: url(../../../static/main/res/call-default.png);
  width: 40px;
  margin-left: 5px;
  height: 40px;
  outline: none;
  border-width: 0px;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: transparent;
}
#btnCall:hover {
  float: left;
  background-image: url(../../../static/main/res/call-click.png);
  width: 40px;
  margin-left: 5px;
  height: 40px;
  outline: none;
  border-width: 0px;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: transparent;
}
#btnPlayRecord {
  float: left;
  background-image: url(../../../static/main/res/video-default.png);
  width: 40px;
  margin-left: 5px;
  height: 40px;
  outline: none;
  border-width: 0px;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: transparent;
}
#btnPlayRecord:hover {
  float: left;
  background-image: url(../../../static/main/res/video-click.png);
  width: 40px;
  margin-left: 5px;
  height: 40px;
  outline: none;
  border-width: 0px;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: transparent;
}
.hidden {
  display: none;
}

.tabWrap{
    position: relative;
  height: calc(100% - 82px);
}
.el-tabs{
  /* margin-left: 10px; */
  width: 412px;
  float: left;
  height: 100%;
  border-top: 1px solid #5C6D86;
}
.video-voice,
.video-command,
.video-conferecing{
  float: left;
  width: 40px;
  margin-left: 5px;
  height: 40px;
  outline: none;
  border-width: 0px;
}
.video-voice {
  background: url(../../../static/main/res/voice.png) no-repeat;
}
.video-voice:hover {
  background: url(../../../static/main/res/voice_hover.png) no-repeat;
}
.video-conferecing{
  background: url(../../../static/main/res/meeting.png) no-repeat;
}
.video-conferecing:hover{
  background: url(../../../static/main/res/meeting_hover.png) no-repeat;
}
.video-command {
  background: url(../../../static/main/res/videoCommand.png) no-repeat;
}
.video-command:hover {
  background: url(../../../static/main/res/videoCommand_hover.png) no-repeat;
}
.command{
    margin: 0;
    padding: 0;
}
.command li{
    height: 30px;
    line-height: 30px;
    vertical-align: middle;
    white-space: nowrap;
    list-style: none;
    cursor: pointer;
    position: relative;
    padding-left: 22px;
}
.command li:hover{
    color: #69c3fc;
}
.command li .square{
    width: 8px;
    height: 8px;
    background-color: #69c3fc;
    display: inline-block;
    border-radius: 5px;
    margin-right: 5px;
    position: absolute;
    top: 11px;
    left: 6px;
}
.command li .square + span {
  color: #69c3fc;
}
/deep/ .el-tabs__header {
  padding:0 25px 0 20px;
  position: relative;
  margin: 0;
  background-color: #314D78;
  z-index: 300;
  /* border-bottom: 1px solid #c2dff3; */
}
/deep/ .el-dropdown-menu__item{
    white-space: nowrap;
}
/deep/ .el-tabs__content{
  height: calc(100% - 36px);
}
 /deep/  .tabWrap>.el-tabs.tabWrap_tabs>.el-tabs__content{
  overflow: visible;
}
/deep/ .el-tabs__nav-wrap::after {
    background-color: transparent;
}
/deep/ .el-tabs__item {
    padding: 0 12px;
}
/deep/ .el-tree {
    position: relative;
    cursor: default;
    background: transparent;
    color: #D3DCF0;
}
/deep/ .el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2),
/deep/ .el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
/deep/ .el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
/deep/ .el-tabs--top .el-tabs__item.is-top:nth-child(2){
  padding-left: 0;
 
}

/* ui tab样式11.14 */
/deep/ .tabWrap >.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item{
  padding:0;
  color:#B7C1D0;
  font-size:18px;
}
/deep/ .tabWrap >.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item::after{
  content:'/';
  margin:0 10px;
}
/deep/ .tabWrap >.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item:last-child:after{
  content:''
}
/deep/ .tabWrap >.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item.is-active{
  font-size: 18px;
  color:#fff;
  
}
/deep/ .tabWrap >.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__active-bar{
  height: 0;
  left:-12px;
}

/* .popperBox{
    color: #B7C1D0;
    width: 420px;
    min-height: 50px;
    background: url(/static/main/screen/resource_bg2.png) no-repeat top;
    background-size: 100% 400px;
    position: absolute;
    top: 79px;
    left: 50px;
    z-index: 100;
    padding: 10px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.25);
}
.popperBox /deep/ .el-checkbox__input .el-checkbox__inner{
  background-color:transparent;
}
.popperBox /deep/ .el-checkbox{
  color:#fff;
  margin-top:10px;
}
.popperBox /deep/  .el-checkbox__input.is-checked .el-checkbox__inner,.popperBox /deep/  .el-checkbox__input.is-indeterminate .el-checkbox__inner{
  background-color: #409EFF;
}
.popperBox /deep/  .el-checkbox__input.is-checked+.el-checkbox__label,
.popperBox /deep/  .el-button--text{
  color:#B7C1D0;
  text-align: left;
}

.icon-clear{
    display: inline-block;
    width:12px;
    height: 12px;
    vertical-align: middle;
    background: url(../../../static/common/reset.png) no-repeat center;
    background-size: 12px;
}

.poperBoxfoot{
  margin: 20px 0 10px 0;
  text-align: center;
}
.clearbtn{
  float:right;
  margin-right:10px;
} */
/* 视频巡查管理按钮 */
.btn-stratege{
  width: 24px;
  height: 24px;
  background: url(../../../static/stratege/icon-mainStratege.png) no-repeat center;
  position: absolute;
  right: 45px;
  top: 9px;
  cursor: pointer;
  z-index: 400;
}
.btn-stratege:hover{
  background: url(../../../static/stratege/icon-mainStratege-hover.png) no-repeat center;
}
.btn-stratege:active{
  background: url(../../../static/stratege/icon-mainStratege-act.png) no-repeat center;
}

</style>
