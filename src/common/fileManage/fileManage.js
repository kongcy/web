import Axios from 'axios'
import MD5 from './md5'
var fileManageSDK = {
    _URLPrefix: "http://172.16.100.30:30900/openvone/recordvod-play-system/api/v1",
    _token: "",
    _errorCB: function(msg) {},
    _isAsync: true,
    _dataType: "json",
    maxSize: 3 * 1024 * 1024,
    _doGet: async function(url, data, callback) {
        var configObj = {
            method: "GET",
            url: fileManageSDK._URLPrefix + url,
            async: fileManageSDK._isAsync,
            data: data,
            dataType: fileManageSDK._dataType,
            success: callback,
            error: fileManageSDK._errorCB
        };
        await Axios.get(configObj.url + '?' + data).then((res) => {
            if (callback) callback(res.data);
        }).catch(() => {
            callback({code: 88})
        });
    },
    _doPost: async function(url, data, content, callback) {
        let postUrl = fileManageSDK._URLPrefix + url
        var configObj = {
            body: content
        };
        await Axios.post(postUrl + '?' + data, configObj).then((res) => {
            if (callback) callback(res.data);
        });
    },
    _getDataString: function(mapObj, noToken) {
        if (noToken == undefined)
            mapObj.set("operatorToken", fileManageSDK._token);
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
    createMultipartUpload: async function(file_name , file_size , file_before_md5 , file_after_md5 , callback) {
        var mapObj = new Map();
        mapObj.set("file_name", file_name)
        mapObj.set("file_size", file_size)
        mapObj.set("file_before_md5", file_before_md5)
        mapObj.set("file_after_md5", file_after_md5)
        var data = fileManageSDK._getDataString(mapObj);
        var url = "/fileupload/createMultipartUpload";
        await fileManageSDK._doGet(url, data, callback);
    },
    iterUploadPart: function(file_name , file_size , bucket_id , upload_id, part_number, blocks_total, block_size, block_entity , callback) {
        var mapObj = new Map();
        mapObj.set("file_name", file_name)
        mapObj.set("file_size", file_size)
        mapObj.set("bucket_id", bucket_id)
        mapObj.set("upload_id", upload_id)
        mapObj.set("part_number", part_number)
        mapObj.set("blocks_total", blocks_total)
        mapObj.set("block_size ", block_size);
        var data = fileManageSDK._getDataString(mapObj);
        var url = "/fileupload/iterUploadPart";
        fileManageSDK._doPost(url, data, block_entity, callback);
    },
    overMultipartUpload: function(file_name , file_size , bucket_id, upload_id, blocks_total, block_size, notify_url, file_before_md5, file_after_md5, callback) {
        var mapObj = new Map();
        mapObj.set("file_name", file_name)
        mapObj.set("file_size", file_size)
        mapObj.set("bucket_id", bucket_id)
        mapObj.set("upload_id", upload_id)
        mapObj.set("blocks_total", blocks_total)
        mapObj.set("block_size", block_size)
        mapObj.set("notify_url", notify_url)
        mapObj.set("file_before_md5", file_before_md5)
        mapObj.set("file_after_md5", file_after_md5)
        var data = fileManageSDK._getDataString(mapObj);
        var url = "/fileupload/overMultipartUpload";
        fileManageSDK._doGet(url, data, callback);
    },
    /**
     * 页面调用上传接口
     * file_name:文件名
     * file_size:文件大小(byte)
     * file: 二进制文件内容
     * 
     * 
     * file 
     */
    async upload(file_name, file_size, file, file_before, file_after, callback) {
        // debugger
        var file_before_md5 = MD5(file_before);
        var file_after_md5 = MD5(file_after);
        var blocks_total = Math.ceil(file_size/fileManageSDK.maxSize);
        var bucket_id ='';
        var upload_id = '';
        var mapObj = new Map();
        mapObj.set("file_name", file_name);
        mapObj.set("file_size", file_size);
        mapObj.set("file_before_md5", file_before_md5);
        mapObj.set("file_after_md5", file_after_md5);
        var data = fileManageSDK._getDataString(mapObj);
        let res = await Axios.get(fileManageSDK._URLPrefix + "/fileupload/createMultipartUpload" + '?' + data);
        res = res.data;
        if (res.code == 200) {
            bucket_id = res.bucket_id
            upload_id = res.upload_id
            for (let i = 0; i < blocks_total; i++) {
                console.log(i);
                // 分片
                var start = i * fileManageSDK.maxSize;
                var end = Math.min(file_size, start + fileManageSDK.maxSize);
                var block_entity = file.slice(start, end);

                var mapObj = new Map();
                mapObj.set("file_name", file_name)
                mapObj.set("file_size", file_size)
                mapObj.set("bucket_id", bucket_id)
                mapObj.set("upload_id", upload_id)
                mapObj.set("part_number", i)
                mapObj.set("blocks_total", blocks_total)
                mapObj.set("block_size", end);
                var data = fileManageSDK._getDataString(mapObj);
                console.log(block_entity);
                let postUrl = fileManageSDK._URLPrefix + "/fileupload/iterUploadPart";
                // let entityRes = await Axios.post(postUrl + '?' + data, block_entity{
                //     header: 'application/octet-stream'
                // })
                let entityRes = await Axios({
                    method: 'post',
                    url: postUrl + '?' + data,
                    headers: { 'Content-Type': 'application/octet-stream' },
                    data: block_entity
                })
            }
            fileManageSDK.overMultipartUpload(file_name , file_size , bucket_id, upload_id, blocks_total, end, '', file_before_md5, file_after_md5, res => {
                let resp = {}
                if (res.code == 200 && res.media_id) {
                    resp.Ret = 0
                    resp.mediaID = res.media_id;
                } else {
                    resp.Ret = -1
                }
                callback(resp)
            })
        }
    },
    download(media_id, previous_flag, attach_name) {
        // debugger
        let url = fileManageSDK._URLPrefix + "/filedownload/getContent";
        var mapObj = new Map();
        mapObj.set("media_id", media_id)
        mapObj.set("previous_flag", previous_flag)
        mapObj.set("attach_name", attach_name)
        var data = fileManageSDK._getDataString(mapObj);
        // window.open(url + "?" + data, '_self');
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url + "?" + data
        link.setAttribute('download', attach_name)
        document.body.appendChild(link)
        link.click()
        // debugger
        // Axios.get(url + "?" + data).then(res => {
        //     window.open
        //     console.log(res);
        // })
    },

}
export default fileManageSDK