export const playerSDK5 = {
  _osIndex  : -1,
  _getOS : function (){
    if(playerSDK5._osIndex != -1) return playerSDK5._osIndex;
    if(navigator.userAgent.indexOf("MSIE")>0)
      playerSDK5._osIndex = 1;
    else if(!!window.ActiveXObject || "ActiveXObject" in window)
      playerSDK5._osIndex = 1;
    else if(navigator.userAgent.indexOf("Firefox")>0)
      playerSDK5._osIndex = 2;
    else
      playerSDK5._osIndex = 0;
    return playerSDK5._osIndex;
  },
  //初始化图像显示组件
  initMXTC : function(parentID,width,height){
    console.log('initMXTC');
    var playElement = document.getElementById(parentID);
    // var width  = playElement.clientWidth;
    // var height = playElement.clientHeight;
    var obj = document.createElement("object");
    var distance = 0;
    var splitDistance = 0;
    var joinType = 1;

    if(playerSDK5._getOS() == 1){
      // if(navigator.userAgent.indexOf("MSIE 8.0") == -1){
      obj.setAttribute("id"     ,"ActivexQtTerminal");
      obj.setAttribute("CLASSID","clsid:71D2FC55-6C66-4A23-A546-B3F9244EC3C5");
      obj.setAttribute("style"  ,"width:100%; height:100%;z-index:0;border:0px;");
      playElement.appendChild(obj);
      // }

      if( document.attachEvent ){
        // console.log('attachEvent');
        var ActivexQtTerminal = document.getElementById("ActivexQtTerminal");
        console.dir(ActivexQtTerminal);
        ActivexQtTerminal.onAttachEvent("onPlayResult", onPlayResult);
        ActivexQtTerminal.onAttachEvent("onWindowMessage", onWindowMessage);
        var param = document.createElement("param");
        param.name = "wmode";
        param.value = "transparent";
        obj.appendChild(param);
        ActivexQtTerminal.onInitPlugin(parseInt(width),parseInt(height),parseInt(distance));
        ActivexQtTerminal.onChangeSize(width, height);
        playerSDK5.splitWidow(4);
      }
      if( document.addEventListener ){
        // console.log('addEventListener');
        var ActivexQtTerminal = document.getElementById("ActivexQtTerminal");
        console.dir(ActivexQtTerminal);
        ActivexQtTerminal.addEventListener("onPlayResult", onPlayResult);
        ActivexQtTerminal.addEventListener("onWindowMessage", onWindowMessage);
        var param = document.createElement("param");
        param.name = "wmode";
        param.value = "transparent";
        obj.appendChild(param);
        ActivexQtTerminal.onInitPlugin(parseInt(width),parseInt(height),parseInt(distance));
        ActivexQtTerminal.onChangeSize(width, height);
        playerSDK5.splitWidow(4);
      }
    }else if(playerSDK5._getOS() == 2){
      obj.setAttribute("id"   , "npQtTerminal");
      obj.setAttribute("type" , "npQtTerminal/very");
      obj.setAttribute("style", "width:100%; height:100%; border-style:solid;border:0px;z-Index:-1;");
      playElement.appendChild(obj);

      var npQtTerminal = document.getElementById("npQtTerminal");
      console.log(npQtTerminal);
      if( npQtTerminal.onAttachEvent ){
        npQtTerminal.onAttachEvent("onPlayResult");
        npQtTerminal.onAttachEvent("onWindowMessage");
        npQtTerminal.onAttachEvent("onSessionEvent");
        npQtTerminal.onAttachEvent("onBtnEvent");
        npQtTerminal.onAttachEvent("onPlaybackEvent");
        npQtTerminal.onAttachEvent("onPtz3DMessage");
        npQtTerminal.onAttachEvent("onWgtSelected");
        npQtTerminal.onInitPlugin(parseInt(width), parseInt(height), parseInt(splitDistance),parseInt(joinType));
        // npQtTerminal.onChangeSize(width,height);
        playerSDK5.splitWidow(4);
        console.log("playerSDK5.initBtn() start ")

        setTimeout(() => {
          playerSDK5.initBtn()
        }, 3*1000);
        //playerSDK5.initBtn();
        
        console.log("playerSDK5.initBtn() end ")
      }else{
        setTimeout(function(){
          npQtTerminal.onAttachEvent("onPlayResult");
          npQtTerminal.onAttachEvent("onWindowMessage");
          npQtTerminal.onAttachEvent("onSessionEvent");
          npQtTerminal.onAttachEvent("onBtnEvent");
          npQtTerminal.onAttachEvent("onPlaybackEvent");
          npQtTerminal.onAttachEvent("onPtz3DMessage");
          npQtTerminal.onAttachEvent("onWgtSelected");
          npQtTerminal.onInitPlugin(parseInt(width), parseInt(height), parseInt(splitDistance),parseInt(joinType));
          // npQtTerminal.onChangeSize(width,height);
          playerSDK5.splitWidow(4);
        },1000);
      }
    }
    else{
      alert("您的浏览器不支持当前插件...");
      /*console.log(businessSDK);
            businessSDK.pluginUnavailableContent = "当前浏览器不支持当前插件，请使用FireFox 45-51...";
            console.log(businessSDK.pluginUnavailableContent);
            businessSDK._receivePluginUnavailableCommandWindowCB(businessSDK.pluginUnavailableContent);*/
    }
  },
  unInitMxtc:function(){
    // try{
    //   if(playerSDK5._getOS() == 1)
    //     document.getElementById("ActivexQtTerminal").unInit();
    //   else if(playerSDK5._getOS() == 2) // Firefox
    //     document.getElementById("npQtTerminal").unInit();
    // }catch(e){
    //   alert(e.name + ":" + e.message);
    // }
  },
  initBtn: function(){
    npQtTerminal.onInitButton(0,1,"Nor_StopPlay");
    npQtTerminal.onInitButton(1,1,"Nor_Record");
    npQtTerminal.onInitButton(2,1,"Pause");
    npQtTerminal.onInitButton(3,1,"Record_Pause");
    npQtTerminal.onInitButton(4,1,"Record_Slow");
    npQtTerminal.onInitButton(5,1,"Record_Fast");
    npQtTerminal.onInitButton(6,1,"Record_Frame");
    npQtTerminal.onInitButton(7,1,"Record_Renew");
    npQtTerminal.onInitButton(8,1,"Nor_VolOn");
    npQtTerminal.onInitButton(9,1,"Slider_Vol");
    
    npQtTerminal.onInitButton(0,0,"Video_Quality");
    npQtTerminal.onInitButton(1,0,"Nor_PTZ");
    npQtTerminal.onInitButton(2,0,"Nor_FullScreen");
    npQtTerminal.onInitButton(3,0,"Pic_Capture");
  },
  addButton : function(pos, isLeft, btnKey){//isLeft 按钮在窗口的左部还是右部 1->左 0->右
    try{
      if(playerSDK5._getOS() == 1)
        document.getElementById("ActivexQtTerminal").onInitButton(pos, isLeft, btnKey);
      else if(playerSDK5._getOS() == 2) // Firefox
        document.getElementById("npQtTerminal").onInitButton(pos, isLeft, btnKey);
    }catch(e){
      alert(e.name + ":" + e.message);
    }
  },
  splitWidow : function(screenType){
    try{
      if(playerSDK5._getOS() == 1)
        document.getElementById("ActivexQtTerminal").onSplitWindow(screenType);
      else if(playerSDK5._getOS() == 2) // Firefox
        document.getElementById("npQtTerminal").onSplitWindow(screenType);
    }catch(e){
      console.log(e.name + ":" + e.message);
    }
  },
  startPlay : function(localVPort, fIPs, fCH, destAPort, devIds, devCh, usrIds, type){
    try{
      if(playerSDK5._getOS()==1)
        document.getElementById("ActivexQtTerminal").onStartPlay(localVPort,fIPs,fCH,destAPort,devIds,devCh,usrIds, type ? type : -1);
      else if(playerSDK5._getOS()==2)
        document.getElementById("npQtTerminal").onStartPlay(localVPort,fIPs,fCH,destAPort,devIds,devCh,usrIds, type ? type : -1);
    }catch(e){
      console.log(e.name + ":" + e.message);
    }
  },
  startPlayInPos : function(localVPort, fIPs, fCH, destAPort, pos, devIds, devCh, usrIds, type){
    try{
      if(playerSDK5._getOS()==1)
        document.getElementById("ActivexQtTerminal").onStartPlayInPos(localVPort,fIPs,fCH,destAPort,pos,devIds,devCh,usrIds, type ? type : -1);
      else if(playerSDK5._getOS()==2){
        document.getElementById("npQtTerminal").onStartPlayInPos(localVPort,fIPs,fCH,destAPort,pos,1,devIds,devCh,usrIds, type ? type : -1);
      }
    }catch(e){
      console.log(e.name + ":" + e.message);
    }
  },
  startPlaybackTime : function(pos, startTime, endTime){
    try{
      if(playerSDK5._getOS()==1)
        document.getElementById("ActivexQtTerminal").onPlaybackTime(pos, startTime, endTime);
      else if(playerSDK5._getOS()==2){
        document.getElementById("npQtTerminal").onPlaybackTime(pos, startTime, endTime);
      }
    }catch(e){
      console.log(e.name + ":" + e.message);
    }
  },
  setOSD : function (pos, index, Caption, Color, Bold, Italic, WidthSize, HeightSize, LeftRate, TopRate){
    try{
      if(playerSDK5._getOS()==1)
        document.getElementById("ActivexQtTerminal").onShowOSD(pos,index,Caption,"宋体",Color,Bold,Italic,WidthSize,HeightSize,LeftRate,TopRate);
      else if(playerSDK5._getOS()==2)
        document.getElementById("npQtTerminal").onShowOSD(pos,index,Caption,"宋体",Color,Bold,Italic,WidthSize,HeightSize,LeftRate,TopRate);
    }catch(e){
      console.log(e.name + ":" + e.message);
    }
  },
  cancelOSD : function (pos, osdIndex){
    try{
      if(playerSDK5._getOS()==1)
        document.getElementById("ActivexQtTerminal").onCancelOSD(pos,osdIndex);
      else if(playerSDK5._getOS()==2)
        document.getElementById("npQtTerminal").onCancelOSD(pos,osdIndex);
    }catch(e){
      console.log(e.name + ":" + e.message);
    }
  },
  showFullScreen : function(isFull){
    try{
      if(playerSDK5._getOS()==1)
        document.getElementById("ActivexQtTerminal").onShowFullScreen(isFull);
      else if(playerSDK5._getOS()==2)
        document.getElementById("npQtTerminal").onShowFullScreen(isFull);
    }catch(e){
      console.log(e.name + ":" + e.message);
    }
  },
  stopPlay : function(playIndex){
    try{
      if(playerSDK5._getOS()==1)
        document.getElementById("ActivexQtTerminal").onStopPlayInPos(playIndex);
      else if(playerSDK5._getOS()==2)
        document.getElementById("npQtTerminal").onStopPlayInPos(playIndex);
    }catch(e){
      console.log(e.name + ":" + e.message);
    }
  },
  changeButton:function(screenIndex, isLeft, btnPos, btnKey){
    try{
      if(playerSDK5._getOS() === 1)
        document.getElementById("ActivexQtTerminal").onBtnChanged(screenIndex, isLeft, btnPos, btnKey);
      else if(playerSDK5._getOS() === 2) // Firefox
        document.getElementById("npQtTerminal").onBtnChanged(screenIndex, isLeft, btnPos, btnKey);
    }catch(e){
      alert(e.name + ":" + e.message);
    }
  },
  stopPlayAll : function(){
    try{
      if(playerSDK5._getOS()==1)
        document.getElementById("ActivexQtTerminal").onStopPlayAll();
      else if(playerSDK5._getOS()==2)
        document.getElementById("npQtTerminal").onStopPlayAll();
    }catch(e){
      console.log(e.name + ":" + e.message);
    }
  },
  fullScreen : function(pos){ //全屏
    try{
      if(playerSDK5._getOS()==1)
        document.getElementById("ActivexQtTerminal").onSetFullScreen(pos,1);
      else if(playerSDK5._getOS()==2)
        document.getElementById("npQtTerminal").onSetFullScreen(pos,1);
    }catch(e){
      console.log(e.name + ":" + e.message);
    }
  },
  setFullScreen:function(pos,type){
    try{
      if(playerSDK5._getOS()==1)
        document.getElementById("ActivexQtTerminal").onSetFullScreen(pos,type);
      else if(playerSDK5._getOS()==2)
        document.getElementById("npQtTerminal").onSetFullScreen(pos, type);
    }catch(e){
      console.log(e.name + ":" + e.message);
    }
  },
  onSetUrl:function(url, userIDs){
    try{
      if(playerSDK5._getOS()==1) //IE下的点播方式
        document.getElementById("ActivexQtTerminal").onSetUrl(url, userIDs);
      else if(playerSDK5._getOS()==2) //火狐下的点播方式
        document.getElementById("npQtTerminal").onSetUrl(url, userIDs);
    }catch(e){
      console.log(e.name + ":" + e.message);
    }
  },
  setVolume:function(pos, vol){
    try{
      if(playerSDK5._getOS()==1) //IE下的点播方式
        document.getElementById("ActivexQtTerminal").onSetVolume(pos, vol);
      else if(playerSDK5._getOS()==2) //火狐下的点播方式
        document.getElementById("npQtTerminal").onSetVolume(pos, vol);
    }catch(e){
      console.log(e.name + ":" + e.message);
    }
  },
  setVolumeAll: function(flag){
    try{
      if(playerSDK5._getOS()==1) //IE下的点播方式
        document.getElementById("ActivexQtTerminal").onSetVolumeAll(flag);
      else if(playerSDK5._getOS()==2) //火狐下的点播方式
        document.getElementById("npQtTerminal").onSetVolumeAll(flag);
    }catch(e){
      console.log(e.name + ":" + e.message);
    }
  },
  showDownloadRecord:function(){
    try{
      if(playerSDK5._getOS()==1)
        document.getElementById("ActivexQtTerminal").onShowDownloadRecord();
      else if(playerSDK5._getOS()==2)
        document.getElementById("npQtTerminal").onShowDownloadRecord();
    }catch(e){
      console.log(e.name + ":" + e.message);
    }
  },
  startDownloadRecord:function(format){
    // Parameter: QString format 下载录像的格式:"name=张三;url=ftp:\\a&&ftp:\\b;filesize=30;startTime=0;EndTime=-1"
    try{
      if(playerSDK5._getOS()==1)
        document.getElementById("ActivexQtTerminal").onStartDownloadRecord(format);
      else if(playerSDK5._getOS()==2)
        document.getElementById("npQtTerminal").onStartDownloadRecord(format);
    }catch(e){
      console.log(e.name + ":" + e.message);
    }
  },
  startPtz3D:function(){
    console.log('startPtz3D');
    try{
      if(playerSDK5._getOS()==1)
        window.parent.document.getElementById("ActivexQtTerminal").onEnablePtz3D(1);
      else if(playerSDK5._getOS()==2)
        window.parent.document.getElementById("npQtTerminal").onEnablePtz3D(1);
    }catch(e){
      console.log(e.name + ":" + e.message);
    }
  },
  stopPtz3D:function(){
    console.log('stopPtz3D');
    try{
      if(playerSDK5._getOS()==1)
        window.parent.document.getElementById("ActivexQtTerminal").onEnablePtz3D(0);
      else if(playerSDK5._getOS()==2)
        window.parent.document.getElementById("npQtTerminal").onEnablePtz3D(0);
    }catch(e){
      console.log(e.name + ":" + e.message);
    }
  },

  pauseDBImageByPos:function(screenIndex){
    try{
      if(playerSDK5._getOS() === 1){
        document.getElementById("ActivexQtTerminal").onSuspendPlay(screenIndex);
      }
      else if(playerSDK5._getOS() === 2) // Firefox
      {
        document.getElementById("npQtTerminal").onSuspendPlay(screenIndex);
      }
    }catch(e){
      alert(e.name + ":" + e.message);
    }
  },

  resumeDBImageByPos:function(screenIndex){
    try{
      if(playerSDK5._getOS() === 1){
        document.getElementById("ActivexQtTerminal").onResumePlay(screenIndex);
      }
      else if(playerSDK5._getOS() === 2) // Firefox
      {
        document.getElementById("npQtTerminal").onResumePlay(screenIndex);
      }
    }catch(e){
      alert(e.name + ":" + e.message);
    }
  },

  /**
   * 图像抓拍
   * pos:位置
   * fileName:文件名称
   * httpPath:未知
   * */
  takeASnap:function (pos, fileName, httpPath) {
    console.log("takeASnap")
    try{
      if(playerSDK5._getOS()==1) {
        window.parent.document.getElementById("ActivexQtTerminal").onCappic(pos,fileName,httpPath);
      }
      else if(playerSDK5._getOS()==2){
        window.parent.document.getElementById("npQtTerminal").onCappic(pos,fileName,httpPath);
      }
    }catch(e){
      console.log(e.name + ":" + e.message);
    }
  }
}
