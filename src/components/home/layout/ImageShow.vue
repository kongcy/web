<template>
    <div class="imageContentBox">
        <!-- <div id="imageShowContainer" style="width:100%;height:100%"></div> -->
        <div class="imageDiv" :id="id" style="width:100%;height:100%"></div>
        <div class="cornerBox">
            <i class="icon-corner corner-top-left"></i>
            <i class="icon-corner corner-top-right"></i>
            <i class="icon-corner corner-bottom-left"></i>
            <i class="icon-corner corner-bottom-right"></i>
        </div>
        <take-photo-dialog ref="takePhoto" />
        <!-- <holder-control-dialog ref="holderControlDialog" /> -->
        
        <!-- 设置 -->
        <setting-dialog ref="settingDialog"/>
    </div>
</template>

<script>
import TakePhotoDialog from '@/components/home/takePhotoDialog.vue'
// import HolderControlDialog  from '@/components/ytcontrol/HolderControlDialog.vue'
import Enum from "@/common/enum";
import Fun from "@/common/fun";

import settingDialog from "@/components/conference/settingConference.vue"
export default {
    name: "ImageShow",
    components: {
        TakePhotoDialog,
        settingDialog,
        // HolderControlDialog
	},
    data(){
      return {
          currentPlayScreens: [],
          begintime_PlayRecord:0,
          endtime_PlayRecord:0,
          curSelectedPos: -1,
          DbClickPos:-1,
          DbClickTime:null,
          isFullScreen:false,
          id:"imageShowContainer",
          activetabName:''
        //  paddingV:'8px 8px 0 8px'
      }
    },
    mounted(){
        this.activetabName=xtxk.cache.get('activeName');
       
        if(this.activetabName=="Meeting"){
           // this.paddingV="8px 8px 0 8px"
        }
         //事件
        window.onSessionEvent = this.onSessionEvent;
        window.onBtnEvent = this.onBtnEvent;
        window.onWgtSelected = this.onWgtSelected;
        window.onWindowMessage = this.onWindowMessage;
        window.onPlayResult = this.onPlayResult;
        window.onPlaybackEvent = this.onPlaybackEvent;
        window.onPtz3DMessage = this.onPtz3DMessage;
    },
    watch: { 
        currentPlayScreens: {
            handler(newArr, old) {
                sessionStorage.setItem('currentScreen', JSON.stringify(newArr))
                 if(this.activetabName=="Monitor"){
                    let componentArr=this.$parent.$refs;
                    if(componentArr.hasOwnProperty("resourcecontainer")){
                         let deviceTreePlan= this.$parent.$refs.resourcecontainer.$refs.equipementRes[0].$refs.deviceTree[0];
                             let commonuseTreePlan= this.$parent.$refs.resourcecontainer.$refs.equipementRes[0].$refs.commonUse[0];
                        if(newArr.length==0){
                            deviceTreePlan.hasPlayD=false;
                            commonuseTreePlan.hasPlayD=false;
                            this.$parent.$refs.resourcecontainer.$refs.searchStratege[0].hasPlayD=false;
                          
                        }else{
                            deviceTreePlan.hasPlayD=true;
                            commonuseTreePlan.hasPlayD=true;
                            this.$parent.$refs.resourcecontainer.$refs.searchStratege[0].hasPlayD=true;
                        }
                          commonuseTreePlan.changeStatus();
                    }
                 }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        initMXTC: function(width, height,id){
            console.log('进来了-----', id);
            let self=this;
            self.id= id?id:self.id; 
            this.$nextTick(()=>{
               const  cdom = document.getElementById(self.id);
               console.log(`${self.id}player容器更新!` + cdom)
                console.log('----------------------------------------------')
                self.apiSDK.initLayout(self.id, width, height, self.onBtnEvent, self.onSessionEvent, self.onWgtSelected, self.onPlaybackEvent, self.onPlayResult, this.onSelectedDrop);
                self.initMedia();
            }) 
            // this.$nextTick(function(){
            //     //  //初始化插件
            //     // if(self.apiSDK.config.version == self.apiSDK.enumSDKVersion.SDKVersion5){
            //     //     self.$store.commit("setMediaService", Enum.enumMediaService.Success);
            //     // }else if(self.apiSDK.config.version == self.apiSDK.enumSDKVersion.SDKVersion6){
            //     //     self.$store.commit("setMediaService", Enum.enumMediaService.Unregister);
            //     // }
            //     self.apiSDK.initLayout(id, width, height, self.onBtnEvent, self.onSessionEvent, self.onWgtSelected, self.onPlaybackEvent, self.onPlayResult, this.onSelectedDrop);
            //     self.initMedia();
            // })
            // //初始化插件  star 2020.10.22
            //     if(this.apiSDK.config.version == this.apiSDK.enumSDKVersion.SDKVersion5){
            //         this.$store.commit("setMediaService", Enum.enumMediaService.Success);
            //     }else if(this.apiSDK.config.version == this.apiSDK.enumSDKVersion.SDKVersion6){
            //         this.$store.commit("setMediaService", Enum.enumMediaService.Unregister);
            //     }
            //     this.apiSDK.initMXTC("imageShowContainer", width, height, this.onBtnEvent, this.onSessionEvent, this.onWgtSelected, this.onPlaybackEvent, this.onPlayResult);
            //     this.initMedia();
        },
        // 去重
        reduce(array, key) {
            let object = {}
            return array.reduce((total, item) => {
                object[item[key]] ? '' : object[item[key]] = true && total.push(item)
                return total
            }, [])
        },
        getResource: function(pos){
            return this.currentPlayScreens.findIndex(item => pos == item.screenIndex)
        },
        initMedia: function(){
            let that = this;
            // var sipInfo = xtxk.cache.get('SIPINFO');
            // if(sipInfo){
            //     //刷新时，用缓存的sip信息注册插件
            //     var sipInfo = xtxk.cache.get('SIPINFO');
            //     this.apiSDK.registerForPlguin(sipInfo);
            // }else{
            //     //初始化媒体
            //     this.apiSDK.publishInitMediaByCustom();
            // }
            
            // //回调
            // this.apiSDK.setInformInitMediaCallback(function(obj) {
            //     //SIPID:"",serverID:"",serverIP:"",serverPort:"", clientPassword:""
            //     console.log("收到媒体初始化反馈------")
            //     //businessSDK.publishSplitScreen(4);
            //     if (obj && obj.serverIP) {
            //         let mediaServiceEnable = that.$store.getters.getMediaService
            //         if(mediaServiceEnable == Enum.enumMediaService.Success || mediaServiceEnable == Enum.enumMediaService.Registering){
            //             that.$store.commit("setMediaService", Enum.enumMediaService.Unregister);
            //             that.apiSDK.unregisterForPlugin();
            //         }
            //         var info = { userName: obj.SIPID, pwd: obj.clientPassword, ip: obj.serverIP, port: obj.serverPort };
            //         that.$store.commit("setMediaService", Enum.enumMediaService.Registering);
			// 		xtxk.cache.set('SIPINFO', info);
            //         that.apiSDK.registerForPlguin(info);
            //     }
            // });

            //通过url显示图像
            this.apiSDK.setInformStartPlayByRTMPCallback((res, type) => {
                if (type === 'flv') {
                    let playURL = res.playURL;
                    if (playURL || playURL.substring(playURL.length-3) !== 'flv') {
                        that.showremind("提示","转码未完成");
                        return;
                    }
                }
                this.apiSDK.startPlayByRTMPForPlugin(res.screenIndex, res.resourceType, res.playURL, type);
            });

            //设置临时录像状态
            this.apiSDK.setReceiveRecordingStatusCallback(function(obj){
                if(obj){
                    let pos = obj.pos;
                    if (!obj.pos) {
                        let resource = this.currentPlayScreens.find(item => obj.resId == item.resId);
                        pos = resource && resource.screenIndex;
                    }
                    if(obj.isRecord==1){
                         that.apiSDK.changeButtonForPlugin(pos,1,1,"Choose_Record");
                        that.showremind("提示","设备开始录像")
                    }else{
                        that.apiSDK.changeButtonForPlugin(pos,1,1,"Nor_Record");
                        that.showremind("提示","设备停止录像")
                    }
                }
            });

            this.apiSDK.setReceivePlaybackStatusCallback((obj) =>{
                if( obj.msg ){
                    that.showremind("提示",obj.msg)
                }else{
                    that.begintime_PlayRecord = obj.beginTime;
                    that.endtime_PlayRecord = obj.endTime;
                }
            });

            this.apiSDK.setInformStartMediaByLocalCallback((obj) =>{
                console.log("收到开启媒体(软解)" );
                if(obj){
                    // that.apiSDK.startPlayForPlugin(obj.screenIndex, obj.videoRTPId || "", obj.audioRTPId || "",
                    //     obj.localVPort, obj.fIPS, obj.fCH, 0, obj.resId, obj.resCh, "", obj.resType);
                    //     2020-06-15 修改
                    that.apiSDK.startPlayForPlugin(obj.screenIndex, obj.videoRTPId || "", obj.audioRTPId || "", obj.encoderSipID,
                        obj.localVPort, obj.fIPS, obj.fCH, 0, obj.resId, obj.resCh, "", obj.resType, obj.mediaGroupID, obj.channel, obj.mediaType);
                    
                    if(obj.resType == 3){
                        that.apiSDK.startPlaybackTimeForPlugin(obj.screenIndex,that.begintime_PlayRecord,that.endtime_PlayRecord)
                    }
                    let itemIndex = that.getResource(obj.screenIndex);
                    if(itemIndex != -1){//存在，就更新
                        that.$set(that.currentPlayScreens, itemIndex, {
                            screenIndex : obj.screenIndex,
                            resId : obj.resId,
                            resCh : obj.resCh,
                            resType : obj.resType,
                            encoderSipID: obj.encoderSipID,
                            channel: obj.channel
                        })
                    }else{
                        that.currentPlayScreens.push({
                            screenIndex : obj.screenIndex,
                            resId : obj.resId,
                            resCh : obj.resCh,
                            resType : obj.resType,
                            encoderSipID: obj.encoderSipID,
                            channel: obj.channel
                        });
                    }
                }
            });

            this.apiSDK.setInformStopMediaByLocalCallback(function (obj) {
                console.log("收到停止媒体(软解)");
                if (obj.screenIndex instanceof Array) {
                     obj.screenIndex.length && obj.screenIndex.forEach(item => {
                        that.apiSDK.stopPlayForPlugin(item);
                        let itemIndex = that.getResource(item);
                        if (itemIndex != -1) {
                            that.currentPlayScreens.splice(itemIndex, 1)
                        }
                    })
                    }else{
                    that.apiSDK.stopPlayForPlugin(obj.screenIndex);
                    let itemIndex = that.getResource(obj.screenIndex);
                    if (itemIndex != -1) {
                        that.currentPlayScreens.splice(itemIndex, 1)
                    }
                }
            });

            this.apiSDK.setInformSplitScreenByLocalCallback(function (obj) {
                console.log("收到分屏(软解)");
                if (obj) {
                  that.apiSDK.splitWidowForPlugin(parseInt(obj.splitType))
                  if(that.$parent.$refs.imageBottomNav){
                      that.$parent.$refs.imageBottomNav.activeScreenNum=obj.splitType;
                  }
                }
            });


            this.apiSDK.setVolumeByLocalCallback(function(obj){
              if(obj){
                that.apiSDK.setVolumeStateForPlugin(obj.screenIndex, obj.state);

                that.apiSDK.changeButtonForPlugin(obj.screenIndex, true, 8, obj.state?"Nor_VolOn":"Nor_VolOff");
              }
            });

            this.apiSDK.setInformFullScreenByLocalCallback(function (obj) {
                console.log("收到全屏(软解)");
                if (obj) {
                  that.apiSDK.setFullScreenForPlugin(obj.screenIndex,obj.isFullScreen);
                }
            });

            //osd
            this.apiSDK.setInformOsdStatusCallback(function (obj) {
                if(obj){
					//取消osd
					if(obj.length > 0) that.apiSDK.cancelOSDForPlugin(obj[0].screenIndex);
					//设置osd
                    obj.forEach(function(item){
                        //字号转像素
                        let fontSize = Fun.filterForFontSize(item.fontSize)
                        that.apiSDK.setOSDForPlugin(item.screenIndex,item.osdIndex,item.caption,item.fontColor,item.bold,item.italic,item.width,item.height,
                            item.relativeX,item.relativeY,item.basePoint,fontSize,item.fontFamily)
                    })
                }
            })

            this.apiSDK.setReceiveInformGroupStartMediaCallback(function (obj) {
                console.log("收到组开启");
                if (obj && obj.data) {
                    var data_ = JSON.parse(obj.data);
                    var arr = [];
                    data_.forEach(item => {
                        // arr.push({pos: item.screenIndex, videoRtpId: item.videoRTPId||"", audioRtpId: item.audioRTPId||"", resourceType: item.resourceType})
                        // 2020-07-28修改
                        arr.push({
                            pos: item.screenIndex,
                            resSipId: item.encoderSipID,
                            resourceType: item.resourceType,
                            channel: item.channel,
                            groupId: item.mediaGroupID,
                            isMP: item.isMP,
                            mediaType: item.mediaType
                        })
                    })
                    
                    that.apiSDK.groupStartCommandForPlugin(obj.sceneID, arr, obj.splitType, obj.screenMemberName && JSON.parse(obj.screenMemberName));
                }
            });

            this.apiSDK.setReceiveInformRefreshGroupMediaCallback(function (obj) {
                console.log("收到组刷新");
                if (obj && obj.data) {
                    var data_ = JSON.parse(obj.data);
                    var arr = [];
                    data_.forEach(item => {
                        // arr.push({pos: item.screenIndex, videoRtpId: item.videoRTPId||"", audioRtpId: item.audioRTPId||"", resourceType: item.resourceType})
                        // 2020-07-28修改
                        arr.push({
                            pos: item.screenIndex,
                            resSipId: item.encoderSipID,
                            resourceType: item.resourceType,
                            channel: item.channel,
                            groupId: item.mediaGroupID,
                            isMP: item.isMP,
                            mediaType: item.mediaType
                        })
                    })
                    that.apiSDK.groupRefreshCommandForPlugin(obj.sceneID, arr);
                }
            });

            this.apiSDK.setReceiveInformStopGroupMediaCallback(function (obj) {
                console.log("收到组停止");
                if (obj) {
                    that.apiSDK.groupStopCommandForPlugin(obj.mediaGroupID);
                }
            });
            this.apiSDK.setInformRefreshScreenNameCallBack();
        },

        //播放器回调
        //eventType: 0, status_code: 1 播放；0 停止播放；-1 断流
        //eventType: 1, status_code: 1 注册成功；-1注册失败；-2 移除成功；-3 链路断开，2 注销成功
        onSessionEvent: function(eventType, sessionid, status_code, msg, wgtpos) {
            console.log("播放器回调------eventType:" + eventType + "--sessionid：" + sessionid + "--status_code:" + status_code + "--msg:" + msg + "--wgtpos:" + wgtpos);
            if (eventType == 0) {
                switch (status_code) {
                    case 1: //点播成功
                        let curObj = this.currentPlayScreens.find(item => wgtpos == item.screenIndex)
                        if (curObj) {
                            this.apiSDK.sendForceIFrame(curObj.encoderSipID, curObj.resCh, curObj.resType, curObj.channel);
                            this.apiSDK.setVolumeStateForPlugin(wgtpos, false);
                        }
                    case 0: //点播失败
                        // this.apiSDK.stopPlayByIndex(wgtpos);
                        break;
                    case -1: break;
                }
            } else if (eventType == 1) {
                switch (status_code) {
                    case 2:  break;//注销成功
                    case 1:  this.$store.commit("setMediaService", Enum.enumMediaService.Success); break;//注册成功
                    case -1: this.$store.commit("setMediaService", Enum.enumMediaService.Unregister); break;//注册失败
                    case -2: break;
                    case -3: break;
                }
            }
        },
        //播放器按钮回调事件
        //wgtpos:窗口索引，btnpos：按钮索引
        onBtnEvent: function(wgtpos, isLeft, btnpos, btnkey, volumeval) {
            console.log("播放器点击按钮回调-------" + wgtpos + "  " + isLeft + "   " + btnpos + "  " + btnkey + '   '+ volumeval);
            if (btnkey == "Nor_StopPlay") //停止视频
            {
                this.apiSDK.stopPlayByIndex(wgtpos);
                 this.$parent.HideHolder(wgtpos);
            } else if (btnkey == "Nor_VolOn") //关声音
            {
                // this.apiSDK.publishVolume(wgtpos, false,0);
                this.apiSDK.setVolumeStateForPlugin(wgtpos, false);
            } else if (btnkey == "Nor_VolOff")//开声音
            {
                // this.apiSDK.publishVolume(wgtpos, true,255);
                this.apiSDK.setVolumeStateForPlugin(wgtpos, true);
            } else if (btnkey == "Volume_Progress")//声音值调节
            {
                this.apiSDK.setVolumeForPlugin(wgtpos, volumeval);   
            } else if (btnkey == "Nor_PTZ")//云台
            {
                console.log("123")
               
                var index = this.getResource(wgtpos);
                if(index != -1){
                    if(this.currentPlayScreens[index].resType == 2 || this.currentPlayScreens[index].resType == 3){
                        this.showremind("提示", "设备不允许开启云台控制")
                        return
                    }
                    console.log("所选视频区："+JSON.stringify(this.currentPlayScreens[index]))
                    // 校验是否有云台的权限
                    this.apiSDK.getValidYTRight(this.currentPlayScreens[index].resId, this.currentPlayScreens[index].resCh, (obj)=>{
                        if( obj && obj.Ret == 0 ){
                            // 打开云台
                            this.$parent.expendHolder();
                            this.$parent.$refs.holderControl.showDialog(this.currentPlayScreens[index].resId, this.currentPlayScreens[index].resCh, this.currentPlayScreens[index].encoderSipID, this.currentPlayScreens[index].channel);   
                            // this.$refs.holderControlDialog.showDialog(this.currentPlayScreens[index].resId, this.currentPlayScreens[index].resCh, this.currentPlayScreens[index].encoderSipID, this.currentPlayScreens[index].channel);   
                        }else{
                            // 提示没有权限
                            this.showremind("提示", "没有云台控制的权限")
                        }
                    });
                }
            } else if (btnkey == "Nor_FullScreen")//全屏
            {
                this.apiSDK.setFullScreenForPlugin(wgtpos, true);
                this.apiSDK.changeButtonForPlugin(wgtpos, isLeft, btnpos, "Nor_CancelFull");
                this.isFullScreen=true;
            } else if (btnkey == "Nor_CancelFull") {
                this.apiSDK.setFullScreenForPlugin(wgtpos, false);
                this.apiSDK.changeButtonForPlugin(wgtpos, isLeft, btnpos, "Nor_FullScreen");
                  this.isFullScreen=false;
            }else if(btnkey == "Nor_Record"){//开启临时录像
                var index = this.getResource(wgtpos);
                if(index != -1){
                    if(this.currentPlayScreens[index].resType == 2 || this.currentPlayScreens[index].resType == 3){
                        this.showremind("提示", "设备不允许开启临时录像")
                        return
                    }
                    this.apiSDK.startVideoRecording(this.currentPlayScreens[index].resId,this.currentPlayScreens[index].resCh, this.currentPlayScreens[index].resType, wgtpos)
                    this.apiSDK.changeButtonForPlugin(wgtpos, isLeft, btnpos, "Choose_Record");
                }
            }else if(btnkey == "Choose_Record"){//停止临时录像
                var index=this.getResource(wgtpos);
                if(index != -1){
                    this.apiSDK.stopVideoRecording(this.currentPlayScreens[index].resId,this.currentPlayScreens[index].resCh,this.currentPlayScreens[index].resType);
                    this.apiSDK.changeButtonForPlugin(wgtpos, isLeft, btnpos, "Nor_Record");
                }
            }else if(btnkey == "Record_Pause"){//暂停录像回放
                this.apiSDK.changeButtonForPlugin(wgtpos,isLeft,btnpos,"Record_Play");
                this.apiSDK.pauseVideoPlayback(wgtpos)
            }else if(btnkey == "Record_Play"){//恢复录像回放
                this.apiSDK.changeButtonForPlugin(wgtpos,isLeft,btnpos,"Record_Pause");
                this.apiSDK.resumeVideoPlayback(wgtpos)
            }else if(btnkey == "Record_Frame"){//单帧播放录像回放
                this.apiSDK.singleFrameVideoPlayback(wgtpos);
            }else if(btnkey == "Pic_Capture"){//抓拍
                var index=this.getResource(wgtpos);
                if(index != -1){
                    var curDate = new Date();
                    var fileName = this.currentPlayScreens[index].resId +this.currentPlayScreens[index].resCh+ curDate.getFullYear() + curDate.getMonth() + curDate.getDay() + curDate.getHours() + curDate.getMinutes() + curDate.getSeconds() + ".bmp";
                    let imgData = [];
                    // imgUrl.replace(/\\/g,"/")
                    // let imgUrl = "D:/XtImg/" + fileName;
                    this.apiSDK.takeASnap(wgtpos, "D:/XtImg/" + fileName, "", res => {
                        if (res.Ret == '0') {
                            imgData.push({url: res.url, setIndex: wgtpos})
                        }
                    });
                    this.$refs.takePhoto.showDialog(imgData);
                }
            }else if(btnkey == "Pause"){//暂停播放
                this.apiSDK.changeButtonForPlugin(wgtpos, isLeft, btnpos, "Play");
                this.apiSDK.pauseDBImageByPosForPlugin(wgtpos);
                // this.apiSDK.setVolumeStateForPlugin(wgtpos, false);
            }else if(btnkey == "Play") {//恢复图像
                this.apiSDK.changeButtonForPlugin(wgtpos, isLeft, btnpos, "Pause");
                this.apiSDK.resumeDBImageByPosForPlugin(wgtpos);
                // this.apiSDK.setVolumeStateForPlugin(wgtpos, true);
            } else if( btnkey == 'Open_Meeting' ) {
                // 开启会议
                this.openMeeting(wgtpos);
            }
        },
        //播放器选中回调
        onWgtSelected: function(wgtpos, isPlay,dbClickwgtpos) {
            console.log("播放器选中屏幕回调----pos:" + wgtpos + "--isPlay:" + isPlay+ "--dbClickwgtpos:" + dbClickwgtpos);
            //单击实现双击效果 wxx 2020.10.30
            if( this.activetabName=="Monitor"){
                if(this.DbClickPos == dbClickwgtpos && (new Date().getTime()-this.DbClickTime) < 250){
                    let isLeft=null,btnpos=null;
                    if(isPlay==1){
                        if (!this.isFullScreen)//全屏
                        {
                            this.apiSDK.setFullScreenForPlugin(dbClickwgtpos, true);
                            this.apiSDK.changeButtonForPlugin(dbClickwgtpos, isLeft, btnpos, "Nor_CancelFull");
                            this.isFullScreen=true;
                        } else{
                            this.apiSDK.setFullScreenForPlugin(dbClickwgtpos, false);
                            this.apiSDK.changeButtonForPlugin(dbClickwgtpos, isLeft, btnpos, "Nor_FullScreen");
                            this.isFullScreen=false;
                        }
                    }
                }
            }
             this.curSelectedPos = wgtpos;
             this.DbClickPos = dbClickwgtpos;
             this.DbClickTime = new Date().getTime();
            sessionStorage.setItem('curSelectedPos', this.curSelectedPos)

            //点击屏幕选中设备树资源节点
            if(this.activetabName=="Monitor"){
                if(this.curSelectedPos!=-1){ //选中屏幕
                    let screenArr = JSON.parse(sessionStorage.getItem('currentScreen')); //在播放状态的屏
                    if (screenArr.length != 0) {
                        let ckResource  = screenArr.find(item => item.screenIndex == this.curSelectedPos)
                        if(typeof(ckResource) != 'undefined'){
                            let ckResourceID = ckResource.resId
                            let deviceTree = this.$parent.$refs.resourcecontainer.$refs.equipementRes[0].$refs.deviceTree[0]
                            if(ckResource.resCh == -1)  ckResource.resCh = 0
                            deviceTree.$refs.main_device_tree.setCurrentKey(ckResourceID)
                            deviceTree.$refs.main_device_tree.setCurrentKey(ckResourceID + '_' + ckResource.resCh)
                        }
                    }else{
                        let deviceTree = this.$parent.$refs.resourcecontainer.$refs.equipementRes[0].$refs.deviceTree[0]
                        deviceTree.$refs.main_device_tree.setCurrentKey(null)
                    }
                }else{ //取消选中
                    let deviceTree = this.$parent.$refs.resourcecontainer.$refs.equipementRes[0].$refs.deviceTree[0]
                    deviceTree.$refs.main_device_tree.setCurrentKey(null)
                }
            }
        },
     
        onPlayResult: function(pos, ip, ch, devIds, devCh, resID, opType){
            console.log('----------------------onPlayResult----------------------');
                // console.log('pos='+pos);
                // console.log('ip='+ip);
                // console.log('ch='+ch);
                // console.log('devIds='+devIds);
                // console.log('devCh='+devCh);
                // console.log('resID='+resID);
                // console.log('opType='+opType);

                // var indexView = layui.index.prototype;
                if (pos != -1) {
                    pos = pos ? pos : 0; // 如果没有下标，默认0
                    let resource = this.currentPlayScreens.find(item => pos == item.screenIndex);
                    //更新图标状态
                    if (resource) {
                        this.apiSDK.sendForceIFrame(resource.resId, resource.resCh, resource.resType);
                        this.apiSDK.resumeDBImageByPosForPlugin(pos,1,2,"Pause");
                    }
                } else {
                    // console.log("点播失败" + resID);
                    this.apiSDK.stopPlayByIndex(pos);
                }
        },
        onPlaybackEvent: function(wgtpos,type,speed,time){
            console.log('----------------------onPlaybackEvent----------------------');
            // wgtpos 窗口的下标，从0开始
            // type	0-点击的是回放进度条 1-点击的是回放速度控制
            // speed	回放速度控制 （值为-4 -2 1 2 4 8）
            // time	回放进度条的时间戳
            console.log('wgtpos='+wgtpos);
            console.log('type='+type);
            console.log('speed='+speed);
            console.log('time='+time);
            if( type == '0' ){// time
                console.log('type=0');
                this.apiSDK.jumpToSpecifiedPosition(wgtpos, time);
            }else if( type == '1' ){// speed
                console.log('type=1');
                if( speed == -2 ){
                    speed = 0.5;
                }else if( speed == -4 ){
                    speed = 0.25;
                }
                this.apiSDK.changeVideoPlaybackSpeed(wgtpos, speed);
            }
        },
        onPtz3DMessage: function(pos,x1,y1,x2,y2,w,h){
            console.log('onPtz3DMessage');
            console.log(pos+" ,"+x1+" ,"+y1+" ,"+x2+" ,"+y2+" ,"+w+" ,"+h);
            //自动补零
            //number 数字
            //length 长度
            function PrefixInteger (number,length){
                return (Array(length).join(' ')+number).slice(-length);
            }
            var value = PrefixInteger(0,6)+','+PrefixInteger(0,6)+','+PrefixInteger(w,6)+','+PrefixInteger(h,6)+','+PrefixInteger(x1,6)+','+PrefixInteger(y1,6)+','+PrefixInteger(x2-x1,6)+','+PrefixInteger(y2-y1,6);
            console.log('value='+value);
            var index=this.getResource(pos);
            if(index != -1){
                this.apiSDK.publish3DControl(this.currentPlayScreens[index].resId, this.currentPlayScreens[index].resCh, value,function(obj){
                        console.log(obj);
                        if( obj.ret == 0 ){
                            console.log('3D控制开启成功');
                        }
                    });
            }
            /**
            for(var i=0;i<currentPlayingScreens.length;i++){
                var item = currentPlayingScreens[i];
                if( pos == item.pos ){
                    ytControlSDK.publish3DControl(item.devIds, item.devCh, value,function(obj){
                        console.log(obj);
                        if( obj.ret == 0 ){
                            console.log('3D控制开启成功');
                        }
                    });
                }
            }
            */
        },
        //1119云调度拖动点播
        onSelectedDrop: function(wgtpos, isPlay, dragData) {
            console.log("播放器拖拽选中屏幕回调----pos:" + wgtpos + "--isPlay:" + isPlay, dragData);
            this.curSelectedPos = wgtpos;
            sessionStorage.setItem('curSelectedPos', this.curSelectedPos);
            // 11.26同步云调度 1123 提交 拖拽点播可覆盖点播----
            // if (isPlay === 1) {
            //     this.showremind('提示', '当前分屏正在播放');
            // } else {
                // 判断是否在点播
                this.currentPlayScreens.forEach(item => {
                    if( item.screenIndex == wgtpos ){
                        this.apiSDK.stopPlayByIndex(wgtpos);
                    }
                });
                if (dragData.resourceType === Enum.enumResType.PERSON) {
                    this.apiSDK.startPlayUser(wgtpos, dragData.id, '', dragData.name, 'unicast');
                } else if (dragData.resourceType === Enum.enumResType.DEVICE) {
                    this.apiSDK.startPlayDevice(wgtpos, dragData.id, '', dragData.resourceType, '', dragData.name, 'unicast');
                } 
                //1119云调度拖动点播
                else if (dragData.resourceType === "channel") { 
                    let channels = [{channelID: dragData.id, index: wgtpos}];
                    this.apiSDK.startPlayNVRDeviceByIndex(dragData.pid, channels, 'unicast');
                }
            // }
        },
        showremind: function(title,message){
            this.$notify({
                    title: title,
                    message: message,
                    type: 'warning',
                  });
        },
        // 开启会议
        openMeeting(pos){
            // let meetingNo = ''; // 拉人入会的会议号
            // let xiaoYuNums = ''; // 被拉的小鱼号 11
            console.log('主页---开启会议', this.currentPlayScreens);
           let data = {
               encoderSipID: this.currentPlayScreens[pos].encoderSipID,
               resId: this.currentPlayScreens[pos].resId,
               joinMember: xtxk.cache.get('yhsjhm'),
               channel: this.currentPlayScreens[pos].channel,
           };
           console.log('开启会议--- 111', data );
           this.apiSDK.newOpenMeeting(data, obj => {
               console.log('点击会议返回', obj);
           });
        }
    }
}
</script>
<style scoped>

    .imageContentBox{
        width:100%;
        height:100%;
     /**  padding: 8px 8px 0 8px; */ 
        box-sizing: border-box;
        background: url(../../../../static/main/screen/imgShow_bg.png) no-repeat;
        background-size: 100% 100%;
        position: relative;
    }
    .cornerBox{
       
    }
    .icon-corner{
        position: absolute;
        display: block;
        width:24px;
        height: 24px;
        z-index: 100;
    }
    /* .corner-top-left{
        top:0;
        left:0;
        background: url(../../../../static/main/screen/corner1.png) no-repeat;
        background-size: 100% 100%;
    }
     .corner-top-right{
        top:0;
        right:0;
        background: url(../../../../static/main/screen/corner2.png) no-repeat;
        background-size: 100% 100%;
    }
    .corner-bottom-left{
        bottom:0;
        left:0;
        background: url(../../../../static/main/screen/corner4.png) no-repeat;
        background-size: 100% 100%;
    }
     .corner-bottom-right{
        bottom:0;
        right:0;
        background: url(../../../../static/main/screen/corner3.png) no-repeat;
        background-size: 100% 100%;
    } */
</style>
