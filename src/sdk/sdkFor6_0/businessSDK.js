var businessSDK = {
    /*回调函数**************************************************************************************/
    _receiveJoinCB: null,
    _receiveMessageCB: null,
    _receiveRemindCB: null,
    _receiveReconnectCommandWindowCB: null,

    _receiveBusinessStatusCB: null,
    _receiveYTStatusCB: null,
    _receiveNotifyStatusCB: null,
    _receiveExitCB: null,

    _receiveInformStartMediaByLocalCB: null,
    _receiveInformStopMediaByLocalCB: null,
    _receiveInformSplitScreenByLocalCB: null,
    _receiveInformFullScreenByLocalCB: null,
    _receiveInformOSDByLocalCB: null,
    _receiveInformStartMediaByRemoteCB: null,
    _receiveInformStopMediaByRemoteCB: null,
    _receiveInformSplitScreenByRemoteCB: null,
    _receiveInformFullScreenByRemoteCB: null,
    _receiveInformOSDByRemoteCB: null,
    _receiveInformAddDepartmentCB: null,
    _receiveInformAddResourceStatusCB: null,
    _receiveInformRemoveResourceStatusCB: null,
    _receiveInformRefreshResourceStatusCB: null,
    _receiveInformTransmitListCB: null,
    _receiveInformInitMediaCB: null,
    _receiveInformChangeMediaByLocalCB: null,

    _receiveInformRefreshSceneListCB: null,
    _receiveInformRefreshActivedSceneDetailCB: null,
    _receiveInformRemoveActivedSceneDetailCB: null,
    _receiveInformRefreshScreenOSDInfosCB: null,
    _receiveInformSetVolumeCB: null,
    /*公共接口**************************************************************************************/
    //初始化接口
    _socketURL: null,
    _wsclient: null,
    _isConnect: false,
    _userID: null,
    _userName: null,
    _token: null,
    _receiveInitCb: null,
    _receiveClosedCB: null,
    _receiveErrorCB: null,
    _failureCount: 0, //重连失败次数
    _reConnectInterval: null, //重连定时器
    protoCode: {
        PING_PROTO: 1 << 8 | 220, //476		S--B	心跳消息
        PONG_PROTO: 2 << 8 | 220, //732		B--S	心跳消息
        SYST_PROTO: 3 << 8 | 220, //988		S--B	系统消息
        EROR_PROTO: 4 << 8 | 220, //1244
        AUTH_PROTO: 5 << 8 | 220, //1500	B--S	认证消息
        MESS_PROTO: 6 << 8 | 220, //1756	双向	普通数据
        EXIT_PROTO: 7 << 8 | 220, //2012	B--S	退出消息
    },
    //ws初始化
    initScoket: function(wssURL, token, cb1) {
        console.log("socket init-----------------" + wssURL);
        businessSDK._socketURL = wssURL;
        businessSDK._token = token;
        try {
            if ("WebSocket" in window) {
                businessSDK._wsclient = new WebSocket(businessSDK._socketURL);
            } else if ("MozWebSocket" in window) {
                businessSDK._wsclient = new MozWebSocket(businessSDK._socketURL);
            } else {
                alert("您的浏览器不支持WebSocket...");
                return;
            }
        } catch (e) {
            console.log(e);
            alert("创建SOCKET失败");
            return;
        }
        businessSDK._wsclient.onopen = businessSDK._onOpen;
        businessSDK._wsclient.onmessage = businessSDK._onMessage;
        businessSDK._wsclient.onclose = businessSDK._onClose;
        businessSDK._wsclient.onerror = businessSDK._onError;

        if (businessSDK._isEmpty(cb1) == false) {
            businessSDK._receiveInitCb = cb1;
        }
    },
    _onError: function(event) {
        console.log("socket error-----------------");
        businessSDK._isConnect = false;
        businessSDK._reConnect();
        /*if(businessSDK._receiveErrorCB == null) return;
        businessSDK._receiveErrorCB(event); */
    },
    _onClose: function(event) {
        console.log("socket close-----------------");
        businessSDK._isConnect = false;
        businessSDK._reConnect();
        /*if(businessSDK._receiveClosedCB == null) return;
        businessSDK._receiveClosedCB(event);*/
    },
    _reConnect: function() {
        //重连
        if (businessSDK._wsclient && businessSDK._wsclient.readyState == WebSocket.CLOSED) {
            if (businessSDK._reConnectInterval) return;
            //状态上报
            if (businessSDK._isEmpty(businessSDK._receiveReconnectCommandWindowCB) == false) {
                for (var key in businessSDK._receiveReconnectCommandWindowCB) {
                    businessSDK._receiveReconnectCommandWindowCB[key](-1);
                }
            }
            var reConnect = 0;
            businessSDK._reConnectInterval = setInterval(function() {
                if (reConnect > 720) {
                    clearInterval(businessSDK._reConnectInterval);
                    businessSDK._reConnectInterval = null;
                }
                businessSDK._wsclient.close(); //清除之前的
                businessSDK._wsclient = null;
                if ("WebSocket" in window) {
                    businessSDK._wsclient = new WebSocket(businessSDK._socketURL);
                } else if ("MozWebSocket" in window) {
                    businessSDK._wsclient = new MozWebSocket(businessSDK._socketURL);
                }
                businessSDK._wsclient.onopen = businessSDK._onOpen;
                businessSDK._wsclient.onmessage = businessSDK._onMessage;
                businessSDK._wsclient.onclose = businessSDK._onClose;
                businessSDK._wsclient.onerror = businessSDK._onError;

                reConnect++;
                if (reConnect % 5 == 1) console.log("socket重连第" + reConnect + "次");
            }, 5000);
        }
    },
    _onOpen: function(event) {
        if (businessSDK._wsclient.readyState == WebSocket.OPEN) {
            console.log("socket open-----------------");
            businessSDK._isConnect = true;
            var isFirst = true;
            if (businessSDK._reConnectInterval == null) { //首次创建成功

            } else { //重连成功
                clearInterval(businessSDK._reConnectInterval);
                businessSDK._reConnectInterval = null;
                isFirst = false;
            }
            if (businessSDK._isEmpty(businessSDK._receiveInitCb) == false) {
                businessSDK._receiveInitCb(isFirst);
            }
            //状态上报
            if (businessSDK._isEmpty(businessSDK._receiveReconnectCommandWindowCB) == false) {
                for (var key in businessSDK._receiveReconnectCommandWindowCB) {
                    businessSDK._receiveReconnectCommandWindowCB[key](isFirst ? 1 : 2);
                }
            }
        }
    },
    _onMessage: function(event) {
        //console.log(event);
        var data = JSON.parse(event.data);
        //console.log(data);
        switch (data.uri) {
            case 1 << 8 | 220: // ping message
                //console.log("heart beat---------");
                businessSDK.publishBase(businessSDK.protoCode.PONG_PROTO);
                break;
            case 2 << 8 | 220: // pong message
                break;
            case 3 << 8 | 220: // system message
                break;
            case 4 << 8 | 220: // error message
                break;
             case 9 << 8 | 220:
                if (businessSDK._isEmpty(businessSDK._receivePassiveExitCB) == false)
                    businessSDK._receivePassiveExitCB(params);
                break;
            case 6 << 8 | 220: // broadcast message
                if (data.body) {
                    var vData = null;
                    var funName = null;
                    var params = null;
                    if (typeof(JSON.parse(data.body)) == "object") {
                        vData = JSON.parse(data.body);
                        funName = vData.funName;
                        params = vData.params;
                    } else {
                        vData = JSON.parse(JSON.parse(data.body));
                        funName = vData.funName;
                        params = vData.params;
                    }
                    console.log("receive----------" + funName);
                    console.log(params);

                    if (funName == "join") {
                        if (businessSDK._isEmpty(businessSDK._receiveJoinCB) == false)
                            businessSDK._receiveJoinCB(params);
                    } else if (funName == "informShowMessage") {
                        if (businessSDK._isEmpty(businessSDK._receiveMessageCB) == false)
                            businessSDK._receiveMessageCB(params);
                    } else if (funName == "informShowRemind") {
                        if (businessSDK._isEmpty(businessSDK._receiveRemindCB) == false)
                            businessSDK._receiveRemindCB(params);
                    } else if (funName == "informBusinessStatus") {
                        if (businessSDK._isEmpty(businessSDK._receiveBusinessStatusCB) == false)
                            businessSDK._receiveBusinessStatusCB(params);
                    } else if (funName == "informYTStatus") {
                        if (businessSDK._isEmpty(businessSDK._receiveYTStatusCB) == false)
                            businessSDK._receiveYTStatusCB(params);
                    } else if (funName == "informNotifyStatus") {
                        if (businessSDK._isEmpty(businessSDK._receiveNotifyStatusCB) == false)
                            businessSDK._receiveNotifyStatusCB(params);
                    }
                    //yangyong
                    else if (funName == "exit") {
                        if (businessSDK._isEmpty(businessSDK._receiveExitCB) == false)
                            businessSDK._receiveExitCB(params);
                    }
                    // axy
                    else if (funName == "informStartMediaByLocal") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformStartMediaByLocalCB) == false)
                            businessSDK._receiveInformStartMediaByLocalCB(params);
                    } else if (funName == "informStopMediaByLocal") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformStopMediaByLocalCB) == false)
                            businessSDK._receiveInformStopMediaByLocalCB(params);
                    } else if (funName == "informSplitScreenByLocal") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformSplitScreenByLocalCB) == false)
                            businessSDK._receiveInformSplitScreenByLocalCB(params);
                    } else if (funName == "informFullScreenByLocal") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformFullScreenByLocalCB) == false)
                            businessSDK._receiveInformFullScreenByLocalCB(params);
                    } else if (funName == "informOSDByLocal") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformOSDByLocalCB) == false)
                            businessSDK._receiveInformOSDByLocalCB(params);
                    } else if (funName == "informStartMediaByRemote") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformStartMediaByRemoteCB) == false)
                            businessSDK._receiveInformStartMediaByRemoteCB(params);
                    } else if (funName == "informStopMediaByRemote") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformStopMediaByRemoteCB) == false)
                            businessSDK._receiveInformStopMediaByRemoteCB(params);
                    } else if (funName == "informSplitScreenByRemote") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformSplitScreenByRemoteCB) == false)
                            businessSDK._receiveInformSplitScreenByRemoteCB(params);
                    } else if (funName == "informFullScreenByRemote") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformFullScreenByRemoteCB) == false)
                            businessSDK._receiveInformFullScreenByRemoteCB(params);
                    } else if (funName == "informOSDByRemote") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformOSDByRemoteCB) == false)
                            businessSDK._receiveInformOSDByRemoteCB(params);
                    } else if (funName == "informInitMedia") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformInitMediaCB) == false)
                            businessSDK._receiveInformInitMediaCB(params);
                    } else if (funName == "informChangeMediaByLocal") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformChangeMediaByLocalCB) == false)
                            businessSDK._receiveInformChangeMediaByLocalCB(params);
                    } else if (funName == "informAddDepartment") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformAddDepartmentCB) == false) {
                            // for(var i=0; i<businessSDK._receiveInformAddDepartmentCB.length; i++){
                            // 	businessSDK._receiveInformAddDepartmentCB[i](params);
                            // }
                            //wxx 2020.11.26
                            for (var key in businessSDK._receiveInformAddDepartmentCB) {
                                businessSDK._receiveInformAddDepartmentCB[key](data.body);
                                // businessSDK._receiveInformAddDepartmentCB[key](params);
                            }
                        }
                    } else if (funName == "informAddResourceStatus") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformAddResourceStatusCB) == false) {
                            // for(var i=0; i<businessSDK._receiveInformAddResourceStatusCB.length; i++){
                            // 	businessSDK._receiveInformAddResourceStatusCB[i](params);
                            // }
                            for (var key in businessSDK._receiveInformAddResourceStatusCB) {
                                businessSDK._receiveInformAddResourceStatusCB[key](params);
                            }
                        }
                    } else if (funName == "informRemoveResourceStatus") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformRemoveResourceStatusCB) == false)
                            businessSDK._receiveInformRemoveResourceStatusCB(params);
                    } else if (funName == "informRefreshResourceStatus") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformRefreshResourceStatusCB) == false) {
                            // for(var i=0; i<businessSDK._receiveInformRefreshResourceStatusCB.length; i++){
                            // 	businessSDK._receiveInformRefreshResourceStatusCB[i](params);
                            // }
                            for (var key in businessSDK._receiveInformRefreshResourceStatusCB) {
                                businessSDK._receiveInformRefreshResourceStatusCB[key](params);
                            }
                        }
                    } else if (funName == "informTransmitList") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformTransmitListCB) == false)
                            businessSDK._receiveInformTransmitListCB(params);
                    }
                    //zk
                    else if (funName == "informRefreshSceneList") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformRefreshSceneListCB) == false)
                            businessSDK._receiveInformRefreshSceneListCB(params);
                    } else if (funName == "informRefreshActivedSceneDetail") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformRefreshActivedSceneDetailCB) == false)
                            businessSDK._receiveInformRefreshActivedSceneDetailCB(params);
                        if (businessSDK._isEmpty(businessSDK._ReceiveInformAddBusinessGroupResourceCb) == false) {
                            //轮循点播资源的刷新走的通道是会议场景明细的刷新
                            businessSDK._ReceiveInformAddBusinessGroupResourceCb(params)
                        }
                    }else if (funName == "informRefreshActivedCommandDetail") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformRefreshActivedCommandResourceCb) == false) {
                            //指挥
                            businessSDK._receiveInformRefreshActivedCommandResourceCb(params)
                        }
                    } else if (funName == "informRemoveActivedCommandDetail") {
                        // 指挥
                        if (businessSDK._isEmpty(businessSDK._ReceiveInformStopCommandDetailCb) == false) {
                            businessSDK._ReceiveInformStopCommandDetailCb(params); //停止轮循点播推送，走的是删除场景明细通道
                        }
                    }else if (funName == "informRemoveActivedSceneDetail") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformRemoveActivedSceneDetailCB) == false)
                            businessSDK._receiveInformRemoveActivedSceneDetailCB(params);
                        if (businessSDK._isEmpty(businessSDK._ReceiveInformStopBusinessGroupResourceCb) == false) {
                            businessSDK._ReceiveInformStopBusinessGroupResourceCb(params); //停止轮循点播推送，走的是删除场景明细通道
                        }
                    } else if (funName == "informAddDecoderGroups") { //解码器分组加载反馈
                        if (businessSDK._isEmpty(businessSDK._receiveInformAddDecoderGroupsCb) == false)
                            businessSDK._receiveInformAddDecoderGroupsCb(params);
                    } else if (funName == "informAddDecoderGroupItems") { //解码器条目加载反馈
                        if (businessSDK._isEmpty(businessSDK._receiveInformAddDecoderGroupItemsCb) == false)
                            businessSDK._receiveInformAddDecoderGroupItemsCb(params);
                    } else if (funName == "informRefreshDecoderGroupItems") { //解码器条目变更反馈
                        if (businessSDK._isEmpty(businessSDK._receiveInformRefreshDecoderGroupItemsCb) == false)
                            businessSDK._receiveInformRefreshDecoderGroupItemsCb(params);
                    } else if (funName == "informDecoderStatus") { //解码器状态变更反馈
                        if (businessSDK._isEmpty(businessSDK._receiveInformDecoderStatusCb) == false)
                            businessSDK._receiveInformDecoderStatusCb(params);
                    } else if (funName == "informRecevieCommunicationMessage") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformReceiveMessageCB1) == false) {
                            console.log('----------------------------------------_receiveInformReceiveMessageCB1------------------------------------------');
                            businessSDK._receiveInformReceiveMessageCB1(params);
                        }
                        if (businessSDK._isEmpty(businessSDK._receiveInformReceiveMessageCB) == false) {
                            console.log('-------------------------------_receiveInformReceiveMessageCB--------------------------------------');
                            businessSDK._receiveInformReceiveMessageCB(params);
                        }
                    } else if (funName == "informRecevieCommunicationNotification") {
                        //_receiveCommunicationNotificationCB
                        if (businessSDK._isEmpty(businessSDK._receiveCommunicationNotificationCB) == false) {
                            businessSDK._receiveCommunicationNotificationCB(params);
                        }
                    }
                    //yangyong 11.04
                    else if (funName == "informGroupStartMedia") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformGroupStartMediaCB) == false)
                            businessSDK._receiveInformGroupStartMediaCB(params);
                    } else if (funName == "informRefreshGroupMedia") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformRefreshGroupMediaCB) == false)
                            businessSDK._receiveInformRefreshGroupMediaCB(params);
                    } else if (funName == "informStopGroupMedia") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformStopGroupMediaCB) == false)
                            businessSDK._receiveInformStopGroupMediaCB(params);
                    }
                    // OSD 信息反馈
                    else if (funName == "informRefreshScreenOSDInfos") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformRefreshScreenOSDInfosCB) == false)
                            businessSDK._receiveInformRefreshScreenOSDInfosCB(params);
                    }
                    // 接收会话状态反馈
                    else if (funName == "informUserCommSessionPreview") {

                        if (businessSDK._isEmpty(businessSDK._receiveInformUserCommSessionPreviewCB1) == false) {
                            // console.log('_receiveInformUserCommSessionPreviewCB1')
                            businessSDK._receiveInformUserCommSessionPreviewCB1(params);
                        }

                        if (businessSDK._isEmpty(businessSDK._receiveInformUserCommSessionPreviewCB) == false) {
                            // console.log('_receiveInformUserCommSessionPreviewCB');
                            businessSDK._receiveInformUserCommSessionPreviewCB(params);
                        }
                    }
                    //yangyong 12.09
                    else if (funName == "informVoiceRemind") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformVoiceRemindCB) == false)
                            businessSDK._receiveInformVoiceRemindCB(params);
                    } else if (funName == "informAlarmInfo") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformAlarmInfoCB) == false)
                            businessSDK._receiveInformAlarmInfoCB(params);
                    } else if (funName == "informStartRecord") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformStartRecordCB) == false)
                            businessSDK._receiveInformStartRecordCB(params);
                    } else if (funName == "informStartFileMedia") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformStartFileMediaCB) == false)
                            businessSDK._receiveInformStartFileMediaCB(params);
                    } else if (funName == "informStartRecordMedia") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformStartRecordMediaCB) == false)
                            businessSDK._receiveInformStartRecordMediaCB(params);
                    } else if (funName == "informInitMediaForEncoder") {
                        if (businessSDK._isEmpty(businessSDK._receiveInformInitMediaForEncoderCB) == false)
                            businessSDK._receiveInformInitMediaForEncoderCB(params);
                    } else if (funName == 'informInitMediaForBindingEncoder') {
                        if (businessSDK._isEmpty(businessSDK._receiveInformInitMediaForBindingEncoderCB) == false)
                            businessSDK._receiveInformInitMediaForBindingEncoderCB(params);
                    } else if (funName == 'informRefreshCoordinateList') {
                        if (businessSDK._isEmpty(businessSDK.receiveInformRefreshCoordinateListCB) == false)
                            businessSDK.receiveInformRefreshCoordinateListCB(params);
                    } else if (funName == 'informClearAll') {
                        if (businessSDK._isEmpty(businessSDK._receiveInformClearAllCB) == false)
                            businessSDK._receiveInformClearAllCB(params);
                    } else if (funName == 'informRefreshScreenName') {  //1118云调度 修改
                        if (businessSDK._isEmpty(businessSDK._receiveInformRefreshScreenNameCB) == false)
                            businessSDK._receiveInformRefreshScreenNameCB(params);
                    }
                }
                break;
        }
    },
    _reset: function() {
        businessSDK._receiveReconnectCommandWindowCB = null;
        businessSDK._receiveInformAddDepartmentCB = null;
        businessSDK._receiveInformAddResourceStatusCB = null;
        businessSDK._receiveInformRefreshResourceStatusCB = null;
        businessSDK._ReceiveInformStopBusinessGroupResourceCb = null;
    },
    _isEmpty: function(obj) {
        if (typeof(obj) == "undefined" || obj == null)
            return true;
        else
            return false;
    },
    publishBase: function(code, data) {
        var data_ = { "code": code };
        if (code == businessSDK.protoCode.PONG_PROTO) {

        } else if (code == businessSDK.protoCode.AUTH_PROTO) {
            data_.userID = businessSDK._userID;
            data_.userName = businessSDK._userName;
            data_.token = businessSDK._token;
        } else if (code == businessSDK.protoCode.MESS_PROTO) {
            data_.userID = businessSDK._userID;
            data_.funName = data.funName;
            data_.params = data.params;
			data_.serviceName = data.serviceName;
        } else if (code == businessSDK.protoCode.EXIT_PROTO) {

        }

        if (!businessSDK._isConnect) {
            console.log("SOCKET连接关闭", data);
            return;
        }
        if (businessSDK._wsclient.readyState != WebSocket.OPEN) { //未成功
            if (businessSDK._failureCount >= 3) return;
            setTimeout("businessSDK.publishBase('" + code + "', " + JSON.stringify(data) + ");", 1000);
            businessSDK._failureCount++;
            return;
        }
        if (businessSDK._failureCount != 0) businessSDK._failureCount = 0;

        businessSDK._wsclient.send(JSON.stringify(data_));
        console.log("publish--------------" + JSON.stringify(data_));
    },
    //publish
    publish: function(funName, params, serviceName) {
        params.operatorToken = businessSDK._token;
        var data = {
            "funName": funName,
            "params": params
        };
		if(serviceName) data.serviceName = serviceName
        businessSDK.publishBase(businessSDK.protoCode.MESS_PROTO, data);
    },
    //join
    join: function(userID, userName, cb) {
        businessSDK._userID = userID;
        businessSDK._userName = userName;

        //认证
        businessSDK.publishBase(businessSDK.protoCode.AUTH_PROTO);

        var funName = "join";
        var params = {};
        businessSDK.publish(funName, params);

        //回调
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveJoinCB = cb;
        }
    },
    //leave
    leave: function(cb) {
        var funName = "leave";
        var params = {};
        businessSDK.publish(funName, params);

        //退出
        businessSDK.publishBase(businessSDK.protoCode.EXIT_PROTO);
        //重置
        businessSDK._reset();
		//清除重连定时器
		clearInterval(businessSDK._reConnectInterval);
        businessSDK._reConnectInterval = null;

        //if(businessSDK._wsclient) businessSDK._wsclient = null;
        /*if(cb != null && typeof(cb) != "undefined"){
        	businessSDK._receiveClosedCB = cb;
        }*/
    },
    // 仅断开socket
    onlyClose: function() {
        if (!!businessSDK._wsclient) {
            businessSDK._wsclient.close();
            businessSDK._wsclient = null;
        }
    },
    // 抢占登录
    _receivePassiveExitCB: null,
    setReceivePassiveExitCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receivePassiveExitCB = cb;
        }
    },
    //socket状态回调
    setReceiveReconnectCommandWindowCallback: function(id, cb) {
        if (businessSDK._receiveReconnectCommandWindowCB == undefined)
            businessSDK._receiveReconnectCommandWindowCB = {};
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveReconnectCommandWindowCB[id] = cb;
        }
    },
    //被动下线
    setReceiveExitCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveExitCB = cb;
        }
    },
    //订阅消息
    subscribeMessage: function() {
        var funName = "subscribeMessage";
        var params = {};

        businessSDK.publish(funName, params);
    },
    //取消订阅消息
    cancelSubscribeMessage: function() {
        var funName = "cancelSubscribeMessage";
        var params = {};
        businessSDK.publish(funName, params);
    },
    //订阅提醒
    subscribeRemind: function() {
        var funName = "subscribeRemind";
        var params = {};
        businessSDK.publish(funName, params);
    },
    //取消订阅提醒
    cancelRemind: function() {
        var funName = "cancelRemind";
        var params = {};
        businessSDK.publish(funName, params);
    },


    /*公共-用户消息start**************************************************************************************/
    //设置接收消息窗口时回调
    setReceiveMessageCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveMessageCB = cb;
        }
    },
    //设置接收提醒时回调
    setReceiveRemindCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveRemindCB = cb;
        }
    },
    /*公共-用户消息end**************************************************************************************/


    /*用户资源-用户列表start**************************************************************************************/
    // 订阅用户组织结构
    subscribeOrganizationUser: function(organizationID, subscribeID) {
        var funName = "subscribeOrganizationUser";
        var params = {
            "organizationID": organizationID,
            "subscribeID": subscribeID,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 订阅用户状态
    subscribeUsersStatus: function(dirID, subscribeID) {
        var funName = "subscribeUsersStatus";
        var params = {
            "dirID": dirID,
            "subscribeID": subscribeID,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 根据关键字订阅用户状态
    subscribeUsersStatusByKey: function(key, subscribeID, organizationID) {
        var funName = "subscribeUsersStatusByKey";
        var params = {
            "key": key, //关键字
            "subscribeID": subscribeID,
            "organizationID": organizationID,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 根据资源状态订阅用户状态
    subscribeUsersStatusByStatus: function(status, subscribeID, organizationID) {
        var funName = "subscribeUsersStatusByStatus";
        var params = {
            "status": status + "",
            "subscribeID": subscribeID,
            "organizationID": organizationID,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    /*用户资源-用户列表end**************************************************************************************/


    /*用户资源-设备列表start**************************************************************************************/
    // 订阅设备组织结构
    subscribeOrganizationDevice: function(organizationID, subscribeID) {
        var funName = "subscribeOrganizationDevice";
        var params = {
            "organizationID": organizationID,
            "subscribeID": subscribeID,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 订阅设备状态
    subscribeDevicesStatus: function(dirID, subscribeID) {
        var funName = "subscribeDevicesStatus";
        var params = {
            "dirID": dirID,
            "subscribeID": subscribeID,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 根据关键字订阅设备状态
    subscribeDevicesStatusByKey: function(key, subscribeID, organizationID) {
        var funName = "subscribeDevicesStatusByKey";
        var params = {
            "key": key + "",
            "subscribeID": subscribeID,
            "organizationID": organizationID,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 根据资源状态订阅设备状态
    subscribeDevicesStatusByStatus: function(status, subscribeID, organizationID) {
        var funName = "subscribeDevicesStatusByStatus";
        var params = {
            "status": status + "",
            "subscribeID": subscribeID,
            "organizationID": organizationID,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    /*用户资源-设备列表end**************************************************************************************/


    /*用户资源-常用资源start**************************************************************************************/
    // 订阅常用资源
    subscribeCommonResources: function(subscribeID) {
        var funName = "subscribeCommonResources";
        var params = {
            "subscribeID": subscribeID,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 资源收藏
    publishResourceCollect: function(resourceID, resourceType, isCollect) {
        var funName = "publishResourceCollect";
        var params = {
            "resourceID": resourceID,
            "resourceType": resourceType + "",
            "isCollect": isCollect + "", // true false
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    //根据关键字订阅常用资源
    subscribeCommonResourcesByKey: function(key, subscribeID, organizationID) {
        var funName = "subscribeCommonResourcesByKey";
        var params = {
            "key": key + "",
            "subscribeID": subscribeID,
            "organizationID": organizationID,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    //根据资源状态订阅常用资源
    subscribeCommonResourcesByStatus: function(status, subscribeID, organizationID) {
        var funName = "subscribeCommonResourcesByStatus";
        var params = {
            "status": status + "",
            "subscribeID": subscribeID,
            "organizationID": organizationID,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    /*用户资源-常用资源end**************************************************************************************/


    /*用户资源-其他start**************************************************************************************/
    // 组织结构加载反馈
    setReceiveInformAddDepartmentCallback: function(id, cb) {
        if (businessSDK._receiveInformAddDepartmentCB == undefined)
        //businessSDK._receiveInformAddDepartmentCB = [];
            businessSDK._receiveInformAddDepartmentCB = {};
        if (businessSDK._isEmpty(cb) == false) {
            //businessSDK._receiveInformAddDepartmentCB.push(cb);
            businessSDK._receiveInformAddDepartmentCB[id] = cb;
        }
    },
    // 资源状态加载反馈
    setReceiveInformAddResourceStatusCallback: function(id, cb) {
        if (businessSDK._receiveInformAddResourceStatusCB == undefined)
            businessSDK._receiveInformAddResourceStatusCB = {};
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformAddResourceStatusCB[id] = cb;
        }
    },
    // 资源状态移除反馈
    setReceiveInformRemoveResourceStatusCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformRemoveResourceStatusCB = cb;
        }
    },
    // 资源状态变更反馈
    setReceiveInformRefreshResourceStatusCallback: function(id, cb) {
        if (businessSDK._receiveInformRefreshResourceStatusCB == undefined)
            businessSDK._receiveInformRefreshResourceStatusCB = {};
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformRefreshResourceStatusCB[id] = cb;
        }
    },
    // 取消订阅
    cancelSubscribeResourceStatus: function(subscribeID) {
        var funName = "cancelSubscribeResourceStatus";
        var params = {
            "subscribeID": subscribeID,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    /*用户资源-其他end**************************************************************************************/

    /*用户业务状态**************************************************************************************/
    //订阅业务状态
    //   busType：业务类型数组:play|call|meeting|speak|all
    //   subscribeID：订阅ID
    subscribeBusinessStatus: function(busType, subscribeID) {
        var funName = "subscribeBusinessStatus";
        var params = {
            "busType": busType + "",
            "subscribeID": subscribeID
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    //取消订阅业务状态
    //   subID：订阅ID
    cancelSubscribeBusinessStatus: function(subscribeID) {
        var funName = "cancelSubscribeBusinessStatus";
        var params = { "subscribeID": subscribeID };
        businessSDK.publish(funName, params);
    },
    //设置业务状态回调
    setReceiveBusinessStatusCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveBusinessStatusCB = cb;
        }
    },


    /*用户媒体-媒体控制start**************************************************************************************/
    // 发布分屏状态
    //   splitType：分屏模式
    publishSplitScreen: function(splitType) {
        var funName = "publishSplitScreen";
        var params = {
            "splitType": splitType + "",
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 发布全屏状态
    publishFullScreen: function(screenIndex, isFullScreen) {
        var funName = "publishFullScreen";
        var params = {
            "screenIndex": screenIndex + "",
            "isFullScreen": isFullScreen + "", // true false
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 发布媒体声音控制
    publishAllVolumn: function(isOpen) {
        var funName = "publishAllVolumn";
        var params = {
            "isOpen": isOpen + "", // true false
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 发布单路声音控制
    publishVolumn: function(screenIndex, isOpen) {
        var funName = "publishVolumn";
        var params = {
            "screenIndex": screenIndex + "",
            "isOpen": isOpen + "", // true false
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);

        if (businessSDK._isEmpty(businessSDK._receiveInformSetVolumeCB) == false) {
            var resp = {}
            resp.screenIndex = screenIndex
            resp.state = isOpen
            resp.volume = isOpen ? 255 : 0
            businessSDK._receiveInformSetVolumeCB(resp)
        }


    },
    // 发布停止业务
    publishStopBusiness: function(screenIndex) {
        var funName = "publishStopBusiness";
        var params = {
            "screenIndex": screenIndex + "",
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 发布停止业务所有
    publishStopAllBusiness: function() {
        var funName = "publishStopAllBusiness";
        var params = {};
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    /*用户媒体-媒体控制end**************************************************************************************/


    /*用户媒体-媒体状态start**************************************************************************************/
    //订阅媒体状态
    subscribeMediaStatus: function() {
        var funName = "subscribeMediaStatus";
        var params = {};
        businessSDK.publish(funName, params);
    },
    //取消订阅媒体状态
    cancelSubscribeMediaStatus: function() {
        var funName = "cancelSubscribeMediaStatus";
        var params = {};
        businessSDK.publish(funName, params);
    },
    // 开启媒体输出反馈（软解）
    setReceiveInformStartMediaByLocalCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformStartMediaByLocalCB = cb;
        }
    },
    // 停止媒体输出反馈（软解）
    setReceiveInformStopMediaByLocalCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformStopMediaByLocalCB = cb;
        }
    },
    // 媒体分屏显示反馈（软解）
    setReceiveInformSplitScreenByLocalCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformSplitScreenByLocalCB = cb;
        }
    },
    // 媒体全屏显示反馈（软解）
    setReceiveInformFullScreenByLocalCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformFullScreenByLocalCB = cb;
        }
    },
    // 媒体OSD显示反馈（软解）
    setReceiveInformOSDByLocalCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformOSDByLocalCB = cb;
        }
    },

    // OSD信息反馈
    setReceiveInformRefreshScreenOSDInfosCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformRefreshScreenOSDInfosCB = cb;
        }
    },
    setVolumeByLocalCallback: function(cb) {
        if (cb != null && typeof(cb) != "undefined") {
            businessSDK._receiveInformSetVolumeCB = cb;
        }
    },

    // 开启媒体输出反馈（硬解）
    setReceiveInformStartMediaByRemoteCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformStartMediaByRemoteCB = cb;
        }
    },
    // 停止媒体输出反馈（硬解）
    setReceiveInformStopMediaByRemoteCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformStopMediaByRemoteCB = cb;
        }
    },
    // 媒体分屏显示反馈（硬解）
    setReceiveInformSplitScreenByRemoteCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformSplitScreenByRemoteCB = cb;
        }
    },
    // 媒体全屏显示反馈（硬解）
    setReceiveInformFullScreenByRemoteCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformFullScreenByRemoteCB = cb;
        }
    },
    // 媒体OSD显示反馈（硬解）
    setReceiveInformOSDByRemoteCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformOSDByRemoteCB = cb;
        }
    },
    // 发布初始化媒体状态（用户习惯）
    publishInitMediaByCustom: function() {
        var funName = "publishInitMediaByCustom";
        var params = {};
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 发布初始化媒体状态（设备SIPID）
    publishInitMediaByDevice: function(encoderSIPID, decoderSIPID) {
        var funName = "publishInitMediaByDevice";
        var params = {
            "encoderSIPID": encoderSIPID,
            "decoderSIPID": decoderSIPID,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 发布媒体初始化反馈
    setReceiveInformInitMediaCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformInitMediaCB = cb;
        }
    },
    // 切换点播分屏
    setReceiveInformChangeMediaByLocalCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformChangeMediaByLocalCB = cb;
        }
    },
    /*用户媒体-媒体状态end**************************************************************************************/


    /*用户媒体-媒体输出方式start**************************************************************************************/
    // 切换本地输出
    publishLocalOutput: function() {
        var funName = "publishLocalOutput";
        var params = {};
        businessSDK.publish(funName, params);
    },
    // 切换解码器输出
    publishDecoderOutputByCustom: function() {
        var funName = "publishDecoderOutputByCustom";
        var params = {};
        businessSDK.publish(funName, params);
    },
    /*用户媒体-媒体输出方式end**************************************************************************************/


    /*点播控制-点播start**************************************************************************************/
    // 开启点播人员
    publishStartPlayUser: function(receiverID, receiverName, transportType) {
        var funName = "publishStartPlayUser";
        var params = {
            "receiverID": receiverID,
            //"senderName" : senderName,
            "receiverName": receiverName,
            "transportType": transportType
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 停止点播人员
    publishStopPlayUser: function(receiverID, receiverName) {
        var funName = "publishStopPlayUser";
        var params = {
            "receiverID": receiverID,
            //"senderName" : senderName,
            "receiverName": receiverName,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 开启点播设备
    publishStartPlayDevice: function(receiverID, receiverName, transportType) {
        var funName = "publishStartPlayDevice";
        var params = {
            "receiverID": receiverID,
            //"senderName" : senderName,
            "receiverName": receiverName,
            "transportType": transportType
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 停止点播设备
    publishStopPlayDevice: function(receiverID, receiverName) {
        var funName = "publishStopPlayDevice";
        var params = {
            "receiverID": receiverID,
            //"senderName" : senderName,
            "receiverName": receiverName,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
	 publishStartPlayNVRDevice(receiverID, channels, transportType) {
        var funName = "publishStartPlayNVRDevice";
        var params = {
            "receiverID": receiverID,
            "channels": channels,
            "transportType": transportType
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    //1119云调度拖动点播
    publishStartPlayNVRDeviceByIndex(receiverID, channels, transportType) {
        var funName = "publishStartPlayNVRDeviceByIndex";
        var params = {
            "receiverID": receiverID,
            "channels": JSON.stringify(channels),
            "transportType": transportType
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    publishStopPlayNVRDevice(receiverID, channels) {
        var funName = "publishStopPlayNVRDevice";
        var params = {
            "receiverID": receiverID,
            "channels": channels,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 指定分屏开启点播人员
    publishStartPlayUserByIndex: function(receiverID, receiverName, index, transportType) {
        var funName = "publishStartPlayUserByIndex";
        var params = {
            "receiverID": receiverID,
            //"senderName" : senderName,
            "receiverName": receiverName,
            "index": index + "",
            "transportType": transportType,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 指定分屏开启点播设备
    publishStartPlayDeviceByIndex: function(receiverID, receiverName, index, transportType) {
        var funName = "publishStartPlayDeviceByIndex";
        var params = {
            "receiverID": receiverID,
            //"senderName" : senderName,
            "receiverName": receiverName,
            "index": index + "",
            "transportType": transportType
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 批量点播
    publishStartPlayRes: function(resInfos) {
        var funName = "publishStartPlayRes";
        var params = {
            "resInfos": resInfos, //[{resID:"", resName:"",resType:""}]
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    /*点播控制-点播end**************************************************************************************/


    /*呼叫控制-呼叫start**************************************************************************************/
    // 开启呼叫
    publishStartCall: function(receiverID, onlyVolice, senderName, receiverName) {
        var funName = "publishStartCall";
        var params = {
            "receiverID": receiverID,
            "onlyVolice": onlyVolice + "", // true false
            "senderName": senderName,
            "receiverName": receiverName,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 开启呼叫华为uc
    publishStartCallHW: function(receiverID, onlyVolice, senderName, receiverName) {
        var funName = "publishStartCallHWMeetingTerminal";
        var params = {
            "receiverID": receiverID,
            "onlyVolice": onlyVolice + "", // true false
            "senderName": senderName,
            "receiverName": receiverName,
        };
        businessSDK.publish(funName, params);
    },
    // 同意接收呼叫
    publishAcceptCall: function(receiverID, onlyVolice, senderName, receiverName) {
        var funName = "publishAcceptCall";
        var params = {
            "receiverID": receiverID,
            "senderName": senderName,
            "receiverName": receiverName,
            "onlyVolice": onlyVolice
        };
        var serviceName = "CoreControlService"
        businessSDK.publish(funName, params, serviceName);
    },
    // 拒接接收呼叫
    publishRefuseCall: function(receiverID, senderName, receiverName) {
        var funName = "publishRefuseCall";
        var params = {
            "receiverID": receiverID,
            "senderName": senderName,
            "receiverName": receiverName,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 停止呼叫
    publishStopCall: function(receiverID, senderName, receiverName) {
        var funName = "publishStopCall";
        var params = {
            "receiverID": receiverID,
            "senderName": senderName,
            "receiverName": receiverName,
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    // 批量呼叫
    publishStartCalls: function(senderName, resInfos) {
        var funName = "publishStartCalls";
        var params = {
            "onlyVolice": "false",
            "senderName": senderName,
            "resInfos": resInfos, //[{resID:"", resName:""}]
        };
        var serviceName = 'CoreControlService';
        businessSDK.publish(funName, params, serviceName);
    },
    /*呼叫控制-呼叫end**************************************************************************************/

    /*转发控制-视频转发start**************************************************************************************/
    // 开启转发 {funName:"publishStartTransmit", params:{ operatorToken:"", receiverID:"", resourceInfos:[{resID:"", resName:"", resType:""}, {...}], senderName:"", receiverName:""}}
    publishStartTransmit: function(receiverID, senderName, receiverName, resourceInfos) {
        var funName = "publishStartTransmit";
        var params = {
            "receiverID": receiverID,
            "senderName": senderName,
            "receiverName": receiverName,
            "resourceInfos": resourceInfos
        };
        businessSDK.publish(funName, params);
    },
    // 同意接收转发
    publishAcceptTransmit: function(receiverID, senderName, receiverName, resourceInfos) {
        var funName = "publishAcceptTransmit";
        var params = {
            "receiverID": receiverID,
            "senderName": senderName,
            "receiverName": receiverName,
            "resourceInfos": resourceInfos //[{resID:"", resName:"", resType:""}, {...}]
        };
        businessSDK.publish(funName, params);
    },
    // 拒绝接收转发
    publishRefuseTransmit: function(receiverID, senderName, receiverName, resourceInfos) {
        var funName = "publishRefuseTransmit";
        var params = {
            "receiverID": receiverID,
            "senderName": senderName,
            "receiverName": receiverName,
            "resourceInfos": resourceInfos //[{resID:"", resName:"", resType:""}, {...}]
        };
        businessSDK.publish(funName, params);
    },
    //停止转发
    publishStopTransmit: function(receiverID, senderName, receiverName, resourceInfos) {
        var funName = "publishStopTransmit";
        var params = {
            "receiverID": receiverID,
            "senderName": senderName,
            "receiverName": receiverName,
            "resourceInfos": resourceInfos //[{resID:"", resName:"", resType:""}, {...}]
        };
        businessSDK.publish(funName, params);
    },
    // 订阅转发信息
    subscribeTransmitInfos: function() {
        var funName = "subscribeTransmitInfos";
        var params = {};
        businessSDK.publish(funName, params);
    },
    // 取消订阅转发信息
    cancelSubscribeTransmitInfos: function() {
        var funName = "cancelSubscribeTransmitInfos";
        var params = {};
        businessSDK.publish(funName, params);
    },
    // 推送转发信息
    setReceiveInformTransmitListCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformTransmitListCB = cb;
        }
    },
    /*转发控制-视频转发end**************************************************************************************/


    /*云台控制-云台控制start**************************************************************************************/
    // 方向控制
    publishDirectionControl: function(resourceID, direction, speed) {
        var funName = "publishDirectionControl";
        var params = {
            "resourceID": resourceID,
            "direction": direction + "",
            "speed": speed + "",
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },
    // nvr方向控制
    publishNVRDirectionControl: function(resourceID, direction, speed, channelNo, encoderSIPID) {
        var funName = "publishNVRDirectionControl";
        var params = {
            "encoderSIPID": encoderSIPID,
            "direction": direction + "",
            "speed": speed + "",
            "channelID": resourceID,
            "channelNo": channelNo
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },
    //焦距控制
    publishZoomControl: function(resourceID, zoom, speed) {
        var funName = "publishZoomControl";
        var params = {
            "resourceID": resourceID,
            "zoom": zoom + "",
            "speed": speed + "",
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },
    //焦点控制
    publishFocusControl: function(resourceID, focus, speed) {
        var funName = "publishFocusControl";
        var params = {
            "resourceID": resourceID,
            "focus": focus + "",
            "speed": speed + "",
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },
    //雨刷控制
    publishWiperControl: function(resourceID, value) {
        var funName = "publishWiperControl";
        var params = {
            "resourceID": resourceID,
            "value": value + "",
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },
    //光圈控制
    publishApertureControl: function(resourceID, aperturectrl, speed) {
        var funName = "publishApertureControl";
        var params = {
            "resourceID": resourceID,
            "aperturectrl": aperturectrl +'',
            "speed": speed + "",
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },
    //加热控制
    publishAddHeat: function(resourceID, value) {
        var funName = "publishAddHeat";
        var params = {
            "resourceID": resourceID,
            "value": value + "",
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },
    //停止控制
    publishStopControl: function(resourceID) {
        var funName = "publishStopControl";
        var params = {
            "resourceID": resourceID,
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },
    //nvr停止控制
    publishStopNVRControl: function(resourceID, encoderSIPID, channelNo) {
        var funName = "publishStopNVRControl";
        var params = {
            "encoderSIPID": encoderSIPID,
            "channelID": resourceID,
            "channelNo": channelNo
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },
    //重置预置点
    publishResetPoint: function(resourceID) {
        var funName = "publishResetPoint";
        var params = {
            "resourceID": resourceID,
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },
    //跳转预置点
    publishUpResPoint: function(resourceID, pointID, index) {
        var funName = "publishUpResPoint";
        var params = {
            "resourceID": resourceID,
            "pointID": pointID,
            index: index
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },
    /*云台控制-云台控制end**************************************************************************************/


    /*云台控制-云台接管start**************************************************************************************/
    //云台接管
    publishTakeoverYT: function(resourceID, isTakeover) {
        var funName = "publishTakeoverYT";
        var params = {
            "resourceID": resourceID,
            "isTakeover": isTakeover + "",
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },
    //订阅云台接管状态
    subscribeYTStatus: function(resourceID) {
        var funName = "subscribeYTStatus";
        var params = {
            "resourceID": resourceID,
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },
    //取消订阅云台状态
    cancelSubscribeYTStatus: function() {
        var funName = "cancelSubscribeYTStatus";
        var params = {};
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },
    //设置接收云台状态回调(云台状态推送)
    setReceiveYTStatusCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveYTStatusCB = cb;
        }
    },
    /*云台控制-云台接管end**************************************************************************************/


    /*通知业务**************************************************************************************/
    //发送通知
    //   receiverIDs：多个接收人ID
    //   message：消息内容
    publishSendNotify: function(receiverIDs, message) {
        //tragetIds:[{"343434","44444"}],message:"测试测试"
        var funName = "publishSendNotify";
        var params = {
            "receiverIDs": receiverIDs,
            "message": message
        };
        businessSDK.publish(funName, params);
    },
    //订阅通知状态
    subscribeNotifyStatus: function() {
        var funName = "subscribeNotifyStatus";
        var params = {};
        businessSDK.publish(funName, params);
    },
    //取消订阅通知状态
    cancelSubscribeNotifyStatus: function() {
        var funName = "cancelSubscribeNotifyStatus";
        var params = {};
        businessSDK.publish(funName, params);
    },
    //设置接收通知回调
    setReceiveNotifyStatusCallback: function(cb) {
        //{revDate:"2018-11-10 20:20:10",senderName:"测试用户",content:"请参加11月18号会议任务",total:10}
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveNotifyStatusCB = cb;
        }
    },


    /*音频广播**************************************************************************************/
    //开启音频广播
    //   name：名称
    //   description：描述
    //   personInfos：人员列表（ID、名称）
    //   deviceInfos：设备列表（ID、通道号、名称）
    publishStartAudioBroadcase: function(name, description, personInfos, deviceInfos) {
        //broadcastName:"测试分组",description:"领导检查",peopleList:[{resId:"",resName:"张三"}]，deviceList:[{resId:"",resCh:"",resName:"设备AAA"}]
        var funName = "publishStartAudioBroadcase";
        var params = {
            "name": name,
            "description": description,
            "personInfos": personInfos,
            "deviceInfos": deviceInfos
        };
        businessSDK.publish(funName, params);
    },
    //移除音频广播成员
    //   personInfos：人员列表（ID、名称）
    //   deviceInfos：设备列表（ID、通道号、名称）
    publishRemoveAudioBroadcaseMember: function(personInfos, deviceInfos) {
        var funName = "publishRemoveAudioBroadcaseMember";
        var params = {
            "personInfos": personInfos,
            "deviceInfos": deviceInfos
        };
        businessSDK.publish(funName, params);
    },
    //关闭音频广播
    //   affairID：场景ID
    publishStopAudioBroadcase: function(affairID) {
        var funName = "publishStopAudioBroadcase";
        var params = { "affairID": affairID };
        businessSDK.publish(funName, params);
    },
    //添加资源
    //affairID, peopleList:[{resId:"",resName:"张三"}]，deviceList:[{resId:"",resCh:"",resName:"设备AAA"}]}
    //   affairID：场景ID
    //   personInfos：人员列表（ID、名称）
    //   deviceInfos：设备列表（ID、通道号、名称）
    publishAddAudioBoardCaseMember: function(affairID, personInfos, deviceInfos) {
        var funName = "publishAddAudioBoardCaseMember";
        var params = {
            "affairID": affairID,
            "personInfos": personInfos,
            "deviceInfos": deviceInfos
        };
        businessSDK.publish(funName, params);
    },


    /*用户场景**************************************************************************************/
    //通知刷新场景列表回调
    setReceiveInformRefreshSceneListCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformRefreshSceneListCB = cb;
        }
    },

    //通知刷新场景明细回调
    setReceiveInformRefreshActivedSceneDetailCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformRefreshActivedSceneDetailCB = cb;
        }
    },
    _receiveInformRefreshActivedCommandResourceCb: null,
    //通知刷新指挥明细回调
    setReceiveInformRefreshActivedCommandDetailCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformRefreshActivedCommandResourceCb = cb;
        }
    },
    //通知删除场景明细回调
    setReceiveInformRemoveActivedSceneDetailCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformRemoveActivedSceneDetailCB = cb;
        }
    },
    _ReceiveInformStopCommandDetailCb: null,
    setReceiveInformRemoveActivedCommandDetailCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._ReceiveInformStopCommandDetailCb = cb;
        }
    },
    // 订阅转发信息回调
    setReceiveSubscribeTransmitInfosCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveSubscribeTransmitInfosCB = cb;
        }
    },

    //场景应用
    publishSetIsActivedScene: function(sceneID, IsActived) {
        var funName = "publishSetIsActivedScene";
        var params = {
            "sceneID": sceneID,
            "IsActived": IsActived + ""
        };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    //场景停止
    publishStopScene: function(sceneID) {
        var funName = "publishStopScene";
        var params = { "sceneID": sceneID };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    /*视频会议****************************************************************************/
    //主席-开启会议
    /*
     *  members:[
         {index:0, userID:"", userName:""}
         {index:1, userID:"", userName:""}
        ],
       device:[
         {index:0, deviceID:"", deviceName:"",deviceSIPID:""}
         {index:1, deviceID:"", deviceName:"",deviceSIPID:""}
        ],
       spectator:[
         {index:0, userID:"", userName:""}
         {index:1, userID:"", userName:""}
        ]
     */
    publishStartConference: function(sceneName, description, schemeID, isMediaProcessing, operatorName, needPassword, password, members, devices, spectators, mediaType) {
        var funName = "publishStartConference";
        var params = {
            "sceneName": sceneName,
            "description": description,
            "schemeID": schemeID,
            "isMediaProcessing": isMediaProcessing + "",
            "operatorName": operatorName,
            "needPassword": needPassword + "",
            "password": password,
            "members": members,
            "device": devices,
            "spectator": spectators,
            "mediaType": mediaType,
        };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    // 主席开启预设会议
    publishStartGroupConference: function(meetingGroupID, mediaType) {
        var funName = "publishStartGroupConference";
        var params = { "meetingGroupID": meetingGroupID, "mediaType": mediaType };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    //主席-停止会议
    publishStopConference: function(sceneID) {
        var funName = "publishStopConference";
        var params = { "sceneID": sceneID };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    // 主席-历史会议重开
    publishRestartHistoryConference: function(conferenceID) {
        var funName = "publishRestartHistoryConference";
        var params = { "conferenceID": conferenceID };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    //主席-添加成员
    /*
     *  members:[
         {index:0, userID:"", userName:""}
         {index:1, userID:"", userName:""}
        ]
     */
    publishAddMembersFromConference: function(sceneID, members) {
        var funName = "publishAddMembersFromConference";
        var params = {
            "sceneID": sceneID,
            "members": members
        };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },
    //主席-强退成员
    /*
     * memberIDs:["","",...]
     */
    publishRemoveMembersFromConference: function(sceneID, memberIDs) {
        var funName = "publishRemoveMembersFromConference";
        var params = {
            "sceneID": sceneID,
            "memberIDs": memberIDs
        };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    //主席-指定发言
    publishSetSpeakerFromConference: function(sceneID, memberID) {
        var funName = "publishSetSpeakerFromConference";
        var params = {
            "sceneID": sceneID,
            "memberID": memberID
        };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    //主席-收回发言
    publishCancelSpeakerFromConference: function(sceneID) {
        var funName = "publishCancelSpeakerFromConference";
        var params = { "sceneID": sceneID };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    // 主席-会议暂停（恢复）
    publishSetPausedFromConference: function(sceneID, isPaused) {
        var funName = "publishSetPausedFromConference";
        var params = {
            "sceneID": sceneID,
            "isPaused": isPaused + ""
        };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    // 主席-会议静音
    publishSetMutedFromConference: function(sceneID, isMuted) {
        var funName = "publishSetMutedFromConference";
        var params = {
            "sceneID": sceneID,
            "isMuted": isMuted + ""
        };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    //主席-同意发言
    publishAcceptSpeakerFromConference: function(sceneID, isMuted) {
        var funName = "publishAcceptSpeakerFromConference";
        var params = {
            "sceneID": sceneID,
            "isMuted": isMuted + ""
        };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },
    //主席-会议讨论

    //主席-会议静音

    //主席-设备调阅
    publishPlayDeviceFromConference: function(sceneID, deviceID) {
        var funName = "publishPlayDeviceFromConference";
        var params = {
            "sceneID": sceneID,
            "deviceID": deviceID
        };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    //成员-加入会议
    publishMemberJoinFromConference: function(sceneID) {
        var funName = "publishMemberJoinFromConference";
        var params = { "sceneID": sceneID };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    //成员-申请发言
    publishMemberSpeakFromConference: function(sceneID, isCancel) {
        var funName = "publishMemberSpeakFromConference";
        var params = {
            "sceneID": sceneID,
            "isCancel": isCancel + ""
        };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    //成员-取消发言
    // publishMemberSpeakFromConference : function(sceneID, isCancel){
    // 	var funName = "publishMemberSpeakFromConference";
    // 	var params = {"sceneID":sceneID,
    // 			"isCancel":isCancel+""};
    // 	businessSDK.publish(funName, params);
    // },

    //成员-退出会议
    publishMemberLeaveFromConference: function(sceneID) {
        var funName = "publishMemberLeaveFromConference";
        var params = { "sceneID": sceneID };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    //旁观-加入会议
    publishSpectatorJoinFromConference: function(sceneID) {
        var funName = "publishSpectatorJoinFromConference";
        var params = { "sceneID": sceneID };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    //旁观-退出会议
    publishSpectatorLeaveFromConference: function(sceneID) {
        var funName = "publishSpectatorLeaveFromConference";
        var params = { "sceneID": sceneID };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    //受邀入会（主席发起，对方接受）
    publishInviteJoinFromConference: function(sceneID, isSpectator) {
        var funName = "publishInviteJoinFromConference";
        var params = {
            "sceneID": sceneID,
            "isSpectator": isSpectator + ""
        };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    /*分组点播****************************************************************************/
    //开启点播

    publishStartPollPlayByGroup: function(groupID) {
        var funName = "publishStartPollPlayByGroup";
        var params = {
            "groupID": groupID
        };
        businessSDK.publish(funName, params);
    },
    publishStartGroupPlay: function(groupID) {
        var funName = "publishStartGroupPlay";
        var params = {
            "groupID": groupID
        };
        businessSDK.publish(funName, params);
    },

    //停止点播
    publishStopPollPlay: function(sceneID) {
        var funName = "publishStopPollPlay";
        var params = { "sceneID": sceneID };
        businessSDK.publish(funName, params);
    },

    publishStopGroupPlay: function(groupID) {
        var funName = "publishStopGroupPlay";
        var params = { "groupID": groupID };
        businessSDK.publish(funName, params);
    },

    //添加成员
    /*
	 *  members:[
	     {index:3, resourceID:"", resourceType:0, resourceName:""}
	     {index:4, resourceID:"", resourceType:0, resourceName:""}
	     {index:5, resourceID:"", resourceType:0, resourceName:""}
        ]
	 */
    publishAddMembersFromGroupPlay: function(sceneID, members) {
        var funName = "publishAddMembersFromGroupPlay";
        var params = {
            "sceneID": sceneID,
            "members": members
        };
        businessSDK.publish(funName, params);
    },

    //删除成员
    /*
     * memberIDs:["","",""]
     */
    publishRemoveMembersFromGroupPlay: function(sceneID, memberIDs) {
        var funName = "publishRemoveMembersFromGroupPlay";
        var params = {
            "sceneID": sceneID,
            "memberIDs": memberIDs
        };
        businessSDK.publish(funName, params);
    },

    //发布用户状态
    publishUserStatus: function(status, encoderSIPID) {
        var funName = "publishUserStatus";
        var params = { "status": status + "",  encoderSIPID: encoderSIPID};
        var serviceName = "AdminService";
        businessSDK.publish(funName, params, serviceName);
    },

    //订阅分组状态
    subscribeBusinessGroupList: function(subscribeID, containsGroup, containsReousce, groupID) {
        var funName = "subscribeBusinessGroupList";
        var params = {
            "subscribeID": subscribeID,
            "containsGroup": containsGroup,
            "containsReousce": containsReousce,
            "groupID": groupID
        };
        businessSDK.publish(funName, params);
    },
    //取消订阅分组状态（批量）
    cancelSubscribeBusinessGroupList: function(subscribeIDs) {
        var funName = "cancelSubscribeBusinessGroupList";
        var params = {
            "subscribeIDs": subscribeID + ""
        };
        businessSDK.publish(funName, params);
    },

    _ReceiveInformAddBusinessGroupListCb: null,
    //分组状态反馈
    setInformAddBusinessGroupList: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._ReceiveInformAddBusinessGroupListCb = callback
        }
    },

    _ReceiveInformAddBusinessGroupResourceCb: null,
    //轮循点播资源推送，走的是会议场景通知刷新场景明细
    setInformAddBusinessGroupResource: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._ReceiveInformAddBusinessGroupResourceCb = callback
        }
    },

    _ReceiveInformRefreshBusinessGroupResourceCb: null,
    //分组资源状态更新反馈
    setInformRefreshBusinessGroupResource: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._ReceiveInformRefreshBusinessGroupResourceCb = callback
        }
    },

    _ReceiveInformStopBusinessGroupResourceCb: null,
    //轮循点播停止反馈，走的是场景中的场景停止
    setInformStopBusinessGroupResource: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._ReceiveInformStopBusinessGroupResourceCb = callback
        }
    },

    // 设置显示方案
    publishSetSchemeFromPollPlay: function(sceneID, schemeID) {
        var funName = "publishSetSchemeFromPollPlay";
        var params = {
            "sceneID": sceneID,
            "schemeID": schemeID
        };
        businessSDK.publish(funName, params);
    },

    //===============================================================解码器控制=========================================

    /**
     * 设置全屏
     */

    publishSetDecoderFullScreen: function(decoderID, screenIndex) {
        var funName = "publishSetDecoderFullScreen";
        var params = {
            "decoderID": decoderID,
            "screenIndex": screenIndex + ""
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    /**
     * 取消全屏
     */

    publishCancelDecoderFullScreen: function(decoderID) {
        var funName = "publishCancelDecoderFullScreen";
        var params = {
            "decoderID": decoderID
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    /**
     * 设置分屏类型
     */

    publishSetDecoderSplitType: function(decoderID, splitType) {
        var funName = "publishSetDecoderSplitType";
        var params = {
            "decoderID": decoderID,
            "splitType": splitType + ""
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    /**
     * 设置设备声音（开关）
     */

    publishSetDecoderSoundOff: function(decoderID, soundOff) {
        var funName = "publishSetDecoderSoundOff";
        var params = {
            "decoderID": decoderID,
            "soundOff": soundOff + ""
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    /**
     *设置分屏声音（音量）
     */

    publishSetDecoderScreenSoundValue: function(decoderID, screenIndex, value) {
        var funName = "publishSetDecoderScreenSoundValue";
        var params = {
            "decoderID": decoderID,
            "screenIndex": screenIndex + "",
            "value": value + ""
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    /**
     * 设置分屏声音（开关）
     */

    publishSetDecoderScreenSoundOff: function(decoderID, screenIndex, soundOff) {
        var funName = "publishSetDecoderScreenSoundOff";
        var params = {
            "decoderID": decoderID,
            "screenIndex": screenIndex + "",
            "soundOff": soundOff + ""
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    //订阅解码器列表
    subscribeUserDecoderForList: function(subscribeID, containsDecoder, containsDecoderDetail) {
        var funName = "subscribeUserDecoder";
        var params = {
            "subscribeID": subscribeID,
            "containsGroup": "true",
            "containsDecoder": containsDecoder + "",
            "containsDecoderDetail": containsDecoderDetail + "",
            "groupID": "",
            "decoderID": ""
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    //订阅解码器分组底下的解码器列表
    subscribeUserDecoderForListInfo: function(subscribeID, groupID) {
        var funName = "subscribeUserDecoder";
        var params = {
            "subscribeID": subscribeID,
            "containsGroup": "false",
            "containsDecoder": "true",
            "containsDecoderDetail": "true",
            "groupID": groupID,
            "decoderID": ""
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    //订阅解码器明细
    subscribeUserDecoderForDetail: function(subscribeID, groupId, decoderID) {
        var funName = "subscribeUserDecoder";
        var params = {
            "subscribeID": subscribeID,
            "containsGroup": "false",
            "containsDecoder": "false",
            "containsDecoderDetail": "true",
            "groupID": groupId,
            "decoderID": decoderID
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    //取消订阅（批量）
    cancelSubscribeUserDecoder: function(subscribeIDs) {
        var funName = "cancelSubscribeUserDecoder";
        var params = {
            "subscribeIDs": subscribeIDs + ""
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    //解码器分组加载反馈
    _receiveInformAddDecoderGroupsCb: null,
    setInformAddDecoderGroups: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._receiveInformAddDecoderGroupsCb = callback;
        }
    },

    //解码器分组加载反馈
    _receiveInformAddDecoderGroupItemsCb: null,
    setInformAddDecoderGroupItems: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._receiveInformAddDecoderGroupItemsCb = callback;
        }
    },
    //解码器条目变更反馈
    _receiveInformRefreshDecoderGroupItemsCb: null,
    setInformRefreshDecoderGroupItems: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._receiveInformRefreshDecoderGroupItemsCb = callback;
        }
    },

    //解码器状态变更反馈
    _receiveInformDecoderStatusCb: null,
    setInformDecoderStatus: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._receiveInformDecoderStatusCb = callback;
        }
    },

    /**
     * 开启分屏点播
     */

    /* publishStartDecoderScreenPlay : function(decoderID,screenIndex,encoderID,encoderName){
       var funName = "publishStartDecoderScreenPlay";
       var params = {
         "decoderID":decoderID,
         "screenIndex":screenIndex,
         "encoderID":encoderID,
         "encoderName":encoderName
       };
       businessSDK.publish(funName, params);
     },*/

    publishStartDecoderScreenPlay: function(decoderID, screenIndex, resourceID, resourceType, resourceName) {
        var funName = "publishStartDecoderScreenPlay";
        var params = {
            "decoderID": decoderID,
            "screenIndex": screenIndex + "",
            "resourceID": resourceID,
            "resourceType": resourceType + "",
            "resourceName": resourceName
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    /**
     * 停止分屏点播
     */

    publishStopDecoderScreenPlay: function(decoderID, screenIndex) {
        var funName = "publishStopDecoderScreenPlay";
        var params = {
            "decoderID": decoderID,
            "screenIndex": screenIndex + ""
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    /**
     * 停止全部分屏点播
     */

    publishStopDecoderPlay: function(decoderID) {
        var funName = "publishStopDecoderPlay";
        var params = {
            "decoderID": decoderID
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    /**
     * 开启组业务
     */

    publishStartDecoderGroup: function(decoderID, decoderGroupID, schemeID) {
        var funName = "publishStartDecoderGroup";
        var params = {
            "decoderID": decoderID,
            "decoderGroupID": decoderGroupID,
            "schemeID": schemeID
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    /**
     * 停止组业务
     */

    publishStopDecoderGroup: function(decoderID) {
        var funName = "publishStopDecoderGroup";
        var params = {
            "decoderID": decoderID
        };
        var serviceName = "ResourceControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    /**
     * 申请入会（主席端）主席同意或拒绝用户申请加入会议，终端无感知
     */
    publishAnswerApplyJoinFromConference: function(sceneID, applyUserID, isAgree) {
        var funName = "publishAnswerApplyJoinFromConference";
        var params = {
            "sceneID": sceneID,
            "applyUserID": applyUserID,
            "isAgree": isAgree + ""
        };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    /**
     * 用户申请入会
     */
    publishApplyJoinFromConference: function(sceneID, isSpectator, applyUserName, password) {
        var funName = "publishApplyJoinFromConference";
        var params = {
            "sceneID": sceneID,
            "isSpectator": isSpectator + "",
            "applyUserName": applyUserName,
            "password": password
        };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },

    /**
     *  即时通讯 发送消息
     * */
    publishSendCommunicationMessage: function(receiverIDs, content) {
        var funName = "publishSendCommunicationMessage"
        var params = {
            "receiverIDs": receiverIDs,
            "content": content
        }

        businessSDK.publish(funName, params)
    },
    /**
     * 即时通讯 发送消息（会话内）
     * */
    publishSendCommunicationMessageFromSession: function(sessionID, content) {
        var funName = "publishSendCommunicationMessageFromSession"
        var params = {
            "sessionID": sessionID,
            "content": content
        }
        businessSDK.publish(funName, params)
    },

    /**
     * 设置消息已读
     */
    publishSetCommunicationMessageReaded: function(messageIDs) {
        var funName = "publishSetCommunicationMessageReaded"
        var params = {
            "messageIDs": messageIDs
        }
        businessSDK.publish(funName, params)
    },

    /**
     * 订阅会话状态
     */

    subscribeUserCommSessionPreview: function(subscribeID, isUnreaded) {
        var funName = "subscribeUserCommSessionPreview"
        var params = {
            "subscribeID": subscribeID,
            "isUnreaded": isUnreaded
        }
        businessSDK.publish(funName, params)
    },

    /**
     * 取消订阅会话状态
     */
    cancelSubscribeUserCommSessionPreview: function(subscribeID, isUnreaded) {
        var funName = "cancelSubscribeUserCommSessionPreview"
        var params = {
            "subscribeID": subscribeID
        }
        businessSDK.publish(funName, params);
    },

    /*  /!**
       * 即时通讯 发送通知
       * *!/
      publishSendCommunicationNotification:function(receiverIDs,content){
        var funName = "publishSendCommunicationNotification"
        var params = {
          "receiverIDs":receiverIDs,
          "content":content
        }
        businessSDK.publish(funName,params)
      },*/

    /**
     *  用户通知 - 发送通知
     */

    publishSendCommunicationNotification: function(receiverIDs, content, fontFamlily, fontSize, fontStyle, fontColorR, fontColorG, fontColorB, direction, aligning, speed, isScrollTime, scrollInterval) {
        var funName = "publishSendCommunicationNotification"
        var params = {
            "receiverIDs": receiverIDs,
            "content": content,
            "fontFamlily": fontFamlily,
            "fontSize": fontSize,
            "fontStyle": fontStyle,
            "fontColorR": fontColorR,
            "fontColorG": fontColorG,
            "fontColorB": fontColorB,
            "direction": direction,
            "aligning": aligning,
            "speed": speed,
            "isScrollTime": isScrollTime,
            "scrollInterval": scrollInterval,
        }
        businessSDK.publish(funName, params)
    },


    _receiveCommunicationNotificationCB: null,
    setInformRecevieCommunicationNotificationCallback: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._receiveCommunicationNotificationCB = callback;
        }
    },

    //视频会议新增接口，yangyong，2019-11-04 ===================
    //开启会议反馈
    _receiveInformGroupStartMediaCB: null,
    setReceiveInformGroupStartMediaCallback: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._receiveInformGroupStartMediaCB = callback;
        }
    },

    //刷新会议反馈
    _receiveInformRefreshGroupMediaCB: null,
    setReceiveInformRefreshGroupMediaCallback: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._receiveInformRefreshGroupMediaCB = callback;
        }
    },

    //停止会议反馈
    _receiveInformStopGroupMediaCB: null,
    setReceiveInformStopGroupMediaCallback: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._receiveInformStopGroupMediaCB = callback;
        }
    },


    //即时消息 - 接收消息反馈
    _receiveInformReceiveMessageCB: null,
    _receiveInformReceiveMessageCBOld: null,
    setReceiveInformRecevieMessageCallback: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._receiveInformReceiveMessageCB = callback;
            // businessSDK._receiveInformReceiveMessageCB1 = null;
        }
    },

    _receiveInformReceiveMessageCB1: null,
    _receiveInformReceiveMessageCB1Old: null,
    setReceiveInformRecevieMessageCallback1: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._receiveInformReceiveMessageCB1 = callback;
            // businessSDK._receiveInformReceiveMessageCB1 = null;
        }
    },


    // 接收会话状态反馈
    _receiveInformUserCommSessionPreviewCB: null,
    setReceiveInformUserCommSessionPreviewCallback: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._receiveInformUserCommSessionPreviewCB = callback;
            // businessSDK._receiveInformUserCommSessionPreviewCB1 = null;
        }
    },

    //接收会话状态反馈1,用于顶部接收
    _receiveInformUserCommSessionPreviewCB1: null,
    setReceiveInformUserCommSessionPreviewCallback1: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._receiveInformUserCommSessionPreviewCB1 = callback;
            // businessSDK._receiveInformUserCommSessionPreviewCB = null;
        }
    },

    //业务等待中取消业务
    cancelBusiness: function(resourceID, resourceType, busType) {
        var funName = "cancelBusiness"
        var params = {
            "resourceID": resourceID,
            "resourceType": resourceType + "",
            "type": busType + "" //Play,Call,Speak
        }
        var serviceName = "CoreControlService";
        businessSDK.publish(funName, params, serviceName)
    },

    //强制I帧
    publishCaptureIFrame: function(resourceID, resourceType,channelIndex) {
        var funName = "publishCaptureIFrame";
        var params = {
            "resourceID": resourceID,
            "resourceType": resourceType + "",
            "channelIndex": channelIndex + ""
        };
        var serviceName = "CoreControlService"
        businessSDK.publish(funName, params, serviceName);
    },

    //异常下线
    publishUserStatusException: function() {
        var funName = "publishUserStatusException";
        var params = {
            "type": "0"
        };
        var serviceName = "AdminService"
        businessSDK.publish(funName, params, serviceName);
    },

    // 声音消息反馈
    _receiveInformVoiceRemindCB: null,
    setReceiveInformVoiceRemindCallback: function(cb) {
        if (businessSDK._isEmpty(cb) == false) {
            businessSDK._receiveInformVoiceRemindCB = cb;
        }
    },

    // 告警业务
    _receiveInformAlarmInfoCB: null,
    setReceiveInformAlarmInfoCallback: function(cb) {
        if (businessSDK._isEmpty(cb) === false) {
            businessSDK._receiveInformAlarmInfoCB = cb;
        }
    },

    //设置告警信息已读
    publishSetMessageReaded: function(alarmAsgId) {
        var funName = "publishSetMessageReaded";
        var params = {
            "alarmAsgId": alarmAsgId,
            "isReaded": true
        };
        businessSDK.publish(funName, params);
    },
    // 1111111
    //========================================视频指挥协议 start===================================================
    //开启临时指挥
    publishStartTempCommand: function(topic, commanderId,description, users, devices) {
        var funName = "publishStartTempCommand";
        var params = {
            "operatorToken": businessSDK._token,
            // "topic": topic,
            // "commanderID": commanderId,
            "sceneName":topic,  
            "description":description,
            "schemeID":commanderId,
            "users": users,
            "devices": devices,
            "spectator":"[]"
        };
        // businessSDK6.publish(funName, params);
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },
    //开启分组指挥
    publishStartCommand: function(topic, groupId) {
        var funName = "publishStartCommand";
        var params = {
            "topic": topic,
            "groupId": groupId
        };
        businessSDK6.publish(funName, params);
    },
    //关闭指挥
    publishStopCommand: function(sceneId) {
        var funName = "publishStopCommand";
        var params = {
            "sceneID": sceneId,
        };
        var serviceName = "SceneControlService";
        businessSDK.publish(funName, params, serviceName);
    },
    //激活指挥
    publishActivateCommand: function(sceneId) {
        var funName = "publishActivateCommand";
        var params = {
            "sceneId": sceneId,
        };
        businessSDK6.publish(funName, params);
    },
    //冻结指挥
    publishDeactivateCommand: function(sceneId) {
        var funName = "publishDeactivateCommand";
        var params = {
            "sceneId": sceneId,
        };
        businessSDK6.publish(funName, params);
    },
    //暂停指挥
    publishPauseCommand: function(sceneId) {
        var funName = "publishPauseCommand";
        var params = {
            "sceneId": sceneId,
        };
        businessSDK6.publish(funName, params);
    },
    //恢复指挥
    publishResumeCommand: function(sceneId) {
        var funName = "publishResumeCommand";
        var params = {
            "sceneId": sceneId,
        };
        businessSDK6.publish(funName, params);
    },
    //添加/邀请成员（指挥呼叫,指挥邀请）
    publishCallMember: function(sceneId, users) {
        var funName = "publishAddMembersFromCommand";
        var params = {
            "sceneID": sceneId,
            "members": JSON.stringify(users),
        };
        businessSDK6.publish(funName, params);
    },
    //强退成员
    publishKickMember: function(sceneId, users) {
        var funName = "publishKickMember";
        var params = {
            "sceneId": sceneId,
            "users": users,
        };
        businessSDK6.publish(funName, params);
    },
    //强行插入指挥组参与指挥
    publishForceJoin: function(sceneId) {
        var funName = "publishForceJoin";
        var params = {
            "sceneId": sceneId
        };
        businessSDK6.publish(funName, params);
    },
    //申请退出指挥
    publishApplyLeave: function(sceneId) {
        var funName = "publishApplyLeave";
        var params = {
            "sceneId": sceneId
        };
        businessSDK6.publish(funName, params);
    },
    //向上静默
    publishUpSilentCommand: function(sceneId, model) {
        var funName = "publishUpSilentCommand";
        var params = {
            "sceneId": sceneId,
            "model": model
        };
        businessSDK6.publish(funName, params);
    },
    //关闭向上静默
    publishStopUpSilentCommand: function(sceneId, model) {
        var funName = "publishStopUpSilentCommand";
        var params = {
            "sceneId": sceneId,
            "model": model
        };
        businessSDK6.publish(funName, params);
    },
    //向下静默
    publishDownSilentCommand: function(sceneId, model) {
        var funName = "publishDownSilentCommand";
        var params = {
            "sceneId": sceneId,
            "model": model
        };
        businessSDK6.publish(funName, params);
    },
    //关闭向下静默
    publishStopDownSilentCommand: function(sceneId, model) {
        var funName = "publishStopDownSilentCommand";
        var params = {
            "sceneId": sceneId,
            "model": model
        };
        businessSDK6.publish(funName, params);
    },
    //专向指挥
    publishSpecialCommand: function(sceneId, userId, model) {
        var funName = "publishSpecialCommand";
        var params = {
            "sceneId": sceneId,
            "userId": userId,
            "model": model
        };
        businessSDK6.publish(funName, params);
    },
    //停止专向指挥
    publishStopSpecialCommand: function(sceneId, userId, model) {
        var funName = "publishStopSpecialCommand";
        var params = {
            "sceneId": sceneId,
            "userId": userId,
            "model": model
        };
        businessSDK6.publish(funName, params);
    },
    //协同指挥
    publishCooperateCommand: function(sceneId, userId) {
        var funName = "publishCooperationFromCommand";
        var params = {
            "sceneID": sceneId,
            "members": JSON.stringify(userId)
        };
        let serviceName="SceneControlService";
        businessSDK6.publish(funName, params, serviceName);
    },
    //停止协同指挥
    publishStopCooperateCommand: function(sceneId, userId) {
        var funName = "publishStopCoordinateCommand";
        var params = {
            "sceneId": sceneId,
            "userId": userId
        };
        let serviceName="SceneControlService";
        businessSDK6.publish(funName, params, serviceName);
    },

    //协调指挥
    publishCoordinateCommand: function(sceneId, users) {
        var funName = "publishCoordinateCommand";
        var params = {
            "sceneId": sceneId,
            "users": users
        };
        let serviceName="SceneControlService";
        businessSDK6.publish(funName, params, serviceName);
    },
    //停止协调指挥
    publishStopCoordinateCommand: function(sceneId, users) {
        var funName = "publishStopCoordinateCommand";
        var params = {
            "sceneId": sceneId,
            "users": users
        };
        let serviceName="SceneControlService";
        businessSDK6.publish(funName, params, serviceName);
    },
    //停止全部协调指挥
    publishStopAllCoordinateCommand: function(sceneId, users) {
        var funName = "publishStopAllCoordinateCommand";
        var params = {
            "sceneId": sceneId,
            "users": users
        };
        let serviceName="SceneControlService";
        businessSDK6.publish(funName, params, serviceName);
    },
    
    //授权指挥
    publishAuthorizeCommand: function(sceneId, userId) {
        var funName = "publishAuthorizeCommand";
        var params = {
            "sceneId": sceneId,
            "userId": userId
        };
        businessSDK6.publish(funName, params);
    },
    //停止授权指挥
    publishStopAuthorizeCommand: function(sceneId, userId) {
        var funName = "publishStopAuthorizeCommand";
        var params = {
            "sceneId": sceneId,
            "userId": userId
        };
        businessSDK6.publish(funName, params);
    },
    //越级指挥
    publishCrossGradeCommand: function(sceneId, userId) {
        var funName = "publishCrossGradeCommand";
        var params = {
            "sceneID": sceneId,
            "userId":userId
        };
        var serviceName = 'SceneControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    //指挥呼叫
    publishCommandCall: function(sceneId, userId) {
        var funName = "publishCommandCall";
        var params = {
            "sceneID": sceneId,
            "userId": userId
        };
        var serviceName = 'SceneControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    //取消越级指挥、指挥呼叫
    publishStopCrossGradeCommand: function(sceneId, userId) {
        var funName = "publishStopCrossGradeCommand";
        var params = {
            "sceneID": sceneId,
            "userId": userId
        };
        var serviceName = 'SceneControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    //接替指挥
    publishSupersedeCommand: function(sceneId, userId) {
        var funName = "publishSupersedeCommand";
        var params = {
            "sceneId": sceneId,
            "userId": userId
        };
        businessSDK6.publish(funName, params);
    },
    //停止接替指挥
    publishStopSupersedeCommand: function(sceneId, userId) {
        var funName = "publishStopSupersedeCommand";
        var params = {
            "sceneId": sceneId,
            "userId": userId
        };
        businessSDK6.publish(funName, params);
    },
    //分派指挥
    publishAllocateCommand: function(sceneId, userId, users) {
        var funName = "publishAllocateCommand";
        var params = {
            "sceneId": sceneId,
            "userId": userId,
            "users": users
        };
        businessSDK6.publish(funName, params);
    },
    //停止分派指挥
    publishCancelAllocateCommand: function(sceneId, userId) {
        var funName = "publishCancelAllocateCommand";
        var params = {
            "sceneId": sceneId,
            "userId": userId
        };
        businessSDK6.publish(funName, params);
    },
    //指挥转发
    publishTransmitCommand: function(sceneId, resources, users) {
        var funName = "publishTransmitCommand";
        var params = {
            "sceneId": sceneId,
            "resources": resources,
            "users": users
        };
        businessSDK6.publish(funName, params);
    },
    //停止指挥转发
    publishStopTransmitCommand: function(sceneId, resourceId, resourceCh, userId) {
        var funName = "publishStopTransmitCommand";
        var params = {
            "sceneId": sceneId,
            "resourceId": resourceId,
            "resourceCh": resourceCh,
            "userId": userId
        };
        businessSDK6.publish(funName, params);
    },
    //停止所有指挥转发
    publishStopAllTransmitCommand: function(sceneId) {
        var funName = "publishStopAllTransmitCommand";
        var params = {
            "sceneId": sceneId
        };
        businessSDK6.publish(funName, params);
    },
    //指挥广播
    publishBroadcastCommand: function(sceneId) {
        var funName = "publishBroadcastCommand";
        var params = {
            "sceneId": sceneId
        };
        businessSDK6.publish(funName, params);
    },
    //停止指挥广播
    publishStopBroadcastCommand: function(sceneId) {
        var funName = "publishStopBroadcastCommand";
        var params = {
            "sceneId": sceneId
        };
        businessSDK6.publish(funName, params);
    },
    //指挥提醒
    publishForespeakCommand: function(sceneId, userId) {
        var funName = "publishForespeakCommand";
        var params = {
            "sceneId": sceneId,
            "userId": userId
        };
        businessSDK6.publish(funName, params);
    },
    //停止指挥提醒
    publishStopForespeakCommand: function(sceneId, userId) {
        var funName = "publishStopForespeakCommand";
        var params = {
            "sceneId": sceneId,
            "userId": userId
        };
        businessSDK6.publish(funName, params);
    },
    //指挥录像
    publishRecordCommand: function(sceneId, userId, resourceId, resourceCh) {
        var funName = "publishRecordCommand";
        var params = {
            "sceneId": sceneId,
            "userId": userId,
            "resourceId": resourceId,
            "resourceCh": resourceCh,
        };
        businessSDK6.publish(funName, params);
    },
    //停止指挥录像
    publishStopRecordCommand: function(sceneId, userId, resourceId, resourceCh) {
        var funName = "publishStopRecordCommand";
        var params = {
            "sceneId": sceneId,
            "userId": userId,
            "resourceId": resourceId,
            "resourceCh": resourceCh,
        };
        businessSDK6.publish(funName, params);
    },
    // 订阅协调指挥列表
    publishCoordinateList: function(sceneId) {
        var funName = "subscribeCoordinateList";
        var params = {
            "sceneId": sceneId
        };
        var serviceName = "SceneControlService"
        businessSDK6.publish(funName, params, serviceName);
    },
    // 协调指挥列表
    receiveInformRefreshCoordinateListCB: null,
    setReceiveInformRefreshCoordinateListCallback: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK.receiveInformRefreshCoordinateListCB = callback;
        }
    },
    //========================================视频指挥协议 end===================================================
    //========================================录播 start========================================================
    // 开启录播用户
    publishStartUserRecord: function(targetUserID, deviceType) {
        var funName = "publishStartUserRecord";
        var params = {
            "targetUserID": targetUserID,
            "deviceType": deviceType
        };
        var serviceName = 'ResourceControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    // 停止录播用户
    publishStopUserRecord: function(resourceID) {
        var funName = "publishStopUserRecord";
        var params = {
            "resourceID": resourceID,
        };
        var serviceName = 'ResourceControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    // 开启录播设备
    publishStartDeviceRecord: function(deviceID, deviceType) {
        var funName = "publishStartDeviceRecord";
        var params = {
            "deviceID": deviceID,
            "deviceType": deviceType
        };
        var serviceName = 'ResourceControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    // 停止录播设备
    publishStopDeviceRecord: function(resourceID) {
        var funName = "publishStopDeviceRecord";
        var params = {
            "resourceID": resourceID
        };
        var serviceName = 'ResourceControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    // 开启录播反馈
    // _receiveinformStartRecordCB: null,
    setReceiveInformStartRecordCallback: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._receiveinformStartRecordCB = callback;
            // businessSDK._receiveInformUserCommSessionPreviewCB = null;
        }
    },
    //========================================录播 end=========================================================
    //========================================文件 start  ===================================================
    // 开启点播媒资文件
    publishStartPlayFileChannel(screenIndex, itemID) {
        var funName = "publishStartPlayFileChannel";
        var params = {
            "screenIndex": screenIndex +'',
            "itemID": itemID
        };
        var serviceName = 'ResourceControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    // 点播媒资文件反馈
    setReceiveInformStartFileMediaCallback: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._receiveInformStartFileMediaCB = callback;
        }
    },
    // 开启录像回放
    publishStartPlayRecordItem(screenIndex, resourceID, deviceType, begin, end) {
        var funName = "publishStartPlayRecordItem";
        var params = {
            "screenIndex": screenIndex,
            "resourceID": resourceID,
            "deviceType": deviceType +'',
            "begin": begin,
            "end": end
        };
        var serviceName = 'ResourceControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    // 录像回放反馈
    setReceiveInformStartRecordMediaCallback: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._receiveInformStartRecordMediaCB = callback;
        }
    },
    //软编注册
    _receiveInformInitMediaForEncoderCB: null,
    setInformInitMediaForEncoderCallback: function(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._receiveInformInitMediaForEncoderCB = callback;
        }
    },
    //========================================文件 end  ===================================================
    //断网重连
    publishReconnect() {
        var funName = "publishReconnect";
        var params = {};
        var serviceName = 'CoreControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    //========================================视频会议 start  ===================================================
    // 主席,成员闭音
    publishMemberAudioAbility(sceneID, memberIDs, audioAbility) {
        var funName = "publishMemberAudioAbility";
        var params = {
            sceneID: sceneID,
            memberIDs: memberIDs,
            audioAbility: audioAbility+''
        };
        var serviceName = 'SceneControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    // 主席,成员闭麦
    publishMemberMicrophone(sceneID, memberIDs, microphoneAbility) {
        var funName = "publishMemberMicrophone";
        var params = {
            sceneID: sceneID,
            memberIDs: memberIDs,
            microphoneAbility: microphoneAbility+''
        };
        var serviceName = 'SceneControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    // 主席,成员关闭视频
    publishMemberVideoAbility(sceneID, memberIDs, videoAbility) {
        var funName = "publishMemberVideoAbility";
        var params = {
            sceneID: sceneID,
            memberIDs: memberIDs,
            videoAbility: videoAbility +''
        };
        var serviceName = 'SceneControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    // ID加入会议
    publishMemberJoinMeetingBySceneID(sceneID, memberID, microphoneAbility) {
        var funName = "publishMemberJoinMeetingBySceneID";
        var params = {
            sceneID: sceneID,
            memberID: memberID,
            microphoneAbility: microphoneAbility +''
        };
        var serviceName = 'SceneControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    // 指定主席
    publishSetChairmanRole(sceneID, memberID) {
        var funName = "publishSetChairmanRole";
        var params = {
            sceneID: sceneID,
            memberID: memberID
        };
        var serviceName = 'SceneControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    // 共享屏幕
    publishShareScreen(sceneID, isShare) {
        var funName = "publishShareScreen";
        var params = {
            sceneID: sceneID,
            isShare: isShare +''
        };
        var serviceName = 'SceneControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    // 主席退出会议
    publishChairmanQuitConference(sceneID) {
        var funName = "publishChairmanQuitConference";
        var params = {
            sceneID: sceneID,
        };
        var serviceName = 'SceneControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    // 成员通过会议ID加入会议
    publishMemberJoinConferenceOfID(sceneID, audioAbility, videoAbility, microphoneAbility) {
        var funName = "publishMemberJoinConferenceOfID";
        var params = {
            sceneID: sceneID,
            audioAbility: audioAbility +'',
            videoAbility: videoAbility +'',
            microphoneAbility: microphoneAbility +''
        };
        var serviceName = 'SceneControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    // 主席-会议讨论
    publishDiscussConference(sceneID, sceneName, description, isMediaProcessing, operatorName, needPassword, password, mediaType, startType, arrangeTime, microphoneAbility, members, arrangeLength) {
        var funName = "publishDiscussConference";
        var params = {
            sceneID: sceneID,
            sceneName: sceneName,
            description: description,
            isMediaProcessing: isMediaProcessing +'',
            operatorName: operatorName,
            needPassword: needPassword +'',
            password: password,
            mediaType: mediaType,
            startType: startType,
            arrangeTime: arrangeTime + '',
            arrangeLength: arrangeLength + '',
            microphoneAbility: microphoneAbility +'',
            members: JSON.stringify(members)
        };
        var serviceName = 'SceneControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    // 重开历史讨论会议
    publishRestartHistoryDiscussConference(sceneID) {
        var funName = "publishRestartHistoryDiscussConference";
        var params = {
            sceneID: sceneID,
        };
        var serviceName = 'SceneControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    //========================================视频会议 end  ===================================================
    //编码器反馈
    _receiveInformInitMediaForBindingEncoderCB: null,
    setInformInitMediaForBindingEncoderCallback(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._receiveInformInitMediaForBindingEncoderCB = callback;
        }
    },

    //发送电子白板通知
    publishWhiteBoard(sceneID,userID, isShow){
        var funName = "publishWhiteBoard";
        var params = {
            sceneID: sceneID,
            userID: userID,
            isShow: isShow+ ''
        };
        var serviceName = 'SceneControlService';
        businessSDK6.publish(funName, params, serviceName);
    },
    // 清除所有业务
    _receiveInformClearAllCB: null,
    setInformClearAllCallback(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._receiveInformClearAllCB = callback;
        }
    },
    // 通知刷新讨论会议（拼接）分屏角标   //1118 云调度修改
    _receiveInformRefreshScreenNameCB: null,
    setInformRefreshScreenNameCallBack(callback) {
        if (businessSDK._isEmpty(callback) === false) {
            businessSDK._receiveInformRefreshScreenNameCB = callback;
        }
    }

};

export var businessSDK6 = businessSDK;