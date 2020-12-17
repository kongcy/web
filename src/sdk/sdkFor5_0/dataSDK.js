import Axios from 'axios'

// Axios.defaults.withCredentials=true;
export const dataSDK5 = {
    /*基础接口**************************************************************************************/
    _URLPrefix: "",
    _errorCB: function(msg) {},
    _isAsync: true,
    _dataType: "json",
    //设置URL前缀
    setURLPrefix: function(prefix) {
        if (prefix != null && typeof(prefix) != "undefined") {
            dataSDK5._URLPrefix = prefix;
        }
    },
    //设置调用发生异常时回调方法
    setErrorCallback: function(callback) {
        if (callback != null && typeof(callback) != "undefined") {
            dataSDK5._errorCB = callback;
        }
    },
    //设置是否异步消息
    setIsAsync: function(isAsync) {
        if (isAsync != null && typeof(isAsync) != "undefined") {
            dataSDK5._isAsync = isAsync;
        }
    },
    //设置返回数据类型
    setDataType: function(dataType) {
        if (dataType != null && typeof(dataType) != "undefined") {
            dataSDK5._dataType = dataType;
        }
    },
    _doGet: function(url, data, callback) {
        var configObj = {
            method: "GET",
            url: dataSDK5._URLPrefix + url,
            data: data,
            dataType: dataSDK5._dataType,
            success: callback,
            error: dataSDK5._errorCB
        };

        // $.ajax(configObj);
        Axios.get(configObj.url + '?' + data, {
            withCredentials: true
        }).then((res) => {
            console.log("Axios 请求 get 获取到的结果 ：---------------")
            console.log(res)
            callback(res.data);
        });
    },
    _doPost: function(url, data, callback) {
        console.log(dataSDK5._URLPrefix)
        var configObj = {
            method: "POST",
            url: dataSDK5._URLPrefix + url,
            async: dataSDK5._isAsync,
            data: data,
            dataType: dataSDK5._dataType,
            success: callback,
            error: dataSDK5._errorCB
        };

        // $.ajax(configObj);
        Axios.post(configObj.url, data, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8; multipart/form-data'
            },
            withCredentials: true
        }).then((res) => {
            console.log("Axios 请求 post 获取到的结果 ：----------------")
            console.log(res)
            callback(res.data);
        });
    },
    _loginDoPost: function(url, data, callback) {
        var configObj = {
            method: "POST",
            url: dataSDK5._URLPrefix + url,
            async: dataSDK5._isAsync,
            data: data,
            dataType: dataSDK5._dataType,
            rossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: callback,
            error: dataSDK5._errorCB
        };
        //$.ajax(configObj);
        Axios.post(configObj.url).then(callback);
    },
    _getDataString: function(mapObj) {
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

    /** 业务开始 ------------------------------------------------------------------------------ */

    /** 1-登录（1.2）------------------------------------------------------------------------------ */

    /**
     * 登录
     */
    login: function(username, password, imagecode, callback) {
        var mapObj = new Map();
        mapObj.set("userName", username);
        mapObj.set("password", password);
        mapObj.set("imageCode", imagecode);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/Authority/login";
        dataSDK5._doPost(url, data, callback);
    },

    refrshToken: function(token, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/Authority/refrshToken";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 抢占登录
     */
    forcelogin: function(token, replace, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("replace", replace);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/Authority/forcelogin";
        dataSDK5._doPost(url, data, callback);


    },

    /**
     * 切换登录
     */
    changelogin: function(token, userName, password, imagecode, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("userName", userName);
        mapObj.set("password", password);
        mapObj.set("imageCode", imagecode);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/Authority/changelogin";
        dataSDK5._doPost(url, data, callback);

    },

    /**
     * 验证token
     */
    vaildToken: function(token, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/Authority/vaildToken";
        dataSDK5._doPost(url, data, callback);
    },

    /** 2-预留问题（1.2）------------------------------------------------------------------------------ */

    /**
     * 启用预留问题/关闭预留问题
     *
     * enable:0-不启用 1-启用
     */
    setQuestionEnable: function(token, enable, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("enable", enable);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/question/setQuestionEnable";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 增加预留问题
     */
    addQuestion: function(token, questionDes, answer, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("questionDes", questionDes);
        mapObj.set("answer", answer);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/question/addQuestion";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 删除预留问题
     */
    removeQuestion: function(token, questionId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("questionId", questionId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/question/removeQuestion";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 修改预留问题
     */
    updateQuestion: function(token, questionId, questionDes, answer, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("questionId", questionId);
        mapObj.set("questionDes", questionDes);
        mapObj.set("answer", answer);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/question/updateQuestion";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 获取预留问题
     */
    getQuestion: function(token, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/question/getQuestion";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 验证预留问题答案
     */
    vaildQuestion: function(token, questionId, answer, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("questionId", questionId);
        mapObj.set("answer", answer);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/question/vaildQuestion";
        dataSDK5._doGet(url, data, callback);
    },

    /** 3-编码器绑定（1.2）------------------------------------------------------------------------------ */

    /**
     * 获取绑定编码器
     */
    getBindDevice: function(token, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/device/getBindDevice";
        dataSDK5._doGet(url, data, callback)
    },

    /**
     * 获取编码器
     */
    getDevices: function(token, name, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("name", name);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/device/getDevices";
        dataSDK5._doGet(url, data, callback)
    },

    /**
     * 绑定编码器
     */
    setBindDevice: function(token, deviceId, deviceCh, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("deviceId", deviceId);
        mapObj.set("deviceCh", deviceCh);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/device/setBindDevice";
        dataSDK5._doPost(url, data, callback)
    },

    /**
     * 验证终端是否已注册
     */
    IsRegister: function(token, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        //mapObj.set("deviceId",deviceId);
        //mapObj.set("deviceCh",deviceCh);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/device/IsRegister";
        dataSDK5._doPost(url, data, callback)
    },

    /** 4-资源获取(1.2)------------------------------------------------------------------------------ */

    /**
     * 获取资源名称
     */
    getResourceName: function(token, resourceId, resourceCh, resourceType, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resourceId", resourceId);
        mapObj.set("resourceCh", resourceCh);
        mapObj.set("resourceType", resourceType);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/device/getResourceName";
        dataSDK5._doGet(url, data, callback)
    },

    /** 5-人员树（1.2修改）------------------------------------------------------------------------------ */

    /**
     * 获取组织结构树（包括主界面和子界面）
     */
    getOrganizationUser: function(userId, token, id, subjectId, sceneId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("UserId", userId);
        mapObj.set("Id", id);
        mapObj.set("subjectId", subjectId);
        mapObj.set("sceneId", sceneId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/resManager/getUserDepartment";
        dataSDK5._doPost(url, data, callback);
    },

    /** 6-设备树（1.2修改）------------------------------------------------------------------------------ */

    /**
     * 获取设备资源树
     */
    getOrganizationDevice: function(userId, token, Id, subjectId, sceneId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("UserId", userId);
        mapObj.set("Id", Id);
        mapObj.set("subjectId", subjectId);
        mapObj.set("sceneId", sceneId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/resManager/getDeviceDepartment";
        dataSDK5._doPost(url, data, callback);
    },

    /** 常用资源（1.2修改）------------------------------------------------------------------------------ */

    //无

    /** 7-图像点播（1.1&1.3）------------------------------------------------------------------------------ */

    //无

    /** 8-权限验证（1.2）------------------------------------------------------------------------------ */

    getRight: function(token, resId, resCh, rightId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", userId);
        mapObj.set("resCh", resCh);
        mapObj.set("rightId", rightId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/Authority/getRight";
        dataSDK5._doPost(url, data, callback);
    },

    getRight2: function(token, resId, resCh, rightId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", userId);
        mapObj.set("resCh", resCh);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/Authority/getRight2";
        dataSDK5._doPost(url, data, callback);
    },

    /** 9-云台业务（1.2）------------------------------------------------------------------------------ */
    /**
     * 是否有云台权限
     */
    validYTRight: function(token, resId, resCh, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/ytControl/validYTRight";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 方向
     */
    directionControl: function(token, resId, resCh, direction, speed, isStart, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("direction", direction);
        mapObj.set("speed", speed);
        mapObj.set("isStart", isStart);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/ytControl/directionControl";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 变焦
     */
    zoomControl: function(token, resId, resCh, zoom, speed, isStart, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("zoom", zoom);
        mapObj.set("speed", speed);
        mapObj.set("isStart", isStart);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/ytControl/zoomControl";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 聚焦
     */
    focusControl: function(token, resId, resCh, focus, speed, isStart, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("focus", focus);
        mapObj.set("speed", speed);
        mapObj.set("isStart", isStart);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/ytControl/focusControl";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 光圈
     */
    apertureControl: function(token, resId, resCh, aperture, speed, isStart, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("aperture", aperture);
        mapObj.set("speed", speed);
        mapObj.set("isStart", isStart);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/ytControl/apertureControl";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 雨刷
     */
    wiperControl: function(token, resId, resCh, value, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("value", value);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/ytControl/wiperControl";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 加热
     */
    heatControl: function(token, resId, resCh, value, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("value", value);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/ytControl/heatControl";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 夜视
     */
    nightControl: function(token, resId, resCh, value, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("value", value);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/ytControl/nightControl";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 3D 控制 方法前面是数字导致编译器包红
     */

    _3DControl: function(token, resId, resCh, value, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("value", value);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/ytControl/3DControl";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 查询云台功能
     */
    getYTOperate: function(token, resId, resCh, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/ytControl/getYTOperate";
        dataSDK5._doGet(url, data, callback);
    },

    /** 10-预置点（1.2）------------------------------------------------------------------------------ */

    /**
     * 添加预置点
     */
    addPrepoint: function(token, resId, resCh, prepointName, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("prepointName", prepointName);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/addPrepoint";
        dataSDK5._doPost(url, data, callback)
    },

    /**
     * 删除预置点
     */
    deletePrepoint: function(token, resId, resCh, prepointIndex, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("prepointIndex", prepointIndex);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/deletePrepoint";
        dataSDK5._doPost(url, data, callback)
    },

    /**
     * 修改预置点
     */
    updatePrepoint: function(token, resId, resCh, prepointList, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("prepointList", prepointList);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/updatePrepoint";
        dataSDK5._doPost(url, data, callback)
    },

    /**
     * 查询所有预置点
     */
    queryPrepoint: function(token, resId, resCh, page, offset, limit, callback) {
        // queryPrepoint:function (token, resId, resCh, page, offset, limit,callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/queryPrepoint";
        dataSDK5._doGet(url, data, callback)
    },

    /**
     * 查询所有不在组预置点
     */
    queryPrepoint2: function(token, resId, resCh, page, offset, limit, callback) {
        // queryPrepoint2:function (token, resId, resCh, page, offset, limit,callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/queryPrepoint2";
        dataSDK5._doGet(url, data, callback)
    },

    /**
     * 设置默认预置点
     */
    setDefaultPrepoint: function(token, resId, resCh, prepointIndex, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("prepointIndex", prepointIndex);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/setDefaultPrepoint";
        dataSDK5._doPost(url, data, callback)
    },

    /**
     * 取消默认预置点
     */
    cancelDefaultPrepoint: function(token, resId, resCh, prepointIndex, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("prepointIndex", prepointIndex);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/cancelDefaultPrepoint";
        dataSDK5._doPost(url, data, callback)
    },

    /**
     * 添加预置点分组
     *
     * 为避免函数名重复，函数名与url最后路径不一致
     */
    addYzdGroup: function(token, resId, resCh, groupName, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("groupName", groupName);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/addGroup";
        dataSDK5._doPost(url, data, callback)
    },

    /**
     * 删除预置点分组
     *
     * 为避免函数名重复，函数名与url最后路径不一致
     */
    deleteYzdGroup: function(token, resId, resCh, groupID, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("groupID", groupID);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/deleteGroup";
        dataSDK5._doPost(url, data, callback)
    },

    /**
     * 修改预置点分组
     *
     * 为避免函数名重复，函数名与url最后路径不一致
     */
    updateYzdGroup: function(token, resId, resCh, groupList, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("groupList", groupList);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/updateGroup";
        dataSDK5._doPost(url, data, callback)
    },

    /**
     * 查询预置点分组(只获取分组)
     *
     * 为避免函数名重复，函数名与url最后路径不一致
     */
    queryYzdGroup: function(token, resId, resCh, page, offset, limit, callback) {
        // queryGroup:function (token,resId,resCh,page,offset,limit,callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/queryGroup";
        dataSDK5._doGet(url, data, callback)
    },

    /**
     * 查询预置点分组(分组中带预置点)
     *
     * 为避免函数名重复，函数名与url最后路径不一致
     */
    queryYzdGroup2: function(token, resId, resCh, page, offset, limit, callback) {
        // queryGroup2:function (token,resId,resCh,page,offset,limit,callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/queryGroup2";
        dataSDK5._doGet(url, data, callback)
    },

    /**
     * 向分组添加预置点(新增预置点)
     */
    addPrepoint2Group: function(token, resId, resCh, groupID, prepointName, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("groupID", groupID);
        mapObj.set("prepointName", prepointName);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/addPrepoint2Group";
        dataSDK5._doPost(url, data, callback)
    },

    /**
     * 向分组添加预置点(移动预置点到分组)
     */
    addPrepoint2Group2: function(token, resId, resCh, groupID, prepoint, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("groupID", groupID);
        mapObj.set("prepoint", prepoint);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/addPrepoint2Group2";
        dataSDK5._doPost(url, data, callback)
    },

    /**
     * 向分组删除预置点
     */
    removePrepoint2Group: function(token, resId, resCh, groupID, prepoint, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("groupID", groupID);
        mapObj.set("prepoint", prepoint);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/removePrepoint2Group";
        dataSDK5._doPost(url, data, callback)
    },

    /**
     * 向分组删除所有预置点
     */
    removePrepoint2Group2: function(token, resId, resCh, groupID, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("groupID", groupID);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/removePrepoint2Group2";
        dataSDK5._doPost(url, data, callback)
    },

    /**
     * 查询分组信息
     */
    queryPrepoint2Group: function(token, resId, resCh, groupID, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("groupID", groupID);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/queryPrepoint2Group";
        dataSDK5._doGet(url, data, callback)
    },

    /**
     * 添加预置点巡航方案
     */
    addSchemeForPrePoint: function(token, resId, resCh, SchemeName, looptime, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("SchemeName", SchemeName);
        mapObj.set("looptime", looptime);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/addScheme";
        dataSDK5._doGet(url, data, callback)
    },

    /**
     * 删除预置点巡航方案
     */
    deleteSchemeForPrePoint: function(token, resId, resCh, SchemeID, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("SchemeID", SchemeID);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/deleteScheme";
        dataSDK5._doGet(url, data, callback)
    },

    /**
     * 修改预置点巡航方案
     */
    updateSchemeForPrePoint: function(token, resId, resCh, SchemeList, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("SchemeList", SchemeList);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/updateScheme";
        dataSDK5._doGet(url, data, callback)
    },

    /**
     * 查询预置点巡航方案
     */
    querySchemeForPrePoint: function(token, resId, resCh, page, offset, limit, callback) {
        // queryScheme:function (token, resId, resCh, page, offset, limit,callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/queryScheme";
        dataSDK5._doGet(url, data, callback)
    },

    /**
     * 向巡航方案添加预置点
     */
    addPrepoint2Scheme: function(token, resId, resCh, SchemeID, prepoint, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("SchemeID", SchemeID);
        mapObj.set("prepoint", prepoint);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/addPrepoint2Scheme";
        dataSDK5._doPost(url, data, callback)
    },

    /**
     * 向巡航方案删除预置点
     */
    removePrepoint2Scheme: function(token, resId, resCh, SchemeID, prepoint, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("SchemeID", SchemeID);
        mapObj.set("prepoint", prepoint);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/removePrepoint2Scheme";
        dataSDK5._doPost(url, data, callback)
    },

    /**
     * 向巡航方案删除所有预置点
     */
    removePrepoint2Scheme2: function(token, resId, resCh, SchemeID, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("SchemeID", SchemeID);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/removePrepoint2Scheme2";
        dataSDK5._doPost(url, data, callback)
    },

    /**
     * 查询巡航方案信息
     */
    queryPrepoint2Scheme: function(token, resId, resCh, SchemeID, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resId", resId);
        mapObj.set("resCh", resCh);
        mapObj.set("SchemeID", SchemeID);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/PTZControl/queryPrepoint2Scheme";
        dataSDK5._doGet(url, data, callback)
    },

    /** 11-录时录像（1.2）------------------------------------------------------------------------------ */

    /**
     * 获取存储服务器
     */
    getStoreServer: function(token, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/recordPlan/getStoreServer";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 创建录像方案
     *
     * schemeName: 方案名称
     * opened: 方案是否启动
     * allday: 是否全天候
     */
    addRecordScheme: function(token, schemeName, opened, allday, begintime, endtime, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeName", schemeName);
        mapObj.set("opend", opened);
        mapObj.set("allday", allday);
        mapObj.set("begintime", begintime);
        mapObj.set("endtime", endtime);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/recordPlan/addRecordScheme";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 修改录像方案（全天候，周循环录制时段由创建计划时绑定）
     *
     * schemeId: 方案ID
     * schemeName: 方案名称
     * opend: 方案是否启动
     * allday: 是否全天候
     * begintime: 方案开始时间
     * endtime: 方案结束时间
     */
    updateRecordScheme: function(token, schemeId, schemeName, opend, allday, begintime, endtime, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeId", schemeId);
        mapObj.set("schemeName", schemeName);
        mapObj.set("opend", opend);
        mapObj.set("allday", allday);
        mapObj.set("begintime", begintime);
        mapObj.set("endtime", endtime);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/recordPlan/updateRecordScheme";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 删除录像方案
     *
     * schemeId: 方案ID
     */
    deleteRecordScheme: function(token, schemeId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeId", schemeId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/recordPlan/deleteRecordScheme";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 查询录像方案，同步返回数组（只查询用户自己创建的方案）
     */
    queryRecordScheme: function(token, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/recordPlan/queryRecordScheme";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 创建录像计划
     *
     * planName: 计划名称
     * timeZone: 间隔时段 例：timezone=8，最小时间范围是2h（15min*8）
     * schemeId: 方案ID
     */
    addRecordPlan: function(token, schemeId, planName, timeZone, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeId", schemeId);
        mapObj.set("planName", planName);
        mapObj.set("timeZone", timeZone);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/recordPlan/addRecordPlan";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 修改录像计划
     *
     * planId: 计划ID
     * planName: 计划名称
     * timezone: 间隔时段
     * schemeId: 方案ID
     */
    updateRecordPlan: function(token, schemeId, planId, planName, timeZone, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeId", schemeId);
        mapObj.set("planId", planId);
        mapObj.set("planName", planName);
        mapObj.set("timeZone", timeZone);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/recordPlan/updateRecordPlan";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 删除录像计划
     * planId: 计划ID
     * schemeId: 方案ID
     */
    deleteRecordPlan: function(token, schemeId, planId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeId", schemeId);
        mapObj.set("planId", planId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/recordPlan/deleteRecordPlan";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 检索录像计划
     * schemeId: 方案ID
     */
    queryRecordPlan: function(token, schemeId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeId", schemeId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/recordPlan/queryRecordPlan";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 录像计划添加设备
     *
     *schemeId: 方案ID
     * planId: 计划ID
     * resources: 资源对象数组
     */
    addRecordResource: function(token, schemeId, planId, resources, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeId", schemeId);
        mapObj.set("planId", planId);
        mapObj.set("resources", resources);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/recordPlan/addRecordResource";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 检索录像计划设备
     *
     * planId: 计划ID
     * schemeId: 方案ID
     */
    queryRecordResource: function(token, schemeId, planId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeId", schemeId);
        mapObj.set("planId", planId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/recordPlan/queryRecordResource";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 录像计划时间设置
     *
     * timeStructs: 录像时段数组（7个元素，一周）
     * planId: 计划ID
     * schemeId: 方案ID
     */
    addRecordTime: function(token, schemeId, planId, times, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeId", schemeId);
        mapObj.set("planId", planId);
        mapObj.set("times", times);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/recordPlan/addRecordTime";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 检索录像计划时间
     *
     * planId: 计划ID
     * schemeId: 方案ID
     */
    queryRecordTime: function(token, planId, schemeId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("planId", planId);
        mapObj.set("schemeId", schemeId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/recordPlan/queryRecordTime";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 开启计划录像
     *
     * schemeId: 方案ID
     */
    startRecordScheme: function(token, schemeId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeId", schemeId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/recordPlan/startRecordScheme";
        dataSDK5._doPost(url, data, callback);

    },

    /**
     * 停止计划录像
     *
     * schemeId: 方案ID
     */
    stopRecordScheme: function(token, schemeId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeId", schemeId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/recordPlan/stopRecordScheme";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 录像检索
     */
    queryRecord: function(token, resourceId, resourceCh, resourceType, begintime, endtime, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resourceId", resourceId);
        mapObj.set("resourceCh", resourceCh);
        mapObj.set("resourceType", resourceType);
        mapObj.set("begintime", begintime);
        mapObj.set("endtime", endtime);
        mapObj.set("page", 1);
        mapObj.set("offsize", 1);
        mapObj.set("limit", 25000);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/recordQuery/queryRecord";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 删除录像
     */
    deleteRecord: function(token, resourceId, resourceCh, resourceType, records, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resourceId", resourceId);
        mapObj.set("resourceCh", resourceCh);
        mapObj.set("resourceType", resourceType);
        mapObj.set("records", records);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/recordQuery/deleteRecord";
        dataSDK5._doPost(url, data, callback);
    },

    /** 12-解码器控制（1.3）------------------------------------------------------------------------------ */

    /**
     * 获取本中心解码器
     */
    getMatrix: function(token, type, page, offset, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("type", type);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/getMatrix";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 获取终端绑定大厅解码器
     */
    getMatrix2: function(token, page, offset, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/getMatrix2";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 添加解码器分组
     */
    addMatrixGroup: function(token, groupName, row, col, matrixs, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupName", groupName);
        mapObj.set("row", row);
        mapObj.set("col", col);
        mapObj.set("matrixs", matrixs);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/addGroup";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 删除矩阵分组
     *
     * groupId: 解码器分组ID
     */
    deleteMaxtrixGroup: function(token, groupId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupID", groupId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/deleteGroup";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 修改矩阵分组
     *
     */
    updateMaxtrixGroup: function(token, groupID, groupName, row, col, matrixs, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupID", groupID);
        mapObj.set("groupName", groupName);
        mapObj.set("row", row);
        mapObj.set("col", col);
        mapObj.set("matrixs", matrixs);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/updateGroup";
        dataSDK5._doPost(url, data, callback);
    },


    /**
     * 修改矩阵分组
     *
     */
    updateMaxtrixGroup2: function(token, groupID, groupName, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupID", groupID);
        mapObj.set("groupName", groupName);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/updateGroup2";
        dataSDK5._doPost(url, data, callback);
    },



    /**
     * 查询矩阵分组
     */
    queryMatrixGroup: function(token, page, offset, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/queryGroup";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 查询矩阵分组ById
     */
    queryMatrixGroup2: function(token, groupID, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupID", groupID);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/queryGroup2";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 创建矩阵轮循（方案）
     *
     * schemeName: 轮循方案名称
     * loopTime: 轮循间隔
     * splitNum: 分屏类型
     * screens: 轮循分屏 1个分屏代表单路轮循 多个分屏代表多路轮循，用，分割
     * devices: 设备数组
     */
    addMatrixLoop: function(token, groupName, loopTime, splitNum, screens, devices, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupName", groupName);
        mapObj.set("loopTime", loopTime);
        mapObj.set("splitNum", splitNum);
        mapObj.set("screens", screens);
        mapObj.set("devices", devices);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/addMatrixLoop";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 修改矩阵轮循（方案）
     *
     * groupId: 轮循方案ID
     * groupName: 轮循方案名称
     * * loopType: 矩阵轮循类型 1--单路轮循，2--分组轮循
     * loopTime: 轮循间隔
     * splitNum: 分屏类型
     * screens: 轮循分屏 1个分屏代表单路轮循 多个分屏代表多路轮循，用，分割
     * devices: 设备数组
     */
    updateMatrixLoop: function(token, groupId, groupName, loopTime, splitNum, screens, devices, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        mapObj.set("groupName", groupName);
        mapObj.set("loopTime", loopTime);
        mapObj.set("splitNum", splitNum);
        mapObj.set("screens", screens);
        mapObj.set("devices", devices);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/updateMatrixLoop";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 删除矩阵轮循（方案）
     */
    deleteMatrixLoop: function(token, groupId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/deleteMatrixLoop";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 查询矩阵轮循（方案）列表
     */
    queryMatrixLoop: function(token, page, offset, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/queryMatrixLoop";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 创建矩阵订阅关系
     *
     */
    addMatrixSubscribe: function(token, sourceId, sourcePos, destId, destPos, isUse, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("sourceId", sourceId);
        mapObj.set("sourcePos", sourcePos);
        mapObj.set("destId", destId);
        mapObj.set("destPos", destPos);
        mapObj.set("isUse", isUse);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/addMatrixSubscribe";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 删除矩阵订阅关系
     *
     * subscribeId: 已订阅矩阵的ID
     */
    deleteMatrixSubscribe: function(token, subscribeId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("subscribeId", subscribeId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/deleteMatrixSubscribe";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 修改矩阵订阅关系
     *
     * subscribeId: 已订阅矩阵的ID
     */
    updateMatrixSubscribe: function(token, subscribeId, sourceId,
        sourcePos, destId, destPos, isUse, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("subscribeId", subscribeId);
        mapObj.set("sourceId", sourceId);
        mapObj.set("sourcePos", sourcePos);
        mapObj.set("destId", destId);
        mapObj.set("destPos", destPos);
        mapObj.set("isUse", isUse);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/updateMatrixSubscribe";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 查询矩阵订阅关系
     */
    queryMatrixSubscribe: function(token, type, page, offset, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("type", type);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/queryMatrixSubscribe";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 创建矩阵同步关系
     *
     * sourceId: 源ID
     * destId: 目标ID
     * isUse: 是否使用
     */
    addMatrixSync: function(token, sourceId, destId, isUse, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("sourceId", sourceId);
        mapObj.set("destId", destId);
        mapObj.set("isUse", isUse);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/addMatrixSync";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 删除矩阵同步关系
     *
     * syncId: 已同步矩阵的ID
     */
    deleteMatrixSync: function(token, syncId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("syncId", syncId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/deleteMatrixSync";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 修改矩阵同步关系
     *
     * syncId: 已同步矩阵的ID
     * sourceId: 目标解码器ID
     * destId: 被订阅解码器ID
     */
    updateMatrixSync: function(token, syncId, sourceId, destId, isUse, callback) {

        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("syncId", syncId);
        mapObj.set("sourceId", sourceId);
        mapObj.set("destId", destId);
        mapObj.set("isUse", isUse);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/updateMatrixSync";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 查询矩阵订阅关系
     */
    queryMatrixSync: function(token, type, page, offset, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("type", type);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/queryMatrixSync";
        dataSDK5._doGet(url, data, callback);
    },

    /** 13-大屏控制（1.3）------------------------------------------------------------------------------ */

    /**
     * 获取用户绑定的大厅
     */
    getHall: function(token, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/Hall/getHall";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 获取本中心下的大厅
     */
    getHall2: function(token, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/Hall/getHall2";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 获取用户绑定的大厅下的大屏列表
     */
    getBigScreen: function(token, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/Hall/getBigScreen";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 获取大厅下的大屏
     *
     * hallId: 大厅ID
     */
    getBigScreen2: function(token, hallId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("hallId", hallId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/Hall/getBigScreen2";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 获取指定分屏模式屏
     *
     * screenId: 大屏ID
     */
    getBigScreenMode: function(token, screenId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("screenId", screenId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/Hall/getBigScreenMode";
        dataSDK5._doGet(url, data, callback);
    },

    /** 14-模拟矩阵控制（1.3）------------------------------------------------------------------------------ */

    /**
     * 获取本中心模拟矩阵
     */
    getAnlogMatrix: function(token, page, offset, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/AnalogMatrix/getMatrix";
        dataSDK5._doGet(url, data, callback);
    },
    /**
     * 创建输出通道分组
     *
     * matrixId: 矩阵ID
     * groupName: 通道组名称
     * output: 输出源数组
     */
    addMatrixOutGroup: function(token, matrixId, groupName, output, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("matrixId", matrixId);
        mapObj.set("groupName", groupName);
        mapObj.set("output", output);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/AnalogMatrix/addMatrixOutGroup";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 删除输出通道分组
     *
     * matrixId: 矩阵ID
     * groupId: 通道组ID
     */
    deleteMatrixOutGroup: function(token, matrixId, groupId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("matrixId", matrixId);
        mapObj.set("groupId", groupId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/AnalogMatrix/deleteMatrixOutGroup";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 修改矩阵通道组
     *
     * matrixId: 矩阵ID
     * groupId: 通道组ID
     * groupName: 通道组名称
     * output: 输出源数组
     */
    updateMatrixOutGroup: function(token, matrixId, groupId, groupName, output, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("matrixId", matrixId);
        mapObj.set("groupId", groupId);
        mapObj.set("groupName", groupName);
        mapObj.set("output", output);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/AnalogMatrix/updateMatrixOutGroup";
        dataSDK5._doPost(url, data, callback);
    },
    /** 15-分组管理（1.3&1.4）------------------------------------------------------------------------------ */

    /**
     * 创建点播分组
     *
     * groupName: 分组名称
     * schemeId: schemeId为空 则只为分组点播 不为空则为轮循点播
     * description: 描述
     * fixdResources:同一个资源不允许既是固定资源又是轮循资源
     * loopResources:
     */
    addDBImageGroup: function(token, groupName, schemeId, description,
        fixdResources, loopResources, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupName", groupName);
        mapObj.set("schemeId", schemeId);
        mapObj.set("description", description);
        mapObj.set("fixdResources", fixdResources);
        mapObj.set("loopResources", loopResources);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/addDBImageGroup";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 删除点播分组
     *
     * groupId: 分组ID
     */
    deleteDBImageGroup: function(token, groupId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/deleteDBImageGroup";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 修改点播分组
     *
     * groupId: 分组ID
     */
    updateDBImageGroup: function(token, groupId, groupName, schemeId, description,
        fixdResources, loopResources, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        mapObj.set("groupName", groupName);
        mapObj.set("schemeId", schemeId);
        mapObj.set("description", description);
        mapObj.set("fixdResources", fixdResources);
        mapObj.set("loopResources", loopResources);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/updateDBImageGroup";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 获取正在点播的资源列表
     * @param {*} token
     * @param {*} callback  {"Ret":0,"Msg":"Success",token:"",Data":[{resId:"",resCh:"",resName:"",resType:"",pos:"",mediaType:"",bitstream:""}]}
     */
    queryDBImage: function(token, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/DBImage/queryDBImage";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 查询点播分组
     */
    queryDBImageGroup: function(token, page, offset, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/queryDBImageGroup";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 查询点播分组信息
     *
     * groupId: 分组ID
     */
    queryDBImageGroupInfo: function(token, groupId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/queryDBImageGroupInfo";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 创建呼叫分组
     *
     * groupName: 分组名称
     * description:
     */
    addCallGroup: function(token, groupName, description, users, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupName", groupName);
        mapObj.set("description", description);
        mapObj.set("users", users);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/addCallGroup";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 删除呼叫分组
     *
     * groupId: 分组ID
     */
    deleteCallGroup: function(token, groupId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/deleteCallGroup";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 修改呼叫分组
     *
     * groupId: 分组ID
     * groupName: 分组名称
     * description: 描述
     */
    updateCallGroup: function(token, groupId, groupName, description, users, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        mapObj.set("groupName", groupName);
        mapObj.set("description", description);
        mapObj.set("users", users);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/updateCallGroup";
        dataSDK5._doPost(url, data, callback);
    },
    /**
     * 查询所有分组
     */
    queryAllGroup: function(token, page, offset, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/queryAllGroup";
        dataSDK5._doGet(url, data, callback);
    },
    /**
     * 查询呼叫分组
     */
    queryCallGroup: function(token, page, offset, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/queryCallGroup";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 查询呼叫分组信息
     *
     * groupId: 分组ID
     */
    queryCallGroupInfo: function(token, groupId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/queryCallGroupInfo";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 创建会议分组
     *
     * groupName: 分组名称
     * description: 描述
     * chairmanId: 主席ID
     * users: 成员数组
     * devices: 设备数组
     */
    addMeetingGroup: function(token, groupName, schemeId, description, chairmanId, users, devices, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupName", groupName);
        mapObj.set("schemeId", schemeId);
        mapObj.set("description", description);
        mapObj.set("chairmanId", chairmanId);
        mapObj.set("users", users);
        mapObj.set("devices", devices);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/addMeetingGroup";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 删除会议分组
     *
     * groupId: 分组ID
     */
    deleteMeetingGroup: function(token, groupId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/deleteMeetingGroup";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 修改会议分组
     *
     * groupId: 分组ID
     * groupName: 分组名称
     * description: 描述
     * chairmanId: 主席ID
     * users: 成员数组
     * devices: 设备数组
     */
    updateMeetingGroup: function(token, groupId, schemeId, groupName, description, chairmanId, users, devices, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        mapObj.set("schemeId", schemeId);
        mapObj.set("groupName", groupName);
        mapObj.set("description", description);
        mapObj.set("chairmanId", chairmanId);
        mapObj.set("users", users);
        mapObj.set("devices", devices);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/updateMeetingGroup";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 查询会议分组
     */
    queryMeetingGroup: function(token, page, offset, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/queryMeetingGroup";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 查询会议分组信息
     *
     * groupId: 分组ID
     */
    queryMeetingGroupInfo: function(token, groupId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/queryMeetingGroupInfo";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 创建视频指挥分组
     *
     * groupName: 分组名称
     * description: 描述
     * schemeId: 方案ID
     * users: 成员数组 users=[{userId:"",parentId:""},{userId:"",parentId:""}]
     * devices: 设备数组 devices=[{deviceId:"",deviceCh:0}]
     */
    addCommandGroup: function(token, groupName, description, schemeId, users, devices, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupName", groupName);
        mapObj.set("description", description);
        mapObj.set("schemeId", schemeId);
        mapObj.set("users", users);
        mapObj.set("devices", devices);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/addCommandGroup";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 删除视频指挥分组
     *
     * groupId: 分组id
     */
    deleteCommandGroup: function(token, groupId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/deleteCommandGroup";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 编辑视频指挥分组
     *
     * groupId: 分组id
     * groupName: 分组名称
     * description: 描述
     * schemeId: 方案ID
     * users: 成员数组 users=[{userId:"",parentId:""},{userId:"",parentId:""}]
     * devices: 设备数组 devices=[{deviceId:"",deviceCh:0}]
     */
    updateCommandGroup: function(token, groupId, groupName, description, schemeId, users, devices, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        mapObj.set("groupName", groupName);
        mapObj.set("description", description);
        mapObj.set("schemeId", schemeId);
        mapObj.set("users", users);
        mapObj.set("devices", devices);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/updateCommandGroup";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 根据id查询视频指挥分组的详细信息
     *
     * groupId: 分组id
     */
    queryCommandGroupInfo: function(token, groupId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/queryCommandGroupInfo";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 查询指挥分组
     *
     * groupId: 分组id
     */
    queryCommandGroup: function(token, page, offset, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/queryCommandGroup";
        dataSDK5._doPost(url, data, callback);
    },

    /** 16-显示方案（1.3）------------------------------------------------------------------------------ */

    /**
     * 创建显示方案
     *
     * schemeName: 方案名称
     * schemeType: 方案类型
     * splitType: 分屏类型
     * screens: 屏组
     */
    addDisplayScheme: function(token, schemeName, schemeType, splitType, screens, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeName", schemeName);
        mapObj.set("schemeType", schemeType);
        mapObj.set("splitType", splitType);
        mapObj.set("screens", screens);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/DisplayScheme/addScheme";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 删除显示方案
     *
     * schemeId: 方案ID
     */
    deleteDisplayScheme: function(token, schemeId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeId", schemeId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/DisplayScheme/deleteScheme";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 修改显示方案
     *
     * schemeId: 方案ID
     * schemeName: 方案名称
     * schemeType: 方案类型
     * splitType: 分屏类型
     * screens: 屏组设置
     */
    updateDisplayScheme: function(token, schemeId, schemeName, schemeType, splitType, screens, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeId", schemeId);
        mapObj.set("schemeName", schemeName);
        mapObj.set("schemeType", schemeType);
        mapObj.set("splitType", splitType);
        mapObj.set("screens", screens);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/DisplayScheme/updateScheme";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 查询所有显示方案
     */
    queryDisplayScheme: function(token, page, offset, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/DisplayScheme/queryScheme";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 查询指定类型显示方案
     *
     * schemeType: 方案类型
     */
    queryDisplayScheme2: function(token, schemeType, page, offset, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeType", schemeType);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/DisplayScheme/queryScheme2";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 查询显示方案信息
     *
     * schemeId: 方案ID
     */
    queryScheme3: function(token, schemeId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeId", schemeId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/DisplayScheme/queryScheme3";
        dataSDK5._doGet(url, data, callback);
    },

    /** 17-视频呼叫（1.3）------------------------------------------------------------------------------ */

    /**
     * 设置呼叫习惯
     */
    setCallBehavior: function(token, autoAccept, ring, outputScreen,
        screen, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("autoAccept", autoAccept);
        mapObj.set("ring", ring);
        mapObj.set("outputScreen", outputScreen);
        mapObj.set("screen", screen);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/call/setCallBehavior";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 获取呼叫习惯
     */
    queryCallBehavior: function(token, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/call/queryCallBehavior";
        dataSDK5._doGet(url, data, callback);
    },

    /** 18-视频会议（1.4）------------------------------------------------------------------------------ */

    //无

    /** 19-视频指挥（1.4）------------------------------------------------------------------------------ */

    //无

    /** OLD INTERFACES (静态数据Tab)------------------------------------------------------------------- */

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
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
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
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //设置已读 未读
    //	msgID String 消息ID
    setReadState: function(msgID, callback) {
        var mapObj = new Map();
        mapObj.set("msgID", msgID);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    /*OSD方案管理**************************************************************************************/
    //新增方案
    //	schemeName  String          方案名称
    //	styleID     String          样式ID
    //	personList  List<String>    人员列表
    //	userID      String          用户ID
    //	description String          描述
    //	deviceList  List<DeviceInfo>设备列表
    //	addOsdSchemeByWeb : function(schemeName, styleID, personList, userID, description, deviceList, callback){  },
    //应用方案
    //	userID   String 用户ID
    //	schemeID String 方案ID
    //	type     int    操作类型 0--应用 1--停止
    applyOsdSchemeByWeb: function(userID, schemeID, type, callback) {
        var mapObj = new Map();
        mapObj.set("userID", userID);
        mapObj.set("schemeID", schemeID);
        mapObj.set("type", type);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //删除方案
    //	schemeID String 删除方案
    delOsdSchemeByWeb: function(schemeID, callback) {
        var mapObj = new Map();
        mapObj.set("schemeID", schemeID);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //修改方案
    //	schemeName  String           方案名称
    //	styleID     String           样式ID
    //	personList  List<String>     人员列表
    //	deviceList  List<DeviceInfo> 设备列表
    //	description String           描述
    //	schemeID    String           方案ID
    updateOsdSchemeByWeb: function(schemeName, styleID, personList, deviceList, description, schemeID, callback) {
        var mapObj = new Map();
        mapObj.set("schemeName", schemeName);
        mapObj.set("styleID", styleID);
        mapObj.set("personList", personList);
        mapObj.set("deviceList", deviceList);
        mapObj.set("description", description);
        mapObj.set("schemeID", schemeID);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //查询方案
    //	userID     String 用户ID
    //	queryKey   String 检索条件
    //	beginIndex int    起始索引
    //	count      int    偏移数量
    getOsdSchemeListByWeb: function(userID, queryKey, beginIndex, count, callback) {
        var mapObj = new Map();
        mapObj.set("userID", userID);
        mapObj.set("queryKey", queryKey);
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    /*方案管理**************************************************************************************/
    //新增方案
    // token=""&schemeName=""&schemeType=1&splitType=4&screens=[{screenType:2,index:"1",enable:0},{screenType:3,index:"2,3,4,5"，looptime:20,enable:1}]
    addScheme: function(token, schemeName, schemeType, splitType, screens, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeName", schemeName);
        mapObj.set("schemeType", schemeType);
        mapObj.set("splitType", splitType);
        mapObj.set("screens", screens);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/DisplayScheme/addScheme";
        dataSDK5._doPost(url, data, callback);
    },
    //编辑方案
    //	schemeName      String 方案名称
    //	splitScreenType int    分屏类型
    //	details	        List<SchemeDetailInfo>方案详情[screenType screenIndex:List<int>,interval]
    //	screeType       --0--固定屏 1--轮循屏 2--本地屏"
    //	schemeType      int    方案类型（0-通用方案 1-视频会议）
    //	schemeID        String 方案ID
    updateScheme: function(token, schemeId, schemeName, schemeType, splitType, screens, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeId", schemeId);
        mapObj.set("schemeName", schemeName);
        mapObj.set("schemeType", schemeType);
        mapObj.set("splitType", splitType);
        mapObj.set("screens", screens);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/DisplayScheme/updateScheme";
        dataSDK5._doPost(url, data, callback);
    },
    //删除所有方案
    //	userID String 用户ID
    delAllScheme: function(userID, callback) {
        var mapObj = new Map();
        mapObj.set("userID", userID);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //删除方案
    deleteScheme: function(token, schemeId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeId", schemeId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/DisplayScheme/deleteScheme";
        dataSDK5._doPost(url, data, callback);
    },
    // 查询所有显示方案
    queryScheme: function(token, page, offset, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/DisplayScheme/queryScheme";
        dataSDK5._doPost(url, data, callback);
    },
    //查询方案详情
    //	schemeID String 方案ID
    getSchemeBySchemeID: function(schemeID, callback) {
        var mapObj = new Map();
        mapObj.set("schemeID", schemeID);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/DisplayScheme/queryScheme2";
        dataSDK5._doPost(url, data, callback);
    },

    queryScheme2: function(token, schemeType, page, offset, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("schemeType", schemeType);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/DisplayScheme/queryScheme2";
        dataSDK5._doPost(url, data, callback);
    },

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
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //删除已发字幕
    //	id String 字幕ID
    delOsdByID: function(id, callback) {
        var mapObj = new Map();
        mapObj.set("id", id);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //新增OSD方案
    //	osdSchemeName String       分组名称
    //	osdStyleID    String       OSD样式
    //	description   String       描述
    //	personList    List<String> 人员列表[resID]
    //	deviceList    List<DeviceInfo> 设备列表[resID,resCH]
    addOsdSchemeByID: function(osdSchemeName, osdStyleID, description, personList, deviceList, callback) {
        var mapObj = new Map();
        mapObj.set("osdSchemeName", osdSchemeName);
        mapObj.set("osdStyleID", osdStyleID);
        mapObj.set("description", description);
        mapObj.set("personList", personList);
        mapObj.set("deviceList", deviceList);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //修改OSD方案
    //	osdSchemeID   String 方案ID
    //	osdSchemeName String 分组名称
    //	osdStyleID    String OSD样式
    //	description   String 描述
    //	personList    List<String>     人员列表[resID]
    //	deviceList    List<DeviceInfo> 设备列表[resID,resCH]
    updateOsdSchemeByID: function(osdSchemeID, osdSchemeName, osdStyleID, description, personList, deviceList, callback) {
        var mapObj = new Map();
        mapObj.set("osdSchemeID", osdSchemeID);
        mapObj.set("osdSchemeName", osdSchemeName);
        mapObj.set("osdStyleID", osdStyleID);
        mapObj.set("description", description);
        mapObj.set("personList", personList);
        mapObj.set("deviceList", deviceList);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },

    // /*分组管理**************************************************************************************/
    // //新增分组
    // //	groupName   String 分组名称
    // //	description String 描述
    // //	userID      String 用户ID
    // //	personList  List<GroupPersonInfo> 人员列表[index personID,personName,parentID,IsByStander]
    // //	devList     List<GroupDeviceInfo> 设备列表[index,deviceID,deviceName]
    // addGroup: function (groupName, description, userID, personList, devList, callback) {
    //   var mapObj = new Map();
    //   mapObj.set("groupName", groupName);
    //   mapObj.set("description", description);
    //   mapObj.set("userID", userID);
    //   mapObj.set("personList", personList);
    //   mapObj.set("devList", devList);
    //   var data = dataSDK5._getDataString(mapObj);
    //   var url = "";
    //   dataSDK5._doPost(url, data, callback);
    // },
    // //编辑分组(类型)
    // //	groupName   String 分组名称
    // //	description String 描述
    // //	userID      String 用户ID
    // //	personList  List<GroupPersonInfo>人员列表[index personID,personName,parentID]
    // //	devList     List<GroupDeviceInfo>设备列表[index,deviceID,deviceName]
    // //	groupID     分组ID
    // updateGroup: function (groupName, description, userID, personList, devList, groupID, callback) {
    //   var mapObj = new Map();
    //   mapObj.set("groupName", groupName);
    //   mapObj.set("description", description);
    //   mapObj.set("userID", userID);
    //   mapObj.set("personList", personList);
    //   mapObj.set("devList", devList);
    //   mapObj.set("groupID", groupID);
    //   var data = dataSDK5._getDataString(mapObj);
    //   var url = "";
    //   dataSDK5._doPost(url, data, callback);
    // },
    // //删除分组
    // //	groupID String 分组ID
    // delGroup: function (groupID, callback) {
    //   var mapObj = new Map();
    //   mapObj.set("groupID", groupID);
    //   var data = dataSDK5._getDataString(mapObj);
    //   var url = "";
    //   dataSDK5._doPost(url, data, callback);
    // },
    // //查询分组列表
    // //	userID     String 用户ID
    // //	beginIndex int    起始索引
    // //	count      int    偏移数量
    // getGroupListByUserID: function (userID, beginIndex, count, callback) {
    //   var mapObj = new Map();
    //   mapObj.set("userID", userID);
    //   mapObj.set("beginIndex", beginIndex);
    //   mapObj.set("count", count);
    //   var data = dataSDK5._getDataString(mapObj);
    //   var url = "";
    //   dataSDK5._doPost(url, data, callback);
    // },
    // //查询分组详情
    // //	groupID String 分组ID
    // getGroupByGroupID: function (groupID, callback) {
    //   var mapObj = new Map();
    //   mapObj.set("groupID", groupID);
    //   var data = dataSDK5._getDataString(mapObj);
    //   var url = "";
    //   dataSDK5._doPost(url, data, callback);
    // },

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
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
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
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
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
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    /*终端配置**************************************************************************************/
    //获取解码器列表
    //	queryKey String 检索条件（为空默认查询所有）
    //	userID   String
    getDecoderList: function(queryKey, userID, callback) {
        var mapObj = new Map();
        mapObj.set("queryKey", queryKey);
        mapObj.set("userID", userID);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //获取编码器列表
    //	queryKey String 检索条件（为空默认查询所有）
    getEncoderList: function(queryKey, callback) {
        var mapObj = new Map();
        mapObj.set("queryKey", queryKey);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //获取大厅列表
    //	queryKey String 检索条件（为空默认查询所有）
    getHallList: function(queryKey, callback) {
        var mapObj = new Map();
        mapObj.set("queryKey", queryKey);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //获取大屏列表
    //	hallID String 大厅ID
    getSceenList: function(hallID, callback) {
        var mapObj = new Map();
        mapObj.set("hallID", hallID);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //获取终端配置
    //	userID String 用户ID
    getTerminalCustom: function(userID, callback) {
        var mapObj = new Map();
        mapObj.set("userID", userID);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //设置终端配置
    //	userID       String 用户ID
    //	configJson   String 配置信息 {callResponse：1,meetingResponse:1,localEncoderInfo:{resID:"""",resch:""""},localDecoderInfo:{type:0,info:{deviceID:"""",deviceCH:2}},hollID:"""",decoderList:[{deviceID,deviceCH}]}
    //	callResponse --0自动 1--手动 meetingResponse--0自动 1手动
    //	type         0--软解 1--硬解码
    addTerminalCustom: function(userID, configJson, callResponse, type, callback) {
        var mapObj = new Map();
        mapObj.set("userID", userID);
        mapObj.set("configJson", configJson);
        mapObj.set("callResponse", callResponse);
        mapObj.set("type", type);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    /*样式管理**************************************************************************************/
    //查询样式列表
    //	userID     String 用户ID
    //	queryKey   String 检索条件
    //	beginIndex int    起始索引
    //	count      int    偏移数量
    getOsdStyleList: function(userID, queryKey, beginIndex, count, callback) {
        var mapObj = new Map();
        mapObj.set("userID", userID);
        mapObj.set("queryKey", queryKey);
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //新增样式
    //	name   String 样式名称
    //	userID String 用户ID
    addStyle: function(name, userID, callback) {
        var mapObj = new Map();
        mapObj.set("name", name);
        mapObj.set("userID", userID);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //删除样式
    //	styleID String 样式ID
    deleteStyle: function(styleID, callback) {
        var mapObj = new Map();
        mapObj.set("styleID", styleID);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //编辑样式
    //	styleID      String 样式ID
    //	elementJson  String 样式属性集合
    //	osdElementID String 元素ID
    //	elementOrder int    元素排序
    //	updateStyle : function(styleID, elementJson, osdElementID, elementOrder, callback){  },
    /*OSD方案管理**************************************************************************************/
    //新增方案
    //	schemeName String 方案名称
    //	styleID    String 样式ID
    //	personList List<String> 人员列表
    //	userID     String 用户ID
    //	deviceList List<DeviceInfo> 设备列表
    addOsdScheme: function(schemeName, styleID, personList, userID, deviceList, callback) {
        var mapObj = new Map();
        mapObj.set("schemeName", schemeName);
        mapObj.set("styleID", styleID);
        mapObj.set("personList", personList);
        mapObj.set("userID", userID);
        mapObj.set("deviceList", deviceList);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //编辑方案
    //	schemeName String 方案名称
    //	styleID    String 样式ID
    //	personList List<String> 人员列表
    //	deviceList List<DeviceInfo> 设备列表
    //	schemeID   String 方案ID
    updateOsdScheme: function(schemeName, styleID, personList, deviceList, schemeID, callback) {
        var mapObj = new Map();
        mapObj.set("schemeName", schemeName);
        mapObj.set("styleID", styleID);
        mapObj.set("personList", personList);
        mapObj.set("deviceList", deviceList);
        mapObj.set("schemeID", schemeID);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //删除方案
    //	schemeIDs List<String> 方案ID(多个以集合方式)
    deleteOsdScheme: function(schemeIDs, callback) {
        var mapObj = new Map();
        mapObj.set("schemeIDs", schemeIDs);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //查询方案列表
    //	userID     String 用户ID
    //	queryKey   String 检索条件
    //	beginIndex int    起始索引
    //	count      int    偏移数量
    getOsdScheme: function(userID, queryKey, beginIndex, count, callback) {
        var mapObj = new Map();
        mapObj.set("userID", userID);
        mapObj.set("queryKey", queryKey);
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    /*策略管理**************************************************************************************/
    delOsdStragegy: function(osdStrategyIDs, callback) {
        var mapObj = new Map();
        mapObj.set("osdStrategyIDs", osdStrategyIDs);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    //修改策略状态
    //	osdStrategyID String 策略ID
    //	type          状态类型:0--运行 1--停止 2--编辑中 3--待编辑
    updateOsdStragegyState: function(osdStrategyID, type, callback) {
        var mapObj = new Map();
        mapObj.set("osdStrategyID", osdStrategyID);
        mapObj.set("type", type);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },
    getOsdStragegyList: function(userID, queryKey, beginIndex, count, callback) {
        var mapObj = new Map();
        mapObj.set("userID", userID);
        mapObj.set("queryKey", queryKey);
        mapObj.set("beginIndex", beginIndex);
        mapObj.set("count", count);
        var data = dataSDK5._getDataString(mapObj);
        var url = "";
        dataSDK5._doPost(url, data, callback);
    },

    // 查询指定类型分组
    queryGroupByType: function(token, groupType, page, offset, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupType", groupType);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/queryGroup";
        dataSDK5._doGet(url, data, callback);
    },

    // 创建解码器轮循分组
    addMatrixLoopGroup: function(token, groupName, schemeId, description, fixdResources, loopResources, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupName", groupName);
        mapObj.set("schemeId", schemeId);
        mapObj.set("description", description);
        mapObj.set("fixdResources", fixdResources);
        mapObj.set("loopResources", loopResources);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/addMatrixLoopGroup";
        dataSDK5._doPost(url, data, callback);
    },

    // 修改解码器轮循分组
    updateMatrixLoopGroup: function(token, groupId, groupName, schemeId, description, fixdResources, loopResources, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        mapObj.set("groupName", groupName);
        mapObj.set("schemeId", schemeId);
        mapObj.set("description", description);
        mapObj.set("fixdResources", fixdResources);
        mapObj.set("loopResources", loopResources);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/updateMatrixLoopGroup";
        dataSDK5._doPost(url, data, callback);
    },

    // 查询解码器轮循分组信息
    queryMatrixLoopGroupInfo: function(token, groupId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/queryMatrixLoopGroupInfo";
        dataSDK5._doGet(url, data, callback);
    },

    // 删除解码器轮循分组
    deleteMatrixLoopGroup: function(token, groupId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/BusinessGroup/deleteMatrixLoopGroup";
        dataSDK5._doPost(url, data, callback);
    },

    // 查询矩阵订阅关系
    queryMatrixSubscribe2: function(token, sourceId, destId, callback) { // token=""&sourceId=""&destId=""
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("sourceId", sourceId);
        mapObj.set("destId", destId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/queryMatrixSubscribe2";
        dataSDK5._doGet(url, data, callback);
    },

    // 查询矩阵同步关系
    queryMatrixSync2: function(token, sourceId, destId, callback) { // token=""&sourceId=""&destId=""
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("sourceId", sourceId);
        mapObj.set("destId", destId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/queryMatrixSubscribe2";
        dataSDK5._doGet(url, data, callback);
    },

    // 查询矩阵订阅关系
    queryMatrixSubscribe3: function(token, sourceName, destName, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("sourceName", sourceName);
        mapObj.set("destName", destName);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/queryMatrixSubscribe3";
        dataSDK5._doGet(url, data, callback);
    },

    // 查询矩阵同步关系
    queryMatrixSync3: function(token, sourceName, destName, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("sourceName", sourceName);
        mapObj.set("destName", destName);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/queryMatrixSync3";
        dataSDK5._doGet(url, data, callback);
    },

    // 按方案类型获取分组列表
    // queryGroupByLayoutType :  function (token,layoutType,page,offset,limit,callback){
    //   var mapObj = new Map();
    //   mapObj.set("token", token);
    //   mapObj.set("layoutType", layoutType);
    //   mapObj.set("page", page);
    //   mapObj.set("offset", offset);
    //   mapObj.set("limit", limit);
    //   var data = dataSDK5._getDataString(mapObj);
    //   var url = "/BusinessGroup/queryGroupByLayoutType";
    //   dataSDK5._doGet(url, data, callback);
    // },
    /**
     * 新增/修改矩阵
     */
    addMatrixSubscribe2: function(token, subs, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("subs", subs);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IPMatrix/addMatrixSubscribe2";
        dataSDK5._doPost(url, data, callback);
    },

    // ==================================================  视频指挥   ======================================================

    /**
     * 查询协调列表
     */
    queryCoordinate: function(token, affairId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("affairId", affairId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/Command/queryCoordinate";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 查询协同列表
     */
    queryCooperate: function(token, affairId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("affairId", affairId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/Command/queryCooperate";
        dataSDK5._doGet(url, data, callback);
    },

    //*********************************************************即时消息***************************************************************/

    /**
     * 创建群组
     * @param {*} token
     * @param {*} groupName
     * @param {*} description
     * @param {*} members   members=[{memberId:"",memberType:0/1/2}]  memberType 分组成员类型 0-群主 1-管理员 2-群成员
     * @param {*} callback   return:{"ret":0,"msg":"Success","data":{groupId:""}}
     */
    addIMGroup: function(token, groupName, description, members, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupName", groupName);
        mapObj.set("description", description);
        mapObj.set("members", members);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IMGroup/addIMGroup";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 修改群组
     * @param {*} token
     * @param {*} groupId
     * @param {*} groupName
     * @param {*} description
     * @param {*} members  members=[{memberId:"",memberType:0/1/2}]  memberType 分组成员类型 0-群主 1-管理员 2-群成员
     * @param {*} callback return:{"ret":0,"msg":"Success","data":{}}
     */
    updateIMGroup: function(token, groupId, groupName, description, members, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        mapObj.set("groupName", groupName);
        mapObj.set("description", description);
        mapObj.set("members", members);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IMGroup/updateIMGroup";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 删除群组
     * @param {*} token
     * @param {*} groupId
     * @param {*} callback return:{"ret":0,"msg":"Success","data":{}}
     */
    removeIMGroup: function(token, groupId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IMGroup/removeIMGroup";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 删除用户会话
     * @param {*} token
     * @param {*} to
     * @param {*} callback return:{"ret":0,"msg":"Success","data":{}}
     */
    removeUserSession: function(token, to, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("to", to);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IMGroup/removeUserSession";
        dataSDK5._doPost(url, data, callback);
    },

    /**
     * 分页查询群组
     * @param {*} token
     * @param {*} page
     * @param {*} offset
     * @param {*} limit
     * @param {*} callback return {"ret":0,"msg":"Success","data":{[{groupId:"",groupName:"",description=""}]}}
     */
    queryIMGroup: function(token, page, offset, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("page", page);
        mapObj.set("offset", offset);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IMGroup/queryIMGroup";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 查询群组详细信息
     * @param {*} token
     * @param {*} groupId
     * @param {*} callback return {"ret":0,"msg":"Success","data":{groupId:"",groupName:"",description="",members:[{memberId:"",memberType:0/1/2}}}
     */
    queryIMGroupInfo: function(token, groupId, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("groupId", groupId);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IMGroup/queryIMGroupInfo";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 文件上传
     * @param {*} token
     * @param {*} file
     * @param {*} callback return {"ret":0,"msg":"Success","data":{fileId:""}}
     */
    // uploadFile: function(token, file, callback) {
    uploadFile: function(file, callback) {
        // var mapObj = new Map();
        // mapObj.set("token", token);
        // mapObj.set("file", file);
        // var data = dataSDK5._getDataString(mapObj);

        var data = new FormData();
        data.append('file', file);
        var url = "/IMGroup/uploadFile";
        dataSDK5._doPost(url, data, callback);
    },

    /** 
     * 查询离线消息
     */
    queryOfflineMessage: function(token, page, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("page", page);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IMGroup/queryOfflineMessage";
        dataSDK5._doGet(url, data, callback);
    },

    /** 
     * 设置离线消息为已读
     */
    updateOfflineMessageRead: function(token, froms, groupIds, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("froms", froms);
        mapObj.set("groupIds", groupIds);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IMGroup/updateOfflineMessageRead";
        dataSDK5._doGet(url, data, callback);
    },

    /**
     * 查询历史消息
     */
    queryHistoryMessage: function(token, to, groupId, keyword, chatType, beginTime, endTime, page, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("to", to);
        mapObj.set("groupId", groupId);
        mapObj.set("keyword", keyword);
        mapObj.set("chatType", chatType);
        mapObj.set("beginTime", beginTime);
        mapObj.set("endTime", endTime);
        mapObj.set("page", page);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IMGroup/queryHistoryMessage";
        dataSDK5._doGet(url, data, callback);
    },

    /** 
     * 查询历史消息成员列表
     */
    queryHistoryMember: function(token, beginTime, endTime, page, limit, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("beginTime", beginTime);
        mapObj.set("endTime", endTime);
        mapObj.set("page", page);
        mapObj.set("limit", limit);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/IMGroup/queryHistoryMember";
        dataSDK5._doGet(url, data, callback);
    },

    //********************************************************* OSD管理 dj***************************************************************/

    /** 
     *  OSD管理 - 保存OSD
     */
    saveOsdLabel: function(token, resourceId, resourceCh, items, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resourceId", resourceId);
        mapObj.set("resourceCh", resourceCh);
        mapObj.set("items", JSON.stringify(items));
        var data = dataSDK5._getDataString(mapObj);
        var url = "/osd/saveOsdLabel";
        dataSDK5._doPost(url, data, callback);
    },
    /** 
     *  OSD管理 - 查询OSD
     */
    queryOsdLabel: function(token, resourceId, resourceCh, callback) {
        var mapObj = new Map();
        mapObj.set("token", token);
        mapObj.set("resourceId", resourceId);
        mapObj.set("resourceCh", resourceCh);
        var data = dataSDK5._getDataString(mapObj);
        var url = "/osd/queryOsdLabel";
        dataSDK5._doGet(url, data, callback);
    },

};