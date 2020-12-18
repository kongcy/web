import Enum from '@/common/enum'
import fileManageSDK from '@/sdk/fileSDK/fileManage'
export default {
    //初始化单位树数据
    _initDepartmentTreeData: function(list, parentId) {
        let nodeStatus='department';
        if (parentId == undefined){
            parentId = "";
            nodeStatus='company';
        };
        //先找根节点，有的根节点父ID为空，有的根节点其ID与父ID相同
        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            if (item.parentId === item.departmentId){
                item.parentId = "";
                nodeStatus='company';
            } 
        }
        var zNodes = [];
        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            if (item.parentId === parentId) {
                var obj = {
                    nodeId: item.departmentId,
                    id: item.departmentId,
                    name: item.departmentName,
                    leaf: false,
                    nodeStatus: nodeStatus,
                    alarm: false,
                    onLineCount:item.onLineCount,
                    totalCount:item.totalCount
                };
                obj.children = this._initDepartmentTreeData(list, item.departmentId);
                zNodes.push(obj);
            }
        }
        return zNodes;
    },

    //初始化人员树数据
    _initPersonTreeData: function(list) {
        var zNodes = [];
        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            var nodeId = item.resId + "_" + (item.resCh || 0);
            // if(xtxk.cache.get('USER').userId == item.resId) continue;//屏蔽自己

            var icon_ = this._getNodeStatus(item.resourceType, item.status, item.buss, item.deviceType);
            var data = {
                nodeId: nodeId,
                id: item.resId,
                name: item.resName,
                resourceType: item.resourceType,
                deviceType: item.deviceType,
                leaf: true,
                nodeStatus: icon_,
                resCh: item.resCh
            };
            zNodes.push(data);
        }
        return zNodes;
    },

    //添加人员树子数据
    _appendPersonTreeData: function(treeObj, list) {
        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            var nodeId = item.resId + "_" + (item.resCh || 0);
            // if(xtxk.cache.get('USER').userId == item.resId) continue;//屏蔽自己

            const node = treeObj.getNode(nodeId);
            if (node && node.parent.data.id == item.parentId) {
                this._refreshPersonTreeData(treeObj, [item]);
            } else {
                var icon_ = this._getNodeStatus(item.resourceType, item.status, item.buss, item.deviceType);
                const parentNode = treeObj.getNode(item.parentId);
                var data = {
                    nodeId: nodeId,
                    id: item.resId,
                    name: item.resName,
                    resourceType: item.resourceType,
                    deviceType: item.deviceType,
                    leaf: true,
                    nodeStatus: icon_,
                    resCh: item.resCh
                };
                if (parentNode) treeObj.append(data, parentNode);
                else treeObj.append(data);
            }
        }
    },

    //删除人员树子数据
    _removePersonTreeData: function(treeObj, list) {
        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            var nodeId = item.resId + "_" + (item.resCh || 0);

            const node = treeObj.getNode(nodeId);
            if (node) treeObj.remove(node.data)
        }
    },

    //刷新人员树数据
    _refreshPersonTreeData: function(treeObj, list) {
        var onlines = [];
        var treeDataArr = this.transformTreeToArray(treeObj.data);

        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            //var nodeId = item.resId + "_" + (item.resCh || 0);

            var preStatus = null,
                curStatus = null;

            for (var j = 0, l2 = treeDataArr.length; j < l2; j++) {
                var item2 = treeDataArr[j];
                if (item.resId == item2.id) {
                    preStatus = item2.nodeStatus;
                    curStatus = this._getNodeStatus(item2.resourceType, item.status, item.buss, item2.deviceType);
                    item2.nodeStatus = curStatus
                }
            }

            //const node = treeObj.getNode(nodeId);
            //if(node) {
            //    preStatus = node.data.nodeStatus;
            //    curStatus = this._getNodeStatus(node.data.resourceType, item.status, item.buss, node.data.deviceType);
            //    node.data.nodeStatus = curStatus;
            //}

            if (preStatus == "person_offline" && curStatus == "person_online") {
                onlines.push(item);
            }
        }
        return onlines;
    },

    //初始化设备树数据
    _initDeviceTreeData: function(list) {
        var zNodes = [];
        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            var nodeId = item.resId + "_" + (item.resCh || 0);
            var channel = item.channels;
            var icon_ = this._getNodeStatus(item.resourceType, item.status, item.buss);
            //通道在线数量 add 2020.12.10
            if(channel&&channel.length>0){
                var count=0;
                for(var j=0;j<channel.length;j++){
                    if(channel[j].isOnline&&channel[j].isOnline==true){
                        count=1;
                        continue;
                    }
                }
                if(count==0){
                    if(icon_=='NVR_online'){
                        icon_='NVR_offline';
                    }else if(icon_=='device_online'){
                        icon_='device_offline';
                    }
                }
            }
            //if(curUserId == item.resourceID) continue;//屏蔽自己
            var data = {
                nodeId: nodeId,
                id: item.resId,
                name: item.resName,
                resourceType: item.resourceType,
                deviceType: item.deviceType,
                leaf: true,
                nodeStatus: icon_,
                resCh: item.resCh,
                alarm: false
            };
            // nvr设备处理  1107 云调度更新 
            if (item.channels && item.channels.length) {
                // var channelIcon_ = this._getNodeStatus(6, item.status, item.buss);
                data.leaf = false;
                data.children = item.channels.map(it => {
                    return {
                        nodeId: it.channelID,
                        id: it.channelID,
                        name: it.channelName,
                        resourceType: 'channel',
                        deviceType: 'channel',
                        leaf: true,
                        isOnline: it.isOnline,
                        nodeStatus: this._getNodeStatus(6, it.isOnline ? 1 : 0, it.resourceBusiness),
                        resCh: '',
                        pid: data.id,
                    }
                });
            }
            zNodes.push(data);
        }
        return zNodes;
    },

    //添加设备树子数据
    _appendDeviceTreeData: function(treeObj, list) {
        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            var nodeId = item.resId + "_" + (item.resCh || 0);

            const node = treeObj.getNode(nodeId);
            if (node && node.parent.data.id == item.parentId) {
                this._refreshDeviceTreeData(treeObj, [item]);
            } else {
                 var icon_ = this._getNodeStatus(item.resourceType, item.status, item.buss);
                var channel = item.channels;
                //通道在线数量 add 2020.12.10
                if(channel&&channel.length>0){
                    var count=0;
                    for(var j=0;j<channel.length;j++){
                        if(channel[j].isOnline&&channel[j].isOnline==true){
                            count=1;
                            continue;
                        }
                    }
                    if(count==0){
                        if(icon_=='NVR_online'){
                            icon_='NVR_offline';
                        }else if(icon_=='device_online'){
                            icon_='device_offline';
                        }
                    }
                }
                const parentNode = treeObj.getNode(item.parentId);
                var data = {
                    nodeId: nodeId,
                    id: item.resId,
                    name: item.resName,
                    resourceType: item.resourceType,
                    deviceType: item.deviceType,
                    leaf: true,
                    nodeStatus: icon_,
                    resCh: item.resCh,
                    alarm: false
                };
                // nvr设备处理 1107 云调度更新
                if (item.channels && item.channels.length) {
                    data.leaf = false;
                    data.children = item.channels.map(it => {
                        return {
                            nodeId: it.channelID,
                            id: it.channelID,
                            name: it.channelName,
                            resourceType: 'channel',
                            deviceType: 'channel',
                            leaf: true,
                            isOnline: it.isOnline,
                            nodeStatus: (icon_ == 'device_offline'||icon_=='NVR_offline')?'channel_offline':this._getNodeStatus(6, it.isOnline ? 1 : 0, it.resourceBusiness),
                            resCh: '',
                            pid: data.id,
                        }
                    });
                }
                if (parentNode) treeObj.append(data, parentNode);
                else treeObj.append(data);
            }
        }
    },

    //删除设备树子数据
    _removeDeviceTreeData: function(treeObj, list) {
        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            var nodeId = item.resId + "_" + (item.resCh || 0);

            const node = treeObj.getNode(nodeId);
            if (node) treeObj.remove(node.data)
        }
    },

    //刷新设备树数据  //1126 同步云调度 1126 多通道修改------------
    _refreshDeviceTreeData: function(treeObj, list) {
        var onlines = [];
        var treeDataArr = this.transformTreeToArray(treeObj.data);

        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            //var nodeId = item.resId + "_" + (item.resCh || 0);

            var preStatus = null,
                curStatus = null,
                channelStatus = null; 
            for (var j = 0, l2 = treeDataArr.length; j < l2; j++) {
                var item2 = treeDataArr[j];
                if (item.resId == item2.id && item.resCh == item2.resCh) {
                    preStatus = item2.nodeStatus;
                    curStatus = this._getNodeStatus(item2.resourceType, item.status, item.buss, item2.deviceType);
                    item2.nodeStatus = curStatus;
                    // nvr多通道
                    item.channels && item.channels.length && item.channels.forEach((it, index) => {
                        channelStatus = this._getNodeStatus(6, it.isOnline ? 1 : 0, it.resourceBusiness)
                        if(curStatus=='device_offline'||curStatus=='NVR_offline'){
                            channelStatus=='channe1_offline';
                        }
                        let idx = item2.children.findIndex(itt => (itt.id === it.channelID));
                        if (idx !== -1) {
                            item2.children[idx].nodeStatus = channelStatus;
                        }
                    })
                }
            }

            //var icon_ = this._getNodeStatus(item.resourceType, item.status, item.buss);
            //var preStatus = null;

            //const node = treeObj.getNode(nodeId);
            //if(node) {
            //    preStatus = node.data.nodeStatus;
            //    node.data.nodeStatus = icon_;
            //}

            if (preStatus == "device_offline" && curStatus == "device_online") {
                onlines.push(item);
            }
        }
        return onlines;
    },
   //初始化常用节点树数据  2020.12.16
    _initCommonUseTreeData: function(obj) {
        var zNodes = [{
            nodeId:obj.parentId,
            id: obj.parentId,
            name: obj.resourceName,
            leaf: false,
            nodeStatus:'company',
            alarm: false,
            onLineCount:obj.onLineNum,
            totalCount:obj.totalNum,
        }];
        zNodes[0].children=[];
        let list={}
        obj.nodes.forEach(item=>{
            if(item.resourceType=="Device"){
                if(item.deviceType=='GBNVREncoder'){
                    item.resourceType = 7
                }else{
                    item.resourceType = 1
                }
                var nodeId = item.resourceID + "_" + (item.resCh || 0);
                var icon_ = this._getNodeStatus(item.resourceType, parseInt(item.status), item.busStatus);
                list={
                    nodeId: nodeId,
                    id: item.resourceID,
                    name: item.resourceName,
                    resourceType: item.resourceType,
                    deviceType: item.deviceType,
                    leaf: true,
                    nodeStatus: icon_,
                    resCh: item.resCh,
                    alarm: false,
                    num:item.num,
                    time:item.updateTimeStr,
                }
            }
            if(item.resourceType=="7"){
                var icon_ =parseInt(item.status)==1?this._getNodeStatus(6, parseInt(item.status), item.busStatus):'channel_offline'
                list={
                    nodeId:item.resourceID,
                    id: item.resourceID,
                    name: item.resourceName,
                    resourceType: 'channel',
                    deviceType:'channel',
                    leaf: true,
                    nodeStatus: icon_,
                    alarm: false,
                    resCh: '',
                    pid:item.pid,
                    num:item.num,
                    time:item.updateTimeStr,
                }
            }
            zNodes[0].children.push(list);
        })
      
        return zNodes;
    },

    //刷新常用节点树数据 2020.12.16
    _refreshCommonUseData: function(treeObj, list) {
        var onlines = [];
        var treeDataArr = this.transformTreeToArray(treeObj.data);
        console.log(treeDataArr)
        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            var preStatus = null,
                curStatus = null,
                channelStatus = null; 
            for (var j = 0, l2 = treeDataArr.length; j < l2; j++) {
                var item2 = treeDataArr[j];
                if (item.resId == item2.id && item.resCh == item2.resCh) {
                    preStatus = item2.nodeStatus;
                    if(item2.resourceType=="channel"){
                        // 通道
                        curStatus = this._getNodeStatus(6, item.status, item.buss, item2.deviceType);
                  
                    }else{
                        curStatus = this._getNodeStatus(item2.resourceType, item.status, item.buss, item2.deviceType);
                    }
                    item2.nodeStatus = curStatus;
                    // nvr多通道
                    // item.channels && item.channels.length && item.channels.forEach((it, index) => {
                    //     channelStatus = this._getNodeStatus(6, it.isOnline ? 1 : 0, it.resourceBusiness)
                    //     if(curStatus=='device_offline'||curStatus=='NVR_offline'){
                    //         channelStatus=='channe1_offline';
                    //     }
                    //     let idx = item2.children.findIndex(itt => (itt.id === it.channelID));
                    //     if (idx !== -1) {
                    //         item2.children[idx].nodeStatus = channelStatus;
                    //     }
                    // })
                }
            }

            //var icon_ = this._getNodeStatus(item.resourceType, item.status, item.buss);
            //var preStatus = null;

            //const node = treeObj.getNode(nodeId);
            //if(node) {
            //    preStatus = node.data.nodeStatus;
            //    node.data.nodeStatus = icon_;
            //}

            if (preStatus == "device_offline" && curStatus == "device_online") {
                onlines.push(item);
            }
        }
        return onlines;
    },
  
    //初始化常用资源树数据
    _initCommonTreeData: function(list) {
        var zNodes = [];
        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            var nodeId = item.resId + "_" + (item.resCh || 0);
            //if(xtxk.cache.get('USER').userId == item.resId) continue;//屏蔽自己 V5.x必须放开

            var icon_ = this._getNodeStatus(item.resourceType, item.status, item.buss);
            var data = {
                nodeId: nodeId,
                id: item.resId,
                name: item.resName,
                resourceType: item.resourceType,
                leaf: true,
                nodeStatus: icon_,
                resCh: item.resCh
            };
            zNodes.push(data);
        }
        return zNodes;
    },
    //新增常用资源树数据
    _appendCommonTreeData: function(treeObj, list) {
        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            var nodeId = item.resId + "_" + (item.resCh || 0);
            //if(xtxk.cache.get('USER').userId == item.resId) continue;//屏蔽自己 V5.x必须放开

            var icon_ = this._getNodeStatus(item.resourceType, item.status, item.buss);
            var data = {
                nodeId: nodeId,
                id: item.resId,
                name: item.resName,
                resourceType: item.resourceType,
                leaf: true,
                nodeStatus: icon_,
                resCh: item.resCh
            };
            treeObj.append(data);
        }
    },

    //刷新常用资源树数据
    _refreshCommonTreeData: function(treeObj, list) {
        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            var nodeId = item.resId + "_" + (item.resCh || 0);
            // if(xtxk.cache.get('USER').userId == item.resId) continue;//屏蔽自己

            var icon_ = this._getNodeStatus(item.resourceType, item.status, item.buss);
            const node = treeObj.getNode(nodeId);
            if (node) node.data.nodeStatus = icon_;
        }
    },

    //删除常用资源树数据
    _removeCommonTreeData: function(treeObj, list) {
        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            var nodeId = item.resId + "_" + (item.resCh || 0);

            const node = treeObj.getNode(nodeId);
            if (node) treeObj.remove(node.data);
        }
    },

    //初始化文件频道数据
    _initFileListTreeData: function(list) {
        var zNodes = [];
        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            var nodeId = item.resId + "_" + (item.resCh || 0);

            var icon_ = this._getNodeStatus(2, item.isOnline == true ? 1 : 0, item.isPlay == true ? Enum.enumBussStatus.Playing : 0);
            var data = {
                nodeId: nodeId,
                id: item.resId,
                name: item.resName,
                resourceType: 2,
                leaf: false,
                nodeStatus: 'department',
                resCh: item.resCh
            };
            zNodes.push(data);
        }
        return zNodes;
    },

    //添加文件频道数据
    _appendFileListTreeData: function(treeObj, list) {
        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            var nodeId = item.resId + "_" + (item.resCh || 0);

            const node = treeObj.getNode(nodeId);
            if (node) {
                this._refreshDeviceTreeData(treeObj, [item]);
            } else {
                const parentNode = treeObj.getNode(item.parentId + "_" + (item.resCh || 0));
                var icon_ = this._getNodeStatus(2, item.isOnline == true ? 1 : 0, item.isPlay == true ? Enum.enumBussStatus.Playing : 0);
                var data = {
                    nodeId: nodeId,
                    id: item.resId,
                    name: item.resName,
                    resourceType: 2,
                    leaf: true,
                    nodeStatus: icon_,
                    resCh: item.resCh
                };
                if (parentNode) treeObj.append(data, parentNode);
                else
                treeObj.append(data);
            }
        }
    },
    //删除文件频道数据
    _removeFileListTreeQueryData: function(treeObj, list) {
        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            var nodeId = item.resId + "_" + (item.resCh || 0);

            const node = treeObj.getNode(nodeId);
            if (node) {
                treeObj.remove(node.data)
            }
        }
    },

    //刷新文件频道数据
    _refreshFileListTreeData: function(treeObj, list) {
        const onlines = [];
        for (var i = 0, l = list.length; i < l; i++) {
            var item = list[i];
            var nodeId = item.resId + "_" + (item.resCh || 0);

            const node = treeObj.getNode(nodeId);
            var icon_ = this._getNodeStatus(2, item.isOnline == "true" ? 1 : 0, item.isPlay == "true" ? Enum.enumBussStatus.Playing : 0);
            const preStatus = node ? node.data.nodeStatus : null;
            if (node) node.data.nodeStatus = icon_;

            if (preStatus == "filelist_offline" && icon_ == "filelist_online") {
                onlines.push(item);
            }
        }
        return onlines;
    },

    //status:业务状态值，type：0-人员，1-设备，2-文件
    _getNodeStatus: function(resType, resStatus, busStatus, deviceType) {
        var iconSkin = null;
        if (resStatus == 1) {
            if (busStatus == Enum.enumBussStatus.Playing) {
                iconSkin = "playing";
            } else if (busStatus == Enum.enumBussStatus.Calling) {
                iconSkin = "calling";
            } else if (busStatus == Enum.enumBussStatus.Meeting) {
                iconSkin = "meeting";
            } else if (busStatus == Enum.enumBussStatus.Speaking) {
                iconSkin = "speaking";
            } else if (busStatus == Enum.enumBussStatus.Transmiting) {
                //暂用对讲图标
                iconSkin = "speaking";
            } else if (busStatus == Enum.enumBussStatus.PlayWaiting) {
                iconSkin = "playWaiting";
            } else if (busStatus == Enum.enumBussStatus.CallWaiting) {
                iconSkin = "callWaiting";
            } else if (busStatus == Enum.enumBussStatus.MeetWaiting) {
                iconSkin = "meetWaiting";
            } else if (busStatus == Enum.enumBussStatus.SpeakWaiting) {
                iconSkin = "speakWaiting";
            } else if (busStatus == Enum.enumBussStatus.TransmitWaiting) {
                //暂用对讲图标
                iconSkin = "speakWaiting";
            } else if (busStatus == Enum.enumBussStatus.Specialtying) {
                //暂用对讲图标
                iconSkin = "specialtying";
            } else if (busStatus == Enum.enumBussStatus.SpecialtyWaiting) {
                //暂用对讲图标
                iconSkin = "specialtyWaiting";
            } else {
                iconSkin = "online";
            }
        } else if (resStatus == 2) { //故障
            iconSkin = "fault";
        } else { //离线
            iconSkin = "offline";
        }
        if (resType == Enum.enumResType.PERSON) {
            if (deviceType == Enum.enumPersonType.IPVoiceTerminal) //IP话音终端
                iconSkin = "ip_" + iconSkin;
            else if (deviceType == Enum.enumPersonType.PSTN) //PSTN终端
                iconSkin = "pstn_" + iconSkin;
            else if (deviceType == Enum.enumPersonType.H323Meeting) //H323会议网关
                iconSkin = "h323_" + iconSkin;
            else
                iconSkin = "person_" + iconSkin;
        } else if (resType == Enum.enumResType.DEVICE) {
            if (deviceType == Enum.enumDeviceType.HWMeetingTerminal)
                iconSkin = "hwMeeting_" + iconSkin;
            else
                iconSkin = "device_" + iconSkin;
        } else if (resType == Enum.enumResType.File)
            iconSkin = "filelist_" + iconSkin;
        else if (resType == Enum.enumResType.PlayRoom)
            iconSkin = "playroom_" + iconSkin;
        else if (resType == Enum.enumResType.Virtual)
            iconSkin = 'virtual_' + iconSkin
        else if (resType == Enum.enumResType.Channel) //1107 云调度更新
        iconSkin = 'channel_' + iconSkin
        else if (resType == Enum.enumResType.NVR) //2020.12.2 wxx add
        iconSkin = 'NVR_' + iconSkin
        return iconSkin;
    },

    //点播人员
    startPlayPerson: function($vue, treeNode, index, transportType) {
        if ($vue.$store.getters.getMediaService != Enum.enumMediaService.Success) {
            this.commonNotify($vue, 'register');
            return;
        }
        var receiverID = treeNode.id;
        var receiverName = treeNode.name;
        if (index == undefined) index = -1;
        $vue.apiSDK.startPlayUser(index, receiverID, 1, receiverName, transportType);
        //刷新图标
        treeNode.nodeStatus = "person_playWaiting";
    },

    //停止点播人员
    stopPlayPerson: function(apiSDK, treeNode) {
        var receiverID = treeNode.id;
        var receiverName = treeNode.name;
        var resourceType = treeNode.resourceType;
        if (treeNode.nodeStatus == "person_playing" || treeNode.nodeStatus == "h323_playing") apiSDK.stopPlayUser(receiverID, 1, receiverName);
        else apiSDK.cancelBusiness(receiverID, resourceType, "Play");
        //刷新图标
        treeNode.nodeStatus = "person_wait";
    },

    //音视频呼叫人员
    //onlyVoice为true表示纯音频呼叫
    startCallPerson: function($vue, treeNode, srcName, onlyVoice) {
        if ($vue.$store.getters.getMediaService != Enum.enumMediaService.Success) {
            this.commonNotify($vue, 'register');
            return;
        }
        var receiverID = treeNode.id;
        var receiverName = treeNode.name;
        var senderName = srcName;
        if (onlyVoice) $vue.apiSDK.startVoiceCall(receiverID, receiverName, senderName);
        else $vue.apiSDK.startMediaCall(receiverID, receiverName, senderName);
        //刷新图标
        treeNode.nodeStatus = "person_callWaiting";
    },

    //音视频呼叫华为UC
    //onlyVoice为true表示纯音频呼叫
    startCallHW: function($vue, treeNode, srcName, onlyVoice) {
        if ($vue.$store.getters.getMediaService != Enum.enumMediaService.Success) {
            this.commonNotify($vue, 'register');
            return;
        }
        var receiverID = treeNode.id;
        var receiverName = treeNode.name;
        var senderName = srcName;
        if (onlyVoice) $vue.apiSDK.startVoiceCallHW(receiverID, receiverName, senderName);
        else $vue.apiSDK.startMediaCallHW(receiverID, receiverName, senderName);
        //刷新图标
        treeNode.nodeStatus = "person_callWaiting";
    },

    //停止呼叫
    stopCallPerson: function(apiSDK, treeNode, srcName, onlyVoice) {
        var receiverID = treeNode.id;
        var receiverName = treeNode.name;
        var resourceType = treeNode.resourceType;
        var senderName = srcName;
        if (onlyVoice) apiSDK.stopCall(receiverID, receiverName, senderName, true);
        else if (treeNode.nodeStatus.indexOf("calling") > 0) apiSDK.stopCall(receiverID, receiverName, senderName, false);
        else apiSDK.cancelBusiness(receiverID, resourceType, "Call");
        //刷新图标
        treeNode.nodeStatus = "person_wait";
    },

    //点播设备  1107 云调度更新
    startPlayDevice: function($vue, treeNode, index, transportType) {
        if ($vue.$store.getters.getMediaService != Enum.enumMediaService.Success) {
            this.commonNotify($vue, 'register');
            return;
        }
        var receiverID = treeNode.id;
        var receiverCh = treeNode.resCh || 0;
        var resourceType = treeNode.resourceType;
        var receiverName = treeNode.name;
        var startPlayNode=[];
        var list={}
        if (index == undefined) index = -1;
        let n=JSON.parse(sessionStorage.getItem('currentScreen')).length; 
        if(n<9){
            if (treeNode.children) {  //1126 同步云调度 1126 多通道修改------------
              //  let channels = treeNode.children.map(item => item.id)
              let channels = [];
              treeNode.children.forEach(item =>{
                   if(n<9){
                        if (item.isOnline) {
                            channels.push(item.id);
                            ++n;
                        }
                   }
                 
              });
            $vue.apiSDK.startPlayNVRDevice(receiverID, channels.join(','), transportType);
            list={"deviceId":receiverID,"channel":channels.join(',')};
            } else if (treeNode.deviceType === 'channel') {
                $vue.apiSDK.startPlayNVRDevice(treeNode.pid, receiverID, transportType);
                list={"deviceId":treeNode.pid,"channel":receiverID};
            } else {
                $vue.apiSDK.startPlayDevice(index, receiverID, receiverCh, resourceType, 1, receiverName, transportType);
                list={"deviceId":receiverID};
                //刷新图标
                treeNode.nodeStatus = "device_playWaiting";
            }
        }
        //添加点击常用节点 2020.12.13
        startPlayNode.push(list);
        console.log(startPlayNode)
        $vue.apiSDK.AddCommonUse(startPlayNode);
    },

    //停止点播设备 1107 云调度更新
    stopPlayDevice: function(apiSDK, treeNode) {
        var receiverID = treeNode.id;;
        var receiverCh = treeNode.resCh || 0;
        var receiverName = treeNode.name;
        var resourceType = treeNode.resourceType;
        if (treeNode.children) { //1126 同步云调度 1126 多通道修改------------
            let channels = treeNode.children.map(item => item.id)
            apiSDK.stopPlayNVRDevice(receiverID, channels.join(','));
        } else if (treeNode.deviceType === 'channel') {
            apiSDK.stopPlayNVRDevice(treeNode.pid, receiverID);
        } else {
            apiSDK.stopPlayDevice(receiverID, receiverCh, 1, receiverName);
            //刷新图标
            // treeNode.nodeStatus = "device_playWaiting";
            // if(treeNode.nodeStatus.indexOf("device_")>-1){
                if(treeNode.nodeStatus=='device_playing'||treeNode.nodeStatus=='device_playWaiting')treeNode.nodeStatus="device_online"
            //}
        }
        // if (treeNode.nodeStatus == "device_playing") apiSDK.stopPlayDevice(receiverID, receiverCh, 1, receiverName);
        // else apiSDK.cancelBusiness(receiverID, resourceType, "Play");
        
    },

    // 批量停止点播设备 20201218
    stopPlayDevices: function($vue, treeNodes) {
        if ($vue.$store.getters.getMediaService != Enum.enumMediaService.Success) {
            this.commonNotify($vue, 'register');
            return;
        }
        let resInfos = [];
        let channelsDevice = [];
        var startPlayNode=[];
        var list={}
        treeNodes.forEach(item => {
                // nvr多通道批量点播
                if (item.resourceType == 'channel') {
                    let obj = channelsDevice.find(it => it.deviceId === item.pid);
                    if (obj) {
                        let channel = obj.channels.find(i => i === item.id)
                        if (!channel) {
                            obj.channels.push(item.id);
                        }
                    } else {
                        channelsDevice.push({deviceId: item.pid, channels: [item.id]})
                    }
                   
                } else if (item.children && item.children.length) {
                    let channels = item.children && item.children.filter(item =>item.id).map(item=>item.id)
                    channelsDevice.push({deviceId: item.id, channels: channels})
                } else {
                    var receiverID = item.id;;
                    var receiverCh = item.resCh || 0;
                    var receiverName = item.name;
                    $vue.apiSDK.stopPlayDevice(receiverID, receiverCh, 1, receiverName);
                }
        })
        //resInfos.length && $vue.apiSDK.publishStartPlayRes(resInfos);
        // nvr多通道批量点播
        channelsDevice.length && channelsDevice.forEach(item => {
            $vue.apiSDK.stopPlayNVRDevice(item.deviceId, item.channels.join(','));
        })
    },

    //批量点播 1126 同步云调度 1125 多通道数据判断条件修改---------
    startPlayRess: function($vue, treeNodes) {
        if ($vue.$store.getters.getMediaService != Enum.enumMediaService.Success) {
            this.commonNotify($vue, 'register');
            return;
        }
        let resInfos = [];
        let channelsDevice = [];
        var startPlayNode=[];
        var list={}
        let n=JSON.parse(sessionStorage.getItem('currentScreen')).length; 
        treeNodes.forEach(item => {
            if(n<9){
                // nvr多通道批量点播
                if (item.resourceType == 'channel') {
                    let obj = channelsDevice.find(it => it.deviceId === item.pid);
                    if (obj) {
                        let channel = obj.channels.find(i => i === item.id)
                        if (!channel) {
                            obj.channels.push(item.id);
                            ++n;
                        }
                    } else {
                        channelsDevice.push({deviceId: item.pid, channels: [item.id]})
                        ++n;
                    }
                   
                } else if (item.children && item.children.length) {
                    let c=n;
                    // let channels = item.children && item.children.map((item,index) => {
                    //     if(index<=9-c){
                    //         ++n;
                    //         return item.id
                    //     }
                    // })

                    let channels = item.children && item.children.filter((item,index) => {
                        if(index<9-c){
                            ++n;
                            return item.id
                        }
                    }).map(item=>item.id)
                    
                    channelsDevice.push({deviceId: item.id, channels: channels})
                } else {
                    resInfos.push({
                        resId: item.id,
                        resCh: item.resCh || 0,
                        resName: item.name,
                        resType: item.resourceType
                    })
                    ++n;
                    startPlayNode.push({"deviceId":item.id})
                }
            }
        })
        resInfos.length && $vue.apiSDK.publishStartPlayRes(resInfos);
        // nvr多通道批量点播
        channelsDevice.length && channelsDevice.forEach(item => {
            $vue.apiSDK.startPlayNVRDevice(item.deviceId, item.channels.join(','));
            startPlayNode.push({"deviceId":item.deviceId,"channel":item.channels.join(',')})
        })

        console.log(startPlayNode)
        $vue.apiSDK.AddCommonUse(startPlayNode);
    },


    //批量呼叫
    startCallRess: function($vue, treeNodes, srcName) {
        if ($vue.$store.getters.getMediaService != Enum.enumMediaService.Success) {
            this.commonNotify($vue, 'register');
            return;
        }
        let resInfos = [];
        treeNodes.forEach(item => {
            resInfos.push({
                resId: item.id,
                resCh: item.resCh || 0,
                resName: item.name
            })
        })
        $vue.apiSDK.publishStartCalls(srcName, resInfos);
    },

    //语音对讲设备
    startSpeakDevice: function($vue, treeNode) {
        if ($vue.$store.getters.getMediaService != Enum.enumMediaService.Success) {
            this.commonNotify($vue, 'register');
            return;
        }
        var receiverID = treeNode.id;
        var receiverCh = treeNode.resCh || 0;
        //var resourceType        = treeNode.resourceType;
        //var receiverName	    = treeNode.name;
        $vue.apiSDK.startSpeak(receiverID, receiverCh);
        //刷新图标
        treeNode.nodeStatus = "device_speakWaiting";
    },

    //停止语音对讲设备
    stopSpeakDevice: function(apiSDK, treeNode) {
        var receiverID = treeNode.id;;
        var receiverCh = treeNode.resCh || 0;
        //var receiverName 	    = treeNode.name;
        var resourceType = treeNode.resourceType;
        if (treeNode.nodeStatus == "device_speaking") apiSDK.stopSpeak(receiverID, receiverCh);
        else apiSDK.cancelBusiness(receiverID, resourceType, "Speak");
        //刷新图标
        treeNode.nodeStatus = "device_wait";
    },

    //收藏资源
    publishResourceCollect: function(apiSDK, treeNode, favourite) {
        var nodeId = treeNode.id;
        var ind = nodeId.indexOf("_");
        var receiverID = ind > -1 ? nodeId.substring(0, ind) : nodeId;
        var resources = [{
            resId: receiverID,
            resCh: treeNode.resCh ? treeNode.resCh : 0,
            resourceType: treeNode.resourceType,
            resName: treeNode.name
        }];
        apiSDK.publishResourceCollect(resources, favourite);
    },

    //分组类型过滤
    filterForGroupType: function(type) {
        let name = '';
        if (type == Enum.enumGroupType.GroupPlay) {
            name = '监看分组';
        } else if (type == Enum.enumGroupType.GroupCall) {
            name = '呼叫分组';
        } else if (type == Enum.enumGroupType.GroupMeeting) {
            name = '视频会议';
        } else if (type == Enum.enumGroupType.VideoCommand) {
            name = '视频指挥';
        } else if (type == Enum.enumGroupType.LocalLoopPlay) {
            name = '监看分组(本地)';
        } else if (type == Enum.enumGroupType.DecodLoopPlay) {
            name = '监看分组(解码)';
        }
        return name;
    },

    //方案类型过滤
    filterForSchemeType: function(type) {
        let name = '';
        if (type == Enum.enumSchemeType.GroupMeeting) {
            name = '视频会议';
        } else if (type == Enum.enumSchemeType.LocalLoopPlay) {
            name = '监看轮循(本地)';
        } else if (type == Enum.enumSchemeType.DecodLoopPlay) {
            name = '监看轮循(解码)';
        } else if (type == Enum.enumSchemeType.VideoCommand) {
            name = '视频指挥';
        }
        return name;
    },

    // 分屏类型过滤
    filterForSplitType: function(type) {
        let name = '';
        if (type == Enum.enumSplitType.OnlyOne) {
            name = 1;
        } else if (type == Enum.enumSplitType.OneInOne) {
            name = 2;
        } else if (type == Enum.enumSplitType.One_Two) {
            name = 3;
        } else if (type == Enum.enumSplitType.OnlyFour) {
            name = 4;
        } else if (type == Enum.enumSplitType.Two_Three) {
            name = 5;
        } else if (type == Enum.enumSplitType.One_Five) {
            name = 6;
        } else if (type == Enum.enumSplitType.One_Seven) {
            name = 8;
        } else if (type == Enum.enumSplitType.OnlyNine) {
            name = 9;
        } else if (type == Enum.enumSplitType.OneX_One) {
            name = 2;
        } else if (type == Enum.enumSplitType.One_OneX) {
            name = 2;
        } else if (type == Enum.enumSplitType.OnlySixteen) {
            name = 16;
        } else if (type == Enum.enumSplitType.OnlySix) {
            name = 6;
        } else if (type == Enum.enumSplitType.One_Six) {
            name = 7;
        } else if (type == Enum.enumSplitType.OnlyTwelve) {
            name = 12;
        } else if (type == Enum.enumSplitType.One_Eleven) {
            name = 12;
        } else if (type == Enum.enumSplitType.One_Nine) {
            name = 10;
        } else if (type == Enum.enumSplitType.OnlyTweentyFour) {
            name = 24;
        } else if (type == Enum.enumSplitType.OnlyTweentyFive) {
            name = 25;
        } else if (type == Enum.enumSplitType.OnlyThirtySix) {
            name = 36;
        } else if (type == Enum.enumSplitType.Two_Eight) {
            name = 10;
        } else if (type == Enum.enumSplitType.OnlyTwo) {
            name = 2;
        }
        return name;
    },

    //字体过滤
    filterForFontFamily: function(type) {
        switch (type) {
            case "SIM_SUN":
                return "宋体"
            case "SIM_HEI":
                return "黑体"
            case "SIM_KAI":
                return "楷体"
            case "SIM_SUN_EX":
                return "仿宋"
            case "SIM_LI":
                return "隶书"
        }
        return "宋体";
    },

    //字号过滤
    filterForFontSize: function(type) {
        switch (type) {
            case 0:
                return 0
            case 1:
                return Enum.enumFontSize.One
            case 2:
                return Enum.enumFontSize.Two
            case 3:
                return Enum.enumFontSize.Three
            case 4:
                return Enum.enumFontSize.Four
            case 5:
                return Enum.enumFontSize.Five
            case 6:
                return Enum.enumFontSize.Six
            case 7:
                return Enum.enumFontSize.Seven
            case 8:
                return Enum.enumFontSize.Eight
            case 9:
                return Enum.enumFontSize.Nine
        }
        return 14;
    },

    //颜色16进制转rgb
    hexToRGB: function(hex) {
        let res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return res ? {
            R: parseInt(res[1], 16),
            G: parseInt(res[2], 16),
            B: parseInt(res[3], 16),
        } : { R: 0, G: 153, B: 255 }
    },

    //将树结构转数组
    transformTreeToArray(treeData, parentNode) {
        var nodes = [];
        if (parentNode == undefined || parentNode == null || parentNode == "") {
            treeData.forEach(item => {
                item.parentId = "";
                item.parentName = "";
                item.level = 1;
                nodes.push(item);
                nodes.push.apply(nodes, this.transformTreeToArray(treeData, item));
            });
        } else {
            parentNode.children && parentNode.children.forEach(item => {
                item.parentId = parentNode.id;
                item.parentName = parentNode.name;
                item.level = parentNode.level + 1;
                nodes.push(item);
                nodes.push.apply(nodes, this.transformTreeToArray(treeData, item));
            });
        }
        return nodes;
    },

    //统一异常提示
    commonNotify($this, type) {
        switch (type) {
            case 'register': //插件注册
                $this.$notify({
                    title: '插件注册服务失败',
                    message: '不能发起业务操作',
                    type: 'warning',
                    position: 'bottom-right'
                })
                break;
            default:
                break;
        }
    },

    //开始人员视频专向
    startVideoSpecialPerson: function($vue, treeNode) {
        if ($vue.$store.getters.getMediaService != Enum.enumMediaService.Success) {
            this.commonNotify($vue, 'register');
            return;
        }
        var receiverID = treeNode.id;
        $vue.apiSDK.startSpecial(receiverID);
    },

    //停止人员视频专向
    stopVideoSpecialPerson: function($vue, treeNode) {
        if ($vue.$store.getters.getMediaService != Enum.enumMediaService.Success) {
            this.commonNotify($vue, 'register');
            return;
        }
        var receiverID = treeNode.id;
        $vue.apiSDK.stopSpecial(receiverID);
    },

    // 文件下载
    fileDownload($vue, treeNode) {
        fileManageSDK.setURLPrefix(xtxk.config.api.fileUploadURL);
        fileManageSDK.download(treeNode.id, 0, treeNode.name);
    },
    
    // nvr设备点播  1107 云调度更新
    startPlayNVRDevice(receiverID, channels) {
        $vue.apiSDK.startPlayNVRDevice(receiverID);
    },
    stopPlayNVRDevice(receiverID, channels) {
        $vue.apiSDK.stopPlayNVRDevice(receiverID);
    },

    // 自动点播
    automaticPlay: function ($vue, treeNode, index, transportType) {
        var receiverID = treeNode.id;
        var receiverCh = treeNode.resCh || 0;
        var resourceType = treeNode.resourceType;
        var receiverName = treeNode.name;
        // debugger;
        $vue.apiSDK.startPlayDevice(index, receiverID, receiverCh, resourceType, 1, receiverName, transportType);
    },
    // 通过通道自动点播
    // singleStartPlayNVRDevice:function ($vue, treeNodes) {
    //     $vue.apiSDK.startPlayNVRDevice(treeNodes.deviceId, treeNodes.channels.join(','));
    // },
    // 通过ip 批量点播
    automaticStartPlayRess: function ($vue, treeNodes) {
        $vue.apiSDK.startPlayNVRDevice(treeNodes.deviceId, treeNodes.channels.join(','));
    },

}
