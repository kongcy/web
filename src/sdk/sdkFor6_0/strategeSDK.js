import Axios from 'axios'

export var strategeSDK6 = {
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
            strategeSDK6._URLPrefix = prefix;
        }
    },
    //设置token
    setToken: function(token) {
        if (token != null && typeof(token) != "undefined") {
            strategeSDK6._token = token;
        }
    },
    //设置调用发生异常时回调方法
    setErrorCallback: function(callback) {
        if (callback != null && typeof(callback) != "undefined") {
            strategeSDK6._errorCB = callback;
        }
    },
    //设置是否异步消息
    setIsAsync: function(isAsync) {
        if (isAsync != null && typeof(isAsync) != "undefined") {
            strategeSDK6._isAsync = isAsync;
        }
    },
    //设置返回数据类型
    setDataType: function(dataType) {
        if (dataType != null && typeof(dataType) != "undefined") {
            strategeSDK6._dataType = dataType;
        }
    },
    _doGet: function(url, data, callback) {
        var configObj = {
            method: "GET",
            url: strategeSDK6._URLPrefix + url,
            async: strategeSDK6._isAsync,
            data: data,
            dataType: strategeSDK6._dataType,
            success: callback,
            error: strategeSDK6._errorCB
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
            url: strategeSDK6._URLPrefix + url,
            async: strategeSDK6._isAsync,
            data: data,
            dataType: strategeSDK6._dataType,
            success: callback,
            error: strategeSDK6._errorCB
        };
        // $.ajax(configObj);
        Axios.post(configObj.url, data, { headers: { 'content-type': 'application/json; charset=UTF-8' } }).then((res) => {
            //console.log("Axios 请求 post 获取到的结果 ：" + res.config.url)
            //console.log(res.data)
            if (callback) callback(res.data);
        });
    },
    _getDataString: function(mapObj, noToken) {
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

    // 视频巡查 新加SDK   11.24   增删改查
    // =================================   查询列表 =============================================
    queryStrategyList: function(userId,strategyType, callback) {
        let data = {
            "userId":userId,
            "strategyType":strategyType
        };
        var url = "/patrolStrategy/queryList";
        strategeSDK6._doPost(url,JSON.stringify(data) , callback);
    },
    // =================================   根据id查询详情  =============================================
    queryStrategyListById: function(strategyId, callback) {
        var data = {
            "strategyId":strategyId
        }
        var url = "/patrolStrategy/queryById";
        strategeSDK6._doPost(url,JSON.stringify(data), callback);
    },
    // =================================   新增、另存为 =============================================
    addPatrolStrategy: function(userId,strategyName, strategyType, patrolInterval, userType, windowLayout, patrolScreen, groupDeviceDtoList,callback) {
        var obj = {
            "userId":userId,
            "strategyName": strategyName,
            "strategyType": strategyType,
            "patrolInterval": patrolInterval,
            "type": userType,
            "windowLayout": windowLayout,
            "patrolScreen": patrolScreen,
            "groupDeviceDtoList": groupDeviceDtoList,
        };
        var url = "/patrolStrategy/add";
        strategeSDK6._doPost(url, JSON.stringify(obj), callback);
    },
    // =================================   修改 =============================================
    updatePatrolStrategy: function(userId,strategyId,strategyName, strategyType, patrolInterval, userType, windowLayout, patrolScreen, departmentDeviceDtoList,callback) {
        var obj = {
            "userId":userId,
            "strategyId": strategyId,
            "strategyName": strategyName,
            "strategyType": strategyType,
            "patrolInterval": patrolInterval,
            "type": userType,
            "windowLayout": windowLayout,
            "patrolScreen": patrolScreen,
            "groupDeviceDtoList": departmentDeviceDtoList,
        };
        var url = "/patrolStrategy/update";
        strategeSDK6._doPost(url,JSON.stringify(obj), callback);
    },
    // =================================   根据id 删除  =============================================
    deleteStrategyById: function(strategyId, callback) {
        var data = {
            "strategyId" :strategyId
        }
        var url = "/patrolStrategy/delete";
        strategeSDK6._doPost(url, JSON.stringify(data) , callback);
    },

    // ====================== 查询设备资源树节点数量 ========================================
    queryResCount: function(data, callback) {
        var url = "/res/queryResCount";
        strategeSDK6._doPost(url, data , callback);
    },

    // 通过ip获取 点播的相关参数
    getDeviceDataCallBack(ip, callback){
        // var mapObj = new Map();
        // mapObj.set("deviceIp", ip);
        // var data = dataSDK6._getDataString(mapObj);
        let data = { deviceIp: ip };
        var url = "/directory/findDeviceInfoByIp";
        strategeSDK6._doPost(url, JSON.stringify(data), callback);
    },
    // ======================  免插登录 新加SDK   1214 ==========================================================
    // =================================   接口 免插登入、登出  =============================================    
       //设置免插登录URL前缀 
    setNoPluginURLPrefix: function(prefix) {
        if (prefix != null && typeof(prefix) != "undefined") {
            strategeSDK6._noPluginURLPrefix = prefix; // 'http://172.16.7.149:8999/user'
        }
    },
    _plugindoGet: function(url, data, callback) {
        var configObj = {
            method: "GET",
            url: strategeSDK6._noPluginURLPrefix  + url,
            async: strategeSDK6._isAsync,
            data: data,
            dataType: strategeSDK6._dataType,
            success: callback,
            error: strategeSDK6._errorCB
        };
        Axios.get(configObj.url + '?' + data).then((res) => {
            if (callback) callback(res.data);
        });
    },
    // =================================   免插登录  =============================================
    noPluginLogin: function(account, callback) {
        var mapObj = new Map();
        mapObj.set('account', account);
        var data = strategeSDK6._getDataString(mapObj);
        var url = "/noPluginLogin";
        strategeSDK6._plugindoGet(url,data, callback);
    },
    // =================================   免插退出  =============================================
    noPluginLoginOut: function(account, callback) {
        var mapObj = new Map();
        mapObj.set('account', account);
        var data = strategeSDK6._getDataString(mapObj);
        var url = "/noPluginLoginOut";
        strategeSDK6._plugindoGet(url,data, callback);
    },

    // ====================== 查询设备常用节点 ========================================
    getCommonUseList(userId,num,callback){
        var data = {
            "userId":userId,
            "moreNum": num
        };
        var url = "/res/queryPopularRes"
        strategeSDK6._doPost(url, JSON.stringify(data),callback);
    },
    // ====================== 添加设备常用节点 ========================================
    AddCommonUse(userId,nodes,callback){
        var data = {
            "userId":userId,
            "param": nodes
        };
        var url = "/res/addPopularRes"
        strategeSDK6._doPost(url, JSON.stringify(data),callback);
    },
    
    // ======================  会议 模板 列表 新加SDK   1209   增删改查 ==========================================================

    // =================================   查询会议 模板 列表  =============================================
    getConferenceTemplateList(creatorId,startTime,endTime,templateName,pageIndex,pageSize,callback){
        var obj = {
            "creatorId":creatorId,
            "startTime": startTime,
            "endTime": endTime,
            "templateName": templateName,
            "pageIndex": pageIndex,
            "pageSize": pageSize,
        };
        var url = "/conferenceTemplate/queryList";
        strategeSDK6._doPost(url,JSON.stringify(obj), callback);
    },
    // =================================   添加 会议 模板  =============================================
    addConferenceTemplate(creatorId,creatorName,templateName,attendance,describe,isPreMain,isDefaultLock,isNeedPwd,isAutoMute,isDefaultRecord,password,userDtoList,callback){
        var obj = {
            "templateName":templateName,
            "attendance": attendance,
            "describe": describe,
            "isPreMain": isPreMain,
            "isDefaultLock": isDefaultLock,
            "isNeedPwd": isNeedPwd,
            "isAutoMute": isAutoMute,
            "isDefaultRecord": isDefaultRecord,
            "creatorId": creatorId,
            "creatorName": creatorName,
            "password": password,
            "userDtoList": userDtoList,
        };
        var url = "/conferenceTemplate/add";
        strategeSDK6._doPost(url,JSON.stringify(obj), callback);
    },
    // =================================   编辑 会议 模板  =============================================
    updateConferenceTemplate(creatorId,creatorName,templateId,templateName,attendance,describe,isPreMain,isDefaultLock,isNeedPwd,isAutoMute,isDefaultRecord,password,userDtoList,callback){
        var obj = {
            "templateId":templateId,
            "templateName":templateName,
            "attendance": attendance,
            "describe": describe,
            "isPreMain": isPreMain,
            "isDefaultLock": isDefaultLock,
            "isNeedPwd": isNeedPwd,
            "isAutoMute": isAutoMute,
            "isDefaultRecord": isDefaultRecord,
            "creatorId": creatorId,
            "creatorName": creatorName,
            "password": password,
            "userDtoList": userDtoList,
        };
        var url = "/conferenceTemplate/update";
        strategeSDK6._doPost(url,JSON.stringify(obj), callback);
    },
    // =================================   删除 会议 模板  =============================================
    deleteConferenceTemplate(templateId,callback){
        var obj = {
            "templateId":templateId,
        };
        var url = "/conferenceTemplate/delete";
        strategeSDK6._doPost(url,JSON.stringify(obj), callback);
    },

    // ======================  我的会议 新加SDK   1210   ==========================================================

    // ===============   我的会议 列表 =============================================
    getMyConferenceList(pageIndex,pageSize,conferenceName,conferenceType,callback){
        var obj = {
            "pageIndex": pageIndex,
            "pageSize": pageSize,
            "conferenceName":conferenceName,
            "conferenceType": conferenceType,
        };
        var url = "/ucfgHistoryConference/queryList";
        strategeSDK6._doPost(url,JSON.stringify(obj), callback);
    },
    
        // =================================   视频诊断 新加SDK   1216  =============================================
    getDiagnoseList: function(data, callback) {
            var url = "/diag/diag_share";
            strategeSDK6._doPost(url,JSON.stringify(data), callback);
     },
     
    newOpenMeeting(data, callback){
        var mapObj = new Map();
        mapObj.set("resourceSipId", data.resId);
        mapObj.set("joinMember", data.joinMember);
        var data = strategeSDK6._getDataString(mapObj);
        var url = "/xiaoyu/startMeeting";
        strategeSDK6._doGet(url, data, callback);
    },

    // 统一登录
    userLogin(data, callback){
        var obj = {
             "ydm": data.ydm,
        //     "yhid": "tycjpt.tlm",
             "yhid": data.userName,
        //    "yhkl": "202004@tycjpt",
             "yhkl": data.passWord,
            // "yhkl":'whxtxk@201906',
        //    "yhdllx": "C/S",
            "yhdllx": "B/S",
            "ip": data.ip,
            "computer": "B/S",
        //     "ywxtbm": "TLMYTYSXRHPT",
            "ywxtbm": 'DMTJHPT',
        //     "ywxtmc": "&#x6CB9;&#x7530;&#x591A;&#x5A92;&#x4F53;&#x8F6F;&#x4EF6;&#x534F;&#x540C;&#x4EA4;&#x4E92;&#x5E73;&#x53F0;"
            "ywxtmc": '塔里木油田音视讯融合平台',
        //    "ywxtmc": '油田多媒体软件协同交互平台'
        }
        var url = "/third/userLogin?mode=1";
        strategeSDK6._doPost(url,JSON.stringify(obj), callback);
    }
}; 