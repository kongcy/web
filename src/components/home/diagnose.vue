<template>
  <div id="divContainer_Monitor">
     
       
    <div id="divMain_Monitor" :style="mainStyle">
      <div id="divImageContent_Monitor" :style="imageContentStyle">
        <DiagnoseTable ref="DiagnoseTable" :nodeId="nodeId"></DiagnoseTable>
      </div>
      
      <div id="divResourceArea_Monitor" v-show="isShowResource" :style="resourceAreaStyle">
        <DiagnoseTableTree @saveNodeId="saveNodeId"></DiagnoseTableTree>
      </div>
     
    </div>
  </div>
</template>

<script>
import DiagnoseTable from "@/components/home/DiagnoseTable.vue";
import DiagnoseTableTree from "@/components/home/DiagnoseTree.vue";
// import Fun from "@/common/fun";
// import Enum from "@/common/enum";
export default {
  name: "HomeContainer",
  components: {
    // ResourceContainer4,
    DiagnoseTable,
    DiagnoseTableTree
  },
  data() {
    return {
      // headerStyle: "",
      // footerStyle: "",
      mainStyle: "",
      resourceAreaStyle: "",
      //图像底部区域
      // imageFooterStyle   : '',
      //图像区域
      imageContentStyle: "",
      //图像左侧区域
      // imageNavStyle: "",
      //图像操作区域
      // imageOperateStyle: "",
      //图像显示区域
      // imageShowStyle: "",
      // imageShowWidth: 0,
      // imageShowHeight: 0,
     //云台控制区域
      // holderControlStyle:'',
      // isShowHolder:true,
      // isShowHolderC:false,
      isShowResource: false,
      nodeId: ''
      
    }
  },
  mounted() {
    const self = this;
    //渲染页面
    this.initLayout();

    //在其它页面刷新后再进入本页面时执行，此时socket已连接
    // if (this.apiSDK.socketStatus != -1) {
    //   //媒体
    // //   self.$refs.imageShow.initMXTC(this.imageShowWidth, this.imageShowHeight,"MonitorContainer");
    //   //资源树
    //   // self.$refs.resourcecontainer.initTree();
    // }

    // 事件
    window.addEventListener("resize", this.resize);


   
  },
  methods: {
    //窗口大小变动
    resize() {
      let self = this;
      self.initLayout();
    },
    //初始化布局
    initLayout() {
     
      var screenWidth = document.body.clientWidth;
      // var screenWidth        = window.screen.width;
      var screenHeight = document.body.clientHeight;
      var headerWidth = screenWidth;
      var headerHeight = 72;
      var footerWidth = screenWidth;
      var footerHeight =0;
      var mainWidth = screenWidth;
      var mainHeight = screenHeight - headerHeight - footerHeight;

      //资源区域
      // var resourceAreaWidth = this.isShowResource?414+24:0;
      var resourceAreaWidth = 0
      var resourceAreaHeight = mainHeight;
      //云台控制区域 11.23
      var holderControlWidth=this.isShowHolderC?412+24:0;
      var holderControlHeight=mainHeight;

      var paddingW=40;
      var margigMiddle=this.isShowHolderC?40:20;
      //图像底部区域
      var imageFooterWidth   = mainWidth - resourceAreaWidth-holderControlWidth-paddingW;
      var imageFooterHeight  = 58;
      //图像区域
      var imageContentWidth = mainWidth - resourceAreaWidth-holderControlWidth;
      var imageContentHeight = mainHeight;
      //图像左侧区域
      // var imageNavWidth = 40;
      var imageNavWidth = 0;
      var imageNavHeight = imageContentHeight;
      //图像操作区域
      // var imageOperateWidth = 40;
       var imageOperateWidth = 0;
      var imageOperateHeight = imageContentHeight;
      //图像显示区域
      var imageShowWidth =imageContentWidth - imageNavWidth - imageOperateWidth-paddingW;
      var imageShowHeight = imageContentHeight-imageFooterHeight;
      //解码器控制区
      // var decoderHeight = 240;
      // // let $decoderControl = document.querySelector("#decoderControl");
      // let $decoderControl = document.querySelector("#decoderControl");
      // if ($decoderControl) {
      //   // $decoderControl.style = "width:" + imageShowWidth + "px";
      //    $decoderControl.style.width = "" + imageShowWidth + "px"
      //   imageShowHeight = imageShowHeight - decoderHeight;
      // }
  
      // this.headerStyle ="width:" + headerWidth + "px" + ";height:" + headerHeight + "px";
      // this.footerStyle ="width:" + footerWidth + "px" + ";height:" + footerHeight + "px";
      this.mainStyle ="width:" + mainWidth + "px" + ";height:" + mainHeight + "px";
      this.resourceAreaStyle ="width:" +resourceAreaWidth +"px" +";height:" +resourceAreaHeight +"px";
      // this.holderControlStyle="width:" +holderControlWidth +"px" +";height:" +holderControlHeight +"px";
      //图像底部区域
      // this.imageFooterStyle='width:' + imageFooterWidth  + 'px' + ';height:' + imageFooterHeight  + 'px';
      //图像区域
      this.imageContentStyle ="width:" +imageContentWidth +"px" +";height:" +imageContentHeight +"px";
      //图像左侧区域
      // this.imageNavStyle ="width:" + imageNavWidth + "px" + ";height:" + imageNavHeight + "px";
      //图像操作区域
      // this.imageOperateStyle ="width:" +imageOperateWidth +"px" +";height:" +imageOperateHeight +"px";
      // 如果是有插件版的
      // if (this.apiSDK.config.pluginVersion == 1) {
      //   // 根据浏览器的缩放比例 设置视频插件的宽高
      //   const getProportion = window.devicePixelRatio.toFixed(2);
      //   if (getProportion != 1) {
      //     imageShowWidth = imageShowWidth * getProportion;
      //     imageShowHeight = imageShowHeight * getProportion;
      //   }
      // }
      // //图像显示区域
      // this.imageShowStyle ="width:" + imageShowWidth + "px" + ";height:" + imageShowHeight + "px";
      // this.imageShowWidth = imageShowWidth-16;
      // this.imageShowHeight = imageShowHeight-8-20-24;
    },
  
    saveNodeId(val){
      this.nodeId = val
    }
  },
  destroyed: function() {
    //注销事件
    window.removeEventListener("resize", this.resize);
  },
  // beforeRouteLeave(to, from, next) {
  //   //取消订阅
  //   var subscribeType = Enum.enumSubscribeType.main;
  //   const subIDs = new Array(
  //     subscribeType.subscribeOrganizationUser,
  //     subscribeType.subscribeUsersStatus,
  //     subscribeType.subscribeUsersStatusByKey,
  //     subscribeType.subscribeUsersStatusByStatus,
  //     subscribeType.subscribeOrganizationDevice,
  //     subscribeType.subscribeDevicesStatus,
  //     subscribeType.subscribeDevicesStatusByKey,
  //     subscribeType.subscribeDevicesStatusByStatus,
  //     subscribeType.subscribeCommonResources,
  //     subscribeType.subscribeCommonResourcesByKey,
  //     subscribeType.subscribeCommonResourcesByStatus
  //   );
  //   this.apiSDK.cancelSubscribeResourceStatus(subIDs.join(","), "all");
  //   //停止所有业务
  //   this.apiSDK.stopAll();


  //   //注销插件
  //   //this.apiSDK.unInitMXTC();
  //   next();
  // }
};
</script>
<style>
.el-tree-node__content{
  padding:5px 0;
}

.el-tree-node.is-current.is-focusable > .el-tree-node__content {
  /* background: #5c98ff; */
  background: #416da8;
  color: #fff;
}
.el-tree-node__content:hover {
  background-color: #2f4977;
}
.el-tree-node:focus > .el-tree-node__content {
  background: transparent;
  color: #b7c1d0;
}
.el-tree-node.is-current.is-focusable > .el-tree-node__children {
  background: transparent;
  color: #b7c1d0;
}

/* tree折叠展开图标 */
.el-tree-node__expand-icon.el-icon-caret-right:before {
  content: "";
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url("../../../static/resource_tree/icon-close.png");
}
/* tree折叠展开图标 无子集 */
.el-tree-node__expand-icon.is-leaf:before {
  content: "";
  display: inline-block;
  width: 16px;
  height: 16px;
  background: transparent;
}

/* tree input框样式 */
.el-tree-node__content .el-checkbox__inner {
  background: transparent;
}

.el-tree-node.is-current.is-focusable > .el-tree-node__children .edit_icon,
.el-tree-node.is-current.is-focusable > .el-tree-node__children .curr_icon,
.el-tree-node.is-current.is-focusable
  > .el-tree-node__children
  .setDefault_icon,
.el-tree-node.is-current.is-focusable > .el-tree-node__children .del_icon {
  visibility: hidden;
}
</style>
<style scoped>
#divContainer_Monitor {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  margin: 0px auto;
  /* padding: 20px 24px; */
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
}
#divHeader {
  padding: 0px;
  margin: 0px;
}
#divFooter {
  padding: 0px;
  margin: 0px;
  color: #ffffff;
  background: #0f5794;
  /* height: 5px !important; */
  /* position: absolute; */
  /* bottom: 0; */
}
#divMain_Monitor {
  padding: 0px;
  margin: 0px;
  /* position: absolute; */
  /* height: calc(100% - 65px) !important; */
  /* overflow: hidden; */
}
#divImageContent_Monitor {
  float: right;
  padding: 10px 0 0 0;
  box-sizing: border-box;
  margin:0px;
  height: 100%;
  width: calc(100% - 302px);
}
#divImageContent_Monitor,
#divImageContent_Monitor > div {
  /*height: 100% !important;*/
  /* background-color: #dbf0fe; */
}
#divImageOperate_Monitor,
#divImageNav_Monitor {
  width: 40px !important;
}
#divImageNav_Monitor {
  float: left;
  padding: 0px;
  margin: 0px;
}
div > div#divImageContent_Monitor > div#divImageShow_Monitor {
  float: left;
 padding: 0px;
  margin: 0px;
  /* zld 调整插件自适应所改 */
  height: 100% !important;
  position: relative;
  /* width: calc(100% - 84px) !important; */
  /* border: 1px solid #358bd5; */
  /* border-top: none; */
  /* border-bottom: none; */
}
#divImageFooter {
  padding: 0px;
  margin: 0px;
  color: #fff;
}
#divImageOperate_Monitor {
  float: right;
  padding: 0px;
  margin: 0px;
}
#divResourceArea_Monitor {
  float: left;
  
  padding: 20px 0 24px 24px;
  box-sizing: border-box;
  margin: 0px;
  height: 100% !important;
}
#divImageBottomNav_Monitor{
  position: absolute;
  bottom:24px;
  padding: 0px;
  margin: 0px;
}
.toLeft,.toRight{
  position:absolute;
  top: calc(50% - 20px);
  width:20px;
  height: 40px;
  cursor: pointer;
}
.toLeft{
  left:-20px;
  background: url(../../../static/common/toLeft.png) no-repeat center;
}
.toLeft:hover{
  left:-20px;
  background: url(../../../static/common/toLeft_active.png) no-repeat center;
}
.toRight{
  right:-20px;
  background: url(../../../static/common/toRight.png) no-repeat center;
}
.toRight:hover{
   right:-20px;
  background: url(../../../static/common/toRight_active.png) no-repeat center;
}
.divHolderControl{
  float:right;
  padding:20px 24px 24px 0;
  box-sizing: border-box;
}


.toLeft.toLeft_R{
  right:-20px;
  background: url(../../../static/common/toRight.png) no-repeat center;
}
.toLeft.toLeft_R:hover{
  right:-20px;
  background: url(../../../static/common/toRight_active.png) no-repeat center;
}

.toRight.toRight_L{
  right:-20px;
  background: url(../../../static/common/toLeft.png) no-repeat center;
}
.toRight.toRight_L:hover{
  right:-20px;
  background: url(../../../static/common/toLeft_active.png) no-repeat center;
}
</style>