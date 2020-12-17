<template>
    <div>
        <!-- <el-button @click="startPlay">点播</el-button> -->
        <div id="automaticStartPlay" style="width:100%;height:100%;position:absolute;top:0;left:0"></div>
    </div>
</template>

<script>
import Enum from "@/common/enum";
import Fun from "@/common/fun";
import { setTimeout } from 'timers';
// import BaseContainer from './BaseContainer'

export default {
    name: 'AutomaticPlay',
    // mixins: [BaseContainer],
    data(){
        return {
            currentPlayScreens: [],
            begintime_PlayRecord:0,
            endtime_PlayRecord:0,
            curSelectedPos: -1,
            DbClickPos:-1,
            DbClickTime:null,
            isFullScreen:false,

           videoWidth: document.body.clientWidth,
           videoHeight: document.body.clientHeight,
           currentNode:{ 
                // id: "072029db5fb84b0cbe9d2cbb5df29b38",
                // name: "Onvif-塔中公寓-87",
                // resCh: undefined,
                // resourceType: 1
                id: "",
                name: "",
                resCh: undefined,
                resourceType: 1
           },

           // playType: null, // 点播类型 
            strategeData: null,
            Timer:null, //定时器
            deviceArray:[], //轮循点播的 设备
            lxData:{},//选中 策略的轮循数据

            form: {},
            playType: null
        }
    },
    created() {

    },
    mounted(){
        // this.getUserAndPsw();
        //事件
        window.onSessionEvent = this.onSessionEvent;
        window.onBtnEvent = this.onBtnEvent;
        window.onWgtSelected = this.onWgtSelected;
        window.onWindowMessage = this.onWindowMessage;
        window.onPlayResult = this.onPlayResult;
        window.onPlaybackEvent = this.onPlaybackEvent;
        window.onPtz3DMessage = this.onPtz3DMessage;
        // this.apiSDK.initSocket(function(obj) {});
        // this.initMXTC();
        // this.initSocket();
        this.judgePlayType();


        let that = this;
        window.addEventListener('beforeunload', function(e) {
            e = e || window.event;
            if( e ){
                that.apiSDK.stopAll();
            }
        });
        let beforeUnloadTime = 0,gapTime=0;
        window.onunload = function(){
            gapTime = new Date().getTime() - beforeUnloadTime
            if(gapTime<=5){
                //停止定时器
                clearInterval(that.Timer);
                clearInterval(that.tokenTime);
                // 退出
                that.apiSDK.publishLeave(function(){});
                // 关闭点播
                that.apiSDK.stopAll();
            }
        }
        window.onbeforeunload = function(){
            // that.apiSDK.stopAll();
            beforeUnloadTime = new Date().getTime();
            that.$nextTick(() => {
                const USER = xtxk.cache.get("USER");
                if(this.apiSDK.playType == 1){
                    this.apiSDK.noPluginLoginOut(USER.userName)
                }
                xtxk.media.setDialogTop('退出系统');
            });
        }

    },
    methods: {
        // 判断点播类型
        judgePlayType(){
            console.log('判断点播类型');
            // console.log('url传递的ip', xtxk.cache.get('AutomaticPlayIp'));
            // let ip = this.form.AutomaticPlayIp;
            // let strategeId = this.form.AutomaticPlayStrategeId;
            // let resourceId = this.form.AutomaticPlayResourceId;
            this.playType = null;
            let ip = xtxk.cache.get('AutomaticPlayIp');
            let strategeId = xtxk.cache.get('AutomaticPlayStrategeId');
            let resourceId = xtxk.cache.get('AutomaticPlayResourceId');
            let NVRDeviceId = xtxk.cache.get('AutomaticPlayNVRDeviceId');
            if( ip ){
            //    this.playType = 'ip';
                this.getDeviceData(ip.ip);
            } else if( strategeId ) {
            //    this.playType = 'strategeId';
                this.getDeviceStratege(strategeId.strategeId);
            } else if( NVRDeviceId ){
                this.playType = 'NVRDeviceId';
                this.currentNode.id = resourceId.resourceId;
                this.currentNode.channels = NVRDeviceId.NVRDeviceId
            } else if( resourceId ){
                this.currentNode.id = resourceId.resourceId;
                // this.initSocket();
                // let that = this;
                // setTimeout(() => {
                //   that.startPlay();
                // }, 2000)
                //    this.startPlay();
            }
            // this.initSocket();
        },
        initMXTC: function(width, height){
            console.log('宽', this.videoWidth)
            console.log('高', this.videoHeight)
            //初始化插件
            if(this.apiSDK.config.version == this.apiSDK.enumSDKVersion.SDKVersion5){
                this.$store.commit("setMediaService", Enum.enumMediaService.Success);
            }else if(this.apiSDK.config.version == this.apiSDK.enumSDKVersion.SDKVersion6){
                this.$store.commit("setMediaService", Enum.enumMediaService.Unregister);
            }
            //1119云调度拖动点播  加入this.onSelectedDrop
            this.apiSDK.initMXTC("automaticStartPlay", this.videoWidth, this.videoHeight, this.onBtnEvent, this.onSessionEvent, this.onWgtSelected, this.onPlaybackEvent, this.onPlayResult, this.onSelectedDrop);
            this.initMedia();
            this.apiSDK.splitWidowForPlugin(1);
            this.apiSDK.publishSplitScreen(1);
        },
        // 通过ip请求点播的信息
        getDeviceData(ip){
            // let ip = xtxk.cache.get('AutomaticPlayData');
            let that = this;
            this.apiSDK.getDeviceDataCallBack(ip, (res) => {
                console.log('通过ip获取设备的信号', res );
                if( res.data ){
                    if(res.data.deviceStatus == '0'){
                        this.$message({message: '当前设备不在线', type: 'error'});
                        return;
                    }
                    that.currentNode = {
                        id: res.data.resourceId,
                        name: res.data.resourceName,
                        resCh: undefined,
                        resourceType: 1,
                        channels: res.data.channels   // 通过ip查询的多路
                    };

                }
            });
        },
        // 通过strategeId 获取轮询信息
        getDeviceStratege(strategeId){
            let that = this;
            this.apiSDK.queryStrategyListById(strategeId, (res) => {
                console.log('通过strategeId获取轮询信息', res);
                that.strategeData = res;
                // that.initSocket();
                // that.hoverStartClick(res.data);
            });
        },
        // 自动点播
        startPlay(){
            // 1125 控制最大分屏
            // let content = '最大只支持9分屏,超过最大分屏';
            // let screenArr = JSON.parse(sessionStorage.getItem('currentScreen')).length; 
            // if(screenArr>=9){
            // this.$message({message: content, type: 'warning'})
            //    return;
            // }
            if( this.playType === 'NVRDeviceId' ){
                Fun.automaticStartPlayRess(this, { deviceId: this.currentNode.id, channels: [this.currentNode.channels]  });
            } else if( this.currentNode.channels && this.currentNode.channels.length ){
                console.log('通过ip查询 多个点播通道');
                // 通过ip查询 多个点播通道
                this.apiSDK.stopAll();
                this.multichannel();
            } else {
                console.log('自动点播');
                Fun.automaticPlay(this, this.currentNode, -1, 'unicast');
            }
        },
        // 多通道
        multichannel(){
            console.log('多通道');
            let channels = this.currentNode.channels.splice(0,9);
            Fun.automaticStartPlayRess(this, { deviceId: this.currentNode.id, channels: channels.map(item => item.gbId )  });
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
            // } else {
                //初始化媒体
                this.apiSDK.publishInitMediaByCustom();
            // }
            //回调
            this.apiSDK.setInformInitMediaCallback(function(obj) {
                //SIPID:"",serverID:"",serverIP:"",serverPort:"", clientPassword:""
                console.log("收到媒体初始化反馈------")
                //businessSDK.publishSplitScreen(4);
                if (obj && obj.serverIP) {
                    let mediaServiceEnable = that.$store.getters.getMediaService
                    if(mediaServiceEnable == Enum.enumMediaService.Success || mediaServiceEnable == Enum.enumMediaService.Registering){
                        that.$store.commit("setMediaService", Enum.enumMediaService.Unregister);
                        that.apiSDK.unregisterForPlugin();
                    }
                    var info = { userName: obj.SIPID, pwd: obj.clientPassword, ip: obj.serverIP, port: obj.serverPort };
                    that.$store.commit("setMediaService", Enum.enumMediaService.Registering);
					xtxk.cache.set('SIPINFO', info);
                    that.apiSDK.registerForPlguin(info);
                    if( that.strategeData ){
                         that.hoverStartClick(that.strategeData);
                    } else {
                         setTimeout(() => {
                            // !that.playType && that.startPlay();
                            that.startPlay();
                         }, 2000);
                    }
                }
            });

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
                console.log("收到开启媒体(软解)");
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
                if (obj) {
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
                  that.apiSDK.splitWidowForPlugin(parseInt(obj.splitType));
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
                    
                that.apiSDK.groupStartCommandForPlugin(obj.sceneID, arr, obj.splitType, obj.screenMemberName && JSON.parse(obj.screenMemberName));                }
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
            //1118 云调度 修改
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
                        if (curObj) this.apiSDK.sendForceIFrame(curObj.resId, curObj.resCh, curObj.resType);
                        break;
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
            } else if (btnkey == "Nor_VolOn") //关声音
            {
                this.apiSDK.publishVolume(wgtpos, false,0);
            } else if (btnkey == "Nor_VolOff")//开声音
            {
                this.apiSDK.publishVolume(wgtpos, true,255);
            } else if (btnkey == "Volume_Progress")//声音值调节
            {
                this.apiSDK.setVolumeForPlugin(wgtpos, volumeval);   
            } else if (btnkey == "Nor_PTZ")//云台
            {
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
                            this.$refs.holderControlDialog.showDialog(this.currentPlayScreens[index].resId, this.currentPlayScreens[index].resCh, this.currentPlayScreens[index].encoderSipID, this.currentPlayScreens[index].channel);                        }else{
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
            console.log("播放器选中屏幕回调----pos:" + wgtpos + "--isPlay:" + isPlay);
            //单击实现双击效果 wxx 2020.11.3
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
        
            this.curSelectedPos = wgtpos;
            this.DbClickPos = dbClickwgtpos;
            this.DbClickTime = new Date().getTime();
            sessionStorage.setItem('curSelectedPos', this.curSelectedPos)

            //点击屏幕选中设备树资源节点
            if(this.curSelectedPos!=-1){ //选中屏幕
                let screenArr = JSON.parse(sessionStorage.getItem('currentScreen')); //在播放状态的屏
                if (screenArr.length != 0) {
                    let ckResource  = screenArr.find(item => item.screenIndex == this.curSelectedPos)
                    if(typeof(ckResource) != 'undefined'){
                        let ckResourceID = ckResource.resId
                        let deviceTree = this.$parent.$refs.resourcecontainer.$refs.deviceTree[0]
                        if(ckResource.resCh == -1)  ckResource.resCh = 0
                        deviceTree.$refs.main_device_tree.setCurrentKey(ckResourceID)
                        deviceTree.$refs.main_device_tree.setCurrentKey(ckResourceID + '_' + ckResource.resCh)
                        console.log(ckResource)
                        console.log(deviceTree.$refs.main_device_tree)
                    }
                }else{
                    let deviceTree = this.$parent.$refs.resourcecontainer.$refs.deviceTree[0]
                    deviceTree.$refs.main_device_tree.setCurrentKey(null)
                }
            }else{ //取消选中
                let deviceTree = this.$parent.$refs.resourcecontainer.$refs.deviceTree[0]
                deviceTree.$refs.main_device_tree.setCurrentKey(null)
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
                    debugger;
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
        showremind: function(title,message){
            this.$notify({
                    title: title,
                    message: message,
                    position: 'bottom-right',
                    type: 'warning',
                  });
        },
        hoverStartClick(data){
            // this.$refs.rightMenu.strategyItem = data.id
            // this.selectedStratege =  data.name
            this.lxData = {
                patrolInterval: data.patrolInterval, // 巡查时间
                windowLayout: data.windowLayout, // 分屏
                patrolScreen: data.patrolScreen.split(','),
                // isOpenVoice:data.isOpenVoice,
                children: data.groupDeviceDtoList, // 轮询的数据 
                // children: data.groupInfoDtoList[0].deviceIdList
            } 
            console.log('轮询信息', this.lxData);
            this.startPlays();
        },
        //开始巡查
        startPlays(){
            // =======================  先停止其他 ====================
            //停止定时器
            clearInterval(this.Timer);

            // ============================= 在开始新的轮循 =============================
            //改变屏幕布局
            this.apiSDK.splitWidowForPlugin(this.lxData.windowLayout);
            this.apiSDK.publishSplitScreen(this.lxData.windowLayout);

            let that = this;
            //用来判断 在线的设备数量 是否少于 轮循屏数量
            let onlineArr = that.lxData.children.filter(item => {return item.status == '1'})
            if(onlineArr.length <= that.lxData.patrolScreen.length){
                that.lxData.patrolScreen = that.lxData.patrolScreen.splice(0,onlineArr.length)
            }
            that.startPlayLoop();
            //如果 在线资源数量 大于 分屏数量  进行 轮循
            if(onlineArr.length > this.lxData.patrolScreen.length){
                this.Timer = setInterval(()=>{
                    that.apiSDK.stopAll();
                    that.startPlayLoop();
                }, that.lxData.patrolInterval * 1000);
            }
        },        
        startPlayLoop(){
            let that = this; 
            //获取 轮循屏幕 数组 loopScreenCount.length  === 一次点播几个资源
            let loopScreenCount = this.lxData.patrolScreen;

            //每次循环 都把上次的点播关闭
            // let screenArr = JSON.parse(sessionStorage.getItem('currentScreen')); //在播放状态的屏
            let screenArr = 9;
            for(var i =0;i<screenArr.length;i++){
                this.apiSDK.stopPlayByIndex(screenArr);  
            }
            //每次固定  播放 轮循屏幕 数
            setTimeout(() => {
               for(let i =0;i<loopScreenCount.length;i++){
                    //判断 播放的资源  是否少于 轮循屏幕数量  
                    if(that.deviceArray.length <= loopScreenCount.length){
                        //少于 将原数组追加到 播放资源    12.1 将在线的设备  组追加到 播放资源
                        let onlineArr = that.lxData.children.filter(item => {return item.status == '1'})
                        that.deviceArray = that.deviceArray.concat(onlineArr)
                    }
                    //因为 每次 点播后都会将 资源删除 所以每次都点播的是 第一条
                    let resouceData = that.deviceArray[0]
                    //点播
                    if(resouceData.resourceType == 'channel'){
                        let channels = [{channelID: resouceData.deviceId.split(',')[0], index: parseInt(loopScreenCount[i])}];
                        that.apiSDK.startPlayNVRDeviceByIndex( resouceData.deviceId.split(',')[1], channels, 'unicast');
                    }else
                        that.apiSDK.startPlayDevice(parseInt(loopScreenCount[i]), resouceData.deviceId, resouceData.resCh,parseInt(resouceData.resourceType), 1, resouceData.name, 'unicast');
                    //每次 都删除 第一条  
                    that.deviceArray.splice(0,1)
                }
            }, 1000);
 
        },
        // 开启会议
        openMeeting(pos){
        //    let meetingNo = ''; // 拉人入会的会议号
        //    let xiaoYuNums = ''; // 被拉的小鱼号
           this.apiSDK.newOpenMeeting(this.currentPlayScreens[pos]).then(obj => {
               console.log('点击会议返回', obj);
           });
        }

    
    }
}
</script>

