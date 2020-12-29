import Axios from 'axios'

export var xiaoyuSDK = {
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
            xiaoyuSDK._URLPrefix = prefix;
        }
    },
    //设置token
    setToken: function(token) {
        if (token != null && typeof(token) != "undefined") {
            xiaoyuSDK._token = token;
        }
    },
    //设置调用发生异常时回调方法
    setErrorCallback: function(callback) {
        if (callback != null && typeof(callback) != "undefined") {
            xiaoyuSDK._errorCB = callback;
        }
    },
    //设置是否异步消息
    setIsAsync: function(isAsync) {
        if (isAsync != null && typeof(isAsync) != "undefined") {
            xiaoyuSDK._isAsync = isAsync;
        }
    },
    //设置返回数据类型
    setDataType: function(dataType) {
        if (dataType != null && typeof(dataType) != "undefined") {
            xiaoyuSDK._dataType = dataType;
        }
    },
    _doGet: function(url, data, callback) {
        var configObj = {
            method: "GET",
            url: xiaoyuSDK._URLPrefix + url,
            async: xiaoyuSDK._isAsync,
            data: data,
            dataType: xiaoyuSDK._dataType,
            success: callback,
            error: xiaoyuSDK._errorCB
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
            url: xiaoyuSDK._URLPrefix + url,
            async: xiaoyuSDK._isAsync,
            data: data,
            dataType: xiaoyuSDK._dataType,
            success: callback,
            error: xiaoyuSDK._errorCB
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
    // newOpenMeeting(meetingNo,xiaoYuNums) {
    //     var url = `/${meetingNo}/${xiaoYuNums}`;
    //     xiaoyuSDK._doPost(url, {}, callback);
    // },
    newOpenMeeting(data, callback){
        var mapObj = new Map();
        mapObj.set("resourceSipId", data.encoderSipID);
        // mapObj.set("resId", data.resId);
        mapObj.set("joinMember", data.joinMember);
        mapObj.set("channelNum", data.channel);
        var data = xiaoyuSDK._getDataString(mapObj);
        var url = "/xiaoyu/startMeeting";
        xiaoyuSDK._doGet(url, data, callback);
    },
}