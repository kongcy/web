<template>
  <div id="divResourceArea" width="300px">
    <div id="divTimeBox">
      <div id="divTimeBox1">{{dataTime}}</div>
      <div id="divTimeBox2">{{dataTime}}</div>
    </div>

    <!-- 资源操作区域 -->
    <div id="divResourceOperate">
      <input type="button" id="btnRecord" title="批量点播" @click="startPlays">
      <input type="button" id="btnCall" title="批量呼叫" @click="startCalls">
      <!-- <input type="button" id="btnPlayRecord" title="录像回放"  @click="videoConferecing"> -->
      <!-- <input type="button" class="video-conferecing" title="视频会议"  @click="startTemproaryVideo('temproaryConference', 'AV')"> -->
      <input type="button" class="video-conferecing" title="视频会议"  @click="openDialog('conferenceScene')">
      <input type="button" class="video-voice" title="语音会议"  @click="startTemproaryVideo('temproaryConference', 'Audio')">
      <input type="button" class="video-command" title="视频指挥"  @click="startTemproaryVideo('temproaryCommand')">
    </div>

    <!-- 资源显示区域 -->
    <div class="tabWrap">
        <el-tabs v-model="activeName" @tab-click="tabClickHandler">
            <el-tab-pane v-for="(item) in editableTabs" :label="item.title" :name="item.name" :key="item.name" style="height:100%">
                <component :is="item.content" :ref="item.ref" :treeId="item.treeId"></component>
                <!-- <person-tree ref="personTree" :treeId="item.treeId"></person-tree> -->
            </el-tab-pane>
        </el-tabs>

        <el-button type="text" v-popover:popover class="menubutn"></el-button>
        <el-popover ref="popover" placement="bottom" trigger="hover" popper-class="tabMenu-popover">
            <ul class="command">
                <li v-for="(item, index) in editableTabs" :key="index" @click="activeName = item.name">
                  <span :class="activeName === item.name ? 'square': ''"></span>
                  <span>{{item.title}}</span>
                </li>
            </ul>
        </el-popover>
    </div>
    <temproary-conference-dialog ref="temproaryConference" />
    <conference-scene-dialog ref="conferenceScene"></conference-scene-dialog>
    <!-- 五阶段会议修改 -->
    <temproary-command-dialog ref="temproaryCommand" />

    </div>
</template>

<script>
import PersonTree from "@/components/home/resource/PersonTree.vue";
import DeviceTree from "@/components/home/resource/DeviceTree.vue";
import CommonRes from "@/components/home/resource/CommonRes.vue";
import FileList from "@/components/home/resource/FileListPanel.vue";
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
    PersonTree,
    DeviceTree,
    CommonRes,
    FileList,
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
      dataTime:new Date().formatDate('yyyy-MM-dd HH:mm:ss'),
      activeName: "PersonTree",
      editableTabs: [
        {
          title: '组织结构',
          name: 'PersonTree',
          content: 'PersonTree',
          ref: 'personTree',
          treeId: 'MainUsersStatus'
        },
        {
          title: '设备资源',
          name: 'DeviceTree',
          content: 'DeviceTree',
          ref: 'deviceTree',
          treeId: 'MainDevicesStatus'
        },
        {
          title: '常用资源',
          name: 'CommonRes',
          content: 'CommonRes',
          ref: 'commonRes',
          treeId: 'MainCommonResources'
        },
        {
          title: '文件频道',
          name: 'FileList',
          content: 'FileList',
          ref: 'fileList',
          treeId: 'FileList'
        },
        {
          title: '录像检索',
          name: 'VideoSearch',
          content: 'VideoSearch',
          ref: 'videoSearch',
          treeId: 'VideoSearch'
        }
      ]
    };
  },

  beforeDestroy(){
    if(this.timer){
      clearInterval(this.timer); // 在vue 实例销毁前，清楚我们的定时器
    }
  },
  mounted() {
    // 时间动态加载
    var _this = this;
    _this.timer = setInterval(function () {
        _this.dataTime = new Date().formatDate('yyyy-MM-dd HH:mm:ss'); // 修改date 数据
    },1000);

    // 视频会议状态推送回调
    this.apiSDK.setInformRefreshMeetingStatusCallback((res) => {
      if (res && res.operate === 'stop') {
        this.deletePanel('VideoPanel');
      } else {
        if (res.sceneType == 0 || res.sceneType == 2) {
          this.addPanel({res: res}, {title: '视频会议', name: 'VideoPanel'});
        } else {
          this.addPanel({res: res}, {title: '视频会议', name: 'ConferenceDiscuss'});
        }
      }
    });
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
    // 视频指挥
    this.apiSDK.startTemporaryCommandCallback(res => {
      //console.log('===================' + res);
      if (res && res.operate === 'stop') {
        this.deletePanel('VideoCommandPanel')
      } else if (res && res.operate === 'cooperate' && res.cooperate.isOnline == "offline") {
        this.getCoordinateCommand();
      } else if (res && res.operate === 'cooperate' && res.cooperate.isOnline == "online") {
        this.getCoordinateCommand();
      } else if (res && res.operate === 'coordinate' && res.coordinate.isOnline == "offline") {
         this.getConcert();
      } else if (res && res.operate === 'coordinate' && res.coordinate.isOnline == "online") {
        this.getConcert();
      }{
        this.addPanel({res: res}, {title: '视频指挥', name: 'VideoCommandPanel'});
      }
    });

    //告警时的事件处理
    this.$root.$on('alarmEvent', (data) => {
      //console.log('on------------------', data)
      //1、树节点标红
      this.$refs.deviceTree[0] && this.$refs.deviceTree[0].setDeviceAlarmStatusByTip(data.locationId, data.deviceId);
    })
  },
  methods: {
    initTree: function() {
      this.$nextTick(() => {
        const self = this;
        const organId = "";
        let subjectId = 0;
        //订阅用户组织结构
        this.apiSDK.getOrganizationUser(organId, Enum.enumSubscribeType.main.subscribeOrganizationUser, subjectId, function(obj) {
          //console.log(obj);
          self.$refs.personTree[0] && self.$refs.personTree[0].setReceiveInformAddDepartmentCallback(obj);
        });

        //获取设备组织结构
        this.apiSDK.getOrganizationDevice(organId, Enum.enumSubscribeType.main.subscribeOrganizationDevice, subjectId, function(obj){
          //console.log(obj);
          self.$refs.deviceTree[0] && self.$refs.deviceTree[0].setReceiveInformAddDepartmentCallback(obj);
        });
        
        //常用资源树
        this.apiSDK.subscribeCommonRes("","",false,Enum.enumSubscribeType.main.subscribeCommonResources);

        //订阅文件频道
        this.apiSDK.subscribeFileStatus(0,"",false,"main-filelist");

        // 资源状态回调
        this.apiSDK.setReceiveResourceStatusQueryCallback("main", function(obj) {
          // console.log('获取资源：'+ JSON.stringify(obj));
          self.$refs.personTree[0] && self.$refs.personTree[0].setReceiveInformResourceStatusCallback(obj);
          self.$refs.deviceTree[0] && self.$refs.deviceTree[0].setReceiveInformResourceStatusCallback(obj);
          self.$refs.commonRes[0] && self.$refs.commonRes[0].setReceiveInformResourceStatusCallback(obj);
        });

        // 文件频道回调
        this.apiSDK.setInformFileStatusCallback((obj) => {
          self.$refs.fileList[0] && self.$refs.fileList[0].setReceiveInformResourceStatusCallback(obj);
        });
      })
    },
    //全部离线
    offline(){
      Fun.transformTreeToArray(this.$refs.personTree[0].treeData).forEach(item => {
          if(item.resourceType==0){
              item.nodeStatus="person_offline"
          }
      });
      Fun.transformTreeToArray(this.$refs.deviceTree[0].treeData).forEach(item => {
          if(item.resourceType==1){
              item.nodeStatus="device_offline"
          }
      });
      this.$refs.commonRes[0].treeData.forEach(item => {
          if(item.resourceType==0){
              item.nodeStatus="person_offline"
          }else if(item.resourceType==1){
              item.nodeStatus="device_offline"
          }
      });
      this.$refs.fileList[0].treeData.forEach(item => {
          item.nodeStatus="filelist_offline"
      });
    },
    //菜单单击
    tabClickHandler(tab){
      //console.log(tab)
    },
    // 去重
    reduce(array) {
        let object = {}
        return array.reduce((total, item) => {
            object[item.nodeId] ? '' : object[item.nodeId] = true && total.push(item)
            return total
        }, [])
    },
    /**
     * @param  {String} resType [需返回的数据，默认为所有]
     * @return {Array}          [description]
     */
    mergeResourceData() {
      let nodes = [];
      if(this.activeName == "PersonTree"){
        nodes = this.$refs.personTree[0].$refs.main_user_tree.getCheckedNodes();
      }else if(this.activeName == "DeviceTree"){
        nodes = this.$refs.deviceTree[0].$refs.main_device_tree.getCheckedNodes();
      } else if(this.activeName == "CommonRes"){
        nodes = this.$refs.commonRes[0].$refs.main_common_tree.getCheckedNodes();
      }
      return this.reduce(nodes);
    },
    //批量点播
    startPlays(){
      var targetNodesP = [];
      var targetNodesD = [];

      var nodes = this.mergeResourceData();
			for( var i=0;i<nodes.length;i++ ){
				if( nodes[i].nodeStatus == "person_online" ){
					targetNodesP.push(nodes[i]);
        }
        if( nodes[i].nodeStatus == "device_online"){
					targetNodesD.push(nodes[i]);
				}
      }
			if( targetNodesP.length + targetNodesD.length == 0 ){
				var content = '请选择在线空闲的资源发起点播';
        this.$message({message: content, type: 'warning'})
				return;
			}
      Fun.startPlayRess(this, targetNodesP.concat(targetNodesD));
    },
    //批量呼叫
    startCalls(){
      var targetNodes = [];

      var nodes = this.mergeResourceData();
			for( var i=0; i<nodes.length; i++ ){
				if( nodes[i].nodeStatus == "person_online"  || nodes[i].nodeStatus == "person_playing" ){
					targetNodes.push(nodes[i]);
				}
			}
			if( targetNodes.length == 0 ){
				this.$message({message: '请选择在线人员发起呼叫', type: 'warning'});
      } else if (targetNodes.findIndex(item => item.id === xtxk.cache.get("USER").userId) != -1) {
        this.$message({message: '不能选择自己', type: 'warning'})
      } else{
        Fun.startCallRess(this, targetNodes, xtxk.cache.get("USER").userName)
      }
    },
    // 
    openDialog(dialogName) {
        this.$refs[dialogName].showDialog();
    },
    // 开启临时指挥
    startTemproaryVideo(dialogName, mediaType) {
        let nodes = this.mergeResourceData();
        if (nodes.length == 0) {
          if(this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5){
            this.$message({message: '请至少选择一名参与用户', type: 'warning'})
            return
          }
        }
        if (nodes.findIndex(item => item.id === xtxk.cache.get("USER").userId) != -1) {
            this.$message({message: '不能选择自己', type: 'warning'})
            return
        }
        this.$refs[dialogName].showDialog(nodes, 'temp', mediaType)
    },
    // 删除面板
    deletePanel(name) {
      let index = this.editableTabs.findIndex(item => item.ref === name)
      if (index !== -1) {
        this.activeName = 'PersonTree'
        this.editableTabs.splice(index, 1)
      }
    },
    // 添加面板
    addPanel(data, panel) {
      let index = this.editableTabs.findIndex(item => item.ref === panel.name)
      if (index === -1 && data && data.res && data.res.operate == "init") {
        this.editableTabs.unshift({
            title: panel.title,
            name: panel.name,
            content: panel.name,
            ref: panel.name
        })
        this.activeName = panel.name
      }

      this.$nextTick(() => {
        this.$refs[panel.name][0] && this.$refs[panel.name][0].initData(data, index === -1)
      })
    },

    // 查询协同列表
    getCoordinateCommand(){
      this.$refs.VideoCommandPanel[0].$refs.CommandCoordinateDialog.getCoordinateCommandResources();
    },
    // 查询协调列表
    getConcert(){
      this.$refs.VideoCommandPanel[0].$refs.CommandConcertDialog.initTable();
    }
  },
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
  /* margin-left: 8px;
    margin-top: 8px;
    margin-right: 8px; */
  padding: 0px;
  width: 300px;
  height: 100%;
  /* display: inline-block; */
  background-size: 100% 100%;
  /* background-color: #dbf0fe; */
  border-left: 1px solid #c2dff3;
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
.el-tabs {
	/* margin-left: 10px; */
  width: 300px;
	float: left;
  height: 100%;
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

/deep/ .el-dropdown-menu__item{
    white-space: nowrap;
}
/deep/ .el-tabs__content{
  height: calc(100% - 39px);
}
/deep/ .el-tabs__header {
  padding: 0 25px 0 0;
  position: relative;
  margin: 0;
  background-color: #dbf0fe;
}
/deep/ .el-tabs__item {
    padding: 0 12px;
}
/deep/ .el-tree {
    position: relative;
    cursor: default;
    background: #FFF;
    color: #606266;
}
/deep/ .el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2),
/deep/ .el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
/deep/ .el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
/deep/ .el-tabs--top .el-tabs__item.is-top:nth-child(2){
  padding-left: 0;
}

</style>
