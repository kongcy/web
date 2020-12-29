<template>
  <div class="holder">
    <el-dialog ref="holderDialog"  :visible.sync="isVisible" width="400px" v-dialogDrag 
      class="custom-dialog" :class="isNVRChannel?'dialogNVR':''" @closed="closedDialog"
      :close-on-click-modal="false" :modal="false">
      <span slot="title" :title="ytTitle" class="el-dialog__title">{{ytTitle}}</span>
        <!-- 左侧 -->
        <div class="left">
             <div class="direction">
               <!-- 方向盘图 -->
               <div class="steeringWheel">
                 <span></span>
                 <div v-for="(item,index) in directionBut" :key="index" :class="item.class" @mousedown="clickDirection(item)" @mouseup="stopDirectionCtl(item)">
                    <span></span>
                 </div>
                </div>
                <div class="holdControlBox unbindLock">
                    <div v-if="!display.unbindLock && this.apiSDK.config.platformVersion == 0 && !isNVRChannel"  @click="publishTakeoverYT">
                        <i class="holdControlbtn icon-unbingLock-start" title="开始接管"></i>
                         <!-- <img src="../../../static/holderControl/unbindLock.png"  title="开始接管" > -->
                         <div >接管</div>
                    </div>
                    <div v-if="display.unbindLock && this.apiSDK.config.platformVersion == 0 && !isNVRChannel"  @click="publishTakeoverStopYT">
                         <i class="holdControlbtn icon-unbingLock-close" title="关闭接管"></i>
                        <!-- <img src="../../../static/holderControl/unbindLock2.png"  title="关闭接管"> -->
                        <div>关闭</div>
                    </div>
                </div>
                <div class="holdControlBox windshieldWiper">
                    <div v-if="!display.windshieldWiper && this.apiSDK.config.platformVersion == 0 && !isNVRChannel"  @click="windshieldWiper">
                         <i class="holdControlbtn icon-windshieldWiper-start" title="打开雨刷"></i>
                        <div >雨刷</div>
                    </div>
                    <div v-if="display.windshieldWiper && this.apiSDK.config.platformVersion == 0 && !isNVRChannel"   @click="windshieldWiperStop">
                        <i class="holdControlbtn icon-windshieldWiper-close" title="关闭雨刮"></i>
                        <div>雨刷</div>
                    </div>
                </div>
                <div class="holdControlBox heat">
                    <div v-if="!display.heatControl && this.apiSDK.config.platformVersion == 0 && !isNVRChannel" @click="heatControl">
                       <i class="holdControlbtn icon-heat-start" title="打开加热"></i>
                        <div >加热</div>
                    </div>
                    <div v-if="display.heatControl && this.apiSDK.config.platformVersion == 0 && !isNVRChannel"  @click="heatControlStop">
                       <i class="holdControlbtn icon-heat-close" title="关闭加热"></i>
                       <div>加热</div>
                    </div>
                </div>
                <div class="holdControlBox _3d">
                    <div  v-if="!display._3d && this.apiSDK.config.platformVersion == 0 && !isNVRChannel" @click="_3dControl">
                       <i class="holdControlbtn icon-3d-start" title="打开3d"></i>
                      <div>3D</div>
                    </div>
                    <div v-if="display._3d && this.apiSDK.config.platformVersion == 0 && !isNVRChannel"  @click="_3dControlStop">
                         <i class="holdControlbtn icon-3d-close" title="关闭3d"></i>
                      <div>3D</div>
                    </div>
                </div>
                <!-- <img v-if="!display.unbindLock && this.apiSDK.config.platformVersion == 0" class="unbindLock"  src="../../../static/holderControl/unbindLock.png"  title="开始接管"  @click="publishTakeoverYT">
               <img  v-if="display.unbindLock && this.apiSDK.config.platformVersion == 0"  class="unbindLock" src="../../../static/holderControl/unbindLock2.png"  title="取消接管" @click="publishTakeoverStopYT">
                <img v-if="!display.windshieldWiper && this.apiSDK.config.platformVersion == 0" class="windshieldWiper" src="../../../static/holderControl/windshieldWiper.png"  title="打开雨刷" @click="windshieldWiper">
                <img v-if="display.windshieldWiper && this.apiSDK.config.platformVersion == 0" class="windshieldWiper" src="../../../static/holderControl/windshieldWiper2.png"  title="关闭雨刮" @click="windshieldWiperStop"> 
                <img v-if="!display.heatControl && this.apiSDK.config.platformVersion == 0" class="heat" src="../../../static/holderControl/heat.png" title="打开加热" @click="heatControl">
                <img v-if="display.heatControl && this.apiSDK.config.platformVersion == 0" class="heat" src="../../../static/holderControl/heat2.png" title="关闭加热" @click="heatControlStop">
                <img v-if="!display._3d && this.apiSDK.config.platformVersion == 0" class="_3d" src="../../../static/holderControl/_3d.png" title="打开3d" @click="_3dControl">
                <img v-if="display._3d && this.apiSDK.config.platformVersion == 0" class="_3d" src="../../../static/holderControl/_3d2.png" title="关闭3d" @click="_3dControlStop">-->

                
                <el-button v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 && this.apiSDK.config.platformVersion == 1 && !isNVRChannel" class="unbindLock lock01" disabled title="接管"></el-button>
                <el-button v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 && this.apiSDK.config.platformVersion == 1 && !isNVRChannel" class="windshieldWiper wiper01" disabled title="雨刷"></el-button>
                <el-button v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 && this.apiSDK.config.platformVersion == 1 && !isNVRChannel" class="heat heat01" disabled title="加热"></el-button>
                <el-button v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 && this.apiSDK.config.platformVersion == 1 && !isNVRChannel" class="_3d _3d01" disabled title="3d"></el-button>
             </div>
             <div class="adjust" v-if="!isNVRChannel">
                <p v-for="(item,index) in adjustData" :key="index" >
                  <span class="adjustAdd" @mousedown="addReduce(item, true, 'mousedown')"
                   @mouseup="addReduce(item, true, 'mouseup')"></span>
                  <span>{{ item }}</span>
                  <span class="adjustReduce" @mousedown="addReduce(item, false, 'mousedown')"
                  @mouseup="addReduce(item, false, 'mouseup')" ></span>
                </p>
             </div> 
            <div class="slider">
              <span>速度</span>
              <div class="sliderbox">
                <el-slider v-model="sliderValue" :min="0" :max="255" :step="5"></el-slider>
                <span class="sliderVal">{{sliderValue}}</span>
              </div>
            </div>
        </div>
        
        <!-- 右侧 -->
        <!-- <div class="right holderControl">
            <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" :render-content="renderContent"
              default-expand-all  :expand-on-click-node="false"></el-tree>
        </div>
        <div class="rightBottom"  v-if="!isNVRChannel">
           <div v-for="(item,index) in bottomData" :key="index" :class="item.class" :title="item.title" @click="clickBottom(item)"></div>
        </div> -->
      </el-dialog>
      <!-- <prepoints-manage-dialog ref="prepointsManageDialog" @close="getPrepareData()"/>
      <cruse-manage-dialog ref="cruseManageDialog"/> -->
  </div>
</template>

<script>
import PrepointsManageDialog from "@/components/ytcontrol/PrepointManageDialog.vue";
import CruseManageDialog from "@/components/ytcontrol/CruseManageDialog.vue";

export default {
    name: 'HolderControl',
    components: {
      PrepointsManageDialog,
      CruseManageDialog,
    },
    data() {
      return {
        ytTitle:'云台控制',
        controlResourceName:'',
        resourceId: '',
        resourceCh: 0,
        channelEncoderSIPID: '',
        channel: '',
        sliderValue: 50,
        isVisible: false,
        display: {
          unbindLock: false,
          disabled:true,
          windshieldWiper: false,
          heatControl: false,
          _3d:false
        },
        directionBut: [
          { class: 'up-left' , direction: '4', direction2:'nw' },
          { class: 'up-centre' , direction: '1', direction2:'n' },
          { class: 'up-right' , direction: '6', direction2:'ne' },
          { class: 'centre-left' , direction: '0', direction2:'w' },
          { class: 'centre-centre' , direction: '', direction2:'' },
          { class: 'centre-right' , direction: '2', direction2:'e' },
          { class: 'below-left' , direction: '5', direction2:'sw' },
          { class: 'below-centre' , direction: '3', direction2:'s' },
          { class: 'below-right' , direction: '7', direction2:'se'},
        ],
        adjustData: [ '聚焦', '光圈', '变焦' ],
        bottomData: [
          // { title: '保存'  , class: 'save' },
          { title: '新增预置点', class: 'prepareAdd' },
          { title: '预置点管理' , class: 'prepare' },
          { title: '巡航配置' , class: 'cruise' },
        ],
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'leaf'
        },
        encoderSIPID: '',
        isNVRChannel: false,

        leftTop:false,
      }
    },
    mounted(){
      //云台状态反馈
      this.apiSDK.setInformYTStatusCallback(res => {
          if( !res.isAllow ){
              // this.ytTitle = '云台控制';
              this.display.unbindLock = true;
              this.display.disabled = false;
          }else{
              // if( res.message ){
              //   this.ytTitle = '云台控制-' + res.message;
              // }else{
              //     this.ytTitle = '云台控制';
              // }
              if( res.takeoverUserID ){
                this.display.unbindLock = false;
                this.display.disabled = true;
              }else{
                  this.display.unbindLock = false;
                  this.display.disabled = false;
              }
          }
      });
    },
    methods: {
      showDialog(resourceId, resourceCh, encoderSIPID, channel) {
        this.resourceId = resourceId;
        this.resourceCh = resourceCh;
        this.channelEncoderSIPID = encoderSIPID;
        this.channel = channel;
        this.isNVRChannel = this.resourceId.length > 20 ? false : true;
        this.isVisible = true;
        // this.$nextTick(()=>{
        //       const {width,height}  =document.fullscreenElement.getBoundingClientRect();
        //       const holderEl = this.$refs.holderDialog.$el.firstChild; 
        //       const ch =holderEl.getBoundingClientRect(); 
        // }) 
         //通过id获取树名
        let EquipementTab=this.$parent.$parent.$refs.resourcecontainer.$refs.equipementRes[0].activeName;
        
        let deviceTree='';
        let d='',c='';
        let resourceChV= this.resourceCh==-1?0:this.resourceCh
        if(EquipementTab=='CommonUse'){
          deviceTree = this.$parent.$parent.$refs.resourcecontainer.$refs.equipementRes[0].$refs.commonUse[0]
          d=deviceTree.$refs.recently_tree.getNode(this.resourceId);
        c=deviceTree.$refs.recently_tree.getNode(this.resourceId+'_'+resourceChV);
        }else{
          deviceTree = this.$parent.$parent.$refs.resourcecontainer.$refs.equipementRes[0].$refs.deviceTree[0];
          d=deviceTree.$refs.main_device_tree.getNode(this.resourceId);
          c=deviceTree.$refs.main_device_tree.getNode(this.resourceId+'_'+resourceChV);
        }
        if(d){
          this.ytTitle='云台控制('+d.data.name+')';
        }else if(c){
          this.ytTitle='云台控制('+c.data.name+')';
        }

        // this.$nextTick(() => {
        //   xtxk.media.setDialogTop("云台控制");
        // });
        //获取预置点
        this.getPrepareData();
        //订阅云台状态
        !this.isNVRChannel && this.apiSDK.subscribeYTStatus(resourceId, resourceCh)

        if (this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5) {
            if( this.apiSDK.config.platformVersion == 0 ){
                this.bottomData =  [
                    // { title: '保存'  , class: 'save' },
                    { title: '新增预置点', class: 'prepareAdd' },
                    { title: '预置点管理' , class: 'prepare' },
                    { title: '巡航配置' , class: 'cruise' },
                ];
            }else if( this.apiSDK.config.platformVersion == 1 ){
                this.bottomData =  [
                    // { title: '保存'  , class: 'save' },
                    { title: '新增预置点', class: 'prepareAdd' },
                    // { title: '预置点管理' , class: 'prepare' },
                    // { title: '巡航配置' , class: 'cruise' },
                ];
            }
        }

        // 收到预置点/预置点分组静态数据修改推送消息
        this.apiSDK.setInformPTZStatusCallback(obj=>{
            console.log(obj);
            if( obj.type == 0 || obj.type == 1 ){
                //获取预置点
                this.getPrepareData();
            }
        })
      },
      closedDialog(){
        //取消订阅
        !this.isNVRChannel && this.apiSDK.cancelSubscribeYTStatus(this.resourceId, this.resourceCh)
       // this.$children[0].$refs.dialog.style.left = '0px'
       // this.$children[0].$refs.dialog.style.top = '0px'
      },
      //停止
      stopDirectionCtl(event){
        if (!this.isNVRChannel) {
          this.apiSDK.publishStopYTDirectionCtl(this.resourceId, this.resourceCh, event.direction, event.direction2);
        } else {
          this.apiSDK.publishStopYTNVRDirectionCtl(this.resourceId, this.channelEncoderSIPID, this.channel);
        }
      },
      // 点击方向盘
      clickDirection( event ) {
          if (this.isNVRChannel) {
            this.apiSDK.publishStartYTNVRDirectionCtl(this.resourceId, event.direction, this.sliderValue, this.channel, this.channelEncoderSIPID);
            return;
          }
          if( this.display.disabled === true ){
              return;
          }
        if( event.direction == '' ) {
          this.apiSDK.publishResetPoint(this.resourceId, this.resourceCh);
        } else {
            if (!this.isNVRChannel) {
               this.apiSDK.publishStartYTDirectionCtl(this.resourceId, this.resourceCh, event.direction,event.direction2, this.sliderValue, function (obj) {});
          } else {
               this.apiSDK.publishStartYTNVRDirectionCtl(this.resourceId, event.direction, this.sliderValue, this.channel, this.channelEncoderSIPID,function (obj) {});
          }
        }
      },
      // 雨刷控制 开
      windshieldWiper() {
          if( this.display.disabled === true ){
              return;
          }
        this.apiSDK.publishStartYTWiperCtl( this.resourceId, this.resourceCh, function (obj) {});
      },
      // 雨刷控制 关
      windshieldWiperStop() {
          if( this.display.disabled === true ){
              return;
          }
        this.apiSDK.publishStopYTWiperCtl( this.resourceId, this.resourceCh, function (obj) {});
      },
      // 加热控制 开
      heatControl() {
          if( this.display.disabled === true ){
              return;
          }
        this.apiSDK.publishStartYTHeatCtl(this.resourceId, this.resourceCh, function (obj) {});
      },
      // 加热控制 关
      heatControlStop() {
          if( this.display.disabled === true ){
              return;
          }
        this.apiSDK.publishStopYTHeatCtl(this.resourceId, this.resourceCh, function (obj) {});
      },
      // 3d 开
      _3dControl() {
        //alert("打开3d控制")
        if( this.display.disabled === true ){
              return;
          }
        this.apiSDK.startPtz3D();
      },
      // 3d 关
      _3dControlStop() {
        //alert("关闭3d控制")
          if( this.display.disabled === true ){
              return;
          }
        this.apiSDK.stopPtz3D();
      },
      // 云台接管 开
      publishTakeoverYT() {
          if( this.display.disabled === true ){
              return;
          }
        this.apiSDK.publishStartYTTakeOverCtl(this.resourceId, this.resourceCh, function (obj) {});
      },
      // 云台接管 关
      publishTakeoverStopYT() {
          if( this.display.disabled === true ){
              return;
          }
        this.apiSDK.publishStopYTTakeOverCtl(this.resourceId, this.resourceCh, function (obj) {});
      },
      /***
       * 加减 触发函数
       * event 为点击的当前对象 如: 聚焦
       * zoom true 为加 false 为减
       * type 有 'mousedown'  'mouseup'
       *  */
      addReduce( event , zoom, type ) {
          switch (event) {
            case '聚焦':
              if( type === 'mousedown' ) {
                this.focusMousedown(zoom);
              } else if( type === 'mouseup' ) {
                this.focusMouseup(zoom);
              }
              break;
            case '光圈':
              if( type === 'mousedown' ) {
                this.apertureMousedown(zoom);
              } else if( type === 'mouseup' ) {
                this.apertureMouseup(zoom);
              }
              break;
            case '变焦':
              if( type === 'mousedown' ) {
                this.changeBurntMousedown(zoom);
              } else if( type === 'mouseup' ) {
                this.changeBurntMouseup(zoom);
              }
              break;
          }
      },
      // 聚焦控制 鼠标按下
      focusMousedown(zoom) {
          if( this.display.disabled === true ){
              return;
          }
        this.apiSDK.publishStartYTFocusCtl(this.resourceId, this.resourceCh, zoom, this.sliderValue, function (obj) {})
      },
      // 聚焦控制 鼠标松开
      focusMouseup(zoom) {
          if( this.display.disabled === true ){
              return;
          }
        this.apiSDK.publishStopYTFocusCtl(this.resourceId, this.resourceCh, zoom, function (obj) {})
      },
      // 光圈控制 鼠标按下
      apertureMousedown(zoom) {
          if( this.display.disabled === true ){
              return;
          }
        this.apiSDK.publishStartYTApertureCtl(this.resourceId, this.resourceCh, zoom, this.sliderValue, function (obj) {})
      },
      // 光圈控制 鼠标松开
      apertureMouseup(zoom) {
          if( this.display.disabled === true ){
              return;
          }
        this.apiSDK.publishStopYIApertureCtrl(this.resourceId, this.resourceCh, zoom, this.sliderValue, function (obj) {})
      },
      // 变焦 鼠标按下
      changeBurntMousedown(zoom) {
          if( this.display.disabled === true ){
              return;
          }
        this.apiSDK.publishStartYTZoomCtl(this.resourceId, this.resourceCh, zoom, this.sliderValue, function (obj) {})
      },
      // 变焦 鼠标松开
      changeBurntMouseup(zoom) {
          if( this.display.disabled === true ){
              return;
          }
        this.apiSDK.publishStopYTZoomCtl(this.resourceId, this.resourceCh, zoom, this.sliderValue);
      },
      // 获取 预置点数据 右侧tree
      getPrepareData() {
        const that = this;
        this.treeData = [];
        var tempPointGroupsArr = [];
        var tempPointsArr = [];
        // 获取分组（带组内预置点）
        this.apiSDK.getYTPointGroupWithPoints(this.resourceId, this.resourceCh, 1, 1024, obj=>{
            // console.log(obj);
            if( obj ){
                obj.rows && obj.rows.forEach((item,index)=>{
                  //组
                  let curObj = {
                      id          : item.groupId,
                      name        : item.groupName,
                      order       : item.order,
                      nodeStatus  : 'prepareGroup',
                      children    : [],
                  }
                  //组内
                  item.points && item.points.forEach(item2 => {
                    curObj.children.push({
                      id          : item2.pointId,
                      name        : item2.pointName,
                      order       : item2.order,
                      nodeStatus  : 'operate',
                      isDefault   : item2.isDefault
                    })
                  });
                  tempPointGroupsArr.push(curObj)
                });
            }
            this.treeData = tempPointGroupsArr.concat(tempPointsArr);
        });
        // 获取组外所有预置点
        this.apiSDK.getYTPointOffGroupBylimit(this.resourceId, this.resourceCh, 1, 1024, obj=>{
            // console.log(obj);
            if( obj && obj.rows){
                this.encoderSIPID = obj.encoderSIPID;
                //组
                let curObj = {
                    id          : "noGroup",
                    name        : "默认分组",
                    order       : 0,
                    nodeStatus  : 'prepareGroup',
                    children    : [],
                }
                obj.rows.forEach((item,index)=>{
                    curObj.children.push({
                      id          : item.pointId,
                      name        : item.pointName,
                      order       : item.order,
                      encoderSIPID: item.encoderSIPID,
                      nodeStatus  : 'operate',
                      isDefault   : item.isDefault,
                      value       : item.value
                    })
                })
                tempPointsArr.push(curObj)
            }
            this.treeData = tempPointGroupsArr.concat(tempPointsArr);
        })
      },
      //树行样式
      renderContent(h, { node, data, store }) {
        if (this.isNVRChannel) {
          return (<span class={"prepare-tree-node " + data.nodeStatus} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                </span>)
        } else if ( data.nodeStatus === 'prepareGroup' ) {
            return (<span class={"prepare-tree-node " + data.nodeStatus} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                    <span class="operateDot">
                       <span class="edit_icon" on-click={ () => this.updateGroup(data) }></span>
                       <span class="del_icon" on-click={ () => this.deleteGroup(data) }></span>
                    </span>
                </span>);
        } else {
            return (<span class={"prepare-tree-node " + data.nodeStatus} >
                    <span class="node-icon"></span>
                    <span>{node.label}</span>
                    <span class="operateGroup">
                       <span class='curr_icon' title="跳转到当前预置点"  on-click={ () => this.skipOperate(data) }></span>
                       <span class="setDefault_icon" title="设置默认预置点" on-click={ () => this.setOperate(data) }></span>
                       <span class="edit_icon" title="编辑预置点" on-click={ () => this.updateOperate(data) }></span>
                       <span class="del_icon" title="删除预置点" on-click={ () => this.delectOperate( data ) }></span>
                    </span>
                </span>);
        }
      },
      handleNodeClick(data) {
        // console.log(JSON.stringify(data));
      },
        //  编辑分组
      updateGroup(data){
          let that = this;
          let groupId = data.id;
          this.$prompt('请输入预置点组名称', '编辑预置点组', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          model: false,
          inputPattern: /^[\u4e00-\u9fa5A-Za-z0-9._-]{1,20}$/,
          inputErrorMessage: '编辑预置点组名称不合法',
          inputValue: data.value,
          closeOnClickModal: false,
          appendToBody: true,
        }).then(({ value }) => {
          let groupName = value;
          that.apiSDK.updateYTGroup(that.resourceId, that.resourceCh, groupId, groupName, function(obj){
                // console.log(obj);
                if( obj && obj.Ret == 0 ){
                    that.getPrepareData();
                    that.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                }else{
                    that.$message({
                        message: '修改失败',
                        type: 'warning'
                    });
                }
            });
        }).catch((value) => {

        });
      },
    //   删除分组
      deleteGroup(data){
          let that = this;
          let groupId = data.id;
            this.apiSDK.removeGroup(this.resourceId, this.resourceCh, groupId, function(obj){
            // console.log(obj);
            if( obj && obj.Ret === 0 ){
                that.getPrepareData();
                that.$message({
                    message: '删除成功',
                    type: 'success'
                });
            }else{
                that.$message({
                    message: '删除失败',
                    type: 'warning'
                });
            }
        });
      },
      // 编辑预置点
      updateOperate(data) {
        if (!this.encoderSIPID) {
            this.$message({
                message: '未绑定SIPID',
                type: 'warning'
            });
            return;
        }
          let that = this;
          // debugger
        this.$prompt('请输入预置点名称', '编辑预置点', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          inputPattern: /^[\u4e00-\u9fa5A-Za-z0-9._-]{1,20}$/,
          inputErrorMessage: '编辑预置点名称不合法',
          inputValue: data.value,
          closeOnClickModal: false
        }).then(({ value }) => {
            // const ytPoints = data;
            // ytPoints.pointName = value;
            // ytPoints =[{pointId:'',pointName:'',isDefault:true/false,order:0}...]
            let ytPoints = [];
            ytPoints.push({
                pointId:data.id,
                pointName:value,
                isDefault:data.isDefault,
                order:data.order,
            });
          that.apiSDK.updateYTPoints(that.resourceId, that.resourceCh, ytPoints, this.encoderSIPID, function (obj) {
            if( obj && obj.Ret === 0 ) {
               that.getPrepareData();
               that.$message({
                    message: '编辑成功',
                    type: 'success'
                });
            } else {
               that.$message({
                    message: '编辑失败',
                    type: 'warning'
                });
            }
          });
        }).catch((value) => {

        });
      },
      // 删除预置点
      delectOperate(data) {
        if (!this.encoderSIPID) {
            this.$message({
                message: '未绑定SIPID',
                type: 'warning'
            });
            return;
        }
          let that = this;
          this.apiSDK.removeYTPoint(this.resourceId, this.resourceCh, data.id, this.encoderSIPID,function (obj) {
            if( obj && obj.Ret == 0 ) {
               that.getPrepareData();
               that.$message({
                    message: '删除成功',
                    type: 'success'
                });
            } else {
            //    that.$message.error('删除失败！');
               that.$message({
                    message: '删除失败',
                    type: 'warning'
                });
            }
          })
      },
      // 设置预置点
      setOperate(data) {
        if (!this.encoderSIPID) {
            this.$message({
                message: '未绑定SIPID',
                type: 'warning'
            });
            return;
        }
          let that = this;
        //   console.log('data.isDefault='+data.isDefault);  // 0/1  根据1.2版本 1表示默认, 0表示非默认
          let isDefault;
          if( data.isDefault === 1 ){
              isDefault = false;
          }else if( data.isDefault === 0 ){
              isDefault = true;
          }
          this.apiSDK.setDefaultUserYTPoint(this.resourceId, this.resourceCh, data.id, isDefault, this.encoderSIPID, function (obj) {
            if( obj && obj.Ret == 0 ) {
               that.getPrepareData();
               that.$message({
                    message: '设置成功',
                    type: 'success'
                });
            } else {
            //    that.$message.error('设置失败！');
               that.$message({
                    message: '设置失败',
                    type: 'warning'
                });
            }
          })
      },
      // 跳转到当前预置点
      skipOperate(data) {
         this.apiSDK.publishUpResPoint( this.resourceId, this.resourceCh, data.id, data.value )
      },
      // 点击节点 隐藏其他节点
      treeShowOperate () {
        const that = this;
        setTimeout(() => {
          const treeNode = document.querySelectorAll('.holderControl .el-tree-node__content');
          for(let i = 0; i < treeNode.length; i++) {
            // 点击tree节点
            treeNode[i].addEventListener('click', function (event) {
                that.removeAllClass();
                event.target.childNodes[3].childNodes[2].classList.remove('hide');
                const spanDel =  document.createElement('span');
                if ( event.target.childNodes[0].classList[0] === 'is-leaf' ) {
                  spanDel.classList.add('operateGroup');
                  spanDel.innerHTML = '<span></span><span></span><span></span><span></span>';
                  // spanDel.childNodes[0].click(function (node) {})
                } else {
                  spanDel.classList.add('operateDot');
                  spanDel.innerHTML = '<span></span><span></span>';
                }
                treeNode[i].appendChild(spanDel);
            });
          };
        }, 10);
      },
      // 移除所有的带 operate 的样式
      removeAllClass() {
        console.log('---------------------removeAllClass-----------------');
        // const selectNodeGroup = document.querySelector('.holderControl .el-tree-node__content span.operateGroup');
        // selectNodeGroup && selectNodeGroup.classList.add('hide');
        // selectNodeGroup && selectNodeGroup.parentNode.removeChild(selectNodeGroup);
        const selectNodeDot = document.querySelectorAll('.holderControl .el-tree-node__content span.operateGroup');
        console.log(JSON.stringify(selectNodeDot));
        for( var i = 0 ; i < selectNodeDot.length; i++ ) {
            selectNodeDot[i] && selectNodeDot[i].classList.add('hide');
        }
        // selectNodeDot && selectNodeDot.parentNode.removeChild(selectNodeDot);
      },
      // 点击右下角 的4个按钮
      clickBottom( data ) {
         switch (data.class) {
            case 'prepare':
             this.$refs.prepointsManageDialog.showDialog(this.resourceId, this.resourceCh);
             break;
            case 'save':

             break;
            case 'prepareAdd':
              this.addYTPoint();
              break;
            case 'cruise':
              this.$refs.cruseManageDialog.showDialog(this.resourceId, this.resourceCh);
              break;
         }
      },
      // 点击 新增预置点
      addYTPoint() {
        let that = this;
        if (!this.encoderSIPID) {
            this.$message({
                message: '未绑定SIPID',
                type: 'warning'
            });
            return;
        }
        this.$prompt('请输入预置点名称', '新增预置点', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          inputPattern: /^[\u4e00-\u9fa5A-Za-z0-9._-]{1,20}$/,
          inputErrorMessage: '新增预置点名称不合法',
          model: false,
        }).then(({ value }) => {
            let pointName = value;
            let goupId = null;
            that.apiSDK.addYTPoint(pointName, this.resourceId, goupId, this.resourceCh, this.encoderSIPID, function(obj){
                if( obj && obj.Ret == 0 ) {
                    that.$message({
                        message: '新增成功',
                        type: 'success'
                    });
                    that.getPrepareData();
                }else{
                    that.$message({
                        message: '新增失败',
                        type: 'warning'
                    });
                }
            })
        });
      }
    }
}
</script>

<style>
/* tree的样式 */
.holderControl span.el-tree-node__label {
  color: #0f5794;
}
.holderControl .el-tree-node__expand-icon {
  color: #128bf1;
}
.holderControl .el-tree-node__expand-icon.is-leaf {
  color: #ffffff;
}

.holderControl .el-tree-node .operateGroup {
  width: 120px;
}
.holderControl .el-tree-node .operateDot {
  width: 55px;
}
.holderControl .el-tree-node .operateGroup,
.holderControl .el-tree-node .operateDot {
  height: 20px;
  position: absolute;
  right: 17px;
  display: flex;
  justify-content: space-between;
  /* padding-top: 7px; */
  /* margin-top: -10px; */
}
.holderControl .is-current {
   background: transparent;
   color: #fff;
}
.holderControl .is-current .is-leaf {
  color: #b1e0ff;
}
.holderControl .el-tree-node .operateDot > span,
.holderControl .el-tree-node .operateGroup > span {
  width: 22px;
  height: 20px;
}
.holderControl .prepare-tree-node > span.hide {
  display: none;
}

/* 预置点图标 */
.prepare-tree-node.operate .node-icon {
  background: url("../../../static/holderControl/prepareIcon.png");
}
/* 预置组图标 */
.prepare-tree-node.prepareGroup .node-icon {
  background: url("../../../static/holderControl/prepareGroupIcon.png");
}
.prepare-tree-node .node-icon {
  margin-right: 5px;
  vertical-align: middle;
  background-repeat: no-repeat;
  background-size: cover;
  width: 20px;
  height: 20px;
  display: inline-flex;
}
.prepare-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

/* 预置组 */
/* .holderControl .el-tree-node  .operateGroup > span:nth-child(1) {
  background: url("../../../static/holderControl/node-update.png");
}
.holderControl .el-tree-node  .operateGroup > span:nth-child(1):hover {
  background: url("../../../static/holderControl/node-update_active.png");
} */
/* .holderControl .el-tree-node  .operateGroup > span:nth-child(2) {
  background: url("../../../static/holderControl/skipPrepare.png");
}
.holderControl .el-tree-node  .operateGroup > span:nth-child(2):hover {
  background: url("../../../static/holderControl/skipPrepare_active.png");
} */
/* .holderControl .el-tree-node  .operateGroup > span:nth-child(3) {
  background: url("../../../static/holderControl/acquiesceIn.png");
}
.holderControl .el-tree-node  .operateGroup > span:nth-child(3):hover {
  background: url("../../../static/holderControl/acquiesceIn_active.png");
}  */
/* .holderControl .el-tree-node  .operateGroup > span:nth-child(4) {
  background: url("../../../static/holderControl/delPrepare.png");
}
.holderControl .el-tree-node  .operateGroup > span:nth-child(4):hover {
  background: url("../../../static/holderControl/delPrepare_active.png");
}  */
/* 预置点 */
/* .holderControl .el-tree-node  .operateDot > span:nth-child(1) {
  background: url("../../../static/holderControl/node-update.png");
}
.holderControl .el-tree-node  .operateDot > span:nth-child(1):hover {
  background: url("../../../static/holderControl/node-update_active.png");
}
.holderControl .el-tree-node  .operateDot > span:nth-child(2) {
  background: url("../../../static/holderControl/delPrepare.png");
}
.holderControl .el-tree-node  .operateDot > span:nth-child(2):hover {
  background: url("../../../static/holderControl/delPrepare_active.png");
} */

.holderControl .el-tree-node__content:hover {
  /* background-color: #b1e0ff; */
  background-color: #2f4977;
}
.holderControl .el-tree-node__content:hover .el-tree-node__expand-icon.is-leaf {
  color: #b1e0ff;
}
.holder .el-dialog__wrapper {
  z-index: 3000;
}

.el-tree-node.is-current.is-focusable > .el-tree-node__content {
  background: #5c98ff;
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
.operateDot .edit_icon,
.operateGroup .edit_icon {
  visibility: hidden;
  background: url("../../../static/holderControl/node-update.png");
}
.el-tree-node__content:hover .operateDot .edit_icon,
.el-tree-node__content:hover .operateGroup .edit_icon {
  visibility: visible;
  background: url("../../../static/holderControl/node-update.png");
}
.is-current .el-tree-node__content:hover .operateGroup .edit_icon {
  visibility: visible;
  background: url("../../../static/holderControl/node-update.png");
}
.is-current .operateDot .edit_icon,
.is-current .operateGroup .edit_icon {
  visibility: visible;
  background: url("../../../static/holderControl/node-update.png");
}

.operateGroup .curr_icon {
  visibility: hidden;
  background: url("../../../static/holderControl/skipPrepare.png");
}
.el-tree-node__content:hover .operateGroup .curr_icon {
  visibility: visible;
  background: url("../../../static/holderControl/skipPrepare.png");
}
.is-current .el-tree-node__content:hover .operateGroup .curr_icon {
  visibility: visible;
  background: url("../../../static/holderControl/skipPrepare.png");
}
.is-current .operateGroup .curr_icon {
  visibility: visible;
  background: url("../../../static/holderControl/skipPrepare.png");
}
.operateGroup .setDefault_icon {
  visibility: hidden;
  background: url("../../../static/holderControl/acquiesceIn.png");
}
.el-tree-node__content:hover .operateGroup .setDefault_icon {
  visibility: visible;
  background: url("../../../static/holderControl/acquiesceIn.png");
}
.is-current .el-tree-node__content:hover .operateGroup .setDefault_icon {
  visibility: visible;
  background: url("../../../static/holderControl/acquiesceIn.png");
}
.is-current .operateGroup .setDefault_icon {
  visibility: visible;
  background: url("../../../static/holderControl/acquiesceIn.png");
}
.operateDot .del_icon,
.operateGroup .del_icon {
  visibility: hidden;
  background: url("../../../static/holderControl/delPrepare.png");
}
.el-tree-node__content:hover .operateDot .del_icon,
.el-tree-node__content:hover .operateGroup .del_icon {
  visibility: visible;
  background: url("../../../static/holderControl/delPrepare.png");
}
.is-current .el-tree-node__content:hover .operateGroup .del_icon {
  visibility: visible;
  background: url("../../../static/holderControl/delPrepare.png");
}
.is-current .operateDot .del_icon,
.is-current .operateGroup .del_icon {
  visibility: visible;
  background: url("../../../static/holderControl/delPrepare.png");
}
</style>

<style scoped>
.custom-dialog /deep/ .el-dialog {
  background:none;
  background-color: rgba(50,77,119,0.4);
} 
.custom-dialog /deep/ .el-dialog__body {
  padding: 10px 20px;
  height: 500px;
}
.custom-dialog /deep/ .el-dialog__title{
  display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: calc(100% - 55px);
}
.custom-dialog.dialogNVR /deep/ .el-dialog__body{
  height: 335px;
}
.custom-dialog.dialogNVR  .left{
  height: 335px;
}
.custom-dialog  .left {
  width: 360px;
  height: 490px;
  /* background: url(../../../static/holderControl/bg.png);
  background-size: 100% 100%; */
	/* background-color: #f2f6f9; */
	/* border: solid 1px rgba(154, 191, 231, 0.6); */
  float: left;
  display: flex;
  justify-content: center;
  position: relative;
}
.custom-dialog  .left .direction {
  width: 315px;
	height: 230px;
  margin-top: 29px;
  display: flex;
  justify-content: center;
  position: relative;
}

.custom-dialog  .left .direction > img,
.custom-dialog  .left .direction > .holdControlBox  {
  cursor: pointer;
  position: absolute;
  text-align: center;
  color:#D3DCF0;
}
.custom-dialog  .left .direction > img.unbindLock,
.custom-dialog  .left .direction > .unbindLock {
  left: 0;
}
.custom-dialog  .left .direction > img.windshieldWiper,
.custom-dialog  .left .direction > .windshieldWiper {
  left: 0;
  bottom: 0;
}
.custom-dialog  .left .direction > img.heat,
.custom-dialog  .left .direction > .heat {
  right: 0;
  bottom: 0;
}
.custom-dialog  .left .direction > img._3d,
.custom-dialog  .left .direction > ._3d {
  right: 0;
  top: 0;
}

.holdControlbtn{
  display: block;
  width: 32px;
  height: 32px;
}
/* 开始接管 */
.icon-unbingLock-start{
   background: url(../../../static/holderControl/bindLock.png) center center no-repeat;
   background-size: 32px 32px;
}
.icon-unbingLock-start:hover{
   background: url(../../../static/holderControl/bindLock_active.png) center center no-repeat;
   background-size: 32px 32px;
}
/* 关闭接管 */
.icon-unbingLock-close{
   background: url(../../../static/holderControl/unbindLock1.png) center center no-repeat;
   background-size: 32px 32px;
}
.icon-unbingLock-close:hover{
   background: url(../../../static/holderControl/unbindLock1_active.png) center center no-repeat;
   background-size: 32px 32px;
}
/* 打开雨刷 */
.icon-windshieldWiper-start{
   background: url(../../../static/holderControl/windshieldWiper_start.png) center center no-repeat;
   background-size: 32px 32px;
}
.icon-windshieldWiper-start:hover{
   background: url(../../../static/holderControl/windshieldWiper_start_active.png) center center no-repeat;
   background-size: 32px 32px;
}
/* 关闭雨刮 */
.icon-windshieldWiper-close{
   background: url(../../../static/holderControl/windshieldWiper_close.png) center center no-repeat;
   background-size: 32px 32px;
}
.icon-windshieldWiper-close:hover{
   background: url(../../../static/holderControl/windshieldWiper_close_active.png) center center no-repeat;
   background-size: 32px 32px;
}
/* 打开加热 */
.icon-heat-start{
   background: url(../../../static/holderControl/heat_start.png) center center no-repeat;
   background-size: 32px 32px;
}
.icon-heat-start:hover{
   background: url(../../../static/holderControl/heat_start_active.png) center center no-repeat;
   background-size: 32px 32px;
}
/* 关闭加热 */
.icon-heat-close{
   background: url(../../../static/holderControl/heat_start.png) center center no-repeat;
   background-size: 32px 32px;
}
.icon-heat-close:hover{
   background: url(../../../static/holderControl/heat_start_active.png) center center no-repeat;
   background-size: 32px 32px;
}
/* 打开3d */
.icon-3d-start{
   background: url(../../../static/holderControl/_3d_start.png) center center no-repeat;
   background-size: 32px 32px;
}
.icon-3d-start:hover{
   background: url(../../../static/holderControl/_3d_start_active.png) center center no-repeat;
   background-size: 32px 32px;
}
/* 关闭3d */
.icon-3d-close{
   background: url(../../../static/holderControl/_3d_start.png) center center no-repeat;
   background-size: 32px 32px;
}
.icon-3d-close:hover{
   background: url(../../../static/holderControl/_3d_start_active.png) center center no-repeat;
   background-size: 32px 32px;
}

.custom-dialog  .left .direction .lock01{
    width:20px;
    height: 20px;
    background: url(../../../static/holderControl/unbindLock.png) center center no-repeat;
    position: absolute;
    left:0;
    padding: 0;
    margin: 0;
    border-style: none;
}
.custom-dialog  .left .direction .wiper01{
    width:20px;
    height: 20px;
    background: url(../../../static/holderControl/windshieldWiper.png) center center no-repeat;
    position: absolute;
    left:0;
    bottom: 0;
    padding: 0;
    margin: 0;
    border-style: none;
}
.custom-dialog  .left .direction .heat01{
    width:20px;
    height: 20px;
    background: url(../../../static/holderControl/heat.png) center center no-repeat;
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 0;
    margin: 0;
    border-style: none;
}
.custom-dialog  .left .direction ._3d01{
    width:20px;
    height: 20px;
    background: url(../../../static/holderControl/_3d.png) center center no-repeat;
    position: absolute;
    right: 0;
    top: 0;
    padding: 0;
    margin: 0;
    border-style: none;
}

.custom-dialog  .left .direction > div.steeringWheel {
	width: 230px;
	height: 230px;
	/* background-color: #128bf1; */
  background: url("../../../static/holderControl/direction.png");
  position: relative;
}
/* .custom-dialog  .left .direction > div:nth-child(1) > span {
	width: 44px;
	height: 44px;
	background-color: #128bf1;
  background: url("../../../static/holderControl/centre.png");
  position: absolute;
  top: 50px;
  left: 50px;
} */
.custom-dialog  .left .direction > div.steeringWheel > div {
  width: 76px;
  height: 76px;
  float: left;
  position: relative;
  cursor: pointer;
}
.direction div > span {
  position: absolute;
}
/* 上 左 */
.direction .up-left > span {
  width: 41px;
  height: 41px;
  bottom: -4px;
  right: -5px;
  /* background: url("../../../static/holderControl/up-left.png") */
}
.direction .up-left:hover > span {
   background: url("../../../static/holderControl/up-left_active.png")
}
/* 上 中 */
.direction .up-centre > span {
  width: 41px;
  height: 41px;
  bottom: 24px;
  right: 16px;
  /* background: url("../../../static/holderControl/up-centre.png") */
}
.direction .up-centre:hover > span {
   background: url("../../../static/holderControl/up-centre_active.png")
}
/* 上 右 */
.direction .up-right > span {
  width: 41px;
  height: 41px;
  bottom: -3px;
  left: -3px;
  /* background: url("../../../static/holderControl/up-right.png") */
}
.direction .up-right:hover > span {
   background: url("../../../static/holderControl/up-right_active.png")
}
/* 中 左 */
.direction .centre-left > span {
  width: 41px;
  height: 41px;
  bottom: 18px;
  right: 22px;
  /* background: url("../../../static/holderControl/centre-left.png") */
}
.direction .centre-left:hover > span {
   background: url("../../../static/holderControl/centre-left_active.png")
}
/* 中 心 */
.direction .centre-centre > span {
  width: 41px;
  height: 41px;
  bottom: 16px;
  right: 15px;
  background: url("../../../static/holderControl/centre-centre.png")
}
.direction .centre-centre:hover > span {
   background: url("../../../static/holderControl/centre-centre_active.png")
}
/* 中 右 */
.direction .centre-right > span {
  width: 41px;
  height: 41px;
  bottom: 18px;
  right: 10px;
  /* background: url("../../../static/holderControl/centre-right.png") */
}
.direction .centre-right:hover > span {
   background: url("../../../static/holderControl/centre-right_active.png")
}
/* 下 左 */
.direction .below-left > span {
  width: 41px;
  height: 41px;
  bottom: 38px;
  right: -4px;
  /* background: url("../../../static/holderControl/below-left.png") */
}
.direction .below-left:hover > span {
   background: url("../../../static/holderControl/below-left_active.png")
}
/* 下 中 */
.direction .below-centre > span {
  width: 41px;
  height: 41px;
  bottom: 11px;
  right: 16px;
  /* background: url("../../../static/holderControl/below-centre.png") */
}
.direction .below-centre:hover > span {
   background: url("../../../static/holderControl/below-centre_active.png")
}
/* 下 右 */
.direction .below-right > span {
  width: 41px;
  height: 41px;
  bottom: 38px;
  right: 37px;
  /* background: url("../../../static/holderControl/below-right.png") */
}
.direction .below-right:hover > span {
   background: url("../../../static/holderControl/below-right_active.png")
}
.adjust {
  height: calc(100% - 300px);
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
  border-top: 1px solid #607096;
}
.adjust p{
    margin-top: 14px;
    margin-bottom:14px;
}
.adjust .adjustAdd {
    background: url("../../../static/holderControl/add.png") no-repeat center;
    background-size:100% 100%;
}
.adjust .adjustAdd:hover {
    background: url("../../../static/holderControl/add_active.png") no-repeat center;
    background-size:100% 100%;
}
.adjust .adjustReduce {
    background: url("../../../static/holderControl/reduce.png") no-repeat center;
    background-size:100% 100%;
}
.adjust .adjustReduce:hover {
    background: url("../../../static/holderControl/reduce_active.png") no-repeat center;
    background-size:100% 100%;
}

.adjust > p {
  position: relative;
  height: 26px;
  line-height: 26px;
  font-size: 14px;
}
.adjust > p > span {
  width: 24px;
  height: 24px;
  position: absolute;
  cursor: pointer;
}

.adjust > p > span:nth-child(1) {
  left: 114px;
}
.adjust > p > span:nth-child(2) {
  left: 166px;
  cursor:default;
  width: 35px;
  height: 26px;
}
.adjust > p > span:nth-child(3) {
  right: 115px;
}
.slider {
  height: 65px;
  line-height: 39px;
  position: absolute;
  bottom: 0;
  width: 100%;
}
.slider > span{
    margin-left: 85px;
}
.slider > div.sliderbox {
  float: right;
  margin-right:  70px;
}
.slider > div.sliderbox div {
   width: 128px;
 display: inline-block;
 vertical-align: middle;
}
.sliderVal{
   width: 30px;
 display: inline-block;
}
/* 滑块样式 */
.slider /deep/ .el-slider__runway,
.slider /deep/ .el-slider__bar{
  background-color: #6B7C92;
  height: 4px;
}
.slider /deep/ .el-slider__button{
    width: 24px;
    height: 24px;
    border:none;
    background-color: #FFF;
    border-radius: 0;
    background:url(../../../static/holderControl/slider-pointer.png) no-repeat center;
    background-size: 100% 100%;
    margin-top: -6px;
}
.slider /deep/ .el-slider__button:hover{
  width: 24px;
    height: 24px;
    background:url(../../../static/holderControl/slider-pointer_active.png) no-repeat center;
    background-size: 100% 100%;
    transform: scale(1);
}
.custom-dialog  .right {
	width: 493px;
	height: 350px;
  overflow: auto;
	background-color: #ffffff;
	border: solid 1px #c2dff3;
  float: right;
}
.custom-dialog .rightBottom {
  height: 35px;
  /* width: 149px;; */
  float: right;
  margin-top: 11px;
  /* display: flex; */
  /* justify-content: space-around; */
}
.custom-dialog .rightBottom > div {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  border: solid 1px #128bf1;
  cursor: pointer;
  margin-right:15px;
  display: inline-block;
}
.custom-dialog .rightBottom > .prepare {
  background: url("../../../static/holderControl/prepare.png");
}
.custom-dialog .rightBottom > .prepare:hover {
  background: url("../../../static/holderControl/prepare_active.png");
}
.custom-dialog .rightBottom > .save {
  background: url("../../../static/holderControl/save.png");
}
.custom-dialog .rightBottom > .save:hover {
  background: url("../../../static/holderControl/save_active.png");
}
.custom-dialog .rightBottom > .prepareAdd {
  background: url("../../../static/holderControl/prepareAdd.png");
}
.custom-dialog .rightBottom > .prepareAdd:hover {
  background: url("../../../static/holderControl/prepareAdd_active.png");
}
.custom-dialog .rightBottom > .cruise {
  background: url("../../../static/holderControl/cruise.png");
}
.custom-dialog .rightBottom > .cruise:hover {
  background: url("../../../static/holderControl/cruise_active.png");
}

.elLeft{
  left:0px;
  top:0px;
}
</style>
