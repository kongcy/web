import Axios from 'axios'

export var dataSDK6 = {
    /*基础接口**************************************************************************************/
    _URLPrefix: "",
    _token: "",
    _errorCB: function(msg) {},
    _isAsync: true,
    _dataType: "json",
    //_contentType: 'application/json;charset=UTF-8',
    //设置URL前缀
    setURLPrefix: function(prefix) {
        if (prefix != null && typeof(prefix) != "undefined") {
            dataSDK6._URLPrefix = prefix;
        }
    },
    //设置token
    setToken: function(token) {
        if (token != null && typeof(token) != "undefined") {
            dataSDK6._token = token;
        }
    },
    //设置调用发生异常时回调方法
    setErrorCallback: function(callback) {
        if (callback != null && typeof(callback) != "undefined") {
            dataSDK6._errorCB = callback;
        }
    },
    //设置是否异步消息
    setIsAsync: function(isAsync) {
        if (isAsync != null && typeof(isAsync) != "undefined") {
            dataSDK6._isAsync = isAsync;
        }
    },
    //设置返回数据类型
    setDataType: function(dataType) {
        if (dataType != null && typeof(dataType) != "undefined") {
            dataSDK6._dataType = dataType;
        }
    },
    _doGet: function(url, data, callback) {
        var configObj = {
            method: "GET",
            url: dataSDK6._URLPrefix + url,
            async: dataSDK6._isAsync,
            data: data,
            dataType: dataSDK6._dataType,
            success: callback,
            error: dataSDK6._errorCB
        };
        // $.ajax(configObj);
        Axios.get(configObj.url + '?' + data).then((res) => {
            //console.log("Axios 请求 get 获取到的结果 ：" + res.config.url)
            //console.log(res.data)
            if (callback) callback(res.data);
        });
    },
    _doPost: function(url, data, callback) {
        var configObj = {
            method: "POST",
            url: dataSDK6._URLPrefix + url,
            async: dataSDK6._isAsync,
            data: data,
            dataType: dataSDK6._dataType,
            success: callback,
            error: dataSDK6._errorCB
        };
        // $.ajax(configObj);
        Axios.post(configObj.url, data, { headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).then((res) => {
            //console.log("Axios 请求 post 获取到的结果 ：" + res.config.url)
            //console.log(res.data)
            if (callback) callback(res.data);
        });
    },
    _getDataString: function(mapObj, noToken) {
        if (noToken == undefined)
            mapObj.set("operatorToken", dataSDK6._token);
        var result = "";
        for (var [key, value] of mapObj) {
            result += key + "=";
            if (value == null) {
                result += "";
            } else if (typeof(value) == "Object" || typeof(value) == "Array" || typeof(value) == "Map") {
                result += JSON.stringify(obj);
            } else {
                result += "" + value;
            }
            result += "&";
        }
        return result.substr(0, result.length - 1);
    },


    /*用户习惯start**************************************************************************************/
    // 设置用户习惯
    setUserCustom: function(userID, callItem, encoderItem, decoderItem, meetingItem, isLocalEncoderID, callback) {
        var mapObj = new Map();
        var obj = {
            "userID": userID,
            "callItem": callItem,
            "encoderItem": encoderItem,
            "decoderItem": decoderItem,
            "meetingItem": meetingItem, //1
            "isLocalEncoderID": isLocalEncoderID
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/userCustom/setUserCustom";
        dataSDK6._doPost(url, data, callback);
    },
    // 读取用户习惯
    getUserCustom: function(callback) {
        var mapObj = new Map();
        var data = dataSDK6._getDataString(mapObj);
        var url = "/userCustom/getUserCustom";
        dataSDK6._doGet(url, data, callback);
    },

    /**
     * 查询设备列表
     */
    queryDeviceList: function(deviceType, beginIndex, count, callback) {
        var mapObj = new Map();
        mapObj.set("deviceType", deviceType);
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/queryDeviceList";
        dataSDK6._doGet(url, data, callback);
    },
    /*用户习惯end**************************************************************************************/


    /*云台控制-预置点start**************************************************************************************/
    //添加预置点
    addUserYTPoint: function(pointID, pointName, userID, resourceID, value, encoderSIPID, callback) {
        var mapObj = new Map();
        var obj = {
            "pointID": pointID,
            "pointName": pointName,
            "userID": userID,
            // "resourceID": resourceID,
            "value": value,
            "encoderSIPID": encoderSIPID
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/ytControl/addUserYTPoint";
        dataSDK6._doPost(url, data, callback);
    },
    //编辑预置点
    editUserYTPoint: function(pointID, pointName, userID, resourceID, value, encoderSIPID, callback) {
        var mapObj = new Map();
        var obj = {
            "pointID": pointID,
            "pointName": pointName,
            "userID": userID,
            // "resourceID": resourceID,
            "value": value,
            "encoderSIPID": encoderSIPID
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/ytControl/editUserYTPoint";
        dataSDK6._doPost(url, data, callback);
    },
    //删除预置点
    removeUserYTPoint: function(pointID, encoderSIPID, callback) {
        var mapObj = new Map();
        mapObj.set("pointID", pointID);
        mapObj.set("encoderSIPID", encoderSIPID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/ytControl/removeUserYTPoint";
        dataSDK6._doGet(url, data, callback);
    },
    //查询预置点
    queryUserYTPointByResID: function(resourceID, beginIndex, count, callback) {
        var mapObj = new Map();
        mapObj.set("resourceID", resourceID);
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/ytControl/queryUserYTPointByResID";
        dataSDK6._doGet(url, data, callback);
    },
    //设置默认预置点
    setDefaultUserYTPoint: function(resourceID, pointID, encoderSIPID, callback) {
        var mapObj = new Map();
        mapObj.set("resourceID", resourceID);
        mapObj.set("pointID", pointID);
		mapObj.set("encoderSIPID", encoderSIPID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/ytControl/setDefaultUserYTPoint";
        dataSDK6._doGet(url, data, callback);
    },
    /*云台控制-预置点end**************************************************************************************/


    /*消息管理**************************************************************************************/
    //查询接收消息列表
    //	startTime Date   开始时间
    //	endTime   Date   结束时间
    //	queryKey  String 检索条件(为空默认查询所有）
    //	userID    String 用户ID
    //	beginIndex int    起始索引
    //	count      int    偏移数量
    getReceiveMsgListByID: function(startTime, endTime, queryKey, userID, beginIndex, count, callback) {
        var mapObj = new Map();
        mapObj.set("startTime", startTime);
        mapObj.set("endTime", endTime);
        mapObj.set("queryKey", queryKey);
        mapObj.set("userID", userID);
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        var data = dataSDK6._getDataString(mapObj);
        var url = "";
        dataSDK6._doPost(url, data, callback);
    },
    //查询发送消息列表
    //	startTime  Date   开始时间
    //	endTime    Date   结束时间
    //	queryKey   String 检索条件（为空默认查询所有）
    //	userID     String 用户ID
    //	beginIndex int    起始索引
    //	count      int    偏移数量
    getSendMsgListByID: function(startTime, endTime, queryKey, userID, beginIndex, count, callback) {
        var mapObj = new Map();
        mapObj.set("startTime", startTime);
        mapObj.set("endTime", endTime);
        mapObj.set("queryKey", queryKey);
        mapObj.set("userID", userID);
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        var data = dataSDK6._getDataString(mapObj);
        var url = "";
        dataSDK6._doPost(url, data, callback);
    },
    //设置已读 未读
    //	msgID String 消息ID
    setReadState: function(msgID, callback) {
        var mapObj = new Map();
        mapObj.set("msgID", msgID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "";
        dataSDK6._doPost(url, data, callback);
    },


    /*全网OSD样式start**************************************************************************************/
    // 添加OSD样式
    addOSDStyle: function(id, name, screenWidth, screenHeight, items, callback) {
        var mapObj = new Map();
        mapObj.set("id", id);
        mapObj.set("name", name);
        mapObj.set("screenWidth", screenWidth);
        mapObj.set("screenHeight", screenHeight);
        mapObj.set("items", items);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/osdManage/addOSDStyle";
        dataSDK6._doPost(url, data, callback);
    },
    //编辑OSD样式
    saveOSDStyle: function(resourceID, index, screenWidth, screenHeight, items, callback) {
        var mapObj = new Map();
        var obj = {
            "resourceID": resourceID,
            "index": index,
            "screenWidth": screenWidth,
            "screenHeight": screenHeight,
            "items": items,
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/osdManage/saveOSDStyle";
        dataSDK6._doPost(url, data, callback);
    },
    //删除OSD样式
    removeOSDStyle: function(resourceID, index, callback) {
        var mapObj = new Map();
        mapObj.set("resourceID", resourceID);
        mapObj.set("index", index);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/osdManage/removeOSDStyle";
        dataSDK6._doGet(url, data, callback);
    },
    // 查询全部OSD样式
    queryAllOSDStyles: function(beginIndex, count, callback) {
        var mapObj = new Map();
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/osdManage/queryAllOSDStyles";
        dataSDK6._doGet(url, data, callback);
    },
    // 根据ID查询样式
    querySingleOSDStyle: function(resourceID, index, callback) {
        var mapObj = new Map();
        mapObj.set("resourceID", resourceID);
        mapObj.set("index", index);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/osdManage/querySingleOSDStyle";
        dataSDK6._doGet(url, data, callback);
    },

    // 保存资源OSD绑定
    saveAnyOSDStyleApply: function(items, callback) {
        var mapObj = new Map();
        mapObj.set("items", items);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/osdManage/saveAnyOSDStyleApply";
        dataSDK6._doPost(url, data, callback);
    },

    // 查询OSD绑定
    queryAnyOSDStyleApply: function(resourceIDs, callback) {
        var mapObj = new Map();
        mapObj.set("resourceIDs", resourceIDs);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/osdManage/queryAnyOSDStyleApply";
        dataSDK6._doGet(url, data, callback);
    },
    /**************************** osd 管理 ***********************************************************/

    /*字幕通知**************************************************************************************/
    //查询已发送字幕列表
    //	userID     String 用户ID
    //	beginIndex int    起始索引
    //	count      int    偏移数量
    getSendOsdList: function(userID, beginIndex, count, callback) {
        var mapObj = new Map();
        mapObj.set("userID", userID);
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        var data = dataSDK6._getDataString(mapObj);
        var url = "";
        dataSDK6._doPost(url, data, callback);
    },
    //删除已发字幕
    //	id String 字幕ID
    delOsdByID: function(id, callback) {
        var mapObj = new Map();
        mapObj.set("id", id);
        var data = dataSDK6._getDataString(mapObj);
        var url = "";
        dataSDK6._doPost(url, data, callback);
    },

    /*业务分组start**************************************************************************************/

    // 添加业务分组
    addBusinessGroup: function(groupName, groupType, description, schemeID, isDefaultScheme, meetingUsers, meetingDevices, playResources, playFixResources, callback) {
        var mapObj = new Map();
        var obj = {
            "groupName": groupName,
            "groupType": groupType,
            "description": description,
            "schemeID": schemeID,
            "isDefaultScheme": isDefaultScheme,
            "meetingUsers": meetingUsers,
            "meetingDevices": meetingDevices,
            "playResources": playResources,
            "playFixResources": playFixResources
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/group/addBusinessGroup";
        dataSDK6._doPost(url, data, callback);
    },
    // 编辑业务分组
    editBusinessGroup: function(groupID, groupName, groupType, description, schemeID, isDefaultScheme, meetingUsers, meetingDevices, playResources, playFixResources, callback) {
        var mapObj = new Map();
        var obj = {
            "groupID": groupID,
            "groupName": groupName,
            "groupType": groupType,
            "description": description,
            "schemeID": schemeID,
            "isDefaultScheme": isDefaultScheme,
            "meetingUsers": meetingUsers,
            "meetingDevices": meetingDevices,
            "playResources": playResources,
            "playFixResources": playFixResources
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/group/editBusinessGroup";
        dataSDK6._doPost(url, data, callback);
    },
    // 批量删除业务分组
    removeAnyBusinessGroups: function(groupIDs, callback) {
        var mapObj = new Map();
        mapObj.set("groupIDs", groupIDs); //["","",""]
        var data = dataSDK6._getDataString(mapObj);
        var url = "/group/removeAnyBusinessGroups";
        dataSDK6._doPost(url, data, callback);
    },
    // 根据分组ID查询业务分组
    querySingleBusinessGroup: function(groupID, callback) {
        var mapObj = new Map();
        mapObj.set("groupID", groupID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/group/querySingleBusinessGroup";
        dataSDK6._doGet(url, data, callback);
    },
    // 查询分组列表 （11 月 21 日 实现版本）
    queryBusinessGroupList: function(type, beginIndex, count, callback) {
        var mapObj = new Map();
        mapObj.set("type", type);
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/group/queryBusinessGroupList";
        dataSDK6._doGet(url, data, callback);
    },

    // 根据分组ID查询呼叫分组
    querySingleCallGroup: function(groupID, callback) {
        var mapObj = new Map();
        mapObj.set("groupID", groupID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/group/querySingleCallGroup";
        dataSDK6._doGet(url, data, callback);
    },

    // 编辑呼叫分组
    editCallGroup: function(groupID, groupName, description, callUsers, callback) {
        var mapObj = new Map();
        var obj = {
            "groupID": groupID,
            "groupName": groupName,
            "description": description,
            "callUsers": callUsers
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/group/editCallGroup";
        dataSDK6._doPost(url, data, callback);
    },

    // 添加呼叫分组
    addCallGroup: function(groupName, description, callUsers, callback) {
        var mapObj = new Map();
        var obj = {
            "groupName": groupName,
            "description": description,
            "callUsers": callUsers
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/group/addCallGroup";
        dataSDK6._doPost(url, data, callback);
    },

    // 添加会议分组
    addMeetingGroup: function(groupName, description, schemeID, isDefaultScheme, needPassword, password, isMediaProcessing, meetingUsers, meetingDevices, callback) {
        var mapObj = new Map();
        var obj = {
            "groupName": groupName,
            "description": description,
            "schemeID": schemeID,
            "isDefaultScheme": isDefaultScheme,
            "needPassword": needPassword,
            "password": password,
            "isMediaProcessing": isMediaProcessing,
            "meetingUsers": meetingUsers,
            "meetingDevices": meetingDevices
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/group/addMeetingGroup";
        dataSDK6._doPost(url, data, callback);
    },
    // 编辑会议分组
    editMeetingGroup: function(groupID, groupName, description, schemeID, isDefaultScheme, needPassword, password, isMediaProcessing, meetingUsers, meetingDevices, callback) {
        var mapObj = new Map();
        var obj = {
            "groupID": groupID,
            "groupName": groupName,
            "description": description,
            "schemeID": schemeID,
            "isDefaultScheme": isDefaultScheme,
            "needPassword": needPassword,
            "password": password,
            "isMediaProcessing": isMediaProcessing,
            "meetingUsers": meetingUsers,
            "meetingDevices": meetingDevices
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/group/editMeetingGroup";
        dataSDK6._doPost(url, data, callback);
    },
    // 根据分组ID查询会议分组
    querySingleMeetingGroup: function(groupID, callback) {
        var mapObj = new Map();
        mapObj.set("groupID", groupID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/group/querySingleMeetingGroup";
        dataSDK6._doGet(url, data, callback);
    },

    // 添加点播分组
    addPlayGroup: function(groupName, description, schemeID, isDefaultScheme, isDecoder, playResources, playFixResources, callback) {
        var mapObj = new Map();
        var obj = {
            "groupName": groupName,
            "description": description,
            "schemeID": schemeID,
            "isDefaultScheme": isDefaultScheme,
            "isDecoder": isDecoder,
            "playResources": playResources,
            "playFixResources": playFixResources
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/group/addPlayGroup";
        dataSDK6._doPost(url, data, callback);
    },

    // 根据分组ID查询点播分组
    querySinglePlayGroup: function(groupID, callback) {
        var mapObj = new Map();
        mapObj.set("groupID", groupID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/group/querySinglePlayGroup";
        dataSDK6._doGet(url, data, callback);
    },

    // 编辑点播分组
    editPlayGroup: function(groupID, groupName, description, schemeID, isDefaultScheme, isDecoder, playResources, playFixResources, callback) {
        var mapObj = new Map();
        var obj = {
            "groupID": groupID,
            "groupName": groupName,
            "description": description,
            "schemeID": schemeID,
            "isDefaultScheme": isDefaultScheme,
            "isDecoder": isDecoder,
            "playResources": playResources,
            "playFixResources": playFixResources
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/group/editPlayGroup";
        dataSDK6._doPost(url, data, callback);
    },

    // 查询近期消息列表
    queryLastUserMessages: function(sessionID, count, callback) {
        var mapObj = new Map();
        mapObj.set("sessionID", sessionID);
        mapObj.set("count", count);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/communication/queryLastUserMessages";
        dataSDK6._doGet(url, data, callback);
    },

    // 查询历史消息列表
    queryHistoryUserMessages: function(beginMessageID, count, callback) {
        var mapObj = new Map();
        mapObj.set("beginMessageID", beginMessageID);
        mapObj.set("count", count);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/communication/queryHistoryUserMessages";
        dataSDK6._doGet(url, data, callback);
    },

    // 根据发起人ID查询通知记录
    queryAllNotificationRecordsBySenderID: function(beginIndex, count, callback) {
        var mapObj = new Map();
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/communication/queryAllNotificationRecordsBySenderID";
        dataSDK6._doGet(url, data, callback);
    },

    // 添加通知模板
    addNotificationTemplate: function(templateName, fontFamlily, fontSize, fontStyle, fontColorR, fontColorG, fontColorB, direction, aligning, speed, isScrollTime, scrollInterval, callback) {
        var mapObj = new Map();
        var obj = {
            "templateName": templateName,
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
            "scrollInterval": scrollInterval
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/communication/addNotificationTemplate";
        dataSDK6._doPost(url, data, callback);
    },

    // 编辑通知模板
    editNotificationTemplate: function(templateID, templateName, fontFamlily, fontSize, fontStyle, fontColorR, fontColorG, fontColorB, direction, aligning, speed, isScrollTime, scrollInterval, callback) {
        var mapObj = new Map();
        var obj = {
            "templateID": templateID,
            "templateName": templateName,
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
            "scrollInterval": scrollInterval
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/communication/editNotificationTemplate";
        dataSDK6._doPost(url, data, callback);
    },

    // 删除通知模板
    removeNotificationTemplate: function(templateID, callback) {
        var mapObj = new Map();
        mapObj.set("templateID", templateID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/communication/removeNotificationTemplate";
        dataSDK6._doGet(url, data, callback);
    },

    // 查询通知模板
    querySingleNotificationTemplate: function(templateID, callback) {
        var mapObj = new Map();
        mapObj.set("templateID", templateID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/communication/querySingleNotificationTemplate";
        dataSDK6._doGet(url, data, callback);
    },

    // 查询模板列表
    queryNotificationTemplatesByUserID: function(beginIndex, count, callback) {
        var mapObj = new Map();
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/communication/queryNotificationTemplatesByUserID";
        dataSDK6._doGet(url, data, callback);
    },

    /*日志查询**************************************************************************************/
    //获取系统日志列表
    //	beginTime  Date   开始时间
    //	endTime    Date   结束时间
    //	queryKey   String 检索条件（为空默认查询所有）
    //	beginIndex int    起始索引
    //	count      int    偏移数量
    getSystemLogList: function(beginTime, endTime, queryKey, beginIndex, count, callback) {
        var mapObj = new Map();
        mapObj.set("beginTime", beginTime);
        mapObj.set("endTime", endTime);
        mapObj.set("queryKey", queryKey);
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        var data = dataSDK6._getDataString(mapObj);
        var url = "";
        dataSDK6._doPost(url, data, callback);
    },
    //操作日志列表
    //	userID     String 用户ID
    //	logType    int    日志类型（0--失败 1--成功 2--错误）
    //	beginTime  Date   开始时间
    //	endTime    Date   结束时间
    //	queryKey   String 检索条件（为空默认查询所有）
    //	beginIndex int    起始索引
    //	count      int    偏移数量
    getOperateLogList: function(userID, logType, beginTime, endTime, queryKey, beginIndex, count, callback) {
        var mapObj = new Map();
        mapObj.set("userID", userID);
        mapObj.set("logType", logType);
        mapObj.set("beginTime", beginTime);
        mapObj.set("endTime", endTime);
        mapObj.set("queryKey", queryKey);
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        var data = dataSDK6._getDataString(mapObj);
        var url = "";
        dataSDK6._doPost(url, data, callback);
    },


    /*密码修改**************************************************************************************/
    //密码修改
    //	userID String 用户ID
    //	oldPwd String 旧密码
    //	newPwd String 新密码
    updatePwd: function(userID, oldPwd, newPwd, callback) {
        var mapObj = new Map();
        mapObj.set("userID", userID);
        mapObj.set("oldPwd", oldPwd);
        mapObj.set("newPwd", newPwd);
        var data = dataSDK6._getDataString(mapObj);
        var url = "";
        dataSDK6._doPost(url, data, callback);
    },

    /**修改用户密码  */
    editUserPassword: function(oldPassword, newPassword, callback) {
        var mapObj = new Map();
        mapObj.set("oldPassword", oldPassword);
        mapObj.set("newPassword", newPassword);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/organization/editUserPassword";
        dataSDK6._doPost(url, data, callback);
    },


    /*终端配置**************************************************************************************/
    //获取解码器列表
    //	queryKey String 检索条件（为空默认查询所有）
    //	userID   String
    getDecoderList: function(queryKey, userID, callback) {
        var mapObj = new Map();
        mapObj.set("queryKey", queryKey);
        mapObj.set("userID", userID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "";
        dataSDK6._doPost(url, data, callback);
    },
    //获取编码器列表
    //	queryKey String 检索条件（为空默认查询所有）
    getEncoderList: function(queryKey, callback) {
        var mapObj = new Map();
        mapObj.set("queryKey", queryKey);
        var data = dataSDK6._getDataString(mapObj);
        var url = "";
        dataSDK6._doPost(url, data, callback);
    },
    //获取大厅列表
    //	queryKey String 检索条件（为空默认查询所有）
    getHallList: function(queryKey, callback) {
        var mapObj = new Map();
        mapObj.set("queryKey", queryKey);
        var data = dataSDK6._getDataString(mapObj);
        var url = "";
        dataSDK6._doPost(url, data, callback);
    },
    //获取大屏列表
    //	hallID String 大厅ID
    getSceenList: function(hallID, callback) {
        var mapObj = new Map();
        mapObj.set("hallID", hallID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "";
        dataSDK6._doPost(url, data, callback);
    },

    /*策略管理**************************************************************************************/
    //新增字幕策略
    //	strategyName String 策略名称
    //	schemeInfos  List<StrategySchemeInfo>[{schemeID,rangs:{type:1,groupIDs:[{groupID:""""}],members:[{resID:""""}]},applicationType:1,beginTime:"""",endTime:"""",schemeType:0}]
    //	type         0 全网 1--指定分组 2--自定义 applicationType 0 终端 1矩阵 2-终端+矩阵
    //	schemeType   --0 日常 1--任务
    //	isApplay     boolean 是否应用
    // addOsdStragegy : function(strategyName, schemeInfos, type, schemeType, isApplay, callback){  },
    //删除字幕策略
    //	osdStrategyIDs List<String> 策略ID
    delOsdStragegy: function(osdStrategyIDs, callback) {
        var mapObj = new Map();
        mapObj.set("osdStrategyIDs", osdStrategyIDs);
        var data = dataSDK6._getDataString(mapObj);
        var url = "";
        dataSDK6._doPost(url, data, callback);
    },
    //修改策略状态
    //	osdStrategyID String 策略ID
    //	type          状态类型:0--运行 1--停止 2--编辑中 3--待编辑
    updateOsdStragegyState: function(osdStrategyID, type, callback) {
        var mapObj = new Map();
        mapObj.set("osdStrategyID", osdStrategyID);
        mapObj.set("type", type);
        var data = dataSDK6._getDataString(mapObj);
        var url = "";
        dataSDK6._doPost(url, data, callback);
    },
    //编辑字幕策略
    //	osdStrategyID String 策略ID
    //	strategyName  String 策略名称
    //	schemeInfos   List<StrategySchemeInfo> 方案信息
    // updateOsdStragegy : function(osdStrategyID, strategyName, schemeInfos, callback){  },
    //查询字幕策略
    //	userID     String 用户ID
    //	queryKey   String 检索条件
    //	beginIndex int    起始索引
    //	count      int    偏移数量
    getOsdStragegyList: function(userID, queryKey, beginIndex, count, callback) {
        var mapObj = new Map();
        mapObj.set("userID", userID);
        mapObj.set("queryKey", queryKey);
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        var data = dataSDK6._getDataString(mapObj);
        var url = "";
        dataSDK6._doPost(url, data, callback);
    },

    /*账户管理-验证码start**************************************************************************************/
    //创建验证码
    createVerificationCode: function(ipAddress, callback) {
        var mapObj = new Map();
        mapObj.set("ipAddress", ipAddress);
        var data = dataSDK6._getDataString(mapObj, true);
        var url = "/account/createVerificationCode";
        dataSDK6._doGet(url, data, callback);
    },
    /*账户管理-验证码end**************************************************************************************/
    /*账户管理-用户身份start**************************************************************************************/
    //针对Web端创建用户身份令牌
    createUserTokenForWeb: function(userID, password, ipAddress, type, vcode, callback) {
        var mapObj = new Map();
        mapObj.set("userID", userID);
        mapObj.set("password", password);
        mapObj.set("ipAddress", ipAddress);
        mapObj.set("type", type);
        mapObj.set("vcode", vcode);
        var data = dataSDK6._getDataString(mapObj, true);
        var url = "/account/createUserTokenForWeb";
        dataSDK6._doGet(url, data, callback);
    },
    //针对会议终端创建用户身份令牌
    createUserTokenForMeetingTerminal: function(userID, password, sipUser, callback) {
        var mapObj = new Map();
        mapObj.set("userID", userID);
        mapObj.set("password", password);
        mapObj.set("sipUser", sipUser);
        var data = dataSDK6._getDataString(mapObj, true);
        var url = "/account/createUserTokenForMeetingTerminal";
        dataSDK6._doGet(url, data, callback);
    },
    //验证用户身份令牌
    getValidUserToken: function(ipAddress, type, callback) {
        var mapObj = new Map();
        mapObj.set("ipAddress", ipAddress);
        mapObj.set("type", type);
        var data = dataSDK6._getDataString(mapObj, true);
        var url = "/account/getValidUserToken";
        dataSDK6._doGet(url, data, callback);
    },
    //删除用户身份令牌
    removeUserToken: function(callback) {
        var mapObj = new Map();
        var data = dataSDK6._getDataString(mapObj);
        var url = "/account/removeUserToken";
        dataSDK6._doGet(url, data, callback);
    },
    //重置用户身份令牌（续约）
    renewUserToken: function(minutes, callback) {
        var mapObj = new Map();
        mapObj.set("minutes", minutes);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/account/renewUserToken";
        dataSDK6._doGet(url, data, callback);
    },
    //验证用户身份令牌
    getValidUserTokenByKey: function(callback) {
        var mapObj = new Map();
        var data = dataSDK6._getDataString(mapObj);
        var url = "/account/getValidUserTokenByKey";
        dataSDK6._doGet(url, data, callback);
    },
    /*账户管理-用户身份end**************************************************************************************/
    /*账户管理-人脸识别start **************************************************************************************/

    /**
     * 人脸登录
     */
    faceLogin: function(image, callback) {
        var data = image;
        var url = "/recognition/login";
        var configObj = {
            method: "POST",
            url: dataSDK6._URLPrefix + url,
            async: dataSDK6._isAsync,
            data: data,
            contentType: "json/application",
            success: callback,
            //error: dataSDK._errorCB
        };

        Axios.post(configObj.url, data, { headers: { 'content-type': 'json/application' } }).then((res) => {
            console.log("Axios 请求 post 获取到的结果 ：" + JSON.stringify(res))
            callback(res.data);
        });
    },

    /**
     * 人脸采集
     */
    faceRegister: function(image, callback) {
        var url = "/recognition/register?operatorToken=" + dataSDK6._token;
        var data = image;
        var configObj = {
            method: "POST",
            url: dataSDK6._URLPrefix + url,
            async: dataSDK6._isAsync,
            data: data,
            contentType: "json/application",
            success: callback,
            //error: dataSDK._errorCB
        };

        Axios.post(configObj.url, data, { headers: { 'content-type': 'json/application' } }).then((res) => {
            console.log("Axios 请求 post 获取到的结果 ：" + JSON.stringify(res))
            callback(res.data);
        });
    },
    /*账户管理-人脸识别end **************************************************************************************/

    /*显示方案start**************************************************************************************/

    /*
     *  screens:[
          {roleType:0, indexes:"",  pollingInterval: 30 },...]
     */

    //创建显示方案
    addDisplayScheme: function(schemeID, schemeName, schemeType, splitType, screens, callback) {
        var mapObj = new Map();
        var obj = {
            "schemeName": schemeName,
            "schemeType": schemeType,
            "splitType": splitType,
            "screens": screens
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/displayScheme/addDisplayScheme";
        dataSDK6._doPost(url, data, callback);
    },

    /*
     *  screens:[
          {roleType:0, indexes:"",  pollingInterval: 30 },...]
     */

    //编辑显示方案
    editDisplayScheme: function(schemeID, schemeName, schemeType, splitType, screens, callback) {
        var mapObj = new Map();
        var obj = {
            "schemeID": schemeID,
            "schemeName": schemeName,
            "schemeType": schemeType,
            "splitType": splitType,
            "screens": screens
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/displayScheme/editDisplayScheme";
        dataSDK6._doPost(url, data, callback);
    },

    //删除显示方案
    removeDisplayScheme: function(schemeID, callback) {
        var mapObj = new Map();
        mapObj.set("schemeID", schemeID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/displayScheme/removeDisplayScheme";
        dataSDK6._doGet(url, data, callback);
    },

    //按方案ID查询方案明细
    queryDisplaySchemeBySchemeID: function(schemeID, callback) {
        var mapObj = new Map();
        mapObj.set("schemeID", schemeID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/displayScheme/queryDisplaySchemeBySchemeID";
        dataSDK6._doGet(url, data, callback);
    },

    //按创建人查询方案列表
    queryDisplaySchemeList: function(type, callback) {
        var mapObj = new Map();
        mapObj.set("type", type);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/displayScheme/queryDisplaySchemeList";
        dataSDK6._doGet(url, data, callback);
    },
    /*显示方案end**************************************************************************************/

    // ========================================解码器控制 start=========================================================
    /**
     * 添加解码器订阅
     */
    addDecoderSubscription: function(sourceID, sourceScreenIndex, targetID, targetScreenIndex, callback) {
        var mapObj = new Map();
        var obj = {
            "sourceID": sourceID,
            "sourceScreenIndex": sourceScreenIndex,
            "targetID": targetID,
            "targetScreenIndex": targetScreenIndex
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/addDecoderSubscription";
        dataSDK6._doPost(url, data, callback);
    },

    /**
     * 删除解码器订阅
     */
    removeDecoderSubscription: function(subscriptionID, callback) {
        var mapObj = new Map();
        var obj = {
            "subscriptionID": subscriptionID
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/removeDecoderSubscription";
        dataSDK6._doGet(url, data, callback);
    },

    /**
     * 查询全部解码器订阅
     */
    queryAllDecoderSubscription: function(callback) {
        var mapObj = new Map();
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/queryAllDecoderSubscription";
        dataSDK6._doGet(url, data, callback);
    },

    /**
     * 根据ID查询解码器订阅
     */

    querySingleDecoderSubscription: function(subscriptionID, callback) {
        var mapObj = new Map();
        var obj = {
            "subscriptionID": subscriptionID
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/querySingleDecoderSubscription";
        dataSDK6._doGet(url, data, callback);
    },

    /**
     * 根据源查询解码器订阅
     */

    queryDecoderSubscriptionBySource: function(sourceDecoderID, callback) {
        var mapObj = new Map();
        var obj = {
            "sourceDecoderID": sourceDecoderID
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/queryDecoderSubscriptionBySource";
        dataSDK6._doGet(url, data, callback);
    },

    /**
     * 根据目标查询解码器订阅
     */

    queryDecoderSubscriptionByTarget: function(targetDecoderID, callback) {
        var mapObj = new Map();
        mapObj.set("targetDecoderID", targetDecoderID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/queryDecoderSubscriptionByTarget";
        dataSDK6._doGet(url, data, callback);
    },

    /**
     * 编辑解码器订阅
     */

    editDecoderSubscription: function(subscriptionID, sourceID, sourceScreenIndex, targetID, targetScreenIndex, callback) {
        var mapObj = new Map();
        var obj = {
            "subscriptionID": subscriptionID,
            "sourceID": sourceID,
            "sourceScreenIndex": sourceScreenIndex,
            "targetID": targetID,
            "targetScreenIndex": targetScreenIndex
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/editDecoderSubscription";
        dataSDK6._doPost(url, data, callback);
    },

    /**
     * 订阅启停
     */

    setDecoderSubscriptionIsActived: function(subscriptionID, isActived, callback) {
        var mapObj = new Map();
        var obj = {
            "subscriptionID": subscriptionID,
            "isActived": isActived
        }
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/setDecoderSubscriptionIsActived";
        dataSDK6._doGet(url, data, callback);
    },

    /**
     * 添加解码器同步
     */
    addDecoderSynchronization: function(sourceID, targetID, callback) {
        var mapObj = new Map();
        var obj = {
            "sourceID": sourceID,
            "targetID": targetID
        }
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/addDecoderSynchronization";
        dataSDK6._doPost(url, data, callback);
    },

    /**
     * 根据ID查询解码器同步
     */

    querySingleDecoderSynchronization: function(synchronizationID, callback) {
        var mapObj = new Map();
        mapObj.set("synchronizationID", synchronizationID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/querySingleDecoderSynchronization";
        dataSDK6._doGet(url, data, callback);
    },

    /**
     * 同步启停
     */

    setDecoderSynchronizationIsActived: function(synchronizationID, isActived, callback) {
        var mapObj = new Map();
        var obj = {
            "synchronizationID": synchronizationID,
            "isActived": isActived
        }
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/setDecoderSynchronizationIsActived";
        dataSDK6._doGet(url, data, callback);
    },

    /**
     * 编辑解码器同步
     */

    editDecoderSynchronization: function(synchronizationID, sourceID, targetID, callback) {
        var mapObj = new Map();
        var obj = {
            "synchronizationID": synchronizationID,
            "sourceID": sourceID,
            "targetID": targetID
        }
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/editDecoderSynchronization";
        dataSDK6._doPost(url, data, callback);
    },

    /**
     * 根据源查询解码器同步
     */

    queryDecoderSynchronizationBySource: function(sourceDecoderID, callback) {
        var mapObj = new Map();
        mapObj.set("sourceDecoderID", sourceDecoderID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/queryDecoderSynchronizationBySource";
        dataSDK6._doGet(url, data, callback);
    },

    /**
     * 根据目标查询解码器同步
     */

    queryDecoderSynchronizationByTarget: function(targetDecoderID, callback) {
        var mapObj = new Map();
        mapObj.set("targetDecoderID", targetDecoderID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/queryDecoderSynchronizationByTarget";
        dataSDK6._doGet(url, data, callback);
    },

    /**
     * 查询全部解码器同步
     */

    queryAllDecoderSynchronization: function(callback) {
        var mapObj = new Map();
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/queryAllDecoderSynchronization";
        dataSDK6._doGet(url, data, callback);
    },

    /**
     * 删除解码器同步
     */

    removeDecoderSynchronization: function(synchronizationID, callback) {
        var mapObj = new Map();
        mapObj.set("synchronizationID", synchronizationID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/removeDecoderSynchronization";
        dataSDK6._doGet(url, data, callback);
    },
    // ========================================解码器控制 end=========================================================

    //========================================解码器分组 start===================================================

    /**
     * 添加解码器分组
     */
    addDecoderGroup: function(groupName, description, devices, callback) {
        var mapObj = new Map();
        var obj = {
            "groupName": groupName,
            "description": description,
            "devices": devices
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/group/addDecoderGroup";
        dataSDK6._doPost(url, data, callback);
    },

    /**
     * 批量删除解码器分组
     */

    removeAnyDecoderGroups: function(groupIDs, callback) {
        var mapObj = new Map();
        mapObj.set("groupIDs", groupIDs);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/group/removeAnyDecoderGroups";
        dataSDK6._doPost(url, data, callback);
    },

    /**
     * 查询分组列表
     */

    queryDecoderGroupList: function(userID, callback) {
        var mapObj = new Map();
        mapObj.set("userID", userID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/group/queryDecoderGroupList";
        dataSDK6._doGet(url, data, callback);
    },

    /**
     * 根据ID查询解码器分组
     */

    querySingleDecoderGroup: function(groupID, callback) {
        var mapObj = new Map();
        mapObj.set("groupID", groupID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/group/querySingleDecoderGroup";
        dataSDK6._doGet(url, data, callback);
    },

    /**
     * 编辑解码器分组
     */

    editDecoderGroup: function(groupID, groupName, description, devices, callback) {
        var mapObj = new Map();
        var obj = {
            "groupID": groupID,
            "groupName": groupName,
            "description": description,
            "devices": devices
        }
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/group/editDecoderGroup";
        dataSDK6._doPost(url, data, callback);
    },

    /**
     * 查询会议明细（进行中）
     */

    getSingleConferenceDetail: function(sceneID, callback) {
        var mapObj = new Map();
        mapObj.set("sceneID", sceneID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/conference/getSingleConferenceDetail";
        dataSDK6._doGet(url, data, callback);
    },

    /**
     * 查询会议列表（历史）
     */
    queryHistoryConference: function(conferenceName, beginTime, endTime, beginIndex, count, confMode, callback) {
        var mapObj = new Map();
        mapObj.set("conferenceName", conferenceName);
        mapObj.set("beginTime", beginTime);
        mapObj.set("endTime", endTime);
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        mapObj.set("confMode", confMode);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/conference/queryHistoryConference";
        dataSDK6._doGet(url, data, callback);
    },

    /**
     * 查询会议详情（历史）
     */
    getSingleHistoryConferenceDetail: function(conferenceID, callback) {
        var mapObj = new Map();
        mapObj.set("conferenceID", conferenceID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/conference/getSingleHistoryConferenceDetail";
        dataSDK6._doGet(url, data, callback);
    },

    /**
     * 查询会议列表（进行中）
     */
    queryAllConferenceListItems: function(callback) {
        var mapObj = new Map();
        var data = dataSDK6._getDataString(mapObj);
        var url = "/conference/queryAllConferenceListItems";
        dataSDK6._doGet(url, data, callback);
    },

    //========================================解码器分组 end===================================================

    /**
     * 根据SIPID查询设备信息
     */
    querySingleDeviceBySipId: function(sipID, callback) {
        var mapObj = new Map();
        mapObj.set("sipID", sipID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/querySingleDeviceBySipId";
        dataSDK6._doGet(url, data, callback);
    },

    //========================================GIS地图 start===================================================

    /**
     * 查询一条目录GIS信息
     */
    querySingleDirectoryGIS: function(directoryID, callback) {
        var mapObj = new Map();
        mapObj.set("directoryID", directoryID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/querySingleDirectoryGIS";
        dataSDK6._doGet(url, data, callback);
    },

    /**
     * 查询所有目录GIS信息
     */
    queryDirectoryGISList: function(callback) {
        var mapObj = new Map();
        var data = dataSDK6._getDataString(mapObj);
        var url = "/deploy/queryDirectoryGISList";
        dataSDK6._doGet(url, data, callback);
    },

    //========================================GIS地图 end=====================================================
    //========================================告警业务 start===================================================
    queryHistoryAlarmMessage(startTime, endTime, alarmEvents, alarmLevels, filters, beginIndex, count, callback) {
        var mapObj = new Map();
        mapObj.set("startTime", startTime);
        mapObj.set("endTime", endTime);
        mapObj.set("alarmEvents", alarmEvents);
        mapObj.set("alarmLevels", alarmLevels);
        mapObj.set("filters", filters);
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/intelligentsercurity/queryHistoryAlarmMessage";
        dataSDK6._doPost(url, data, callback);
    },
    //获取部门有未读告警状态设备
    queryResourceReaded(departmentID, callback) {
        var mapObj = new Map();
        mapObj.set("departmentID", departmentID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/intelligentsercurity/queryResourceReaded";
        dataSDK6._doGet(url, data, callback);
    },

    //========================================告警业务 end===================================================


    //========================================视频指挥协议 start===================================================
    //查询协同列表
    queryCooperate(sceneId, callback) {
        var mapObj = new Map();
        mapObj.set("sceneId", sceneId);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/Command/queryCooperate";
        dataSDK6._doGet(url, data, callback);
    },
    queryCoordinate(sceneId, callback) {
        var mapObj = new Map();
        mapObj.set("sceneID", sceneId);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/command/getCoordinateList";
        dataSDK6._doGet(url, data, callback);
    },

    //========================================录播 start===================================================
    // 查询录播计划列表
    queryRecordPlanListItems(userID, beginIndex, count, callback) {
        var mapObj = new Map();
        mapObj.set("userID", userID);
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/record/queryRecordPlanListItems";
        dataSDK6._doGet(url, data, callback);
    },
    // 查询单个录播计划
    querySingleRecordPlan(planID, callback) {
        var mapObj = new Map();
        mapObj.set("planID", planID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/record/querySingleRecordPlan";
        dataSDK6._doGet(url, data, callback);
    },
    // 检索录像信息
    queryRecordResultItems(userID, resourceID, resourceType, beginDate, endDate, callback) {
        var mapObj = new Map();
        mapObj.set("userID", userID);
        mapObj.set("resourceID", resourceID);
        mapObj.set("resourceType", resourceType);
        mapObj.set("beginDate", beginDate);
        mapObj.set("endDate", endDate);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/record/queryRecordResultItems";
        dataSDK6._doGet(url, data, callback);
    },
    // 新增录播计划
    addRecordPlan(creatorID, planID, planName, isEnable, createDate, beginDate, endDate, isAllDay, interval, resourcelist, itemlist, callback) {
        var mapObj = new Map();
        var obj = {
            creatorID: creatorID,
            planID: planID,
            planName: planName,
            isEnable: isEnable,
            createDate: createDate,
            beginDate: beginDate,
            endDate: endDate,
            isAllDay: isAllDay,
            interval: interval,
            resourcelist: resourcelist,
            itemlist: itemlist
        }
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/record/addRecordPlan";
        dataSDK6._doPost(url, data, callback);
    },
    // 编辑录播计划
    editRecordPlan(creatorID, planID, planName, isEnable, createDate, beginDate, endDate, isAllDay, interval, resourcelist, itemlist, callback) {
        var mapObj = new Map();
        var obj = {
            creatorID: creatorID,
            planID: planID,
            planName: planName,
            isEnable: isEnable,
            createDate: createDate,
            beginDate: beginDate,
            endDate: endDate,
            isAllDay: isAllDay,
            interval: interval,
            resourcelist: resourcelist,
            itemlist: itemlist
        }
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/record/editRecordPlan";
        dataSDK6._doPost(url, data, callback);
    },
    // 删除录播计划
    removeRecordPlan(planID, callback) {
        var mapObj = new Map();
        mapObj.set("planID", planID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/record/removeRecordPlan";
        dataSDK6._doGet(url, data, callback);
    },
    // 开启录播计划
    startRecordPlan(planID, callback) {
        var mapObj = new Map();
        mapObj.set("planID", planID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/record/startRecordPlan";
        dataSDK6._doGet(url, data, callback);
    },
    // 停止录播计划
    stopRecordPlan(planID, callback) {
        var mapObj = new Map();
        mapObj.set("planID", planID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/record/stopRecordPlan";
        dataSDK6._doGet(url, data, callback);
    },
    //========================================录播 end  ===================================================
    //========================================文件 start===================================================
    // 查询文件频道列表信息
    queryFileChannels(userID, beginIndex, count, callback) {
        var mapObj = new Map();
        mapObj.set("userID", userID);
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/file/queryFileChannels";
        dataSDK6._doGet(url, data, callback);
    },
    // 查询单个文件频道信息
    querySingleFileChannel(channelID, callback) {
        var mapObj = new Map();
        mapObj.set("channelID", channelID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/file/querySingleFileChannel";
        dataSDK6._doGet(url, data, callback);
    },
    // 新增文件频道
    addFileChannel(channelID, channelName, isSharing, creatorID, createDate, callback) {
        var mapObj = new Map();
        var obj = {
            "channelID": channelID,
            "channelName": channelName,
            "isSharing": isSharing,
            "creatorID": creatorID,
            "createDate": createDate
        }
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/file/addFileChannel";
        dataSDK6._doPost(url, data, callback);
    },
    // 编辑文件频道
    editFileChannel(channelID, channelName, isSharing, creatorID, createDate, callback) {
        var mapObj = new Map();
       var obj = {
            "channelID": channelID,
            "channelName": channelName,
            "isSharing": isSharing,
            "creatorID": creatorID,
            "createDate": createDate
        }
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/file/editFileChannel";
        dataSDK6._doPost(url, data, callback);
    },
    // 删除文件频道
    removeChannel(channelID, callback) {
        var mapObj = new Map();
        mapObj.set("channelID", channelID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/file/removeChannel";
        dataSDK6._doGet(url, data, callback);
    },
    // 保存文件频道条目
    uploadToFileChannel(channelID, list, callback) {
        var mapObj = new Map();
        var obj = {
            "channelID": channelID,
            "list": list
        }
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/file/uploadToFileChannel";
        dataSDK6._doPost(url, data, callback);
    },
    // 删除文件频道条目
    removeToFileChannel(itemID, callback) {
        var mapObj = new Map();
        mapObj.set("itemID", itemID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/file/removeToFileChannel";
        dataSDK6._doGet(url, data, callback);
    },

    // 下载录像文件
    downloadRecordFile(resource_id, beg_time, end_time, attach_name, callback){
        var mapObj = new Map();
        mapObj.set("resource_id", resource_id);
        mapObj.set("beg_time", beg_time);
        mapObj.set("end_time", end_time);
        mapObj.set("attach_name", attach_name);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/recorddown/slicefile";
        dataSDK6._doPost(url, data, callback);
    },
    // 录像检索swagger
    recordquery(id, startTime, endtime, uploadUrl, callback) {
        Axios.get(`${uploadUrl}/openvone/recordvod-play-system/api/v1/recordquery/index?resource_id=${id}&beg_time=${startTime}&end_time=${endtime}`).then(res => {
            callback(res.data);
        })
    },
	// 文件上传
    uploadFile: function(file, callback) {
        var data = new FormData();
        data.append('file', file);
        var url = "/fileupload/form";
        dataSDK6._doPostFile(url, data, callback);
    }, 
    //文件播放地址   
    getFileStatus(id,callback){
        var mapObj = new Map();
        mapObj.set("media_id", id);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/mediaplay/getUrlAddr";
        dataSDK6._doGet(url, data, callback);
    },
    //========================================文件 end  ===================================================
    //========================================视频会议 start  ===================================================
    // ID加入会议（ID验证）
    checkingConferenceId(sceneID, callback) {
        var mapObj = new Map();
        mapObj.set("sceneID", sceneID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/conference/checkingConferenceId";
        dataSDK6._doGet(url, data, callback);
    },
    // ID加入会议（密码验证)
    checkingConferencePassword(sceneID, password, callback) {
        var mapObj = new Map();
        mapObj.set("sceneID", sceneID);
        mapObj.set("password", password);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/conference/checkingConferencePassword";
        dataSDK6._doGet(url, data, callback);
    },
    // 我的预约会议
    getArrangeConferenceList(beginIndex, count, creatorID, callback) {
        var mapObj = new Map();
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        mapObj.set("creatorID", creatorID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/conference/getArrangeConferenceList";
        dataSDK6._doGet(url, data, callback);
    },
    // 取消预约会议
    cancelArrangeConference(sceneID, callback) {
        var mapObj = new Map();
        mapObj.set("sceneID", sceneID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/conference/cancelArrangeConference";
        dataSDK6._doGet(url, data, callback);
    },
    // 我的预约会议详情
    getArrangeConferenceDetail(sceneID, callback) {
        var mapObj = new Map();
        mapObj.set("sceneID", sceneID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/conference/getSingleArrangeConferenceDetail";
        dataSDK6._doGet(url, data, callback);
    },
    //========================================视频会议 end  ===================================================
	    // 设置用户习惯 - nvr
    setNvrUserCustom(userID, callItem, encoderItem, decoderItem, meetingItem, channelItem, callback) {
        var mapObj = new Map();
        var obj = {
            "userID": userID,
            "callItem": callItem,
            "encoderItem": encoderItem,
            "decoderItem": decoderItem,
            "meetingItem": meetingItem, //1
            "channelItem": channelItem
        };
        mapObj.set("obj", JSON.stringify(obj));
        var data = dataSDK6._getDataString(mapObj);
        var url = "/userCustom/setNvrUserCustom";
        dataSDK6._doPost(url, data, callback);
    },
    // 读取用户习惯 - nvr
    setNvrUserCustom(callback) {
        var mapObj = new Map();
        var data = dataSDK6._getDataString(mapObj);
        var url = "/userCustom/getNvrUserCustom";
        dataSDK6._doGet(url, data, callback);
    },
    // 11.26 同步云调度 1124 bug修改------------------
    // 设置用户状态
    setUserStatus(userID, resourceStatus, encoderSIPID, callback) {
        var mapObj = new Map();
        mapObj.set("userID", userID);
        // mapObj.set("tokenKey", dataSDK6._token);
        mapObj.set("status", resourceStatus);
        mapObj.set("serviceKey", '');
        mapObj.set("encoderSIPID", encoderSIPID);
        var data = dataSDK6._getDataString(mapObj);
        var url = "/SyncControl/setUserStatus";
        dataSDK6._doPost(url, data, callback);
    },
};