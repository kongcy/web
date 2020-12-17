<template>
    <div>
    <el-card id="treeRightMenu" class="treeRightMenu" :style="menuLoc" :class="{menuShow:isMenuShow}" :body-style="{padding:'0px'}">
        <!-- <div id="mItemStartPlayPerson" class="menuItemClass" v-if="isItemShow.startPlayP" v-on:click="startPlayPerson">视频点播</div> -->
        <div id="mItemStartPlayPerson" class="menuItemClass" v-if="isItemShow.startPlayP" v-on:click="startPlayPerson('unicast')">视频单播</div>  <!-- 1118 云调度 修改 -->
        <!-- <div id="mItemStartPlayPerson" class="menuItemClass" v-if="isItemShow.startPlayP" v-on:click="startPlayPerson('multicast')">视频组播</div> 1118 云调度 修改 -->
        <div id="mItemStopPlayPerson" class="menuItemClass" v-if="isItemShow.stopPlayP" v-on:click="stopPlayPerson">停止点播</div>
        <div id="mItemStartCallPerson" class="menuItemClass" v-if="isItemShow.startCall" v-on:click="startCallPerson(false)">视频呼叫</div>
        <div id="mItemStopCallPerson" class="menuItemClass" v-if="isItemShow.stopCall" v-on:click="stopCallPerson(false)">停止呼叫</div>
        <div id="mItemStartVCallPerson" class="menuItemClass" v-if="isItemShow.startVCall" v-on:click="startCallPerson(true)">音频呼叫</div>
        <div id="mItemStopVCallPerson" class="menuItemClass" v-if="isItemShow.stopVCall" v-on:click="stopCallPerson(true)">停止呼叫</div>
        <div id="mItemStartPlayDevice" class="menuItemClass" v-if="isItemShow.startPlayD" v-on:click="startPlayDevice('unicast')">视频单播</div><!-- 1118 云调度 修改 -->
        <!-- <div id="mItemStartPlayDevice" class="menuItemClass" v-if="isItemShow.startPlayD" v-on:click="startPlayDevice('multicast')">视频组播</div> 1118 云调度 修改 -->
        <div id="mItemStopPlayDevice" class="menuItemClass" v-if="isItemShow.stopPlayD" v-on:click="stopPlayDevice">停止点播</div>
        <div id="mItemStartSpeakDevice" class="menuItemClass" v-if="isItemShow.startSpeakD" v-on:click="startSpeakDevice">语音对讲</div>
        <div id="mItemStopSpeakDevice" class="menuItemClass" v-if="isItemShow.stopSpeakD" v-on:click="stopSpeakDevice">停止对讲</div>
        <div id="mItemCollectRes" class="menuItemClass" v-if="isItemShow.collect" v-on:click="publishResourceCollect">收藏资源</div>
        <div id="mItemCancelCollect" class="menuItemClass" v-if="isItemShow.cancelCollect" v-on:click="publishResourceCollect">取消收藏</div>
        <div id="mItemQueryRecord" class="menuItemClass" v-if="isItemShow.queryRecord" v-on:click="publishQueryRecord">检索录像</div>
        <div id="mItemQueryRecord" class="menuItemClass" v-if="isItemShow.startPlayRomm" v-on:click="openPlayFileDialog">开始播放</div>
        <div id="mItemSendRequest"  class="menuItemClass" v-if="isItemShow.sendRequest && this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6" v-on:click="clickSendRequest">发送消息</div>
        <div id="mItemDecoderPlay"  class="menuItemClass" v-if="isItemShow.decoderPlay" v-on:click="startMatrixPlay">解码器点播</div>
        <div id="mItemVideoTurn"  class="menuItemClass" v-if="isItemShow.startVideoSpecial && this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5" v-on:click="startVideoSpecial">开始专向</div>
        <div id="mItemVideoTurn"  class="menuItemClass" v-if="isItemShow.stopVideoSpecial && this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5" v-on:click="stopVideoSpecial">停止专向</div>
        <!-- 告警查询 dj-->
        <div id="mItemAlarmMessage"  class="menuItemClass" v-if="isItemShow.alarmMessage && this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6" v-on:click="showAlarmMessage">告警查询</div>
        <!-- 广播 0707 dj-->
        <div id="mItemStartBroadcas" class="menuItemClass" v-if="isItemShow.startBroadcas && apiSDK.config.version === apiSDK.enumSDKVersion.SDKVersion5" v-on:click="startBroadcasFn">开启广播</div>
        <div id="mItemStopBroadcas" class="menuItemClass" v-if="isItemShow.stopBroadcas" v-on:click="stopBroadcasFn">停止广播</div>
        <!-- 下载 -->
        <div class="menuItemClass" v-if="isItemShow.fileDownload" v-on:click="fileDownload">文件下载</div>

        <div id="strategeStart" class="menuItemClass" v-if="isItemShow.strategeStart" v-on:click="startStrategeLoop">开始</div>
        <div id="stopStrategeLoop" class="menuItemClass" v-if="isItemShow.strategeStop" v-on:click="stopStrategeLoop">停止</div>
        <div id="strategeEdit" class="menuItemClass" v-if="isItemShow.strategeEdit" v-on:click="showStrategeInfo">编辑</div>
        <div id="strategeDel" class="menuItemClass" v-if="isItemShow.strategeDel" v-on:click="delStratege">删除</div>
    </el-card>
    <!-- 选择放映文件 -->
    <el-dialog
        customClass="custom-dialog"
        title="选择放映文件"
        width="500px"
        :modal="false"
        :close-on-click-modal="false"
        :visible.sync="playFile.visible">
        <div class="play-file">
            <div class="item" v-for="(item, index) in playFile.data" :key="index" @click="playFile.resId = item.id" :class="playFile.resId === item.id ? 'active':''">
                <span class="icon" :class="item.resourceType === 2 ? 'filelist' : 'filevideo'"></span>
                <span>{{item.name}}</span>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" :disabled="playFile.data.length === 0">放映</el-button>
            <el-button @click="playFile.visible = false">取消</el-button>
        </div>
    </el-dialog>
      <send-request-dialog ref="SendRequestDialog"></send-request-dialog>
      <alarm-message-dialog ref="AlarmMessageDialog"/>
      <!-- <Im6-dialog ref="talkDialog" />  -->
      <stratege-info-dialog ref="strategeInfoDialog"></stratege-info-dialog>
    </div>
</template>

<script>
import Fun from '@/common/fun';
import Enum from '@/common/enum';
import SendRequestDialog from '@/components/home/SendMessageDialog.vue';
import Im6Dialog from '@/components/home/Im6Dialog.vue';
//告警记录
import AlarmMessageDialog from "@/components/map/AlarmMessageDialog";
//视频巡查 
import StrategeInfoDialog from "@/components/home/resource/StrategeInfoDialog.vue";
export default {
    name: 'treeRightMenu',
    components: {
      SendRequestDialog,
      AlarmMessageDialog,
      Im6Dialog,
      StrategeInfoDialog
    },
    data () {
        return {
          activetabName:'',
            currentUser: null,
            currentNode: null,
            menuLoc: '',
            isMenuShow: false,
            isItemShow: {startPlayP: false, stopPlayP: false, startCall: false, stopCall: false, startPlayD: false, stopPlayD: false, collect: false, cancelCollect: false, queryRecord: false,startVCall: false, stopVCall: false, startSpeakD: false, stopSpeakD: false, startPlayRomm: false, setCommon: false ,sendRequest: false, decoderPlay: false, startVideoSpecial:false,stopVideoSpecial:false,alarmMessage:false,startBroadcas:false,stopBroadcas:false,fileDownload:false,strategeStart:false,strategeStop:false,strategeEdit:false,strategeDel:false},
            playFile: {
                visible: false,
                data: [
                    { nodeId: 0, id: 0, name: '假数据0', resourceType: 2, resCh: 0 },
                    { nodeId: 1, id: 1, name: '假数据1', resourceType: 3, resCh: 0 },
                    { nodeId: 2, id: 2, name: '假数据2', resourceType: 2, resCh: 0 },
                ],
                resId: '',
            },
            strategyItem:''
        };
    },
    mounted(){
      this.currentUser = xtxk.cache.get('USER') || {};
      this.activetabName=xtxk.cache.get('activeName');
      //点击其他地方隐藏右键菜单
      document.addEventListener('click', e => {
        if(e.target.className != 'el-card__body'){
          this.isMenuShow = false;
          this.currentNode = null;
        }
      });
    },
    methods: {
      // 发送请求
      clickSendRequest() {
        let session = {
          sessionId: '',
          users: [{index: 0, userName: this.currentNode.name, userId: this.currentNode.id}],
          isReaded: true
        }
        if (this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5) {
          this.$refs.SendRequestDialog.showDialog(session);
        } else {
          // 此处代码待优化zt
          this.$parent.$parent.$parent.$parent.$parent.$refs.imageNav.$refs.im6Dialog.showDialog(this.currentNode);
          // this.$refs.talkDialog.showDialog(this.currentNode);
        }
          // this.$emit('sendRequestData');
      },
      // 打开放印厅弹框
      openPlayFileDialog() {
          this.playFile.visible = true;
      },
      //点播人员
      startPlayPerson(transportType){
        Fun.startPlayPerson(this, this.currentNode, null, transportType);
      },
      //停止人员
      stopPlayPerson(){
        Fun.stopPlayPerson(this.apiSDK, this.currentNode);
      },
      //呼叫人员/华为一体机
      startCallPerson(onlyVoice){
        if(this.currentNode.nodeStatus == 'hwMeeting_online'){
          Fun.startCallHW(this, this.currentNode, this.currentUser.userName, onlyVoice);
        }else{
          Fun.startCallPerson(this, this.currentNode, this.currentUser.userName, onlyVoice);
        }
      },
      //停止呼叫
      stopCallPerson(onlyVoice){
        Fun.stopCallPerson(this.apiSDK, this.currentNode, this.currentUser.userName, onlyVoice);
      },
      //点播设备
      startPlayDevice(transportType){
        Fun.startPlayDevice(this, this.currentNode, null, transportType);
      },
      //停止设备
      stopPlayDevice(){
        Fun.stopPlayDevice(this.apiSDK, this.currentNode);
        this.$listeners.StopAllHideHolder();
      },
      //对讲设备
      startSpeakDevice(){
        Fun.startSpeakDevice(this, this.currentNode);
      },
      //停止对讲
      stopSpeakDevice(){
        Fun.stopSpeakDevice(this.apiSDK, this.currentNode);
      },
      //收藏与取消收藏
      publishResourceCollect(){
        Fun.publishResourceCollect(this.apiSDK, this.currentNode, this.isItemShow.collect);
      },
      //录像检索
      publishQueryRecord(){
        var receiverID 			  = this.currentNode.id;
        var receiverCh 		    = this.currentNode.resCh ? this.currentNode.resCh : 0;
        var receiverType      = this.currentNode.resourceType;
        var receiverName 	    = this.currentNode.name;

        let params = {
          resourceId: receiverID,
          resourceCh: receiverCh,
          resourceType: receiverType,
          //07.31 默认最近7天 dj
          stratTime: new Date(new Date().getTime() - 3600 * 1000 * 24 * 7).formatDate("yyyy-MM-dd HH:mm:ss"),
          endTime: new Date().formatDate("yyyy-MM-dd") + ' 23:59:59',
          resourceName: receiverName
        }
        this.$parent.$parent.$parent.$parent.activeName  = 'VideoSearch'
        this.$parent.$parent.$parent.$parent.$refs.videoSearch[0].retrieveVideoRecording(params);
      },
      showRightMenu(event, data, soc){
        this.currentNode = data;
        //位置
        //const left_ = document.documentElement.scrollLeft + event.clientX + 20;
        //const top_ = document.documentElement.scrollTop + event.clientY;


        // const left_ = event.clientX + 20;
        // const top_ = event.clientY;
        // this.menuLoc = 'left: '+ left_ +'px; top: '+top_+'px';
         this.$nextTick(()=>{
            const left_ =380;
            const top_ = event.clientY-26;
            let clientHeight = document.body.clientHeight;
            var h=clientHeight-top_;
            var thisH=this.$children[0].$el.clientHeight;
            var topC_=clientHeight-thisH-20;
            console.log(top_)
            if(h>thisH){
              this.menuLoc = 'left: '+ left_ +'px; top: '+top_+'px';
            }else{
              this.menuLoc = 'left: '+ left_ +'px; top: '+topC_+'px';
            }
          })


        //菜单项
        this.showMenuItem(data, soc);
        this.isMenuShow = true;
      },
      closeRightMenu(){
        if(this.isMenuShow){
          this.isMenuShow = false;
          this.currentNode = null;
        }
      },
      // 解码器点播
      startMatrixPlay() {
        let decoderPos = this.$store.getters.getDecoderPos;
        let decoderMatrixId = this.$store.getters.getDecoderMatrixId;
        this.apiSDK.startMatrixPlay(decoderMatrixId, decoderPos, this.currentNode.id, this.currentNode.resCh, this.currentNode.resourceType, this.currentNode.name);
      },
      // 解码器点播按钮
      isDecoderMenu() {
        let decoderPos = this.$store.getters.getDecoderPos;
        let decoderMatrixId = this.$store.getters.getDecoderMatrixId;
        if (decoderPos !== '' && decoderMatrixId !== '' && decoderPos !== undefined && decoderMatrixId !== undefined) {
            this.isItemShow.decoderPlay = true;
        } else {
            this.isItemShow.decoderPlay = false;
        }
      },
      //视频转向
      startVideoSpecial(){
        Fun.startVideoSpecialPerson(this, this.currentNode);
      },

      //停止专向
      stopVideoSpecial(){
        Fun.stopVideoSpecialPerson(this, this.currentNode);
      },
      // 常用资源
      isCommonMenu(soc) {
        if(soc == "common"){
            this.isItemShow.collect = false;
            this.isItemShow.cancelCollect = true;
        }
      },
      // 文件下载
      fileDownload() {
        Fun.fileDownload(this, this.currentNode);
      },
      showMenuItem(data, soc){
        this.reset();
        let status = data.nodeStatus
        let deviceType = data.deviceType
        
        if(deviceType == 'OnvifEncoder' || deviceType == 'DeviceOnvifEncoder'){
          // this.isItemShow.alarmMessage = true;
        }
        if(status == "h323_online"){
            this.isItemShow.startPlayP  = true;
            this.isItemShow.startCall  = true;
            this.isItemShow.startVCall  = true;
        }
        if(status == "h323_playing"){
            this.isItemShow.stopPlayP  = true;
            this.isItemShow.startCall  = true;
            this.isItemShow.startVCall  = true;
        }
        if(status == "h323_calling"){
            this.isItemShow.stopCall  = true;
        }
        if(status == "h323_speaking"){
            this.isItemShow.stopVCall  = true;
        }
        if(status == "ip_online"){
            this.isItemShow.startCall  = true;
            this.isItemShow.startVCall  = true;
        }
        if(status == "ip_calling"){
            this.isItemShow.stopCall  = true;
        }
        if(status == "ip_speaking"){
            this.isItemShow.stopVCall  = true;
        }
        if(status == "pstn_online"){
            this.isItemShow.startVCall  = true;
        }
        if(status == "pstn_speaking"){
            this.isItemShow.stopVCall  = true;
        }
        if(status == "person_online"){
          this.isItemShow.startPlayP    = true;
          this.isItemShow.startCall     = true;
          this.isItemShow.startVCall    = true;
          this.isItemShow.sendRequest   = true;
          //不能对自己发起呼叫
          if(this.currentUser.userId == this.currentNode.id){
            this.isItemShow.startCall     = false;
            this.isItemShow.startVCall    = false;
            this.isItemShow.sendRequest   = false;
          }
          this.isItemShow.queryRecord   = true;
          //专向右键变化
          this.isItemShow.startVideoSpecial = true;
          this.isCommonMenu(soc);
          this.isDecoderMenu();
          //广播 0708 dj
          this.isItemShow.startBroadcas = true;
          return;
        }
        if(status == "person_fault"){
          this.isItemShow.queryRecord   = true;
          this.isCommonMenu(soc);
          return;
        }
        if(status == "person_playing"){
          this.isItemShow.stopPlayP     = true;
          this.isItemShow.startCall     = true;
          this.isItemShow.queryRecord   = true;
          this.isItemShow.startVCall    = true;
          this.isItemShow.sendRequest   = true;
          //专向右键变化
          this.isItemShow.startVideoSpecial = true;
          this.isCommonMenu(soc);
          this.isDecoderMenu();
           //不能对自己发起呼叫
          if(this.currentUser.userId == this.currentNode.id){
            this.isItemShow.startCall     = false;
            this.isItemShow.startVCall    = false;
          }
          //广播 0708 dj
          this.isItemShow.startBroadcas = true;
          return;
        }
        if(status == "person_playWaiting"){
          this.isItemShow.stopPlayP     = true;
          return;
        }
        if(status == "person_calling"){
          this.isItemShow.stopCall      = true;
          this.isItemShow.queryRecord   = true;
          this.isItemShow.sendRequest   = true;
          this.isCommonMenu(soc);
          this.isDecoderMenu();
          return;
        }
        if(status == "person_callWaiting"){
          this.isItemShow.stopCall      = true;
          return;
        }
        if(status == "person_specialtying"){
          this.isItemShow.stopVideoSpecial=true;
          this.isItemShow.queryRecord   = true;
          this.isItemShow.sendRequest   = true;
          this.isCommonMenu(soc);
          this.isDecoderMenu();
          return;
        }
        if(status == "person_specialtyWaiting"){
          this.isItemShow.stopVideoSpecial=true;
          return;
        }
        if(status == "person_speaking"){
          this.isItemShow.stopVCall      = true;
          this.isItemShow.queryRecord   = true;
          this.isItemShow.sendRequest   = true;
          this.isCommonMenu(soc);
          this.isDecoderMenu();
          return;
        }
        if(status == "person_offline"){
          this.isItemShow.queryRecord = true;
          this.isCommonMenu(soc);
          return;
        }
        if(status == "device_online"||status == "NVR_online"){
          this.isItemShow.startPlayD  = true;
          // this.isItemShow.queryRecord = true;
          // this.isItemShow.startSpeakD = true;
          // this.isCommonMenu(soc);
          this.isDecoderMenu();
          //广播
          this.isItemShow.startBroadcas = true;
          return;
        }
        if(status == "device_playing"||status == "NVR_playing"){
          this.isItemShow.stopPlayD   = true;
          // this.isItemShow.queryRecord = true;
          // this.isCommonMenu(soc);
          this.isDecoderMenu();
          //广播 0708 dj
          this.isItemShow.startBroadcas = true;
          return;
        }
        if(status == "device_playWaiting"||status == "NVR_playWaiting"){
          this.isItemShow.stopPlayD   = true;
          return;
        }
        if(status == "device_speaking"){
          // this.isItemShow.queryRecord = true;
          // this.isItemShow.stopSpeakD  = true;
          // this.isCommonMenu(soc);
          this.isDecoderMenu();
          return;
        }
        if(status == "device_speakWaiting"){
          // this.isItemShow.stopSpeakD  = true;
          return;
        }
        if(status == "device_offline"||status == "NVR_offline"){
          // this.isItemShow.queryRecord = true;
          // this.isCommonMenu(soc);
          return;
        }
        if(status == "filelist_offline"){
          this.isItemShow.collect = false;
          return;
        }
        if(status == "filelist_online"){
          this.isItemShow.startPlayD = true;
          this.isItemShow.collect = false;
          this.isItemShow.fileDownload = true;
          return;
        }
        if(status == "filelist_playing"){
          this.isItemShow.stopPlayD = true;
          this.isItemShow.collect = false;
          return;
        }
        if(status == "playroom_online"){
          this.isItemShow.startPlayRomm = true;
          this.isCommonMenu(soc);
          return;
        }
        if(status == "playroom_offline"){
          this.isCommonMenu(soc);
          return;
        }
        if(status == "virtual_online"){
          this.isItemShow.startPlayD  = true;
          this.isItemShow.queryRecord = true;
          this.isItemShow.startSpeakD = true;
          this.isCommonMenu(soc);
          //广播
          this.isItemShow.startBroadcas = true;
          return;
        }
        if(status == "virtual_offline"){
          this.isItemShow.queryRecord = true;
          this.isCommonMenu(soc);
          return;
        }
        if(status == "virtual_playing"){
          this.isItemShow.stopPlayD   = true;
          this.isItemShow.queryRecord = true;
          this.isCommonMenu(soc);
          //广播 0708 dj
          this.isItemShow.startBroadcas = true;
          return;
        }
        if(status == "virtual_speaking"){
          this.isItemShow.queryRecord = true;
          this.isItemShow.stopSpeakD  = true;
          this.isCommonMenu(soc);
          return;
        }
        //华为一体机
        if(status == "hwMeeting_online"){
          return;
        }
        if(status == "hwMeeting_playing"){
          return;
        }
        if(status == "hwMeeting_playWaiting"){
          return;
        }

        if(status == "person_broadcasting"){ //广播 中
            //广播 0708 dj
            this.isItemShow.stopBroadcas = true;
            this.isItemShow.queryRecord = true;
            this.isCommonMenu(soc);
            this.isDecoderMenu();
            return;
        }
        if(status == "person_broadcasting"){ //广播 等待中
            //广播 0708 dj
            this.isItemShow.stopBroadcas = true;
            return;
        }
        //
         if(status == "channel_online"){
          this.isItemShow.startPlayD  = true;
          this.isItemShow.collect = false;
          return;
        }
        if(status == "channel_playing" || status == "channel_playWaiting"){
          this.isItemShow.stopPlayD   = true;
          this.isItemShow.collect = false;
          return;
        }
        if(status == "channel_offline"){
          this.isItemShow.collect = false;
          return;
        }
        //视频巡查
        if(status == "strategeGroup"){
          if(this.strategyItem == data.id){
            this.isItemShow.strategeStop = true;
            this.isItemShow.strategeStart = false;
          }else{
            this.isItemShow.strategeStop = false;
            this.isItemShow.strategeStart = true;
          }
          this.isItemShow.strategeEdit = true;
          this.isItemShow.strategeDel = true;
        }
      },
      //重置
      reset(){
          this.isItemShow.startPlayP    = false;
          this.isItemShow.stopPlayP     = false;
          this.isItemShow.startCall     = false;
          this.isItemShow.stopCall      = false;
          this.isItemShow.startPlayD    = false;
          this.isItemShow.stopPlayD     = false;
          if(this.activetabName=="Monitor"){
            this.isItemShow.collect     = false;
          }else{
            this.isItemShow.collect     = true;
          }
          this.isItemShow.cancelCollect = false;
          this.isItemShow.queryRecord   = false;
          this.isItemShow.startVCall    = false;
          this.isItemShow.stopVCall     = false;
          this.isItemShow.startSpeakD   = false;
          this.isItemShow.stopSpeakD    = false;
          this.isItemShow.sendRequest   = false;
          this.isItemShow.startVideoSpecial = false;
          this.isItemShow.stopVideoSpecial = false;
          this.isItemShow.alarmMessage = false;
          this.isItemShow.startBroadcas = false;
          this.isItemShow.stopBroadcas = false;
          
          this.isItemShow.strategeStart = false;
          this.isItemShow.strategeEdit = false;
          this.isItemShow.strategeDel = false;
      },

      //告警查询
      showAlarmMessage(){
        this.$refs.AlarmMessageDialog.showDialog(this.currentNode)
      },
      //开启广播 dj 0707
      startBroadcasFn(){
        Fun.startBroadcasPerson(this, this.currentNode);
      },
      //关闭广播 dj 0708
      stopBroadcasFn(){
        Fun.stopBroadcasPerson(this, this.currentNode);
      },
      //开始循环
      startStrategeLoop(){
        this.$parent.$parent.$parent.$parent.$refs.searchStratege[0].hoverStartClick(this.currentNode)
        this.strategyItem = this.currentNode.id
      },
      //停止循环
      stopStrategeLoop(){
        this.$parent.$parent.$parent.$parent.$refs.searchStratege[0].stopAll()
        this.strategyItem = ''
      },
      //视频巡查
      showStrategeInfo(){
        this.$refs.strategeInfoDialog.showDialog(this.currentNode.id)
      },
      //删除视频巡查
      delStratege(){
          this.$parent.$parent.$parent.$parent.$refs.searchStratege[0].delGroup(this.currentNode)
      },
      //通知资源树刷新数据
      reloadStrategy(){
        this.$parent.$parent.$parent.$parent.$refs.searchStratege[0].getBusTableData();
      }
    },
}
</script>

<style scoped>
  .treeRightMenu {
    position: fixed;
    display: none;
    margin-left: -60px;
    margin-top: 10px;
    background: url(../../../../static/main/screen/resouce_rightPop_bg.png) center top;
    background-size: 100% 100%;
    border:none;
    color:#D3DCF0;
    border-radius: 0;
  }

  .menuShow {
    display: block;
  }

  .menuItemClass {
    font-size: 12px;
    padding: 10px 24px;
    cursor: pointer;
    min-width: 50px;
  }
  .menuItemClass:hover {
    background: #5C98FF;
    color:#fff;
  }
.play-file{
    max-height: 300px;
    margin: 0 10px;
    overflow: auto;
    border: solid 1px #c8cdd5;
}
.play-file .item{
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    cursor: pointer;
}
.play-file .item .icon{
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: -5px;
}
.play-file .item .icon.filelist{
    background: url(../../../../static/resource_tree/filelist_online.png) no-repeat center top;
}
.play-file .item .icon.filevideo{
    background: url(../../../../static/resource_tree/filevideo_online.png) no-repeat center top;
}
.play-file .item:hover{
    background-color: #e7f1f8;
}
.play-file .item.active{
    background-color: #b1e0ff;
}
</style>
