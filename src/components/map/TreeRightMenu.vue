<template>
  <div>
    <el-card id="treeRightMenu" class="treeRightMenu" :style="menuLoc" :class="{menuShow:isMenuShow}" :body-style="{padding:'0px'}">
      <ul class="right_menu">
        <li v-for="item in menus" :key="item.key" @click="item.handlerClick">{{item.label}}</li>
      </ul>
    </el-card>
  </div>
</template>

<script>
import Fun from '@/common/fun';
export default{
  name: "treeRightMenu",
  data () {
      return {
        currentUser: null,
        currentNode: null,
        menuLoc: '',
        isMenuShow: false,
        menus: []
      }
  },
  mounted(){
    this.currentUser = xtxk.cache.get('USER');

    //点击其他地方隐藏右键菜单
    document.addEventListener('click', e => {
      if(e.target.className != 'el-card__body'){
        this.isMenuShow = false;
        this.currentNode = null;
      }
    });
  },
  methods: {
    showRightMenu(event, data, soc){
      
      this.currentNode = data;
      //位置
      const left_ = event.clientX + 20;
      const top_ = event.clientY;
      this.menuLoc = 'left: '+ left_ +'px; top: '+top_+'px';
      //菜单项
      this.showMenus(data);
      this.isMenuShow = true;
    },
    closeRightMenu(){
      if(this.isMenuShow){
        this.isMenuShow = false;
        this.currentNode = null;
      }
    },
    showMenus(node) {
      let status = node.nodeStatus;
      this.menus = [];
      if (status === 'person_online') {
        this.menus = [
          {label: '视频点播', handlerClick: () => {this.openMediaDialog("play")} },
          {label: '视频呼叫', handlerClick: () => {this.openMediaDialog("call")} },
        ];
        return;
      }
      if(status == "person_playing") {
        this.menus = [
          {label: '停止点播', handlerClick: this.stopPlayPerson },
          //{label: '视频呼叫', handlerClick: this.openMediaDialog("call") },
        ];
        return;
      }
      if(status == "person_playWaiting"){
        this.menus = [
          {label: '停止点播', handlerClick: this.stopPlayPerson },
        ];
        return;
      }
      if(status == "person_calling" || status == 'person_callWaiting'){
        this.menus = [
          {label: '停止呼叫', handlerClick: this.stopCallPerson },
        ];
        return;
      }
      if (status === 'device_online') {
        this.menus = [
          {label: '视频点播', handlerClick: () => {this.openMediaDialog("play")} },
          {label: '告警查询', handlerClick: this.openAlarmMessageDialog },
        ];
        return;
      }
      if (status === 'device_offline') {
        this.menus = [
          {label: '告警查询', handlerClick: this.openAlarmMessageDialog },
        ];
        return;
      }
      if(status == "device_playing" || status == "device_playWaiting"){
        this.menus = [
          {label: '停止点播', handlerClick: this.stopPlayDevice},
          {label: '告警查询', handlerClick: this.openAlarmMessageDialog },
        ];
        return;
      }
      if (status === 'device_alarm') {   //0613 dj
        this.menus = [
          {label: '视频点播', handlerClick: () => {this.openMediaDialog("play")} },
          {label: '告警查询', handlerClick: this.openAlarmMessageDialog },
        ];
        return;
      }
    },
    openMediaDialog(operateType) {
      this.currentNode.operateType = operateType
      this.$emit('openMediaDialog', this.currentNode);
    },
    openAlarmMessageDialog() {
      this.$emit('openAlarmMessageDialog', this.currentNode);
    },
    //停止人员
    stopPlayPerson(){
      Fun.stopPlayPerson(this.apiSDK, this.currentNode);
    },
    //停止呼叫
    stopCallPerson(){
      Fun.stopCallPerson(this.apiSDK, this.currentNode, this.currentUser.userName, false);
    },
    //停止设备
    stopPlayDevice(){
      Fun.stopPlayDevice(this.apiSDK, this.currentNode);
    },
  }
}
</script>

<style scoped>
  .treeRightMenu {
    position: fixed;
    display: none;
  }
  .menuShow {
    display: block;
  }
  .right_menu{
    margin: 0;
    padding: 0;
  }
  .right_menu li{
    margin: 0;
    padding: 0;
    font-size: 12px;
    padding: 5px 15px;
    cursor: pointer;
    color:#333;
  }
  .right_menu li:hover{
    background-color: #e9f3fa; 
  }
</style>
