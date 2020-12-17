/*订阅类型*/
export var enumResSubscribeType = {
  ALL: 0,
  KEY: 1,
  RES_STATUS: 2,
};

export var enumUserStatus = {
  OFF_LINE: 0, //离线
  ONLINE: 1, //在线
  BUSY: 2 //忙碌
};

export var enumMediaType = {
  VIDEO_AND_VOICE: 0, //音视频
  ONLY_VOICE: 1 //纯音频
};

export var enumResType = {
  DEVICE: 0, //设备
  PERSON: 1 //人员
};
/*分屏类型*/
export var enumScreenSplitType = {
  SPLIT_TYPE_ONE: 1, // 1 分屏
  SPLIT_TYPE_FOUR: 4, // 4 分屏
  SPLIT_TYPE_NINE: 9, // 9 分屏
  SPLIT_TYPE_SIXTEEN: 16, // 16 分屏
  SPLIT_TYPE_TWENTFIVE: 25, // 25 分屏
  SPLIT_TYPE_THIRTYSIX: 36, // 36 分屏
  SPLIT_TYPE_ONE_PLUS_FIVE: 6, // 1+5 分屏
  SPLIT_TYPE_ONE_PLUS_SEVEN: 8, // 1+7 分屏
  SPLIT_TYPE_ONE_PLUS_NINE: 10, // 1+9 分屏
  SPLIT_TYPE_ONE_PLUS_ELEVEN: 12 // 1+11 分屏
};

export var enumYTOperate = {
  CLOSE: 0, //关闭
  OPEN: 1, //打开
  AUTO: 2 //自动
};

export var enumBusinessType = {
  MEETING: 0, //视频会议
  VOICE_BROADCAST: 1, //语音广播
  CALL_GROUP: 2 //分组呼叫
};

export var enumBusinessStatus = {
  NOT_START: 0, //未开始
  IN_PROCESS: 1, //进行中
  IS_OVER: 2, //已结束
};

export var businessSDK5 = {
  /*回调函数**************************************************************************************/
  _receiveMessageCB: null,
  _receiveRemindCB: null,
  _receivePersonStatusCB: null,
  _receiveDeviceStatusCB: null,
  _receiveMediaStatusByLocalCB: null,
  _receiveMediaStatusByRemoteCB: null,
  _receiveDBImageGroupStatusCB: null,

  _receiveBusinessStatusCB: null,
  _receiveTransmitListCB: null,
  _receiveYTStatusCB: null,
  _receiveNotifyStatusCB: null,
  _receiveMeetingMembersCB: null,
  _receiveAffairListCB: null,
  _receiveMeetingAffairInfoCB: null,
  _receiveCommandAffairInfoCB: null,
  _receiveSendBusinessListCB: null,
  _receiveJoinBusinessListCB: null,

  _receivePersonNodeCB: null,
  _receivePersonNode_recordPlanCB: null,
  _receiveQueryPersonNodeCB: null,
  _receiveQueryPersonNode_recordPlanCB: null,
  _receiveDeviceNodeCB: null,
  _receiveDeviceNode_recordPlanCB: null,
  _receiveQueryDeviceNodeCB: null,
  _receiveQueryDeviceNode_recordPlanCB: null,
  _receiveCommonStatusCB: null,
  _receiveCommonStatus_recordPlanCB: null,

  _receiveFileListStatusCB: null,
  _receiveRepeatLoginErrorCodeCB: null,
  _receiveLeaveCodeCB: null,

  _receiveInformSetVolumeCB             : null,

  // _receiveinformYTStatusCB:null,

  /** WK ************************************************************************************ */
  _receiveRecordingStatusCallback: null,
  _receiveSchemeStatusCallback: null,
  _receivePlaybackStatusCallback: null,

  _receiveOrganizationCB: null,
  _receiveUserStatusCB: null,
 // _receiveDeviceStatusCB: null,
  _receiveUserStatusQueryCB: null,
  _receiveDeviceStatusQueryCB: null,
  _receiveUploadStatusCB: null,

  _receiveSplitScreenStatusCallback: null,

  //_receiveTransmitListCB: null,
  _receiveTransmitInfoCB: null,

  _receiveMatrixStatusCB: null,
  _receiveScreenStatusCB: null,
  _receiveGroupCallStatusCB: null,

  /** 视频会议模块相关回调 **************************************************************************************/
  _receiveInformMeetingStatusCB: null,
  _receiveInformMeetingStatusCB2: null, // for stop meeting only
  _receiveInformMeetingStatusCB3: null, // for meeting scheme only
  _receiveInformMeetingStatusCB4: null,
  // _receiveInformshowWindowCB: null,
  _receiveInformRingStatusCB: null,
  _receiveMeetingTransmitAuthCB:null,
  _receiveMeetingTransmitMemberCB:null,

  /** 视频指挥模块相关回调 **************************************************************************************/
  _receiveInformCommandStatusCB: null,
  _receiveCommandTransmitAuthCB:null,
  _receiveCommandTransmitMemberCB:null,

  _receiveInformMatrixGroupStatusCb:null,
  /*******************************即时消息********************************************************* */
  _receiveIMMessageCB: null,
  _receiveRemoveIMGroupCB:null,
  _receiveRefreshIMGroupCB:null,

  /*公共接口**************************************************************************************/
  //初始化接口
  _socketURL: null,
  _wsclient: null,
  _userID: null,
  _userName: null,
  _token: null,
  _receiveInitCb: null,
  _failureCount: 0,
  _isExit: false,
  _hasReconnected: false,
  _hasSendedReconnect: false,

  _receiveReconnectCommandWindowCB: null,
  /*_receiveNoSocketCommandWindowCB:null,
  noSocketContent:null,*/
  /*_receivePluginUnavailableCommandWindowCB:null,
  pluginUnavailableContent:null,*/

  _receiveInformTempRecordStatusCB: null,
  _receiveInformPlayRecordCB: null,
  _receivePTZStatusCB: null,
  _receiveInformRecordSchemeCB:null,

  reconnect: function () {
    if (!businessSDK5._hasReconnected) {
      if(businessSDK5._isEmpty(businessSDK5._receiveReconnectCommandWindowCB) == false){
        var resp={}
        resp.state=-1
        for(var key in businessSDK5._receiveReconnectCommandWindowCB){
          businessSDK5._receiveReconnectCommandWindowCB[key](resp);
        }
      }
    }
    businessSDK5._hasReconnected = true;

    setTimeout(function () {
      businessSDK5.init(businessSDK5._socketURL,businessSDK5._token,businessSDK5._receiveInitCb);

      console.log('正在重连，当前时间' + new Date());
    }, 3000)
  },
  heartCheck: {
    timeout: 15000,
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function () {
      // console.log('heartCheck.reset');
      clearTimeout(this.timeoutObj);
      clearTimeout(this.serverTimeoutObj);
      this.start();
    },
    start: function () {
      // console.log('heartCheck.start');
      var self = this;
      this.timeoutObj = setTimeout(function () {
        if(businessSDK5._wsclient == null) return;
        if (businessSDK5._wsclient.readyState == WebSocket.OPEN) {
          businessSDK5._wsclient.send(JSON.stringify({
            "code": 10015
          }));
          console.log('heartbeat ' + new Date());
          self.serverTimeoutObj = setTimeout(function () {
            // console.log(businessSDK5._wsclient.close);
            businessSDK5._wsclient.close();
          }, self.timeout)
        }
      }, this.timeout)
    },
  },

  init: function (wssURL,token,cb) {
	businessSDK5._socketURL = wssURL;
	businessSDK5._token = token;

    if ("WebSocket" in window) {
      businessSDK5._wsclient = new WebSocket(businessSDK5._socketURL);
    } else if ("MozWebSocket" in window) {
      businessSDK5._wsclient = new MozWebSocket(businessSDK5._socketURL);
    } else {
      alert("您的浏览器不支持WebSocket...");
      /*businessSDK5.noSocketContent = "当前浏览器不支持WebSocket，请使用FireFox 45-51...";
      businessSDK5._receiveNoSocketCommandWindowCB(businessSDK5.noSocketContent);*/
    }
    businessSDK5._wsclient.onopen = businessSDK5._onOpen;
    businessSDK5._wsclient.onmessage = businessSDK5._onMessage;
    businessSDK5._wsclient.onclose = businessSDK5._onClose;
	businessSDK5._wsclient.onerror = businessSDK5._onError;

	if(businessSDK5._isEmpty(cb) == false){
		businessSDK5._receiveInitCb = cb;
	}
  },
  //客户端建立连接接口
  join: function (userID, userName) {
	businessSDK5._userID = userID;
	businessSDK5._userName = userName;
    if(businessSDK5._wsclient == null) return;
	var data = {
        "code": 10000,
        "userID": businessSDK5._userID,
        "userName": businessSDK5._userName
      };
      businessSDK5._wsclient.send(JSON.stringify(data));


        //连接
        var data2 = {
          "code": 10086,
          "userId": businessSDK5._userID,
          "funName": "join",
          "params": {
            "token": this._token
          }
        };
        businessSDK5._wsclient.send(JSON.stringify(data2));

  },

  setReceiveReconnectCommandWindowCallback: function (id, cb) {
    if (businessSDK5._receiveReconnectCommandWindowCB == undefined)
      businessSDK5._receiveReconnectCommandWindowCB = {};
    if (businessSDK5._isEmpty(cb) == false) {
        businessSDK5._receiveReconnectCommandWindowCB[id] = cb;
    }
  },

  /*setReceiveNoSocketCommandWindowCallback : function(cb){
  	console.log('setReceiveNoSocketCommandWindowCallback');
  	if(cb != null && typeof(cb) != "undefined"){
  		businessSDK5._receiveNoSocketCommandWindowCB = cb;
  	}
  },*/

  /*setReceivePluginUnavailableCommandWindowCallback : function(cb){
  	console.log('setReceivePluginUnavailableCommandWindowCallback');
  	if(cb != null && typeof(cb) != "undefined"){
  		businessSDK5._receivePluginUnavailableCommandWindowCB = cb;
  	}
  },*/

  _isEmpty: function (obj) {
    if (typeof (obj) == "undefined" || obj == null)
      return true;
    else
      return false;
  },
  _onMessage: function (event) {
    // console.log("message...");
    businessSDK5.heartCheck.reset();

    // console.log(event);
    var data = JSON.parse(event.data);
    // console.log(data);
    switch (data.uri) {
      case 1 << 8 | 220: // ping message
      case 2 << 8 | 220: // pong message
        businessSDK5._wsclient.send(JSON.stringify({
          "code": 10016
        }));
        break;
      case 3 << 8 | 220: // system message
        break;
      case 4 << 8 | 220: // error message
        break;
      case 6 << 8 | 220: // broadcast message
        if (data.body) {
          var vData = null;
          var funName = null;
          var params = null;
          if (typeof (JSON.parse(data.body)) == "object") {
            vData = JSON.parse(data.body);
            funName = vData.funName;
            params = vData.params;
          } else {
            vData = JSON.parse(JSON.parse(data.body));
            funName = vData.funName;
            params = vData.params;
          }
          //console.log(funName + '：' + new Date());
          console.log("receive----------" + funName);
          console.log(JSON.stringify(params));
          // if(funName == "informMessage"){
          if (funName == "informshowWindow") {
            if (businessSDK5._isEmpty(businessSDK5._receiveMessageCB) == false)
              businessSDK5._receiveMessageCB(params);
            // } else if(funName == "informRemind") {
          } else if (funName == "informsubscribeShowRemind") {
            if (businessSDK5._isEmpty(businessSDK5._receiveRemindCB) == false)
              businessSDK5._receiveRemindCB(params);
          } else if (funName == "informFileStatus") {
            if (businessSDK5._isEmpty(businessSDK5._receiveFileListStatusCB) == false)
              businessSDK5._receiveFileListStatusCB(params);
          } else if (funName == "informPersonStatus") {
            if (businessSDK5._isEmpty(businessSDK5._receivePersonStatusCB) == false)
              businessSDK5._receivePersonStatusCB(params);
          } else if (funName == "informDeviceStatus") {
            if (businessSDK5._isEmpty(businessSDK5._receiveDeviceStatusCB) == false)
              businessSDK5._receiveDeviceStatusCB(params);
          } //else if(funName == "informCommonStatus") {
          else if (funName == "pushCommonStatus") {
			      if (businessSDK5._isEmpty(businessSDK5._receiveCommonStatusCB) == false)
              //businessSDK5._receiveCommonStatusCB(params);

              for(var key in businessSDK5._receiveCommonStatusCB){
                businessSDK5._receiveCommonStatusCB[key](params);
              }
          } else if (funName == "informMediaStatusByLocal") {
            if (businessSDK5._isEmpty(businessSDK5._receiveMediaStatusByLocalCB) == false)
              businessSDK5._receiveMediaStatusByLocalCB(params);
            if(businessSDK5._isEmpty(businessSDK5._receiveMediaStatusByLocalCBForStopPlay) == false)
              businessSDK5._receiveMediaStatusByLocalCBForStopPlay(params)

            if(businessSDK5._isEmpty(businessSDK5._receiveMediaStatusByLocalCBForSplitScreen) == false)
              businessSDK5._receiveMediaStatusByLocalCBForSplitScreen(params)

            if(businessSDK5._isEmpty(businessSDK5._receiveMediaStatusByLocalCBForOSD) == false)
              businessSDK5._receiveMediaStatusByLocalCBForOSD(params)

            if(businessSDK5._isEmpty(businessSDK5._receiveMediaStatusByLocalCBForFullScreen) == false)
              businessSDK5._receiveMediaStatusByLocalCBForFullScreen(params)


            if(businessSDK5._isEmpty(businessSDK5._receiveInformSetVolumeCB) == false)
              businessSDK5._receiveInformSetVolumeCB(params)

          } else if (funName == "informMediaStatusByRemote") {
            if (businessSDK5._isEmpty(businessSDK5._receiveMediaStatusByRemoteCB) == false)
              businessSDK5._receiveMediaStatusByRemoteCB(params);
          } else if (funName == "informDBImageGroupStatus") {
            if (businessSDK5._isEmpty(businessSDK5._receiveDBImageGroupStatusCB) == false)
              businessSDK5._receiveDBImageGroupStatusCB(params);
          } else if (funName == "informBusinessStatus") {
            if (businessSDK5._isEmpty(businessSDK5._receiveBusinessStatusCB) == false)
              businessSDK5._receiveBusinessStatusCB(params);
          } else if (funName == "informTransmit") {
            if (businessSDK5._isEmpty(businessSDK5._receiveTransmitListCB) == false)
              businessSDK5._receiveTransmitListCB(params);
          } else if (funName == "informYTStatus") {
            if (businessSDK5._isEmpty(businessSDK5._receiveYTStatusCB) == false)
              businessSDK5._receiveYTStatusCB(params);
          } else if (funName == "informNotifyStatus") {
            if (businessSDK5._isEmpty(businessSDK5._receiveNotifyStatusCB) == false)
              businessSDK5._receiveNotifyStatusCB(params);
          } else if (funName == "informMeetingMembers") {
            if (businessSDK5._isEmpty(businessSDK5._receiveMeetingMembersCB) == false)
              businessSDK5._receiveMeetingMembersCB(params);
          } else if (funName == "informAffairs") {
            if (businessSDK5._isEmpty(businessSDK5._receiveAffairListCB) == false)
              businessSDK5._receiveAffairListCB(params);
          } else if (funName == "informAffairDetail") {
            if (businessSDK5._isEmpty(businessSDK5._receiveMeetingAffairInfoCB) == false)
              businessSDK5._receiveMeetingAffairInfoCB(params);
            if (businessSDK5._isEmpty(businessSDK5._receiveCommandAffairInfoCB) == false)
              businessSDK5._receiveCommandAffairInfoCB(params);
          } else if (funName == "informSendBusinessList") {
            if (businessSDK5._isEmpty(businessSDK5._receiveSendBusinessListCB) == false)
              businessSDK5._receiveSendBusinessListCB(params);
          } else if (funName == "informJoinBusinessList") {
            if (businessSDK5._isEmpty(businessSDK5._receiveJoinBusinessListCB) == false)
              businessSDK5._receiveJoinBusinessListCB(params);
          } else if (funName == "informUser") {
            if(businessSDK5._isEmpty(businessSDK5._receivePersonNodeCB) == false)
              //businessSDK5._receivePersonNodeCB(params);

              for(var key in businessSDK5._receivePersonNodeCB){
                businessSDK5._receivePersonNodeCB[key](params);
              }

            // if( params.subId.toLowerCase().indexOf('main') > -1 ){
            // 	if(businessSDK5._isEmpty(businessSDK5._receivePersonNodeCB) == false){
            // 		businessSDK5._receivePersonNodeCB(params);
            // 	}
            // }else if( params.subId.toLowerCase().indexOf('record') > -1 ){
            // 	if(businessSDK5._isEmpty(businessSDK5._receivePersonNode_recordPlanCB) == false){
            // 		businessSDK5._receivePersonNode_recordPlanCB(params);
            // 	}
            // }
          } else if (funName == "informUserQuery") {
            if(businessSDK5._isEmpty(businessSDK5._receiveQueryPersonNodeCB) == false)
              //businessSDK5._receiveQueryPersonNodeCB(params);

              for(var key in businessSDK5._receiveQueryPersonNodeCB){
                businessSDK5._receiveQueryPersonNodeCB[key](params);
              }

            // if (params.subId.toLowerCase().indexOf('main') > -1) {
            //   if (businessSDK5._isEmpty(businessSDK5._receiveQueryPersonNodeCB) == false) {
            //     businessSDK5._receiveQueryPersonNodeCB(params);
            //   }
            // } else if (params.subId.toLowerCase().indexOf('record') > -1) {
            //   if (businessSDK5._isEmpty(businessSDK5._receiveQueryPersonNode_recordPlanCB) == false) {
            //     businessSDK5._receiveQueryPersonNode_recordPlanCB(params);
            //   }
            // }
          } else if (funName == "informDevice") {
            if(businessSDK5._isEmpty(businessSDK5._receiveDeviceNodeCB) == false)
              //businessSDK5._receiveDeviceNodeCB(params);

              for(var key in businessSDK5._receiveDeviceNodeCB){
                businessSDK5._receiveDeviceNodeCB[key](params);
              }

            // if( params.subId.toLowerCase().indexOf('main') > -1 ){
            // 	if(businessSDK5._isEmpty(businessSDK5._receiveDeviceNodeCB) == false){
            // 		businessSDK5._receiveDeviceNodeCB(params);
            // 	}
            // }else if( params.subId.toLowerCase().indexOf('record') > -1 ){
            // 	if(businessSDK5._isEmpty(businessSDK5._receiveDeviceNode_recordPlanCB) == false){
            // 		businessSDK5._receiveDeviceNode_recordPlanCB(params);
            // 	}
            // }
          } else if (funName == "informDeviceQuery") {
            if(businessSDK5._isEmpty(businessSDK5._receiveQueryDeviceNodeCB) == false)
              //businessSDK5._receiveQueryDeviceNodeCB(params);

              for(var key in businessSDK5._receiveQueryDeviceNodeCB){
                businessSDK5._receiveQueryDeviceNodeCB[key](params);
              }

            // if (params.subId.toLowerCase().indexOf('main') > -1) {
            //   if (businessSDK5._isEmpty(businessSDK5._receiveQueryDeviceNodeCB) == false) {
            //     businessSDK5._receiveQueryDeviceNodeCB(params);
            //   }
            // } else if (params.subId.toLowerCase().indexOf('record') > -1) {
            //   if (businessSDK5._isEmpty(businessSDK5._receiveQueryDeviceNode_recordPlanCB) == false) {
            //     businessSDK5._receiveQueryDeviceNode_recordPlanCB(params);
            //   }
            // }
          } else if (funName == "errorCode") {
            businessSDK5._isExit = true;
            if (businessSDK5._isEmpty(businessSDK5._receiveRepeatLoginErrorCodeCB) == false)
              businessSDK5._receiveRepeatLoginErrorCodeCB(params);
          } else if (funName == "leave") {
            businessSDK5._isExit = true;
            if (businessSDK5._isEmpty(businessSDK5._receiveLeaveCodeCB) == false)
              businessSDK5._receiveLeaveCodeCB(params);
          } else if (funName == "informTempRecordStatus") {
            if (businessSDK5._isEmpty(businessSDK5._receiveInformTempRecordStatusCB) == false)
              businessSDK5._receiveInformTempRecordStatusCB(params);
          } else if (funName == "informPlayRecord") {
            if (businessSDK5._isEmpty(businessSDK5._receiveInformPlayRecordCB) == false)
              businessSDK5._receiveInformPlayRecordCB(params);
          } else if (funName == "informRecordScheme") {
            if (businessSDK5._isEmpty(businessSDK5._receiveInformRecordSchemeCB) == false)
              businessSDK5._receiveInformRecordSchemeCB(params);
          } else if (funName == "informMeetingStatus") {
            if (businessSDK5._isEmpty(businessSDK5._receiveInformMeetingStatusCB) == false)
              businessSDK5._receiveInformMeetingStatusCB(params);
            if (businessSDK5._isEmpty(businessSDK5._receiveInformMeetingStatusCB2) == false)
              businessSDK5._receiveInformMeetingStatusCB2(params);
            if (businessSDK5._isEmpty(businessSDK5._receiveInformMeetingStatusCB3) == false)
              businessSDK5._receiveInformMeetingStatusCB3(params);
            if (businessSDK5._isEmpty(businessSDK5._receiveInformMeetingStatusCB4) == false)
              businessSDK5._receiveInformMeetingStatusCB4(params);
          } else if (funName == "informCommandStatus") {
            if (businessSDK5._isEmpty(businessSDK5._receiveInformCommandStatusCB) == false){
              businessSDK5._receiveInformCommandStatusCB(params);
            }
            if (businessSDK5._isEmpty(businessSDK5._receiveInformCommandStatusCB2) == false){
              businessSDK5._receiveInformCommandStatusCB2(params);
            }
            if (businessSDK5._isEmpty(businessSDK5._receiveInformCommandStatusCB3) == false){
              businessSDK5._receiveInformCommandStatusCB3(params);
            }

            if (businessSDK5._isEmpty(businessSDK5._receiveInformCommandStatusCB4) == false){
              businessSDK5._receiveInformCommandStatusCB4(params);
            }

          }
          else if(funName === "informCommandTransmitAuth") {
            if (businessSDK5._isEmpty(businessSDK5._receiveCommandTransmitAuthCB) == false)
                businessSDK5._receiveCommandTransmitAuthCB(params);
        }else if(funName === "informCommandTransmitMember") {
            if (businessSDK5._isEmpty(businessSDK5._receiveCommandTransmitMemberCB) == false)
                businessSDK5._receiveCommandTransmitMemberCB(params);
        }
          /*else if(  funName == "informshowWindow") {
          	if(businessSDK5._isEmpty(businessSDK5._receiveInformshowWindowCB) == false)
          		businessSDK5._receiveInformshowWindowCB(params);
          }*/
          else if (funName == "informRingStatus") {
            if (businessSDK5._isEmpty(businessSDK5._receiveInformRingStatusCB) == false)
              businessSDK5._receiveInformRingStatusCB(params);
          }
          else if (funName == "informMeetingTransmitAuth") {
            if (businessSDK5._isEmpty(businessSDK5._receiveMeetingTransmitAuthCB) == false)
              businessSDK5._receiveMeetingTransmitAuthCB(params);
          }else if (funName == "informMeetingTransmitMember") {
            if (businessSDK5._isEmpty(businessSDK5._receiveMeetingTransmitMemberCB) == false)
              businessSDK5._receiveMeetingTransmitMemberCB(params);
          }
          
          /**
           * 终端产品部 曾彬 添加开始
           * */
          /*else if ( funName == "informYTStatus") {
          	if(businessSDK5._isEmpty(businessSDK5._receiveinformYTStatusCB) == false)
          		businessSDK5._receiveinformYTStatusCB(params);
          }*/
          else if (funName === "informPTZStatus") {
            if (businessSDK5._isEmpty(businessSDK5._receivePTZStatusCB) == false)
              businessSDK5._receivePTZStatusCB(params);
          } else if (funName === "informMatrixStatus") {
            if (businessSDK5._isEmpty(businessSDK5._receiveMatrixStatusCB) == false)
              businessSDK5._receiveMatrixStatusCB(params);
          } else if (funName === "informScreenStatus") {
            if (businessSDK5._isEmpty(businessSDK5._receiveScreenStatusCB) == false)
              businessSDK5._receiveScreenStatusCB(params);
          } else if (funName === "publishGroupCallStatus") {
            if (businessSDK5._isEmpty(businessSDK5._receiveGroupCallStatusCB) == false)
              businessSDK5._receiveGroupCallStatusCB(params);
          }else if (funName === "informMatrixGroupStatus") {
            if (businessSDK5._isEmpty(businessSDK5._receiveInformMatrixGroupStatusCb) == false)
              businessSDK5._receiveInformMatrixGroupStatusCb(params);
          }
          /**
           * 终端产品部 曾彬 添加结束
           * */
	        else if (funName === "informIMMessage") {
                if (businessSDK5._isEmpty(businessSDK5._receiveIMMessageCB) == false)
                    businessSDK5._receiveIMMessageCB(params);
            }
            else if (funName === "informRemoveIMGroup") {
                if (businessSDK5._isEmpty(businessSDK5._receiveRemoveIMGroupCB) == false)
                    businessSDK5._receiveRemoveIMGroupCB(params);
            }
            else if (funName === "informRefreshIMGroup") {
                if (businessSDK5._isEmpty(businessSDK5._receiveRefreshIMGroupCB) == false)
                    businessSDK5._receiveRefreshIMGroupCB(params);
            }

        }
        break;
    }
  },
  _onClose: function (event) {
    console.log("close...");
    if (!businessSDK5._isExit) {
      businessSDK5.reconnect(this._socketURL);
	}
  },
  _onOpen: function (event) {
    if (businessSDK5._wsclient.readyState == WebSocket.OPEN) {

    	console.log("open... " + new Date());

      businessSDK5.heartCheck.start();
      if(businessSDK5._isEmpty(businessSDK5._receiveInitCb) == false){
        businessSDK5._receiveInitCb();
      }
      // 状态上报
      if(businessSDK5._isEmpty(businessSDK5._receiveReconnectCommandWindowCB) == false)
      {
        var resp={}
        resp.state= businessSDK5._hasReconnected?2:1
        for(var key in businessSDK5._receiveReconnectCommandWindowCB){
          businessSDK5._receiveReconnectCommandWindowCB[key](resp);
        }
        return;
      }

      businessSDK5._isExit = false;
      businessSDK5._hasReconnected = false;
    }
  },
  _onError: function (event) {
    console.log("error...");
     if(!businessSDK5._isExit){
    businessSDK5.reconnect(this._socketURL);
    }
  },
  //客户端断开连接接口
  leave: function () {
    if(businessSDK5._wsclient ==null) return;
    businessSDK5._isExit = true;
    businessSDK5.publish("leave", {
      "userId": businessSDK5._userID,
      "userName": businessSDK5._userName
    });
    businessSDK5._wsclient.close();
    businessSDK5._wsclient = null;
    businessSDK5._receiveReconnectCommandWindowCB = null;
    console.log("------------------------------------")
  },

  // 仅断开socket
  onlyClose:function(){
    if( !!businessSDK5._wsclient ){
      businessSDK5._wsclient.close();
    }
  },

  //客户端发布消息接口
  publish: function (funName, params) {
    try{
      console.log('publish');
      if (businessSDK5._wsclient == null) return;
      console.log('publish1');
      // console.log('businessSDK5._wsclient.readyState='+businessSDK5._wsclient.readyState);
      if (businessSDK5._wsclient.readyState != WebSocket.OPEN) {
        console.log('publish2');
        // if(businessSDK5._failureCount >= 3) return;
        if (businessSDK5._failureCount >= 4) return;
        setTimeout("businessSDK5.publish('" + funName + "', " + JSON.stringify(params) + ");", 1000);
        businessSDK5._failureCount++;
        return;
      }
      console.log('publish3');
      // console.log(businessSDK5._failureCount);
      if (businessSDK5._failureCount != 0) businessSDK5._failureCount = 0;
      console.log('publish4');
      var data = {
        "code": 10086,
        "userId": businessSDK5._userID,
        "funName": funName,
        "params": params
      };
      console.log('publish5');
      businessSDK5._wsclient.send(JSON.stringify(data));
      console.log(JSON.stringify(data) + '：' + new Date());
    }catch(e){
      console.log(e)
    }

  },

  //设置重复登录提示回调
  setReceiveRepeatLoginErrorCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveRepeatLoginErrorCodeCB = cb;
    }
  },

  setReceiveLeaveCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveLeaveCodeCB = cb;
    }
  },

  // 强制I帧
  sendForceIFrame: function (resId, resCh) {
    var funName = "sendForceIFrame";
    var params = {
      "resId": resId,
      "resCh": resCh,
    };
    businessSDK5.publish(funName, params);
  },

  // 设置I帧间隔
  publishSetIFrameInterval: function (token, deviceId, interval) {
    var funName = "publishSetIFrameInterval";
    var params = {
      "token": token,
      "deviceId": deviceId,
      "interval": interval,
    };
    businessSDK5.publish(funName, params);
  },

  // 设置图像参数
  publishSetImageSession: function (token, deviceId, framerate, bitrate, resolutionrate) {
    var funName = "publishSetImageSession";
    var params = {
      "token": token,
      "deviceId": deviceId,
      "framerate": framerate,
      "bitrate": bitrate,
      "resolutionrate": resolutionrate,
    };
    businessSDK5.publish(funName, params);
  },

  // 强制I帧（新）
  publishSetIFrame: function (token, deviceId) {
    var funName = "publishSetIFrame";
    var params = {
      "token": token,
      "deviceId": deviceId,
    };
    businessSDK5.publish(funName, params);
  },
  
  // 点播回调弹窗清零
  clearShowWin: function () {
    var funName = "clearShowWin";
    var params = {};
    businessSDK5.publish(funName, params);
  },

  //订阅消息
  subscribeMessage: function () {
    // var funName = "subscribeMessage";
    var funName = "subscribeShowWindow";
    var params = {};
    businessSDK5.publish(funName, params);
  },
  //取消订阅消息
  cancelSubscribeMessage: function () {
    // var funName = "cancelSubscribeMessage";
    var funName = "cancelSubscribeShowWindow";
    var params = {};
    businessSDK5.publish(funName, params);
  },
  //设置接收消息窗口时回调
  setReceiveMessageCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveMessageCB = cb;
    }
  },
  //订阅提醒
  subscribeRemind: function () {
    // var funName = "subscribeRemind";
    var funName = "subscribeShowRemind";
    var params = {};
    businessSDK5.publish(funName, params);
  },
  //取消订阅提醒
  cancelRemind: function () {
    // var funName = "cancelRemind";
    var funName = "cancelShowRemind";
    var params = {};
    businessSDK5.publish(funName, params);
  },
  //设置接收提醒时回调
  setReceiveRemindCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveRemindCB = cb;
    }
  },

  //订阅文件频道
  // subscribeFileStatus : function(fileListQuery, fileListOnline, fileListType, mainFileListId){
  subscribeFileStatus: function (fileListQuery, fileListOnline, fileListType, mainFileListId, guid) {
    var funName = "subscribeFileStatus";
    var params = {
      "query": fileListQuery,
      "online": fileListOnline,
      "type": fileListType,
      "Id": mainFileListId,
      "guid": guid,
    };
    businessSDK5.publish(funName, params);
  },
  //取消订阅文件频道
  cancelSubscribeFileStatus: function (mainFileListId) {
    var funName = "cancelSubscribeFileStatus";
    var params = {
      "Id": mainFileListId,
    };
    businessSDK5.publish(funName, params);
  },
  // 设置接收文件频道状态时回调
  setReceiveFileListStatusCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveFileListStatusCB = cb;
    }
  },


  /** 5-人员树（1.2修改）------------------------------------------------------------------------------ */

  /**
   * 订阅人员树的子节点
   */
  // subscribeUser:function(departments, Id){
  subscribeUser: function (departments, Id, guid) {
    var funName = "subscribeUser";
    var params = {
      "departments": departments,
      "Id": Id,
      "guid": guid
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 取消订阅
   */
  cancelSubscribeUser: function (Id) {
    var funName = "cancelSubscribeUser";
    var params = {
      "Id": Id
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 设置接收人员树子节点时的回调
   */
  setReceivePersonNodeCallback: function (id, cb) {
    if (businessSDK5._receivePersonNodeCB == undefined)
      businessSDK5._receivePersonNodeCB = {};
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receivePersonNodeCB[id] = cb;
    }
  },

  // 设置接收人员树子节点时的回调-计划录像
  setReceivePersonNodeCallback_recordPlan: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receivePersonNode_recordPlanCB = cb;
    }
  },

  /**
   * 订阅人员树搜索
   */
  // subscribeUserQuery:function(type, text, online, buss, Id){
  subscribeUserQuery: function (type, text, online, buss, Id, guid) {
    var funName = "subscribeUserQuery";
    var params = {
      "type": type,
      "text": text,
      "online": online,
      "buss": buss,
      "Id": Id,
      "guid": guid,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 取消订阅
   */
  cancelSubscribeUserQuery: function (Id) {
    var funName = "cancelSubscribeUserQuery";
    var params = {
      "Id": Id
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 设置接收人员树搜索时的回调
   */
  setReceiveQueryPersonNodeCallback: function (id, cb) {
    if(businessSDK5._receiveQueryPersonNodeCB == undefined)
      businessSDK5._receiveQueryPersonNodeCB = {};
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveQueryPersonNodeCB[id] = cb;
    }
  },

  // 设置接收人员树搜索时的回调-计划录像
  setReceiveQueryPersonNodeCallback_recordPlan: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveQueryPersonNode_recordPlanCB = cb;
    }
  },

  /** 6-设备树（1.2修改）------------------------------------------------------------------------------ */

  /**
   * 订阅设备树的子节点
   */
  // subscribeDevice:function(departments, Id){
  subscribeDevice: function (departments, Id, guid) {
    var funName = "subscribeDevice";
    var params = {
      "departments": departments,
      "Id": Id,
      "guid": guid
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 取消订阅
   */
  cancelSubscribeDevice: function (Id) {
    var funName = "cancelSubscribeDevice";
    var params = {
      "Id": Id
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 设置接收设备树子节点时的回调
   */
  setReceiveDeviceNodeCallback: function (id, cb) {
    if(businessSDK5._receiveDeviceNodeCB == undefined)
      businessSDK5._receiveDeviceNodeCB = {};
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveDeviceNodeCB[id] = cb;
    }
  },

  // 设置接收设备树子节点时的回调-计划录像
  setReceiveDeviceNodeCallback_recordPlan: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveDeviceNode_recordPlanCB = cb;
    }
  },

  /**
   * 订阅设备树搜索
   */
  // subscribeDeviceQuery:function(type, text, online, buss, Id){
  subscribeDeviceQuery: function (type, text, online, buss, Id, guid) {
    var funName = "subscribeDeviceQuery";
    var params = {
      "type": type,
      "text": text,
      "online": online,
      "buss": buss,
      "Id": Id,
      "guid": guid
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 取消订阅
   */
  cancelSubscribeDeviceQuery: function (Id) {
    var funName = "cancelSubscribeDeviceQuery";
    var params = {
      "Id": Id
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 设置接收人员树搜索时的回调
   */
  setReceiveQueryDeviceNodeCallback: function (id, cb) {
    if(businessSDK5._receiveQueryDeviceNodeCB == undefined)
      businessSDK5._receiveQueryDeviceNodeCB = {};
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveQueryDeviceNodeCB[id] = cb;
    }
  },

  // 设置接收人员树搜索时的回调-计划录像
  setReceiveQueryDeviceNodeCallback_recordPlan: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveQueryDeviceNode_recordPlanCB = cb;
    }
  },

  /** 常用资源（1.2修改）------------------------------------------------------------------------------ */

  /**
   * 添加资源收藏
   */
  publishAddCollection: function (resId, ch, resName, resType) {
    var funName = "publishAddCollection";
    var params = {
      "resId": resId,
      "ch": ch,
      "resName": resName,
      "resType": resType
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 移除资源收藏
   */
  publishRemoveCollection: function (resId, ch) {
    var funName = "publishRemoveCollection";
    var params = {
      "resId": resId,
      "ch": ch
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 订阅常用资源状态
   */
  subscribeCommonStatus: function (queryKey, online, type, subID, guid) {
    var funName = "subscribeCommonStatus";
    var params = {
      // "queryKey" : queryKey,
      "query": queryKey,
      "online": online,
      "type": type,
      "Id": subID,
      "guid": guid
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 取消订阅常用资源状态
   */
  cancesubscribeCommonStatus: function (subID) {
    var funName = "cancesubscribeCommonStatus";
    var params = {
      "Id": subID
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 设置接收常用资源状态时回调
   */
  setReceiveCommonStatusCallback: function (id, cb) {
    if(businessSDK5._receiveCommonStatusCB == undefined)
      businessSDK5._receiveCommonStatusCB = {};
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveCommonStatusCB[id] = cb;
    }
  },

  // 设置接收常用资源状态时回调-计划录像
  setReceiveCommonStatusCallback_recordPlan: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveCommonStatus_recordPlanCB = cb;
    }
  },

  /** 7-图像点播（1.1&1.3）------------------------------------------------------------------------------ */

  /**
   * 开启点播
   */
  publishStartPlay: function (resId, ch, mediaTye, pos, resType) {
    var funName = "publishStartPlay";
    var params = {
      "resId": resId,
      "ch": ch,
      "mediaTye": mediaTye,
      "pos": pos,
      "resType": resType
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止点播（根据分屏索引）
   */
  publishStopPlayByIndex: function (screenIndex) {
    var funName = "publishStopPlayByIndex";
    var params = {
      "screenIndex": screenIndex
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止点播（根据资源ID）
   */
  publishStopPlayId: function (resId, resCh, mediaTye) {
    var funName = "publishStopPlayId";
    var params = {
      "resId": resId,
      "resCh": resCh,
      "mediaTye": mediaTye
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止全部点播
   */
  stopAll: function () {
    var funName = "publishStopPlayAll";
    var params = {};
    businessSDK5.publish(funName, params);
  },

  /**
   * 订阅点播信息
   */
  subscribeMediaStatus: function () {
    var funName = "subscribeMediaStatus";
    var params = {};
    businessSDK5.publish(funName, params);
  },
  /**
   *发布媒体声音控制
   * */
  publishAllVolume: function(isOpen,value) {
    var funName = "publishControlAllVolume";
    var params = {
      "value": value,
      "status": isOpen?1:0
    };
    businessSDK5.publish(funName, params);

  },
  /**
   * 发布单路声音控制
   * screenIndex:屏位置
   * isOpen:true/false
   * */
  publishVolume: function(screenIndex, isOpen,value) {
    var funName = "publishControlVolume";
    var params = {
      "screenIndex": screenIndex,
      "value": value,
      "status": isOpen?1:0
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 取消订阅
   */
  cancelSubscribeMediaStatus: function () {
    var funName = "cancelSubscribeMediaStatus";
    var params = {};
    businessSDK5.publish(funName, params);
  },

  /**
   * 设置本地软解回调
   */
  setReceiveMediaStatusByLocalCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveMediaStatusByLocalCB = cb;
    }
  },

  /**
   * 设置本地软解回调，StopPlay
   * */

  _receiveMediaStatusByLocalCBForStopPlay:null,
  setReceiveMediaStatusByLocalCBForStopPlay:function(cb){
    if(cb!=null && typeof(cb)!="undefined"){
      businessSDK5._receiveMediaStatusByLocalCBForStopPlay = cb;
    }
  },

  /**
   * 设置本地软解回调，SplitScreen
   * */
  _receiveMediaStatusByLocalCBForSplitScreen:null,
  setReceiveMediaStatusByLocalCBForSplitScreen:function(cb){
    if(cb!=null && typeof(cb)!="undefined"){
      businessSDK5._receiveMediaStatusByLocalCBForSplitScreen = cb;
    }
  },

  /**
   * 设置本地软解回调，OSD
   * */
  _receiveMediaStatusByLocalCBForOSD:null,
  setReceiveMediaStatusByLocalCBForOSD:function(cb){
    if(cb!=null && typeof(cb)!="undefined"){
      businessSDK5._receiveMediaStatusByLocalCBForOSD = cb;
    }
  },

  /**
   * 设置本地软解回调，FullScreen
   * */
  _receiveMediaStatusByLocalCBForFullScreen:null,
  setReceiveMediaStatusByLocalCBForFullScreen:function(cb){
    if(cb!=null && typeof(cb)!="undefined"){
      businessSDK5._receiveMediaStatusByLocalCBForFullScreen = cb;
    }
  },
  setVolumeByLocalCallback:function(cb){
    if(cb!=null && typeof(cb)!="undefined"){
      businessSDK5._receiveInformSetVolumeCB = cb;
    }
  },
  /**
   * 开启分组点播
   */
  publishStartDBImageGroup: function (token, groupId, isLoop) {
    var funName = "publishStartDBImageGroup";
    var params = {
      "token": token,
      "groupId": groupId,
      "isLoop": isLoop //0不开启，1开启
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止分组点播
   */
  publishStopDBImageGroup: function (token, groupId, isLoop) {
    var funName = "publishStopDBImageGroup";
    var params = {
      "token": token,
      "groupId": groupId,
      "isLoop": isLoop //0不开启，1开启
    };
    businessSDK5.publish(funName, params);
  },

  publishChangeDBScheme:function(token,groupId,schemeId){
    var funName ="publishChangeDBScheme";
    var params ={
      "token": token,
      "groupId": groupId,
      "schemeId":schemeId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * subscribeBusinessGroupList
   * */

  //subscribeBusinessGroupList:function(token)

  /**
   * 订阅分组点播状态
   */
  subscribeDBImageGroupStatus: function (token) {
    var funName = "subscribeDBImageGroupStatus";
    var params = {
      "token": token
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 取消分组点播状态
   */
  cancelSubscribeDBImageGroupStatus: function (token) {
    var funName = "cancelSubscribeDBImageGroupStatus";
    var params = {
      "token": token
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 设置分组点播状态回调
   */
  setReceiveDBImageGroupStatusCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveDBImageGroupStatusCB = cb;
    }
  },

  /** 8-权限验证（1.2）------------------------------------------------------------------------------ */

  //无

  /** 9-云台业务（1.2）------------------------------------------------------------------------------ */

  /**
   * 订阅云台状态
   */
  subscribeYTStatus: function (token, resId, resCh) {
    var funName = "subscribeYTStatus";
    var params = {
      "token": token,
      "resId": resId,
      "resCh": resCh,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 取消订阅云台状态
   */
  cancelSubscribeYTStatus: function (token, resId, resCh) {
    var funName = "cancelSubscribeYTStatus";
    var params = {
      "token": token,
      "resId": resId,
      "resCh": resCh,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 设置接收云台状态回调
   */
  setReceiveYTStatusCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveYTStatusCB = cb;
    }
  },

  /**
   * 接管云台
   */
  publishYTTakeover: function (token, resId, resCh, value) {
    var funName = "publishYTTakeover";
    var params = {
      "token": token,
      "resId": resId,
      "resCh": resCh,
      "value": value,
    };
    businessSDK5.publish(funName, params);
  },

  /** 10-预置点（1.2）------------------------------------------------------------------------------ */

  /**
   * 跳转预置点
   */
  publishCtrlSelectPoint: function (token, resId, resCh, prepointIndex) {
    var funName = "publishCtrlSelectPoint";
    var params = {
      "token": token,
      "resId": resId,
      "resCh": resCh,
      "prepointIndex": prepointIndex,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 跳转默认预置点
   */
  publishCtrlSelectDefaultPoint: function (token, resId, resCh) {
    var funName = "publishCtrlSelectDefaultPoint";
    var params = {
      "token": token,
      "resId": resId,
      "resCh": resCh,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 开启巡航
   */
  publishStartScheme: function (token, resId, resCh, schemeId) {
    var funName = "publishStartScheme";
    var params = {
      "token": token,
      "resId": resId,
      "resCh": resCh,
      "schemeId": schemeId,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止巡航
   */
  publishStopScheme: function (token, resId, resCh, schemeId) {
    var funName = "publishStopScheme";
    var params = {
      "token": token,
      "resId": resId,
      "resCh": resCh,
      "schemeId": schemeId,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 订阅预置点
   */
  subscribePTZStatus: function (token, resId, resCh) {
    var funName = "subscribePTZStatus";
    var params = {
      "token": token,
      "resId": resId,
      "resCh": resCh,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 取消订阅预置点
   */
  cancelsubscribePTZStatus: function (token, resId, resCh) {
    var funName = "cancelsubscribePTZStatus";
    var params = {
      "token": token,
      "resId": resId,
      "resCh": resCh,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 设置接收预置点状态回调
   */
  setReceivePTZStatusCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receivePTZStatusCB = cb;
    }
  },

  /** 11-录时录像（1.2）------------------------------------------------------------------------------ */

  /**
   * 开启临时录像
   */
  publishStartTempRecord: function (token, resId, resCh,pos) {
    var funName = "publishStartTempRecord";
    var params = {
      "token": token,
      "resId": resId,
	  "resCh": resCh,
	  "pos" :pos,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止临时录像
   */
  publishStopTempRecord: function (token, resId, resCh) {
    var funName = "publishStopTempRecord";
    var params = {
      "token": token,
      "resId": resId,
      "resCh": resCh,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 设置接收临时录像状态回调
   */
  setReceiveInformTempRecordStatusCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveInformTempRecordStatusCB = cb;
    }
  },

  /**
   * 查询计划录像状态
   *
   * schemeId: 方案ID
   */
  publishQueryRecordSchemeStatus: function (token, schemeId) {
    var funName = "publishQueryRecordScheme";
    var params = {
      "token": token,
      "schemeId": schemeId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 设置接收计划录像状态回调
   */
  setReceiveRecordSchemeStatusCallBack: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveInformRecordSchemeCB = cb;
    }
  },

  /**
   * 开启录像回放（播放最近一个录像文件）
   */
  startVideoPlayback: function (token, resourceId, resourceCh, resourceType, pos) {
    var funName = "publishStartPlayRecord";
    var params = {
      "token": token,
      "resourceId": resourceId,
      "resourceCh": resourceCh,
      "resourceType": resourceType,
      "pos": pos
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 开启录像回放（录像检索页面的回放入口）
   */
  startVideoPlayback2: function (token, resourceId, resourceCh, resourceType, records) {
    var funName = "publishStartPlayRecord2";
    var params = {
      "token": token,
      "resourceId": resourceId,
      "resourceCh": resourceCh,
      "resourceType": resourceType,
      "records": records
    };
    businessSDK5.publish(funName, params);
  },

  // /**
  //  * 停止录像回放
  //  */
  // stopVideoPlayback: function (userId, token, resource) {
  //   //与停止点播接口一致
  // },

  /**
   * 暂停/恢复
   */
  publishPlayRecord: function (token, pos, status) {
    var funName = "publishPlayRecord";
    var params = {
      "token": token,
      // "resourceId": resourceId,
      // "resourceCh": resourceCh,
      "pos": pos,
      "status": status
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 速度控制
   */
  publishCtrlRecordSpeed: function (token, pos, speed) {
    var funName = "publishCtrlRecordSpeed";
    var params = {
      "token": token,
      // "resourceId": resourceId,
      // "resourceCh": resourceCh,
      "pos": pos,
      "speed": speed
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 单帧回放
   */
  publishCtrlRecordFrame: function (token, pos) {
    var funName = "publishCtrlRecordFrame";
    var params = {
      "token": token,
      // "resourceId": resourceId,
      // "resourceCh": resourceCh,
      "pos": pos
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 跳转
   */
  publishCtrlRecordTransfer: function (token, pos, position) {
    var funName = "publishCtrlRecordTransfer";
    var params = {
      "token": token,
      // "resourceId": resourceId,
      // "resourceCh": resourceCh,
      "pos": pos,
      "position": position
    };
    businessSDK5.publish(funName, params);
  },

  // 全部静音
  publishCtrlMatrixAllVolume: function (token, matrixId, volume) {
    var funName = "publishCtrlMatrixAllVolume";
    var params = {
      "token": token,
      "matrixId": matrixId,
      "volume": volume
    };
    businessSDK5.publish(funName, params);
  },

  // 录像回放状态
  setReceiveInformPlayRecordCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveInformPlayRecordCB = cb;
    }
  },

  /** 12-解码器控制（1.3）------------------------------------------------------------------------------ */

  /**
   * 单路点播图像
   *
   * matrixId: 解码器ID
   * pos: 解码器位置
   * deviceId: 资源ID
   * deviceCh: 资源通道
   */
  publishCtrlMatrixDBImage: function (token, matrixId, pos, deviceId, deviceCh) {
    var funName = "publishCtrlMatrixDBImage";
    var params = {
      "token": token,
      "matrixId": matrixId,
      "pos": pos,
      "deviceId": deviceId,
      "deviceCh": deviceCh
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 单路点播图像(输出声音)
   *
   * matrixId: 解码器ID
   * pos: 解码器位置
   * deviceId: 资源ID      //是否需要？
   * deviceCh: 资源通道
   * volume: 音量
   */
  publishCtrlMatrixDBImage2: function (token, matrixId, pos, deviceId, deviceCh, volume) {
    var funName = "publishCtrlMatrixDBImage2";
    var params = {
      "token": token,
      "matrixId": matrixId,
      "pos": pos,
      "deviceId": deviceId,
      "deviceCh": deviceCh,
      "volume": volume
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 单路停止点播
   *
   * matrixId: 解码器ID
   * pos: 解码器位置
   */
  publishCtrlMatrixStopDBImage: function (token, matrixId, pos) {
    var funName = "publishCtrlMatrixStopDBImage";
    var params = {
      "token": token,
      "matrixId": matrixId,
      "pos": pos,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止所有点播
   *
   * matrixId: 解码器ID
   */
  publishCtrlMatrixStopAll: function (token, matrixId) {
    var funName = "publishCtrlMatrixStopAll";
    var params = {
      "token": token,
      "matrixId": matrixId,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 图像复位
   *
   * matrixId: 解码器ID
   * pos: 解码器位置
   */
  publishCtrlMatrixReset: function (token, matrixId, pos) {
    var funName = "publishCtrlMatrixReset";
    var params = {
      "token": token,
      "matrixId": matrixId,
      "pos": pos
    };
    businessSDK5.publish(funName, params);
  },


  /**
   * 开启/关闭声音
   *
   * matrixId: 解码器ID
   * pos: 解码器位置
   * volume: 是否开启声音 0--关闭 1--开启
   * value: 音量
   */
  publishCtrlMatrixVolume: function (token, matrixId, pos, volume, value) {
    var funName = "publishCtrlMatrixVolume";
    var params = {
      "token": token,
      "matrixId": matrixId,
      "pos": pos,
      "volume": volume,
      "value": value,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 全屏
   *
   * matrixId: 解码器ID
   * pos: 解码器位置
   */
  publishCtrlMatrixFull: function (token, matrixId, pos) {
    var funName = "publishCtrlMatrixFull";
    var params = {
      "token": token,
      "matrixId": matrixId,
      "pos": pos
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 退出全屏
   *
   * matrixId: 解码器ID
   * pos: 解码器位置
   */
  publishCtrlMatrixCancelFull: function (token, matrixId, pos) {
    var funName = "publishCtrlMatrixCancelFull";
    var params = {
      "token": token,
      "matrixId": matrixId,
      "pos": pos
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 控制分屏比例
   *
   * matrixId: 解码器ID
   * pos: 解码器位置
   * width: 显示宽度比例
   * height: 显示高度比例
   */
  publishCtrlMatrixReduce: function (token, matrixId, pos, width, height) {
    var funName = "publishCtrlMatrixReduce";
    var params = {
      "token": token,
      "matrixId": matrixId,
      "pos": pos,
      "width": width,
      "height": height
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 控制矩阵分屏
   *
   * matrixId: 解码器ID
   * screenNum: 显示模式，支持1、4、9、12、16分屏显示模式
   */
  publishCtrlMatrixSplit: function (token, matrixId, screenNum) {
    var funName = "publishCtrlMatrixSplit";
    var params = {
      "token": token,
      "matrixId": matrixId,
      "screenNum": screenNum
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 暂停/恢复
   *
   * matrixId: 解码器ID
   * pos: 解码器位置
   * isPlay: 暂停/恢复
   */
  publishCtrlMatrixPlay: function (token, matrixId, pos, isplay) {
    var funName = "publishCtrlMatrixPlay";
    var params = {
      "token": token,
      "matrixId": matrixId,
      "pos": pos,
      "isplay": isplay
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 设置OSD
   *
   * matrixId: 解码器ID
   * pos: 解码器位置
   * index: 序号
   * show: 是否显示
   */
  publishCtrlMatrixOSD: function (token, matrixId, pos, index, show, color, left, top, width, height, font, text) {
    var funName = "publishCtrlMatrixOSD";
    var params = {
      "token": token,
      "matrixId": matrixId,
      "pos": pos,
      "index": index,
      "show": show,
      "color": color,
      "left": left,
      "top": top,
      "width": width,
      "height": height,
      "font": font,
      "text": text
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 图像增强
   *
   * matrixId: 解码器ID
   * pos: 解码器位置
   * target:
   * value:
   * enable:
   */
  publishCtrlMatrixAdjust: function (token, matrixId, pos, target, value, enable) {
    var funName = "publishCtrlMatrixAdjust";
    var params = {
      "token": token,
      "matrixId": matrixId,
      "pos": pos,
      "target": target,
      "value": value,
      "enable": enable,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * I帧捕获
   *
   * matrixId: 解码器ID
   * pos: 解码器位置
   */
  publishCtrlMatrixIFrame: function (token, matrixId, pos) {
    var funName = "publishCtrlMatrixIFrame";
    var params = {
      "token": token,
      "matrixId": matrixId,
      "pos": pos
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 开启轮循
   *
   * matrixId: 解码器ID
   * groupid: 组ID
   *
   * @see startLoopPlay() in MediaDB.js
   */
  publishCtrlMatrixStartLoop: function (token, matrixId, groupid) {
    var funName = "publishCtrlMatrixStartLoop";
    var params = {
      "token": token,
      "matrixId": matrixId,
      "groupid": groupid
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止轮循
   *
   * matrixId: 解码器ID
   * groupid: 组ID
   */
  publishCtrlMatrixStopLoop: function (token, matrixId, groupid) {
    var funName = "publishCtrlMatrixStopLoop";
    var params = {
      "token": token,
      "matrixId": matrixId,
      "groupid": groupid
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 开启滚动字幕
   *
   */
  publishCtrlMatrixStartNotify: function (token, matrixId, font, color, size, text,
    showtime, mode, speed, location, bold, italic, backgroup, roll) {
    var funName = "publishCtrlMatrixStartNotify";
    var params = {
      "token": token,
      "matrixId": matrixId,
      "font": font,
      "color": color,
      "size": size,
      "text": text,
      "showtime": showtime,
      "mode": mode,
      "speed": speed,
      "location": location,
      "bold": bold,
      "italic": italic,
      "backgroup": backgroup,
      "roll": roll
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 关闭滚动字幕
   *
   * matrixs: 矩阵数组
   */
  publishCtrlMatrixStopNotify: function (token, matrixId) {
    var funName = "publishCtrlMatrixStopNotify";
    var params = {
      "token": token,
      "matrixId": matrixId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 订阅矩阵状态
   *
   * matrixs: 矩阵数组
   */
  subscribeMatrixStatus: function (token, matrixs) {
    var funName = "subscribeMatrixStatus";
    var params = {
      "token": token,
      "matrixs": matrixs,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 取消订阅矩阵状态
   *
   * matrixs: 矩阵数组
   */
  cancelSubscribeMatrixStatus: function (token, matrixs) {
    var funName = "cancelSubscribeMatrixStatus";
    var params = {
      "token": token,
      "matrixs": matrixs,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 设置接收矩阵状态回调
   */
  setReceiveMatrixStatusCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveMatrixStatusCB = cb;
    }
  },

  /** 13-大屏控制（1.3）------------------------------------------------------------------------------ */

  /**
   * 切换模式分屏
   *
   * screenId: 大屏ID
   * modeCode: 模式ID
   */
  publishCtrlScreenSplit: function (token, screenId, modeCode) {
    var funName = "publishCtrlScreenSplit";
    var params = {
      "token": token,
      "screenId": screenId,
      "modeCode": modeCode
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 一键上大屏
   *
   * screenId: 大屏ID
   * screenPos: 模式屏索引
   * smallPos:
   */
  publishCtrlScreenStartPlay: function (token, screenId, screenPos, smallPos) {
    var funName = "publishCtrlScreenStartPlay";
    var params = {
      "token": token,
      "screenId": screenId,
      "screenPos": screenPos,
      "smallPos": smallPos
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止大屏图像
   *
   * screenId: 大屏ID
   * screenPos: 模式屏索引
   * smallPos:
   */
  publishCtrlScreenStopPlay: function (token, screenId, screenPos, smallPos) {
    var funName = "publishCtrlScreenStopPlay";
    var params = {
      "token": token,
      "screenId": screenId,
      "screenPos": screenPos,
      "smallPos": smallPos
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 将大屏中小屏进行全屏
   *
   * screenId: 大屏ID
   * screenPos: 模式屏索引
   * smallPos:
   */
  publishCtrlScreenFull: function (token, screenId, screenPos, smallPos) {
    var funName = "publishCtrlScreenFull";
    var params = {
      "token": token,
      "screenId": screenId,
      "screenPos": screenPos,
      "smallPos": smallPos
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 将大屏中小屏进行取消全屏
   *
   * screenId: 大屏ID
   * screenPos: 模式屏索引
   * smallPos:
   */
  publishCtrlScreenCancelFull: function (token, screenId, screenPos, smallPos) {
    var funName = "publishCtrlScreenCancelFull";
    var params = {
      "token": token,
      "screenId": screenId,
      "screenPos": screenPos,
      "smallPos": smallPos
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 将大屏中小屏进行比例切换
   *
   * screenId: 大屏ID
   * screenPos: 模式屏索引
   * smallPos:
   * widht: 宽
   * height: 高
   */
  publishCtrlScreenReduce: function (token, screenId, screenPos, smallPos,
    width, height) {
    var funName = "publishCtrlScreenReduce";
    var params = {
      "token": token,
      "screenId": screenId,
      "screenPos": screenPos,
      "smallPos": smallPos,
      "width": width,
      "height": height
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 将大屏中小屏进行音量调节
   *
   * screenId: 大屏ID
   * screenPos: 模式屏索引
   * smallPos:
   * volume: 音量
   */
  publishCtrlScreenVolume: function (token, screenId, screenPos, smallPos, volume) {
    var funName = "publishCtrlScreenVolume";
    var params = {
      "token": token,
      "screenId": screenId,
      "screenPos": screenPos,
      "smallPos": smallPos,
      "volume": volume
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 将大屏中模式屏全屏停止
   *
   * screenId: 大屏ID
   * screenPos: 模式屏索引
   */
  publishCtrlScreenStopAll: function (token, screenId, screenPos) {
    var funName = "publishCtrlScreenStopAll";
    var params = {
      "token": token,
      "screenId": screenId,
      "screenPos": screenPos
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 将大屏中模式屏进行分屏
   *
   * screenId: 大屏ID
   * screenPos: 模式屏索引
   * split: 分屏类型
   */
  publishCtrlScreenSplit2: function (token, screenId, screenPos, split) {
    var funName = "publishCtrlScreenSplit2";
    var params = {
      "token": token,
      "screenId": screenId,
      "screenPos": screenPos,
      "split": split
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 将大屏中小屏进行OSD叠加
   *
   * screenId: 大屏ID
   * screenPos: 模式屏索引
   * index: 序号
   * show: 是否显示
   *
   * @see publishCtrlMatrixOSD in decoderControl.js
   */
  publishCtrlScreenOSD: function (token, screenId, screenPos, index, show, color, left, top, width, height, font, text) {
    var funName = "publishCtrlScreenOSD";
    var params = {
      "token": token,
      "screenId": screenId,
      "screenPos": pos,
      "index": index,
      "show": show,
      "color": color,
      "left": left,
      "top": top,
      "width": width,
      "height": height,
      "font": font,
      "text": text
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 订阅大屏状态
   *
   * screens: 大屏数组
   */
  subscribeScreenStatus: function (token, screens) {
    var funName = "subscribeScreenStatus";
    var params = {
      "token": token,
      "screens": screens,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 取消订阅大屏状态
   *
   * matrixs: 大屏数组
   */
  cancelSubscribeScreenStatus: function (token, matrixs) {
    var funName = "cancelSubscribeScreenStatus";
    var params = {
      "token": token,
      "matrixs": matrixs
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 设置接收大屏状态回调
   */
  setReceiveScreenStatusCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveScreenStatusCB = cb;
    }
  },

  /**
   * 订阅分组下矩阵列表的状态
   * */
  subscribeMatrixGroupStatus:function(token,groupId){
    var funName = "subscribeMatrixGroupStatus";
    var params = {
      "token": token,
      "groupId": groupId,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 取消订阅分组矩阵列表的状态
   * */
  cancelSubscribeMatrixGroupStatus:function(token){
    var funName = "cancelSubscribeMatrixGroupStatus";
    var params = {
      "token": token+""
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 推送分组矩阵列表状态
   * */
  setReceiveInformMatrixGroupStatus:function(callback){
    if(callback!=null && typeof(callback)!="undefined"){
      businessSDK5._receiveInformMatrixGroupStatusCb = callback;
    }
  },

  /** 14-模拟矩阵控制（1.3）------------------------------------------------------------------------------ */

  /**
   * 模拟矩阵切换
   *
   * inputMatrixId: 输入矩阵ID
   * inputMatrixCh: 输入矩阵通道
   * outputMatrixId: 输出矩阵ID
   * outputMatrixCh: 输出矩阵通道
   */
  publishCtrlMatrixInputOutput: function (token, inputMatrixId, inputMatrixCh,
    outputMatrixId, outputMatrixCh) {
    var funName = "publishCtrlMatrixInputOutput";
    var params = {
      "token": token,
      "inputMatrixId": inputMatrixId,
      "inputMatrixCh": inputMatrixCh,
      "outputMatrixId": outputMatrixId,
      "outputMatrixCh": outputMatrixCh
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 模拟矩阵切换至输出通道组
   *
   * inputMatrixId: 输入矩阵ID
   * inputMatrixCh: 输入矩阵通道
   * outputMatrixId: 输出矩阵ID
   * outputMatrixGroup: 输出矩阵通道组
   */
  publishCtrlMatrixOutputGroup: function (token, inputMatrixId, inputMatrixCh,
    outputMatrixId, outputMatrixGroup) {
    var funName = "publishCtrlMatrixOutputGroup";
    var params = {
      "token": token,
      "inputMatrixId": inputMatrixId,
      "inputMatrixCh": inputMatrixCh,
      "outputMatrixId": outputMatrixId,
      "outputMatrixGroup": outputMatrixGroup
    };
    businessSDK5.publish(funName, params);
  },

  /** 15-分组管理（1.3&1.4）------------------------------------------------------------------------------ */

  //无

  /** 16-显示方案（1.3）------------------------------------------------------------------------------ */

  //无

  /** 17-视频呼叫（1.3）------------------------------------------------------------------------------ */

  /**
   *开启呼叫
   */
  publishStartCall: function (token, destId) {
    var funcName = "publishStartCall";
    var params = {
      "token": token,
      "destId": destId
    };
    businessSDK5.publish(funcName, params);
  },

  /**
   * 停止呼叫
   */
  publishStopCall: function (token, destId) {
    var funcName = "publishStopCall";
    var params = {
      "token": token,
      "destId": destId
    };
    businessSDK5.publish(funcName, params);
  },

  /**
   * 停止所有呼叫
   */
  publishStopCallAll: function (token) {
    var funcName = "publishStopCallAll";
    var params = {
      "token": token
    };
    businessSDK5.publish(funcName, params);
  },

  /**
   * 接受呼叫
   */
  publishAcceptCall: function (token, destId) {
    var funcName = "publishAcceptCall";
    var params = {
      "token": token,
      "destId": destId
    };
    businessSDK5.publish(funcName, params);
  },

  /**
   * 拒绝呼叫
   */
  publishRefuseCall: function (token, destId) {
    var funcName = "publishRefuseCall";
    var params = {
      "token": token,
      "destId": destId
    };
    businessSDK5.publish(funcName, params);
  },

  /**
   *取消呼叫
   */
  publishCancelCall: function (token, destId) {
    var funcName = "publishCancelCall";
    var params = {
      "token": token,
      "destId": destId
    };
    businessSDK5.publish(funcName, params);
  },

  /**
   *开启音频呼叫
   */
  publishStartAudioCall: function (token, destId) {
    var funcName = "publishStartAudioCall";
    var params = {
      "token": token,
      "destId": destId
    };
    businessSDK5.publish(funcName, params);
  },

  /**
   *停止音频呼叫
   */
  publishStopAudioCall: function (token, destId) {
    var funcName = "publishStopAudioCall";
    var params = {
      "token": token,
      "destId": destId
    };
    businessSDK5.publish(funcName, params);
  },

  /**
   * 开启对讲
   */
  publishStartSpeak: function (token, deviceId, deviceCh) {
    var funcName = "publishStartSpeak";
    var params = {
      "token": token,
      "deviceId": deviceId,
      "deviceCh": deviceCh
    };
    businessSDK5.publish(funcName, params);
  },

  /**
   * 停止对讲
   */
  publishStopSpeak: function (token, deviceId, deviceCh) {
    var funcName = "publishStopSpeak";
    var params = {
      "token": token,
      "deviceId": deviceId,
      "deviceCh": deviceCh
    };
    businessSDK5.publish(funcName, params);
  },

  /**
   * 停止所有对讲
   */
  publishStopSpeakAll: function (token) {
    var funcName = "publishStopSpeakAll";
    var params = {
      "token": token
    };
    businessSDK5.publish(funcName, params);
  },

  /**
   * 接受呼叫
   */
  publishAcceptCall: function (token, destId) {
    var funcName = "publishAcceptCall";
    var params = {
      "token": token,
      "destId": destId
    };
    businessSDK5.publish(funcName, params);
  },

  /**
   * 拒绝呼叫
   */
  publishRefuseCall: function (token, destId) {
    var funcName = "publishRefuseCall";
    var params = {
      "token": token,
      "destId": destId
    };
    businessSDK5.publish(funcName, params);
  },

  /**
   * 开启分组呼叫
   *
   * groupId: 分组ID
   */
  publishStartGroupCall: function (token, groupId) {
    var funcName = "publishStartGroupCall";
    var params = {
      "token": token,
      "groupId": groupId
    };
    businessSDK5.publish(funcName, params);
  },

  /**
   * 结束分组呼叫
   *
   * groupId: 分组ID
   */
  publishStopGroupCall: function (token, groupId) {
    var funcName = "publishStopGroupCall";
    var params = {
      "token": token,
      "groupId": groupId
    };
    businessSDK5.publish(funcName, params);
  },

  /**
   * 添加组外成员
   *
   * groupId: 分组ID
   * memberId: 成员ID
   */
  publishAddGroupCallMember: function (token, groupId, memberId) {
    var funcName = "publishAddGroupCallMember";
    var params = {
      "token": token,
      "groupId": groupId,
      "memberId": memberId
    };
    businessSDK5.publish(funcName, params);
  },

  /**
   * 移除成员
   *
   * groupId: 分组ID
   * memberId: 成员ID
   */
  publishRemoveGroupCallMember: function (token, groupId, memberId) {
    var funcName = "publishRemoveGroupCallMember";
    var params = {
      "token": token,
      "groupId": groupId,
      "memberId": memberId
    };
    businessSDK5.publish(funcName, params);
  },

  /**
   * 呼叫
   *
   * groupId: 分组ID
   * members: 成员数组
   */
  publishStartGroupCalling: function (token, groupId, members) {
    var funcName = "publishStartGroupCalling";
    var params = {
      "token": token,
      "groupId": groupId,
      "members": members
    };
    businessSDK5.publish(funcName, params);
  },

  /**
   * 停止
   *
   * groupId: 分组ID
   * members: 成员数组
   */
  publishStopGroupCalling: function (token, groupId, members) {
    var funcName = "publishStopGroupCalling";
    var params = {
      "token": token,
      "groupId": groupId,
      "members": members
    };
    businessSDK5.publish(funcName, params);
  },

  /**
   * 全部停止
   *
   * groupId: 分组ID
   */
  publishStopAllGroupCalling: function (token, groupId) {
    var funcName = "publishStopAllGroupCalling";
    var params = {
      "token": token,
      "groupId": groupId
    };
    businessSDK5.publish(funcName, params);
  },

  /** 18-视频会议（1.4）------------------------------------------------------------------------------ */

  /**
   * 开启临时会议
   *
   * topic: 临时会议主题
   * chairmanId: 主席ID
   * users: 成员数组
   * devices: 设备数组
   */
  publishStartTempMeeting: function (token, topic, chairmanId, users, devices, schemeId) {
    var funName = "publishStartTempMeeting";
    var params = {
      "token": token,
      "topic": topic,
      "chairmanId": chairmanId,
      "users": users,
      "devices": devices,
      "schemeId":schemeId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 开启预设会议
   *
   * topic: 临时会议主题
   * groupId: 分组ID
   */
  publishStartMeeting: function (token, topic, groupId) {
    var funName = "publishStartMeeting";
    var params = {
      "token": token,
      "topic": topic,
      "groupId": groupId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 关闭会议
   *
   * affairId: 会议ID
   */
  publishStopMeeting: function (token, affairId) {
    var funName = "publishStopMeeting";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 添加成员
   *
   * affairId: 会议ID
   * users: 成员数组
   */
  publishAddMeetingMember: function (token, affairId, users) {
    var funName = "publishAddMeetingMember";
    var params = {
      "token": token,
      "affairId": affairId,
      "users": users
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 成员-同意加入
   *
   * affairId: 会议ID
   * users: 成员数组
   */
  publishAcceptMeetingCall: function (token, affairId) {
    var funName = "publishAcceptMeetingCall";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 成员-拒绝加入
   *
   * affairId: 会议ID
   * users: 成员数组
   */
  publishRefuseMeetingCall: function (token, affairId) {
    var funName = "publishRefuseMeetingCall";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 强退成员
   *
   * affairId: 会议ID
   * users: 成员数组
   */
  publishKickMeetingMember: function (token, affairId, users) {
    var funName = "publishKickMeetingMember";
    var params = {
      "token": token,
      "affairId": affairId,
      "users": users
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 暂停会议
   *
   * affairId: 会议ID
   */
  publishPauseMeeting: function (token, affairId) {
    var funName = "publishPauseMeeting";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 恢复会议
   *
   * affairId: 会议ID
   */
  publishResumeMeeting: function (token, affairId) {
    var funName = "publishResumeMeeting";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 申请加入
   *
   * affairId: 会议ID
   */
  publishRequestMeetingJoin: function (token, affairId) {
    var funName = "publishRequestMeetingJoin";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 主席-同意加入
   *
   * affairId: 会议ID
   * users: 成员数组
   */
  publishAcceptMeetingJoin: function (token, affairId, userId) {
    var funName = "publishAcceptMeetingJoin";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 主席-拒绝加入
   *
   * affairId: 会议ID
   * users: 成员数组
   */
  publishRefuseMeetingJoin: function (token, affairId, userId) {
    var funName = "publishRefuseMeetingJoin";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 申请退出
   *
   * affairId: 会议ID
   */
  publishRequestMeetingExit: function (token, affairId) {
    var funName = "publishRequestMeetingExit";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 主席-同意退出
   *
   * affairId: 会议ID
   * users: 成员数组
   */
  publishAcceptMeetingExit: function (token, affairId, userId) {
    var funName = "publishAcceptMeetingExit";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 主席-拒绝退出
   *
   * affairId: 会议ID
   * users: 成员数组
   */
  publishRefuseMeetingExit: function (token, affairId, userId) {
    var funName = "publishRefuseMeetingExit";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 指定发言
   *
   * affairId: 会议ID
   * userId: 成员ID
   */
  publishAppointMeetingTalk: function (token, affairId, userId) {
    var funName = "publishAppointMeetingTalk";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 收回发言
   *
   * affairId: 会议ID
   * userId: 成员ID（不再需要）
   */
  publishReclaimMeetingTalk: function (token, affairId) {
    var funName = "publishReclaimMeetingTalk";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 申请发言
   *
   * affairId: 会议ID
   */
  publishRequestMeetingTalk: function (token, affairId) {
    var funName = "publishRequestMeetingTalk";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 主席-同意发言
   *
   * affairId: 会议ID
   * users: 成员数组
   */
  publishAcceptMeetingTalk: function (token, affairId, userId) {
    var funName = "publishAcceptMeetingTalk";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 主席-拒绝发言
   *
   * affairId: 会议ID
   * users: 成员数组
   */
  publishRefuseMeetingTalk: function (token, affairId, userId) {
    var funName = "publishRefuseMeetingTalk";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止发言
   *
   * affairId: 会议ID
   */
  publishStopMeetingTalk: function (token, affairId) {
    var funName = "publishStopMeetingTalk";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 开启会议讨论
   *
   * affairId: 会议ID
   */
  publishStartMeetingDiscuss: function (token, affairId) {
    var funName = "publishStartMeetingDiscuss";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止会议讨论
   *
   * affairId: 会议ID
   */
  publishStopMeetingDiscuss: function (token, affairId) {
    var funName = "publishStopMeetingDiscuss";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 开启会议方案
   *
   * affairId: 会议ID
   * schemeId: 方案ID
   */
  publishStartMeetingScheme: function (token, affairId, schemeId) {
    var funName = "publishStartMeetingScheme";
    var params = {
      "token": token,
      "affairId": affairId,
      "schemeId": schemeId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止会议方案
   *
   * affairId: 会议ID
   * schemeId: 方案ID
   */
  publishStopMeetingScheme: function (token, affairId, schemeId) {
    var funName = "publishStopMeetingScheme";
    var params = {
      "token": token,
      "affairId": affairId,
      "schemeId": schemeId
    };
    businessSDK5.publish(funName, params);
  },

   /**
   * 会议切换显示方案
   *
   * affairId: 会议ID
   * schemeId: 方案ID
   */
  publishChangeDisplayScheme: function (token, affairId, schemeId ) {
    var funName = "publishChangeDisplayScheme";
    var params = {
      "token": token,
      "affairId": affairId,
      "schemeId": schemeId,
    };
    businessSDK5.publish(funName, params);
  },

  //设置通知会议状态回调
  setReceiveInformMeetingStatusCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveInformMeetingStatusCB = cb;
    }
  },

  setReceiveInformMeetingStatusCallback2:function(cb){
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveInformMeetingStatusCB2 = cb;
    }
  },

  setReceiveInformMeetingStatusCallback3:function(cb){
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveInformMeetingStatusCB3 = cb;
    }
  },

  setReceiveInformMeetingStatusCallback4:function(cb){
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveInformMeetingStatusCB4 = cb;
    }
  },
  // //1.通知成员会议邀请 回调  2. 通知主席会议加入回调  3.通知主席会议退出回调  4.通知主席申请发言回调
  // setReceiveInformshowWindowCallback: function (cb) {
  //   if (cb != null && typeof (cb) != "undefined") {
  //     businessSDK5._receiveInformshowWindowCB = cb;
  //   }
  // },

  //推送振铃状态回调
  setReceiveInformRingStatusCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveInformRingStatusCB = cb;
    }
  },

  /**
   * 开启会场转发授权
   */
  publishStartMeetingTransmitAuth: function (token, affairId, users ) {
    var funName = "publishStartMeetingTransmitAuth";
    var params = {
      "token": token,
      "affairId": affairId,
      "users": users,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止会场转发授权
   */
  publishStopMeetingTransmitAuth: function (token, affairId, users ) {
    var funName = "publishStopMeetingTransmitAuth";
    var params = {
      "token": token,
      "affairId": affairId,
      "users": users,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 获取会场转发授权列表
   */
  publishQueryMeetingTransmitAuth: function (token, affairId ) {
    var funName = "publishQueryMeetingTransmitAuth";
    var params = {
      "token": token,
      "affairId": affairId,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 设置接收指挥转发授权列表回调
   */
  setReceiveMeetingTransmitAuthInfoCallBack:function(cb){
    if (cb != null && typeof (cb) != "undefined") {
        businessSDK5._receiveMeetingTransmitAuthCB = cb;
      }
  },

  /**
   * 获取会场转发成员
   */
  publishQueryMeetingTansmitMember: function (token, affairId ) {
    var funName = "publishQueryMeetingTansmitMember";
    var params = {
      "token": token,
      "affairId": affairId,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 设置接收会场转发成员回调
   */
  setReceiveMeetingTransmitMemberInfoCallBack:function(cb){
    if (cb != null && typeof (cb) != "undefined") {
        businessSDK5._receiveMeetingTransmitMemberCB = cb;
      }
  },
  
  /** 19-视频指挥（1.4）------------------------------------------------------------------------------ */

  /**
   * 开启临时指挥
   */
  publishStartTempCommand: function (token, topic, commanderId, users, devices, schemeId) {
    var funName = "publishStartTempCommand";
    var params = {
      "token": token,
      "topic": topic,
      "commanderId": commanderId,
      "users": users,
      "devices": devices,
      "schemeId":schemeId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 开启分组指挥
   */
  publishStartCommand: function (token, topic, groupId) {
    var funName = "publishStartCommand";
    var params = {
      "token": token,
      "topic": topic,
      "groupId": groupId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 关闭指挥
   */
  publishStopCommand: function (token, affairId) {
    var funName = "publishStopCommand";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 激活指挥
   */
  publishActivateCommand: function (token, affairId) {
    var funName = "publishActivateCommand";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 暂停指挥
   */
  publishPauseCommand: function (token, affairId) {
    var funName = "publishPauseCommand";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 恢复指挥
   */
  publishResumeCommand: function (token, affairId) {
    var funName = "publishResumeCommand";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 暂停成员
   */
  publishPauseMember: function (token, affairId, users) {
    var funName = "publishPauseMember";
    var params = {
      "token": token,
      "affairId": affairId,
      "users": users
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 恢复成员
   */
  publishResumeMember: function (token, affairId, users) {
    var funName = "publishResumeMember";
    var params = {
      "token": token,
      "affairId": affairId,
      "users": users
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 添加/邀请成员（指挥呼叫）
   */
  publishCallMember: function (token, affairId, users) {
    var funName = "publishCallMember";
    var params = {
      "token": token,
      "affairId": affairId,
      "users": users
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 强退成员
   */
  publishKickMember: function (token, affairId, users) {
    var funName = "publishKickMember";
    var params = {
      "token": token,
      "affairId": affairId,
      "users": users
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 强行插入指挥组参与指挥
   */
  publishForceJoin: function (token, affairId) {
    var funName = "publishForceJoin";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 申请加入指挥
   */
  publishApplyJoin: function (token, affairId) {
    var funName = "publishApplyJoin";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 申请退出指挥
   */
  publishApplyLeave: function (token, affairId) {
    var funName = "publishApplyLeave";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 控制音量
   */
  publishControlAudio: function (token, affairId, volume) {
    var funName = "publishControlAudio";
    var params = {
      "token": token,
      "affairId": affairId,
      "volume": volume
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 向上静默
   *
   * model: 静默模型 -1--None 0--Both 1--Video 2--Audio
   */
  publishUpSilentCommand: function (token, affairId, model) {
    var funName = "publishUpSilentCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "model": model
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 关闭向上静默
   */
  publishStopUpSilentCommand: function (token, affairId, model) {
    var funName = "publishStopUpSilentCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "model": model
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 向下静默
   */
  publishDownSilentCommand: function (token, affairId, model) {
    var funName = "publishDownSilentCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "model": model
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 关闭向下静默
   */
  publishStopDownSilentCommand: function (token, affairId, model) {
    var funName = "publishStopDownSilentCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "model": model
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 专向指挥
   *
   * model: 同向上静默model
   */
  publishSpecialCommand: function (token, affairId, userId, model) {
    var funName = "publishSpecialCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId,
      "model": model
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止专向指挥
   */
  publishStopSpecialCommand: function (token, affairId, userId, model) {
    var funName = "publishStopSpecialCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId,
      "model": model
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 协同指挥
   */
  publishCooperateCommand: function (token, affairId, userId, type) {
    var funName = "publishCooperateCommand";
    var params;
    if( type === 1 ) {
      params = {
        "token": token,
        "affairId": affairId,
        "destId": userId
      };
    } else if( type === 2 ) {
      params = {
        "token": token,
        "affairId": affairId,
        "userId": userId
      };
    }

    businessSDK5.publish(funName, params);
  },

  /**
   * 停止协同指挥
   */
  publishStopCooperateCommand: function (token, affairId,reqestId,destId) {
    var funName = "publishStopCooperateCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "reqestId": reqestId,
      "destId": destId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 查询协同列表
   */
  queryCooperate: function (token, affairId, callback) {
    var mapObj = new Map();
    mapObj.set("token", token);
    mapObj.set("affairId", affairId);
    var data = ajax.getData(mapObj);
    var url = "Command/queryCooperate";
    ajax.doPost(url, data, callback);
  },

  /**
   * 协调指挥
   */
  publishCoordinateCommand: function (token, affairId, users) {
    var funName = "publishCoordinateCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "users": users
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止协调指挥
   */
  publishStopCoordinateCommand: function (token, affairId,requestId, users) {
    var funName = "publishStopCoordinateCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "requestId": requestId,
      "users": users
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 查询协调列表
   */
  /*queryCoordinate: function (token, affairId, callback) {
    var mapObj = new Map();
    mapObj.set("token", token);
    mapObj.set("affairId", affairId);
    var data = ajax.getData(mapObj);
    var url = "Command/queryCoordinate";
    ajax.doPost(url, data, callback);
  },*/

  /**
   * 授权指挥
   */
  publishAuthorizeCommand: function (token, affairId, userId) {
    var funName = "publishAuthorizeCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止授权指挥
   */
  publishStopAuthorizeCommand: function (token, affairId, userId) {
    var funName = "publishStopAuthorizeCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 越级指挥
   */
  publishCrossGradeCommand: function (token, affairId, userId) {
    var funName = "publishCrossGradeCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 取消越级指挥
   */
  publishStopCrossGradeCommand: function (token, affairId, userId) {
    var funName = "publishStopCrossGradeCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 接替指挥（接管）
   */
  publishSupersedeCommand: function (token, affairId, userId) {
    var funName = "publishSupersedeCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 请求接替指挥
   */
  publishRequestSupersedeCommand: function (token, affairId, userId) {
    var funName = "publishRequestSupersedeCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止接替指挥
   */
  publishStopSupersedeCommand: function (token, affairId, userId) {
    var funName = "publishStopSupersedeCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 分派指挥
   */
  publishAllocateCommand: function (token, affairId, users) {
    var funName = "publishAllocateCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId,
      "users": users
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止分派指挥
   */
  publishCancelAllocateCommand: function (token, affairId, userId) {
    var funName = "publishCancelAllocateCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 指挥转发
   */
  publishTransmitCommand: function (token, affairId, resources, users) {
    var funName = "publishTransmitCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "resources": resources,
      "users": users
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止指挥转发
   */
  publishStopTransmitCommand: function (token, affairId, resourceId, resourceCh, userId) {
    var funName = "publishStopTransmitCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "resourceId": resourceId,
      "resourceCh": resourceCh,
      "userId": userId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止所有指挥转发
   */
  publishStopAllTransmitCommand: function (token, affairId) {
    var funName = "publishStopAllTransmitCommand";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 指挥广播
   */
  publishBroadcastCommand: function (token, affairId) {
    var funName = "publishBroadcastCommand";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止指挥广播
   */
  publishStopBroadcastCommand: function (token, affairId) {
    var funName = "publishStopBroadcastCommand";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 指挥提醒
   */
  publishForespeakCommand: function (token, affairId, userId) {
    var funName = "publishForespeakCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 停止指挥提醒
   */
  publishStopForespeakCommand: function (token, affairId, userId) {
    var funName = "publishStopForespeakCommand";
    var params = {
      "token": token,
      "affairId": affairId,
      "userId": userId
    };
    businessSDK5.publish(funName, params);
  },

  /********************************************************************* */

  /**
   * 1. 主席邀请成员加入指挥 - 同意
   */
  publishAccepCommandCall: function (token, affairId) {
    var funName = "publishAccepCommandCall";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 2. 主席邀请成员加入指挥 - 拒绝
   */
  publishRefuseCommandCall: function (token, affairId) {
    var funName = "publishRefuseCommandCall";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 3. 成员向主席申请加入指挥 - 同意
   */
  publishAccepCommandJoin: function (token, affairId) {
    var funName = "publishAccepCommandJoin";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 4. 成员向主席申请加入指挥 - 拒绝
   */
  publishRefuseCommandJoin: function (token, affairId) {
    var funName = "publishRefuseCommandJoin";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 5. 成员向主席申请退出指挥 - 同意
   */
  publishAcceptCommandExit: function (token, affairId) {
    var funName = "publishAcceptCommandExit";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 6. 成员向主席申请退出指挥 - 拒绝
   */
  publishRefuseCommandExit: function (token, affairId) {
    var funName = "publishRefuseCommandExit";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 7. 通知专向指挥邀请 - 同意
   */
  publishAcceptSpecialCommand: function (token, affairId) {
    var funName = "publishAcceptSpecialCommand";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 8. 通知专向指挥邀请 - 拒绝
   */
  publishRefuseSpecialCommand: function (token, affairId) {
    var funName = "publishRefuseSpecialCommand";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 9. 通知越级指挥申请 - 同意
   */
  publishAcceptCrossgadeCommand: function (token, affairId) {
    var funName = "publishAcceptCrossgadeCommand";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 10. 通知越级指挥申请 - 拒绝
   */
  publishRefuseCrossgadeCommand: function (token, affairId) {
    var funName = "publishRefuseCrossgadeCommand";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 通知授权指挥邀请 - 同意
   */
  publishAccepAuthorizeCommand: function (token, affairId) {
    var funName = "publishAccepAuthorizeCommand";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 通知授权指挥邀请 - 拒绝
   */
  publishRefuseAuthorizeCommand: function (token, affairId) {
    var funName = "publishRefuseAuthorizeCommand";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 通知协同指挥邀请 - 同意
   */
  publishAcceptCooperateCommand: function (token, affairId) {
    var funName = "publishAcceptCooperateCommand";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 通知协同指挥邀请 - 拒绝
   */
  publishRefuseCooperateCommand: function (token, affairId) {
    var funName = "publishRefuseCooperateCommand";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 通知接替指挥申请 - 同意
   */
  publishAcceptSupersedeCommand: function (token, affairId) {
    var funName = "publishAcceptSupersedeCommand";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 通知接替指挥申请 - 拒绝
   */
  publishRefuseSupersedeCommand: function (token, affairId) {
    var funName = "publishRefuseSupersedeCommand";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 通知分派指挥邀请 - 同意
   */
  publishAcceptAllocateCommand: function (token, affairId) {
    var funName = "publishAcceptAllocateCommand";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 通知分派指挥邀请 - 拒绝
   */
  publishRefuseAllocateCommand: function (token, affairId) {
    var funName = "publishRefuseAllocateCommand";
    var params = {
      "token": token,
      "affairId": affairId
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 开启指挥转发授权
   * users:["123","456"]
   */
  publishStartCommandTransmitAuth:function(token, affairId, users){
    var funName = "publishStartCommandTransmitAuth";
    var params = {
      "token": token,
      "affairId": affairId,
      "users": users,
    };
    businessSDK5.publish(funName, params);
  },

    /**
   * 停止指挥转发授权
   * users:["123","456"]
   */
  publishStopCommandTransmitAuth:function(token, affairId, users){
    var funName = "publishStopCommandTransmitAuth";
    var params = {
      "token": token,
      "affairId": affairId,
      "users": users,
    };
    businessSDK5.publish(funName, params);
  },


  /**
   * 设置通知指挥状态回调
   */
  setReceiveInformCommandStatusCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveInformCommandStatusCB = cb;
    }
  },


  /**
   * 设置通知指挥状态回调2
   */
  _receiveInformCommandStatusCB2:null,
  setReceiveInformCommandStatusCallback2: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveInformCommandStatusCB2 = cb;
    }
  },

  /**
   * 设置通知指挥状态回调3
   */
  _receiveInformCommandStatusCB3:null,
  setReceiveInformCommandStatusCallback3: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveInformCommandStatusCB3 = cb;
    }
  },

  /**
   * 设置通知指挥状态回调4
   */
  _receiveInformCommandStatusCB4:null,
  setReceiveInformCommandStatusCallback4: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveInformCommandStatusCB4 = cb;
    }
  },

    /**
   * 获取指挥转发授权列表
   */
  publishQueryCommandTransmitAuth: function (token, affairId) {
    var funName = "publishQueryCommandTransmitAuth";
    var params = {
      "token": token,
      "affairId": affairId,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 设置接收指挥转发授权列表回调
   */
  setReceiveCommandTransmitAuthInfoCallBack:function(cb){
    if (cb != null && typeof (cb) != "undefined") {
        businessSDK5._receiveCommandTransmitAuthCB = cb;
      }
  },

  /**
   * 获取指挥转发成员
   */
  publishQueryCommandTansmitMember: function (token, affairId) {
    var funName = "publishQueryCommandTansmitMember";
    var params = {
      "token": token,
      "affairId": affairId,
    };
    businessSDK5.publish(funName, params);
  },

  /**
   * 设置接收指挥转发成员回调
   */
  setReceiveCommandTransmitMemberInfoCallBack:function(cb){
    if (cb != null && typeof (cb) != "undefined") {
        businessSDK5._receiveCommandTransmitMemberCB = cb;
      }
  },


  /** OLD INTERFACES ------------------------------------------------------------------------------- */


  /*人员资源树**************************************************************************************/
  //订阅人员树状态
  //   queryKey：查询关键字。String
  //   online：是否在线。boolean
  //   type：订阅类型
  //   subID：订阅标识
  subscribePersonStatus: function (queryKey, online, type, subID) {
    var funName = "subscribePersonStatus";
    var params = {
      "queryKey": queryKey,
      "online": online,
      "type": type,
      "subID": subID
    };
    businessSDK5.publish(funName, params);
  },
  //取消订阅人员树状态
  //   subID：订阅标识
  cancelSubscribePersonStatus: function (subID) {
    var funName = "cancelSubscribePersonStatus";
    var params = {
      "subID": subID
    };
    businessSDK5.publish(funName, params);
  },
  //设置接收人员树状态时回调
  setReceivePersonStatusCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receivePersonStatusCB = cb;
    }
  },
  /*设备资源树**************************************************************************************/
  //订阅设备状态
  //   queryKey：查询关键字。String
  //   online：是否在线。boolean
  //   type：订阅类型
  //   subID：订阅标识
  subscribeDeviceStatus: function (queryKey, online, type, subID) {
    var funName = "subscribeDeviceStatus";
    var params = {
      "queryKey": queryKey,
      "online": online,
      "type": type,
      "subID": subID
    };
    businessSDK5.publish(funName, params);
  },
  //取消订阅设备树状态
  //   subID：订阅标识
  cancelSubscribeDeviceStatus: function (subID) {
    var funName = "cancelSubscribeDeviceStatus";
    var params = {
      "subID": subID
    };
    businessSDK5.publish(funName, params);
  },
  //设置接收设备树状态时回调
  setReceiveDeviceStatusCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveDeviceStatusCB = cb;
    }
  },
  /*常用资源列表**************************************************************************************/


  /*用户业务状态**************************************************************************************/
  //订阅业务状态
  //   businessTypes：业务类型数组
  //   subID：订阅ID
  subscribeBusinessStatus: function (businessTypes, subID) {
    var funName = "subscribeBusinessStatus";
    var params = {
      "businessTypes": businessTypes,
      "subID": subID
    };
    businessSDK5.publish(funName, params);
  },
  //取消订阅业务状态
  //   subID：订阅ID
  cancelSubscribeBusinessStatus: function (subID) {
    var funName = "cancelSubscribeBusinessStatus";
    var params = {
      "subID": subID
    };
    businessSDK5.publish(funName, params);
  },
  //设置业务状态回调
  setReceiveBusinessStatusCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveBusinessStatusCB = cb;
    }
  },

  /*分屏业务**************************************************************************************/
  //设置分屏
  //   splitType：分屏模式
  publishSplitScreen: function (splitType) {
    var funName = "publishSplitScreen";
    var params = {
      "splitType": splitType
    };
    businessSDK5.publish(funName, params);
  },
  //设置全屏
  //   screenIndex：分屏索引
  publishSetFullScreen: function (screenIndex) {
    var funName = "publishSetFullScreen";
    var params = {
      "screenIndex": screenIndex
    };
    businessSDK5.publish(funName, params);
  },
  //取消设置全屏：
  publishCancelFullScreen: function () {
    var funName = "publishCancelFullScreen";
    var params = {};
    businessSDK5.publish(funName, params);
  },
  //设置选中分屏
  //   screenIndex：分屏索引
  publishSelectedScreen: function (screenIndex) {
    var funName = "publishSelectedScreen";
    var params = {
      "screenIndex": screenIndex
    };
    businessSDK5.publish(funName, params);
  },
  // /*呼叫业务**************************************************************************************/
  // //开启呼叫
  // //   receiverID：接收人ID
  // //   receiverName：接收人名称
  // //   receiverCenterID：接收人中心ID
  // // publishStartCall : function(receiverID, receiverName, receiverCenterID){
  // publishStartCall: function (srcId, srcName, srcCenterId, destId, destName, destCenterId) {
  //   var funName = "publishStartCall";
  //   var params = {
  //     // "srcId"       : receiverID,
  //     // "receiverName"     : receiverName,
  //     // "receiverCenterID" : receiverCenterID
  //     "srcId": srcId,
  //     "srcName": srcName,
  //     "srcCenterId": srcCenterId,
  //     "destId": destId,
  //     "destName": destName,
  //     "destCenterId": destCenterId,
  //   };
  //   businessSDK5.publish(funName, params);
  // },
  // //停止呼叫
  // //   userID：用户ID
  // // publishStopCall : function(userID){
  // publishStopCall: function (destId) {
  //   var funName = "publishStopCall";
  //   // var params = {"userID" : userID};
  //   var params = {
  //     "destId": destId
  //   };
  //   businessSDK5.publish(funName, params);
  // },
  // //停止全部呼叫
  // publishStopCallAll: function () {
  //   var funName = "publishStopCallAll";
  //   var params = {};
  //   businessSDK5.publish(funName, params);
  // },
  // //接收呼叫
  // //   senderID：发起人ID
  // // publishAcceptCall : function(senderID){
  // publishAcceptCall: function (srcId, destId) {
  //   var funName = "acceptCall";
  //   var params = {
  //     // "senderID" : senderID
  //     "srcId": srcId,
  //     "destId": destId,
  //   };
  //   businessSDK5.publish(funName, params);
  // },
  // //拒绝呼叫
  // //   senderID：发起人ID
  // // publishRefuseCall : function(senderID){
  // publishRefuseCall: function (srcId, destId) {
  //   var funName = "refuseCall";
  //   var params = {
  //     // "senderID" : senderID
  //     "srcId": srcId,
  //     "destId": destId,
  //   };
  //   businessSDK5.publish(funName, params);
  // },
  // /*对讲业务**************************************************************************************/
  // //开启对讲
  // //   receiverID：接收人ID
  // //   receiverName：接收人名称
  // //   receiverCenterID：接收人中心ID
  // publishStartSpeak: function (receiverID, receiverName, receiverCenterID) {
  //   var funName = "publishStartSpeak";
  //   var params = {
  //     "receiverID": receiverID,
  //     "receiverName": receiverName,
  //     "receiverCenterID": receiverCenterID
  //   };
  //   businessSDK5.publish(funName, params);
  // },
  // //停止对讲
  // //   userID：用户ID
  // publishStopSpeak: function (userID) {
  //   var funName = "publishStopSpeak";
  //   var params = {
  //     "userID": userID
  //   };
  //   businessSDK5.publish(funName, params);
  // },
  // //停止全部对讲
  // publishStopSpeakAll: function () {
  //   var funName = "publishStopSpeakAll";
  //   var params = {};
  //   businessSDK5.publish(funName, params);
  // },
  // //接收对讲
  // //   senderID：发起人ID
  // publishAcceptSpeak: function (senderID) {
  //   var funName = "publishAcceptSpeak";
  //   var params = {
  //     "senderID": senderID
  //   };
  //   businessSDK5.publish(funName, params);
  // },
  // //拒绝对讲
  // //   senderID：发起人ID
  // publishRefuseSpeak: function (senderID) {
  //   var funName = "publishRefuseSpeak";
  //   var params = {
  //     "senderID": senderID
  //   };
  //   businessSDK5.publish(funName, params);
  // },

    /*转发业务**************************************************************************************/

    /**
     * 开启转发
     * @param {token} token
     * @param {转发资源信息} transinfo [{resId:"XTTEST0000034",resch:1}]
     * @param {转发接受者ID信息} receiver [{receiveId:”XTTEST000034”}]
     * @param {业务ID} affairId
     */
    publishStartTransmit: function(token, transinfo, receiver, affairId) {
        var funName = "publishStartTransmit";
        var params = {
            "token": token,
            "transinfo": transinfo,
            "receiver": receiver,
            "affairId": affairId,
        };
        businessSDK5.publish(funName, params);
    },

    /**
     * 停止转发
     * @param {token} token
     * @param {*} requestId
     * @param {*} destId
     * @param {*} resId
     * @param {*} resch
     * @param {*} affairId
     */
    publishStopTransmit: function(token, requestId, destId, resId, resch, affairId) {
        var funName = "publishStopTransmit";
        var params = {
            "token": token,
            "requestId": requestId,
            "destId": destId,
            "resId": resId,
            "resch": resch,
            "affairId": affairId
        };
        businessSDK5.publish(funName, params);
    },

    /**
     * 停止所有接受的转发
     * @param {token} token
     * @param {affairId} affairId
     */
    publishStopRecvTransmitAll: function(token, affairId) {
        var funName = "publishStopRecvTransmitAll";
        var params = {
            "token": token,
            "affairId": affairId
        };
        businessSDK5.publish(funName, params);
    },

    /**
     * 停止所有发起的转发
     * @param {token} token
     * @param {affairId} affairId
     */
    publishStopInviteTransmitAll: function(token, affairId) {
        var funName = "publishStopInviteTransmitAll";
        var params = {
            "token": token,
            "affairId": affairId
        };
        businessSDK5.publish(funName, params);
    },


    /**
     * 订阅转发列表
     * @param {token} token
     * @param {affairId} affairId
     */
    subscribeTransmit: function(token, affairId) {
        var funName = "subscribeTransmit";
        var params = {
            "token": token,
            "affairId": affairId
        };
        businessSDK5.publish(funName, params);
    },
    /**
     * 取消订阅转发列表
     * @param {toekn} token
     */
    cancelsubscribeTransmit: function(token) {
        var funName = "cancelsubscribeTransmit";
        var params = {
            "token": token
        };
        businessSDK5.publish(funName, params);
    },
    /**
     * 设置接收转发列表回调
     * @param {*} cb
     * params:{type:"init/add/remove/refresh",affairId,
     *  init：[{requestId:"",destId:"",destName:"",resId:"",resch:"",resName:"",status:"",type:""}]，
     *  add：[{requestId:"",destId:"",destName:"",resId:"",resch:"",resName:"",status:"",type:""}]，
     *  remove:[{requestId:"",destId:"",destName:"",resId:"",resch:"",resName:"",status:"",type:""}],
     *  refresh：{requestId:"",destId:"",destName:"",resId:"",resch:"",resName:"",status:"",type:""}
     * status：0-等待接受
               1-正在转发
        type： 1-发起
               2-接收
     */
    setReceiveTransmitInfoListCallback: function(cb) {
        if (cb != null && typeof(cb) != "undefined") {
            businessSDK5._receiveTransmitListCB = cb;
        }
    },

    /**
     * 接收转发
     * @param {*} requestId
     * @param {*} destId
     * @param {*} resId
     * @param {*} resch
     * @param {*} affairId
     */
    publishAcceptTransmit: function(requestId, destId, resId, resch, affairId) {
        //{requestId:"aaaa",destId:"",resId:"",resch:1}
        var funName = "publishAcceptTransmit";
        var params = {
            "requestId": requestId,
            "destId": destId,
            "resId": resId,
            "resch": resch,
            "affairId": affairId
        };
        businessSDK5.publish(funName, params);
    },

    /**
     * 拒绝转发
     * @param {*} requestId
     * @param {*} destId
     * @param {*} resId
     * @param {*} resch
     * @param {*} affairId
     */
    publishRefuseTransmit: function(requestId, destId, resId, resch, affairId) {
        //{requestId:"aaaa",destId:"",resId:"",resch:1}
        var funName = "publishRefuseTransmit";
        var params = {
            "requestId": requestId,
            "destId": destId,
            "resId": resId,
            "resch": resch,
            "affairId": affairId
        };
        businessSDK5.publish(funName, params);
    },

    /** 2020.03.04注释 ******************************************************************************************/
    /* //开启转发
    //   transInfos：转发信息（资源ID、资源通道号、资源名称）
    //   receiverIDs：多个接收人ID
    publishStartTransmit: function(transInfos, receiverIDs) {
        //transInfos:[{resourceId:"XTTEST0000034",resourceCH:1}],receiveIDs:[{receiveId:”XTTEST000034”}
        var funName = "publishStartTransmit";
        var params = {
            "transInfos": transInfos,
            "receiverIDs": receiverIDs
        };
        businessSDK5.publish(funName, params);
    },
    //停止转发
    //   userID：用户ID
    //   resID：资源ID
    //   resCH：	资源通道号
    publishStopTransmit: function(userID, resID, resCH) {
        var funName = "publishStopTransmit";
        var params = {
            "userID": userID,
            "resID": resID,
            "resCH": resCH
        };
        businessSDK5.publish(funName, params);
    },
    //停止全部转发
    publishStopTransmitAll: function() {
        var funName = "publishStopTransmitAll";
        var params = {};
        businessSDK5.publish(funName, params);
    },
    //订阅转发列表
    subscribeTransmitList: function() {
        var funName = "subscribeTransmitList";
        var params = {};
        businessSDK5.publish(funName, params);
    },
    //取消订阅转发列表
    cancelSubscribeTransmitList: function() {
        var funName = "cancelSubscribeTransmitList";
        var params = {};
        businessSDK5.publish(funName, params);
    },
    //设置接收转发列表回调
    setReceiveTransmitListCallback: function(cb) {
        //receiveList:[{resName:"",resId:"",resCH:1,receiveUserName:"测试用户",dateTime:"2019-03-04 10:20:10",status:1}],sendList:[{resName:"",resId:"",resCH:1,receiveUserName:"测试用户",dateTime:"2019-03-04 10:20:10",status}]
        if (cb != null && typeof(cb) != "undefined") {
            businessSDK5._receiveTransmitListCB = cb;
        }
    },
    //同意转发
    //   senderID：发起人ID
    //   resID：	资源ID
    //   resCH：	资源通道号
    acceptTransmit: function(senderID, resID, resCH) {
        //{requestId:"aaaa",destId:"",resId:"",resch:1}
        var funName = "acceptTransmit";
        var params = {
            "senderID": senderID,
            "resID": resID,
            "resCH": resCH
        };
        businessSDK5.publish(funName, params);
    },
    //拒绝转发
    //   senderID：发起人ID
    //   resID：资源ID
    //   resCH：	资源通道号
    refuseTransmit: function(senderID, resID, resCH) {
        //{requestId:"aaaa",destId:"",resId:"",resch:1}
        var funName = "refuseTransmit";
        var params = {
            "senderID": senderID,
            "resID": resID,
            "resCH": resCH
        };
        businessSDK5.publish(funName, params);
    }, */

    /** 2020.03.04注释 ******************************************************************************************/

  // /*云台业务**************************************************************************************/
  // //焦距控制
  // //   resID：资源ID
  // //   resCH：资源通道号
  // //   zoom：焦距
  // //   speed：	速度
  // // publishZoomControl : function(resID, resCH, zoom, speed){
  // publishZoomControl: function (resId, resCh, zoom, speed) {
  //   var funName = "publishZoomControl";
  //   var params = {
  //     // "resID" : resID,
  //     // "resCH" : resCH,
  //     // "focus" : focus,
  //     // "speed" : speed,
  //     "resId": resId,
  //     "resCh": resCh,
  //     "zoom": zoom,
  //     "speed": speed,
  //   };
  //   businessSDK5.publish(funName, params);
  // },
  // //焦点控制
  // //   resID：资源ID
  // //   resCH：资源通道号
  // //   focus：焦点
  // //   speed：	速度
  // // publishFocusControl : function(resID, resCH, focus, speed){
  // publishFocusControl: function (resId, resCh, focus, speed) {
  //   var funName = "publishFocusControl";
  //   var params = {
  //     // "resID" : resID,
  //     // "resCH" : resCH,
  //     // "focus" : focus,
  //     // "speed" : speed,
  //     "resId": resId,
  //     "resCh": resCh,
  //     "focus": focus,
  //     "speed": speed,
  //   };
  //   businessSDK5.publish(funName, params);
  // },
  // //云台方向
  // //   resID：资源ID
  // //   resCH：资源通道号
  // //   direction：方向（上、下、左、右、左上、右上、左下、右下）
  // //   speed：	速度
  // // publishDirectionControl : function(resID, resCH, direction, speed){
  // publishDirectionControl: function (resId, resCh, direction, speed) {
  //   var funName = "publishDirectionControl";
  //   var params = {
  //     // "resID"     : resID,
  //     // "resCH"     : resCH,
  //     // "direction" : direction,
  //     // "speed"     : speed,
  //     "resId": resId,
  //     "resCh": resCh,
  //     "direction": direction,
  //     "speed": speed,
  //   };
  //   businessSDK5.publish(funName, params);
  // },
  // //雨刷
  // //   resID：资源ID
  // //   resCH：资源通道号
  // //   operate：
  // // publishWiperControl : function(resID, resCH, operate){
  // // publishWiperControl : function(resId, resCh, ch, value){
  // publishWiperControl: function (resId, resCh, value) {
  //   var funName = "publishWiperControl";
  //   var params = {
  //     // "resID"   : resID,
  //     // "resCH"   : resCH,
  //     // "operate" : operate,
  //     "resId": resId,
  //     "resCh": resCh,
  //     // "ch" : ch,
  //     "value": value,
  //   };
  //   businessSDK5.publish(funName, params);
  // },
  // //光圈
  // //   resID：资源ID
  // //   resCH：资源通道号
  // //   apertureCtrl：
  // //   speed：	速度
  // // publishApertureControl : function(resID, resCH, apertureCtrl, speed){
  // publishApertureControl: function (resId, resCh, aperturectrl, speed) {
  //   var funName = "publishApertureControl";
  //   var params = {
  //     // "resID"   : resID,
  //     // "resCH"   : resCH,
  //     // "operate" : operate,
  //     "resId": resId,
  //     "resCh": resCh,
  //     "aperturectrl": aperturectrl,
  //     "speed": speed,
  //   };
  //   businessSDK5.publish(funName, params);
  // },
  // //加热
  // //   resID：资源ID
  // //   resCH：资源通道号
  // //   operate：
  // // publishAddHeat : function(resID, resCH, operate){
  // publishAddHeat: function (resId, resCh, value) {
  //   var funName = "publishAddHeat";
  //   var params = {
  //     // "resID"   : resID,
  //     // "resCH"   : resCH,
  //     // "operate" : operate,
  //     "resId": resId,
  //     "resCh": resCh,
  //     "value": value,
  //   };
  //   businessSDK5.publish(funName, params);
  // },
  // //停止控制
  // publishStopControl: function (resId, resCh, direction, speed, aperturectrl, focusctrl, zoom, type) {
  //   var funName = "publishStopControl";
  //   var params = {
  //     "resId": resId,
  //     "resCh": resCh,
  //     "direction": direction,
  //     "speed": speed,
  //     "aperturectrl": aperturectrl,
  //     "focusctrl": focusctrl,
  //     "zoom": zoom,
  //     "type": type,
  //   };
  //   // params:{resId: "aaaa", resCh: 0, direction: "", speed: 1,aperturectrl: "", focusctrl: "", zoom: "",type: ""}
  //   // type--directionControl,focusControl,zoomControl,apertureControl
  //   businessSDK5.publish(funName, params);
  // },
  // //重置预置点
  // //   resID：资源ID
  // //   resCH：	资源通道号
  // // publishResetPoint : function(resID, resCH){
  // publishResetPoint: function (resId, resCh) {
  //   var funName = "publishResetPoint";
  //   var params = {
  //     // "resID" : resID,
  //     // "resCH" : resCH,
  //     "resId": resId,
  //     "resCh": resCh,
  //   };
  //   businessSDK5.publish(funName, params);
  // },
  // //云台接管
  // //   resID：资源ID
  // //   resCH：资源通道号
  // //   isTakeover：是否接管
  // // publishTakeoverYT : function(resID, resCH, isTakeover){
  // publishTakeoverYT: function (resId, resCh, value) {
  //   var funName = "publishTakeoverYT";
  //   var params = {
  //     // "resID" : resID,
  //     // "resCH" : resCH,
  //     // "isTakeover" : isTakeover,
  //     "resId": resId,
  //     "resCh": resCh,
  //     "value": value,
  //   };
  //   businessSDK5.publish(funName, params);
  // },
  // //跳转预置点
  // //   resID：资源ID
  // //   resCH：资源通道号
  // //   pointID：预置点ID
  // // publishUpResPoint : function(resID, resCH, pointID){
  // publishUpResPoint: function (resId, resCh, pointId) {
  //   var funName = "publishUpResPoint";
  //   var params = {
  //     // "resID" : resID,
  //     // "resCH" : resCH,
  //     // "pointID" : pointID,
  //     "resId": resId,
  //     "resCh": resCh,
  //     "pointId": pointId,
  //   };
  //   businessSDK5.publish(funName, params);
  // },

  /*通知业务**************************************************************************************/
  //发送通知
  //   receiverIDs：多个接收人ID
  //   message：消息内容
  publishSendNotify: function (receiverIDs, message) {
    //tragetIds:[{"343434","44444"}],message:"测试测试"
    var funName = "publishSendNotify";
    var params = {
      "receiverIDs": receiverIDs,
      "message": message
    };
    businessSDK5.publish(funName, params);
  },
  //订阅通知状态
  subscribeNotifyStatus: function () {
    var funName = "subscribeNotifyStatus";
    var params = {};
    businessSDK5.publish(funName, params);
  },
  //取消订阅通知状态
  cancelSubscribeNotifyStatus: function () {
    var funName = "cancelSubscribeNotifyStatus";
    var params = {};
    businessSDK5.publish(funName, params);
  },
  //设置接收通知回调
  setReceiveNotifyStatusCallback: function (cb) {
    //{revDate:"2018-11-10 20:20:10",senderName:"测试用户",content:"请参加11月18号会议任务",total:10}
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveNotifyStatusCB = cb;
    }
  },

    /*场景控制**************************************************************************************/

    /**
     * 订阅当前所有业务场景
     * @param {*} token
     */
    subscribeAffairList: function(token) {
        var funName = "subscribeAffairs";
        var params = {
            "token": token
        };
        businessSDK5.publish(funName, params);
    },
    /**
     * 取消订阅当前所有业务场景
     * @param {*} token
     */
    cancelSubscribeAffairList: function(token) {
        var funName = "cancelSubscribeAffairs";
        var params = {
            "token": token
        };
        businessSDK5.publish(funName, params);
    },
    /**
     * 设置接收场景列表回调
     * @param {*} cb
     */
    setReceiveAffairListCallback: function(cb) {
        //		informAffairStatus : function([affairName:"测试分组",affairId:"433",type:1,affairStatus:0,takeTime:"1小时30分"}]){  },
        if (cb != null && typeof(cb) != "undefined") {
            businessSDK5._receiveAffairListCB = cb;
        }
    },

    /**
     * 订阅业务场景实时状态
     * @param {*} token
     * @param {*} affairID
     */
    subscribeAffairDetail: function(token, affairID) {
        var funName = "subscribeAffairDetail";
        var params = {
            "token": token,
            "affairID": affairID
        };
        businessSDK5.publish(funName, params);
    },
    /**
     * 取消订阅当前所有业务场景
     * @param {*} token
     * @param {*} affairID
     */
    cancelSubscribeAffairDetail: function(token, affairID) {
        var funName = "cancelSubscribeAffairDetail";
        var params = {
            "token": token,
            "affairID": affairID
        };
        businessSDK5.publish(funName, params);
    },

    /**
     * 订阅的视频会议业务场景的详细信息
     * @param {回调参数} cb
     */
    setReceiveMeetingAffairInfoCallback: function(cb) {
        if (cb != null && typeof(cb) != "undefined") {
            businessSDK5._receiveMeetingAffairInfoCB = cb;
        }
    },
    /**
     * 订阅的视频指挥业务场景的详细信息
     * @param {回调参数} cb
     */
    setReceiveCommandAffairInfoCallback: function(cb) {
      if (cb != null && typeof(cb) != "undefined") {
          businessSDK5._receiveCommandAffairInfoCB = cb;
      }
    },

    /**
     * 开启业务显示方案
     * @param {token} token
     * @param {业务ID} affairId
     * @param {显示方案ID} schemeId
     */
    publishStartAffairScheme: function(token, affairId, schemeId) {
        var funName = "publishStartAffairScheme";
        var params = {
            "token": token,
            "affairId": affairId,
            "schemeId": schemeId
        };
        businessSDK5.publish(funName, params);
    },

    /**
     * 停止业务显示方案
     * @param {token} token
     * @param {业务ID} affairId
     * @param {显示方案ID} schemeId
     */
    publishStopAffairScheme: function(token, affairId, schemeId) {
        var funName = "publishStopAffairScheme";
        var params = {
            "token": token,
            "affairId": affairId,
            "schemeId": schemeId
        };
        businessSDK5.publish(funName, params);
    },

    /**
     * 切换业务显示方案
     * @param {token} token
     * @param {业务ID} affairId
     * @param {显示方案ID} schemeId
     */
    publishReplaceAffairScheme: function(token, affairId, schemeId) {
        var funName = "publishReplaceAffairScheme";
        var params = {
            "token": token,
            "affairId": affairId,
            "schemeId": schemeId
        };
        businessSDK5.publish(funName, params);
    },
    /**
     * 停止业务
     * @param {业务ID} affairID
     */
    publishStopAffair: function(token, affairId) {
        var funName = "publishStopAffair";
        var params = {
            "token": token,
            "affairId": affairId
        };
        businessSDK5.publish(funName, params);
    },
    /**  原有接口 2020-03-03注释  */
    //订阅场景列表
    /* subscribeAffairList: function () {
      var funName = "subscribeAffairList";
      var params = {};
      businessSDK5.publish(funName, params);
    }, */
    //取消订阅场景状态
    /* cancelSubscribeAffairList: function () {
      var funName = "cancelSubscribeAffairList";
      var params = {};
      businessSDK5.publish(funName, params);
    }, */
    //设置接收场景列表回调
    /* setReceiveAffairListCallback: function (cb) {
      //		informAffairStatus : function([affairName:"测试分组",affairId:"433",type:1,affairStatus:0,takeTime:"1小时30分"}]){  },
      if (cb != null && typeof (cb) != "undefined") {
        businessSDK5._receiveAffairListCB = cb;
      }
    }, */
    //切换场景控制
    //   affairID：场景ID
    //   isApply：是否应用
    /* publishSwitchAffair: function(affairID, isApply) {
        var funName = "publishSwitchAffair";
        var params = {
            "affairID": affairID,
            "isApply": isApply
        };
        businessSDK5.publish(funName, params);
    }, */
    //停止场景
    //   affairID：场景ID
    /*  publishStopAffair: function(affairID) {
         var funName = "publishStopAffair";
         var params = {
             "affairID": affairID
         };
         businessSDK5.publish(funName, params);
     }, */
    /**  原有接口 2020-03-03注释以上  */
    /*音频广播**************************************************************************************/
    publishStartAudioBroadcase: function(name, description, personInfos, deviceInfos) {
        var funName = "publishStartAudioBroadcase";
        var params = {
            "name": name,
            "description": description,
            "personInfos": personInfos,
            "deviceInfos": deviceInfos
        };
        businessSDK5.publish(funName, params);
    },
    //移除音频广播成员
    publishRemoveAudioBroadcaseMember: function(personInfos, deviceInfos) {
        var funName = "publishRemoveAudioBroadcaseMember";
        var params = {
            "personInfos": personInfos,
            "deviceInfos": deviceInfos
        };
        businessSDK5.publish(funName, params);
    },
    //关闭音频广播
    //   affairID：场景ID
    publishStopAudioBroadcase: function(affairID) {
        var funName = "publishStopAudioBroadcase";
        var params = {
            "affairID": affairID
        };
        businessSDK5.publish(funName, params);
    },
    //添加资源
    publishAddAudioBoardCaseMember: function(affairID, personInfos, deviceInfos) {
        var funName = "publishAddAudioBoardCaseMember";
        var params = {
            "affairID": affairID,
            "personInfos": personInfos,
            "deviceInfos": deviceInfos
        };
        businessSDK5.publish(funName, params);
    },

  // /*分组点播**************************************************************************************/
  // //开启分组点播
  // publishStartGroupPlay: function (name, schemeID, osdStyleID, description, personInfos, deviceInfos) {
  //   //bussName:"测试分组",schemeId:"09093-48043aadfb"，osdStyleId:"",description:"领导检查",peopleList:[{resId:"",resName:"张三"}]，deviceList:[{resId:"",resCh:"",resName:"设备AAA"}]
  //   var funName = "publishStartGroupPlay";
  //   var params = {
  //     "name": name,
  //     "schemeID": schemeID,
  //     "osdStyleID": osdStyleID,
  //     "description": description,
  //     "personInfos": personInfos,
  //     "deviceInfos": deviceInfos
  //   };
  //   businessSDK5.publish(funName, params);
  // },
  // //移除成员
  // publishRemoveGroupPlay: function (personIDs, deviceIDs) {
  //   var funName = "publishRemoveGroupPlay";
  //   var params = {
  //     "personIDs": personIDs,
  //     "deviceIDs": deviceIDs
  //   };
  //   businessSDK5.publish(funName, params);
  // },
  // //添加资源
  // publishAddGroupPlay: function (affairID, personInfos, deviceInfos) {
  //   var funName = "publishAddGroupPlay";
  //   var params = {
  //     "affairID": affairID,
  //     "personInfos": personInfos,
  //     "deviceInfos": deviceInfos
  //   };
  //   businessSDK5.publish(funName, params);
  // },
  // //关闭分组点播
  // publishStopGroupPlay: function (affairID) {
  //   var funName = "publishStopGroupPlay";
  //   var params = {
  //     "affairID": affairID
  //   };
  //   businessSDK5.publish(funName, params);
  // },

  // // 开启分组呼叫
  // publishStartGroupCall: function (token, groupId) {
  //   var funName = "publishStartGroupCall";
  //   var params = {
  //     "token": token
  //   };
  //   var params = {
  //     "groupId": groupId
  //   };
  //   businessSDK5.publish(funName, params);
  // },

  // // 结束分组呼叫
  // publishStopGroupCall: function (token, groupId) {
  //   var funName = "publishStopGroupCall";
  //   var params = {
  //     "token": token
  //   };
  //   var params = {
  //     "groupId": groupId
  //   };
  //   businessSDK5.publish(funName, params);
  // },

  // // 呼叫
  // publishStartGroupCalling: function (token, groupId, members) {
  //   var funName = "publishStopGroupCall";
  //   var params = {
  //     "token": token
  //   };
  //   var params = {
  //     "groupId": groupId
  //   };
  //   var params = {
  //     "members": members
  //   };
  //   businessSDK5.publish(funName, params);
  // },

  // // 停止
  // publishStopGroupCalling: function (token, groupId, members) {
  //   var funName = "publishStopGroupCall";
  //   var params = {
  //     "token": token
  //   };
  //   var params = {
  //     "groupId": groupId
  //   };
  //   var params = {
  //     "members": members
  //   };
  //   businessSDK5.publish(funName, params);
  // },

  // // 添加组外成员
  // publishAddGroupCallMember: function (token, groupId, memberId) {
  //   var funName = "publishStopGroupCall";
  //   var params = {
  //     "token": token
  //   };
  //   var params = {
  //     "groupId": groupId
  //   };
  //   var params = {
  //     "members": memberId
  //   };
  //   businessSDK5.publish(funName, params);
  // },

  // // 移除成员
  // publishRemoveGroupCallMember: function (token, groupId, memberId) {
  //   var funName = "publishStopGroupCall";
  //   var params = {
  //     "token": token
  //   };
  //   var params = {
  //     "groupId": groupId
  //   };
  //   var params = {
  //     "members": memberId
  //   };
  //   businessSDK5.publish(funName, params);
  // },

  /*历史业务**************************************************************************************/
  //订阅历史发起业务
  subscribeSendBusinessList: function (businessType, beginTime, endTime, queryKey) {
    var funName = "subscribeSendBusinessList";
    var params = {
      "businessType": businessType,
      "beginTime": beginTime,
      "endTime": endTime,
      "queryKey": queryKey
    };
    businessSDK5.publish(funName, params);
  },
  //取消订阅历史发起业务
  cancelSubscribeSendBusinessList: function () {
    var funName = "cancelSubscribeSendBusinessList";
    var params = {};
    businessSDK5.publish(funName, params);
  },
  //设置接收历史发起业务回调
  setReceiveSendBusinessListCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveSendBusinessListCB = cb;
    }
  },
  //订阅历史参与业务
  //   businessType：业务类型
  //   beginTime：开始时间
  //   endTime：结束时间
  //   queryKey：查询关键字
  subscribeJoinBusinessList: function (businessType, beginTime, endTime, queryKey) {
    //{bussType:1,beginTime:"2019-03-08 19:20:10",endTime:"2019-03-08 19:20:40",searchQuery:""}
    var funName = "subscribeJoinBusinessList";
    var params = {
      "businessType": businessType,
      "beginTime": beginTime,
      "endTime": endTime,
      "queryKey": queryKey
    };
    businessSDK5.publish(funName, params);
  },
  //取消订阅历史参与业务
  cancelSubscribeJoinBusinessList: function () {
    var funName = "cancelSubscribeJoinBusinessList";
    var params = {};
    businessSDK5.publish(funName, params);
  },
  //设置接收历史参与业务回调
  setReceiveJoinBusinessListCallback: function (cb) {
    //{id:"",bussName:"视频会议001",bussType:1,bussStatus:0,description:"测试测试",bussTime:"2018-10-10 20:20:20"}]
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveJoinBusinessListCB = cb;
    }
  },

  /**
   * 人员状态推送
   */
  setReceiveUserStatusQueryCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveUserStatusQueryCB = cb;
    }
  },

  /**
   * 设备状态推送
   */
  setReceiveDeviceStatusQueryCallback: function (cb) {
    if (cb != null && typeof (cb) != "undefined") {
      businessSDK5._receiveDeviceStatusQueryCB = cb;
    }
  },

  setReceiveGroupCallStatusCB:function (cb) {
    if(cb!=null && typeof(cb)!="undefined"){
      businessSDK5._receiveGroupCallStatusCB =cb;
    }
  },

  /**
   * 全部暂停/恢复
   */
  publishCtrlMatrixAllPlay: function (token,matrixId,isplay) {
    var funName = "publishCtrlMatrixAllPlay";
    var params = {
      "token": token,
      "matrixId": matrixId,
      "isplay": isplay
    };
    businessSDK5.publish(funName, params);
  },

    /********************************************视频专向**************************************************/
    /**
     * 开启专向
     * @param {*} token
     * @param {*} destId
     */
    publishStartSpecial: function(token, destId) {
        var funName = "publishStartSpecial";
        var params = {
            "token": token,
            "destId": destId
        };
        businessSDK5.publish(funName, params);
    },

    /**
     * 停止专向
     * @param {*} token
     * @param {*} destId
     */
    publishStopSpecial: function(token, destId) {
        var funName = "publishStopSpecial";
        var params = {
            "token": token,
            "destId": destId
        };
        businessSDK5.publish(funName, params);
    },

    /**
     * 停止所有专向
     * @param {*} token
     */
    publishStopAllSpecial: function(token) {
        var funName = "publishStopAllSpecial";
        var params = {
            "token": token
        };
        businessSDK5.publish(funName, params);
    },

    /**
     * 接受专向
     * @param {*} token
     * @param {*} destId
     */
    publishAcceptSpecial: function(token, destId) {
        var funName = "publishAcceptSpecial";
        var params = {
            "token": token,
            "destId": destId
        };
        businessSDK5.publish(funName, params);
    },

    /**
     * 拒绝专向
     * @param {*} token
     * @param {*} destId
     */
    publishRefuseSpecial: function(token, destId) {
        var funName = "publishRefuseSpecial";
        var params = {
            "token": token,
            "destId": destId
        };
        businessSDK5.publish(funName, params);
    },
    /*********************************************视频专向以上********************************************************/
    /*********************************************即时消息********************************************************/

    /**
     *
     * @param {*} token
     * @param {目标Id} to
     * @param {YYYY-MM-dd HH:mm:SS} time
     * @param {消息类型int类型(0-text 1-image 2-voice 3-vedio)} msg_type
     * @param {聊天类型(1-私聊 2-群聊)} chat_type
     * @param {群组id仅在chattype为2时需要} group_id
     * @param {内容(msgtype为0时内容是文本，msgtype为1/2/3时则为fileid} content
     */
    publishSendMsg: function(token, to, time, msg_type, chat_type, group_id, content) {
        var funName = "publishSendMsg";
        var params = {
            "token": token,
            "to": to,
            "time": time,
            "msg_type": msg_type,
            "chat_type": chat_type,
            "group_id": group_id,
            "content": content
        };
        businessSDK5.publish(funName, params);
    },

    /**
     * 接收通讯消息
     * @param {*} cb
     * from:"来源Id"
       to:"目标Id"
       time:"YYYY-MM-dd HH:mm:SS"
       msg_type:"消息类型int类型(0-text 1-image 2-voice 3-vedio)"
       chat_type:"聊天类型(1-私聊 2-群聊)"
       group_id:"群组id仅在chattype为2时需要"
       content:"内容(msgtype为0时内容是文本，msgtype为1/2/3时则为文件路径)"
     */
    setReceiveIMMessageCallback: function(cb) {
        if (cb != null && typeof(cb) != "undefined") {
            businessSDK5._receiveIMMessageCB = cb;
        }
    },

    /**
     * 接收删除群组消息
     * @param {*} cb
       group_id:"群组id"
     */
    setReceiveRemoveIMGroupCallback: function(cb) {
        if (cb != null && typeof(cb) != "undefined") {
            businessSDK5._receiveRemoveIMGroupCB = cb;
        }
    },

    /**
     * 接收更新群组消息
     * @param {*} cb
       group_id:"群组id"
       group_name:"群组name"
     */
    setReceiveRefreshIMGroupCallback: function(cb) {
        if (cb != null && typeof(cb) != "undefined") {
            businessSDK5._receiveRefreshIMGroupCB = cb;
        }
    },

    /*********************************************即时消息********************************************************/

}
