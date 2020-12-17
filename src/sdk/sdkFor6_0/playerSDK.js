export const playerSDK = {
  _osIndex		: -1,
  _delay			: 500,//毫秒
  _mxtc_aready	: false,
  _reg_info		: null,
  _getOS : function (){
    if(playerSDK._osIndex != -1) return playerSDK._osIndex;
    if(navigator.userAgent.indexOf("MSIE")>0)
      playerSDK._osIndex = 1;
    else if(navigator.userAgent.indexOf("Firefox")>0)
      playerSDK._osIndex = 2;
    else
      playerSDK._osIndex = 0;
    return playerSDK._osIndex;
  },
  //初始化图像显示组件
  initMXTC : function(parentID,width, height){
    var playElement = document.getElementById(parentID);
    //var width  = parseInt(playElement.clientWidth);
    //var height = parseInt(playElement.clientHeight);
    var obj = document.createElement("object");
    if(playerSDK._getOS() == 1){
      obj.setAttribute("id"     ,"ActivexQtTerminal");
      obj.setAttribute("CLASSID","clsid:71D2FC55-6C66-4A23-A546-B3F9244EC3C5");
      obj.setAttribute("style"  ,"width:100%; height:100%;z-index:0;border:0px;");

      try{
        playElement.innerHTML = "";
        playElement.appendChild(obj);
        var ActivexQtTerminal = document.getElementById("ActivexQtTerminal");
        ActivexQtTerminal.onInitPlugin(width, height, 0);//设置插件宽高为[100,570],并设置窗口之间间隔为5
        ActivexQtTerminal.onAttachEvent("onSessionEvent", onSessionEvent); //媒体和sip回调
        ActivexQtTerminal.onAttachEvent("onBtnEvent", onBtnEvent); //按钮回调
        ActivexQtTerminal.onAttachEvent("onWgtSelected", onWgtSelected);//选中回调
        //ActivexQtTerminal.onRectAttribute(2,255); //边框为2个像素，颜色为红色
        //playerSDK.onChangeSize(width, height);
        playerSDK.initBtn();
        playerSDK._mxtc_aready = true;
        //playerSDK.register();
        return true;
      }catch(e){
        console.log(e);
        alert("播放器插件初始化失败");
      }
    }else if(playerSDK._getOS() == 2){
      obj.setAttribute("id"   , "npQtTerminal");
      obj.setAttribute("type" , "npQtTerminal/very");
      obj.setAttribute("style", "width:100%; height:100%; border-style:solid;border:0px;z-Index:-1;");

      try{
        playElement.innerHTML = "";
        playElement.appendChild(obj);
        var npQtTerminal = document.getElementById("npQtTerminal");
        npQtTerminal.onInitPlugin(width, height, 0);
        npQtTerminal.onAttachEvent("onSessionEvent");
        npQtTerminal.onAttachEvent("onBtnEvent");
        npQtTerminal.onAttachEvent("onWgtSelected");
        playerSDK.initBtn();
        playerSDK._mxtc_aready = true;
        //playerSDK.register();
        console.log("插件init over")
        return true;
      }catch(e){
        console.log(e);
        alert("播放器插件初始化失败");
      }
    }
  },
  unInitMxtc:function(){
    try{
      console.log("调用插件unInitMxtc方法");
      playerSDK._reg_info = null;
      if(playerSDK._getOS() == 1)
        document.getElementById("ActivexQtTerminal").unInit();
      else if(playerSDK._getOS() == 2) // Firefox
        document.getElementById("npQtTerminal").unInit();
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  initBtn: function(){
    playerSDK.addButton(0, 1, "Nor_StopPlay");
    playerSDK.addButton(1, 1, "Nor_VolOn");
    playerSDK.addButton(2, 1, "Pause");

    playerSDK.addButton(0, 0, "Video_Quality");
    playerSDK.addButton(1, 0, "Nor_PTZ");
    playerSDK.addButton(2, 0, "Nor_FullScreen");
    playerSDK.addButton(3, 0, "Pic_Capture");
  },
  register: function(info){//向媒体调度服务注册
    try{
      if(info) playerSDK._reg_info = info;
      if(playerSDK._mxtc_aready && playerSDK._reg_info) {//组件已加载成功
        console.log("调用插件onStartRegister方法，参数："+JSON.stringify(playerSDK._reg_info));
        if(playerSDK._getOS() == 1)
          document.getElementById("ActivexQtTerminal").onStartRegister(playerSDK._reg_info.userName, playerSDK._reg_info.pwd, playerSDK._reg_info.ip, playerSDK._reg_info.port);
        else if(playerSDK._getOS() == 2) // Firefox
          document.getElementById("npQtTerminal").onStartRegister(playerSDK._reg_info.userName, playerSDK._reg_info.pwd, playerSDK._reg_info.ip, playerSDK._reg_info.port);
      }
    }catch(e){
      console.log(e);
      alert("媒体服务注册失败")
    }
  },
  unRegister : function(){
    try{
      console.log("调用插件unRegister方法");
      playerSDK._reg_info = null;
      if(playerSDK._getOS() == 1){
        var ActivexQtTerminal = document.getElementById("ActivexQtTerminal");
        if(ActivexQtTerminal) ActivexQtTerminal.onUnRegister();
      }
      else if(playerSDK._getOS() == 2){ // Firefox
        var npQtTerminal = document.getElementById("npQtTerminal")
        if(npQtTerminal) npQtTerminal.onUnRegister();
      }
    }catch(e){
	    console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  addButton : function(pos, isLeft, btnKey){//isLeft 按钮在窗口的左部还是右部 1->左 0->右
    try{
      if(playerSDK._getOS() == 1)
        document.getElementById("ActivexQtTerminal").onInitButton(pos, isLeft, btnKey);
      else if(playerSDK._getOS() == 2) // Firefox
        document.getElementById("npQtTerminal").onInitButton(pos, isLeft, btnKey);
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  changeButton : function(screenIndex, isLeft, btnPos, btnKey){
    try{
      if(playerSDK._getOS() == 1)
        document.getElementById("ActivexQtTerminal").onBtnChanged(screenIndex, isLeft, btnPos, btnKey);
      else if(playerSDK._getOS() == 2) // Firefox
        document.getElementById("npQtTerminal").onBtnChanged(screenIndex, isLeft, btnPos, btnKey);
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  onChangeSize : function(width, height){
    try{
      if(playerSDK._getOS() == 1)
        document.getElementById("ActivexQtTerminal").onChangeSize(width, height);
      else if(playerSDK._getOS() == 2) // Firefox
        document.getElementById("npQtTerminal").onChangeSize(width, height);
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  splitWidow : function(screenType){//分屏模式 1，4，9，2,100,101
    try{
      if(playerSDK._getOS() == 1)
        document.getElementById("ActivexQtTerminal").onSplitWindow(screenType);
      else if(playerSDK._getOS() == 2) // Firefox
        document.getElementById("npQtTerminal").onSplitWindow(screenType);
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  // startPlay : function(pos, sessionId){
  //   try{
  //     if(playerSDK._getOS()==1)
  //       document.getElementById("ActivexQtTerminal").onStartPlay(pos, sessionId);
  //     else if(playerSDK._getOS()==2)
  //       document.getElementById("npQtTerminal").onStartPlay(pos, sessionId);
  //   }catch(e){
  //     alert(e.name + ":" + e.message);
  //   }
  // },
  startPlayByRtpId : function(pos, videoRtpId, audioRtpId){
    try{
      console.log("调用插件startPlayByRtpId方法，参数：pos="+pos+",videoRtpId="+videoRtpId+",audioRtpId="+audioRtpId);
      if(playerSDK._getOS()==1)
        document.getElementById("ActivexQtTerminal").onStartPlayByRtpId(pos, videoRtpId, audioRtpId);
      else if(playerSDK._getOS()==2)
        document.getElementById("npQtTerminal").onStartPlayByRtpId(pos, videoRtpId, audioRtpId);
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  switchPlayPosition : function(startPos, endPos){
    try{
      console.log("调用插件onSwitchPlayPosition方法，参数：startPos="+startPos+",endPos="+endPos);
      if(playerSDK._getOS()==1) {
        document.getElementById("ActivexQtTerminal").onSwitchPlayPosition(startPos, endPos);
      } else if(playerSDK._getOS()==2) {
        document.getElementById("npQtTerminal").onSwitchPlayPosition(startPos, endPos);
      }
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  startPlayInPos : function(localVPort, fIPs, fCH, destAPort, pos, devIds, devCh, usrIds, type){
      try{
          if(playerSDK._getOS()==1)
              document.getElementById("ActivexQtTerminal").onStartPlayInPos(localVPort,fIPs,fCH,destAPort,pos,devIds,devCh,usrIds, type ? type : -1);
          else if(playerSDK._getOS()==2){
              document.getElementById("npQtTerminal").onStartPlayInPos(localVPort,fIPs,fCH,destAPort,pos,devIds,devCh,usrIds, type ? type : -1);
          }
      }catch(e){
        console.log(e)
		    //alert(e.name + ":" + e.message);
      }
    },
  // setOSD : function (pos, Caption, Color, Bold, Italic, WidthSize, HeightSize, LeftRate, TopRate){
  //   try{
  //     if(playerSDK._getOS()==1)
  //       document.getElementById("ActivexQtTerminal").onShowOSD(pos,0,Caption,"宋体",Color,Bold,Italic,WidthSize,HeightSize,LeftRate,TopRate);
  //     else if(playerSDK._getOS()==2)
  //       document.getElementById("npQtTerminal").onShowOSD(pos,0,Caption,"宋体",Color,Bold,Italic,WidthSize,HeightSize,LeftRate,TopRate);
  //   }catch(e){
  //     alert(e.name + ":" + e.message);
  //   }
  // },

  // Qualifier: 设置OSD
	// Parameter: int pos osd所在的窗口位置
	// Parameter: int osdIndex osd的id
	// Parameter: QString osdInfo osd的内容
	// Parameter: QString font osd的字体格式
	// Parameter: int nColor osd的颜色（0xBBGGRR）
	// Parameter: int nBold osd是否粗体(0/1)
	// Parameter: int nItalic osd是否斜体
	// Parameter: double dSizew osd字体的宽
	// Parameter: double dSizeh osd字体的高
	// Parameter: double offsetX osd向窗口左右偏移-以窗口的百分比（basePoint=2/4左偏移，basePoint=1/3右偏移）
	// Parameter: double offsetY osd在窗口上下偏移-以窗口的百分比（basePoint=1/2下偏移，basePoint=3/4上偏移）
	// Parameter: int basePoint osd左边原点（1左上，2右上，3左下，4右下）
	// Parameter: int fontSize osd字号，传入的是转换后的像素（fontSize>0有效，否则字体大小根据字体的宽高计算）
  setOSD : function (pos, osdIndex, osdInfo, font, nColor, nBold, nItalic, dSizew, dSizeh, offsetX, offsetY, basePoint, fontSize){
    try{
      console.log("调用插件setOSD方法，参数：pos="+pos+",osdIndex="+osdIndex+",osdInfo="+osdInfo+",font="+font+",nColor="+nColor+",nBold="+nBold+",nItalic="+nItalic
          +",dSizew="+dSizew+",dSizeh="+dSizeh+",offsetX="+offsetX+",offsetY="+offsetY+",basePoint="+basePoint+",fontSize="+fontSize);
      if(playerSDK._getOS()==1)
        document.getElementById("ActivexQtTerminal").onShowOSD(pos, osdIndex, osdInfo, font, parseInt(nColor, 16), nBold, nItalic, dSizew, dSizeh, offsetX, offsetY, basePoint, fontSize);
      else if(playerSDK._getOS()==2)
        document.getElementById("npQtTerminal").onShowOSD(pos, osdIndex, osdInfo, font, parseInt(nColor, 16), nBold, nItalic, dSizew, dSizeh, offsetX, offsetY, basePoint, fontSize);
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  cancelOSD : function (pos){
    try{
      if(playerSDK._getOS()==1)
        document.getElementById("ActivexQtTerminal").onClearOSD(pos);
      else if(playerSDK._getOS()==2)
        document.getElementById("npQtTerminal").onClearOSD(pos);
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  showFullScreen : function(isFull){//区域全屏
    try{
      if(playerSDK._getOS()==1)
        document.getElementById("ActivexQtTerminal").onShowFullScreen(isFull);
      else if(playerSDK._getOS()==2)
        document.getElementById("npQtTerminal").onShowFullScreen(isFull);
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  stopPlay : function(pos){
    try{
      console.log("调用插件stopPlay方法，参数：pos="+pos);
      if(playerSDK._getOS()==1)
        document.getElementById("ActivexQtTerminal").onStopPlay(pos, "");
      else if(playerSDK._getOS()==2)
        document.getElementById("npQtTerminal").onStopPlay(pos, "");
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  stopPlayAll : function(){
    try{
      if(playerSDK._getOS()==1)
        document.getElementById("ActivexQtTerminal").onStopPlayAll();
      else if(playerSDK._getOS()==2)
        document.getElementById("npQtTerminal").onStopPlayAll();
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  setFullScreen:function(pos,type){
    try{
      if(playerSDK._getOS()==1)
        document.getElementById("ActivexQtTerminal").onSetFullScreen(pos,type);
      else if(playerSDK._getOS()==2)
        document.getElementById("npQtTerminal").onSetFullScreen(pos, type);
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  onSetUrl:function(url, userIDs){
    try{
      if(playerSDK._getOS()==1) //IE下的点播方式
        document.getElementById("ActivexQtTerminal").onSetUrl(url, userIDs);
      else if(playerSDK._getOS()==2) //火狐下的点播方式
        document.getElementById("npQtTerminal").onSetUrl(url, userIDs);
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  setVolume:function(pos, vol){//vol:0-off,255-on
    try{
      if(playerSDK._getOS()==1) //IE下的点播方式
        document.getElementById("ActivexQtTerminal").onSetVolume(pos, vol);
      else if(playerSDK._getOS()==2) //火狐下的点播方式
        document.getElementById("npQtTerminal").onSetVolume(pos, vol);
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  setVolumeAll: function(flag){//flag:0-off,1-on
    try{
      if(playerSDK._getOS()==1) //IE下的点播方式
        document.getElementById("ActivexQtTerminal").onSetVolumeAll(flag);
      else if(playerSDK._getOS()==2) //火狐下的点播方式
        document.getElementById("npQtTerminal").onSetVolumeAll(flag);
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  showDownloadRecord:function(){
    try{
      if(playerSDK._getOS()==1)
        document.getElementById("ActivexQtTerminal").onShowDownloadRecord();
      else if(playerSDK._getOS()==2)
        document.getElementById("npQtTerminal").onShowDownloadRecord();
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  startPtz3D:function(){
    //console.log('startPtz3D');
    try{
      if(playerSDK._getOS()==1)
        window.parent.document.getElementById("ActivexQtTerminal").onEnablePtz3D(1);
      else if(playerSDK._getOS()==2)
        window.parent.document.getElementById("npQtTerminal").onEnablePtz3D(1);
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  stopPtz3D:function(){
    //console.log('stopPtz3D');
    try{
      if(playerSDK._getOS()==1)
        window.parent.document.getElementById("ActivexQtTerminal").onEnablePtz3D(0);
      else if(playerSDK._getOS()==2)
        window.parent.document.getElementById("npQtTerminal").onEnablePtz3D(0);
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  pauseDBImageByPos:function(screenIndex){
    try{
      if(playerSDK._getOS() === 1){
        document.getElementById("ActivexQtTerminal").onSuspendPlay(screenIndex);
      }
      else if(playerSDK._getOS() === 2) // Firefox
      {
        document.getElementById("npQtTerminal").onSuspendPlay(screenIndex);
      }
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  resumeDBImageByPos:function(screenIndex){
    try{
      if(playerSDK._getOS() === 1){
        document.getElementById("ActivexQtTerminal").onResumePlay(screenIndex);
      }
      else if(playerSDK._getOS() === 2) // Firefox
      {
        document.getElementById("npQtTerminal").onResumePlay(screenIndex);
      }
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },

  /**
   * 图像抓拍
   * pos:位置
   * fileName:文件名称
   * httpPath:未知
   * */
  takeASnap:function (pos, fileName, httpPath) {
    //console.log("takeASnap")
    try{
      if(playerSDK._getOS()==1)
        window.parent.document.getElementById("ActivexQtTerminal").onCappic(pos,fileName,httpPath);
      else if(playerSDK._getOS()==2)
        window.parent.document.getElementById("npQtTerminal").onCappic(pos,fileName,httpPath);
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },

  /**
   * 
   * @param {*} groupId string
   * @param {*} cmd string
   */
  groupStartCommand:function (groupId, cmd) {
    console.log("GroupStartCommand")
	  if(!playerSDK._mxtc_aready) return;
    try{
      if(playerSDK._getOS()==1)
        document.getElementById("ActivexQtTerminal").onGroupStartCommand(groupId, JSON.stringify(cmd));
      else if(playerSDK._getOS()==2)
        document.getElementById("npQtTerminal").onGroupStartCommand(groupId, JSON.stringify(cmd));
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },

  /**
   * 
   * @param {*} groupId string
   * @param {*} cmd string
   */
  groupRefreshCommand:function (groupId, cmd) {
    console.log("GroupRefreshCommand")
	  if(!playerSDK._mxtc_aready) return;
    try{
      if(playerSDK._getOS()==1)
        document.getElementById("ActivexQtTerminal").onGroupRefreshCommand(groupId, JSON.stringify(cmd));
      else if(playerSDK._getOS()==2)
        document.getElementById("npQtTerminal").onGroupRefreshCommand(groupId, JSON.stringify(cmd));
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message););
    }
  },

  /**
   * 
   * @param {*} groupId string
   */
  groupStopCommand:function (groupId) {
    console.log("GroupStopCommand")
	  if(!playerSDK._mxtc_aready) return;
    try{
      if(playerSDK._getOS()==1)
        document.getElementById("ActivexQtTerminal").onGroupStopCommand(groupId);
      else if(playerSDK._getOS()==2)
        document.getElementById("npQtTerminal").onGroupStopCommand(groupId);
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },

  /**
   * 
   * 演示版本呼叫显示某两个rtpid的视频
   */
  onTwoDisplay:function (rtpID0, rtpID1) {
    console.log("onTwoDisplay")
	  if(!playerSDK._mxtc_aready) return;
    try{
      if(playerSDK._getOS()==1)
        document.getElementById("ActivexQtTerminal").onTwoDisplay(rtpID0, rtpID1);
      else if(playerSDK._getOS()==2)
        document.getElementById("npQtTerminal").onTwoDisplay(rtpID0, rtpID1);
    }catch(e){
      console.log(e)
      //alert(e.name + ":" + e.message);
    }
  },
  //btnKey
  //Nor_StopPlay 停止点播
  //Choose_StopPlay 停止点播选中状态
  //Nor_VolOn 声音开
  //Nor_VolOff 声音关
  //Nor_PTZ 云台
  //Choose_PTZ 云台选中状态
  //Nor_FullScreen 全屏
  //Nor_CancelFull 取消全屏

  //Pic_Capture 抓拍
  //Nor_Record 启动录像
  //Choose_Record
  //Record_Pause 录像暂停
  //Record_Play 暂停后开始
  //Record_Slow 慢速
  //Record_Fast 快速
  //Record_Renew 恢复
  //Record_Frame

  //Pause 播放暂停
  //Play 恢复播放
}
