import Axios from 'axios'
import MD5 from './md5'
var fileManageSDK = {
    _URLPrefix: '',
    maxSize: 3 * 1024 * 1024,
    /**
     * [setURLPrefix 设置url]
     * @param {[type]} url [description]
     */
    setURLPrefix(url) {
        fileManageSDK._URLPrefix = url + "/openvone/recordvod-play-system/api/v1";
    },
    /**
     * [upload 分片上传 页面调用上传接口]
     * @param  {[type]}   file_name   [文件名]
     * @param  {[type]}   file_size   [文件大小(byte)]
     * @param  {[type]}   file        [文件]
     * @param  {[type]}   file_before [文件前60位md5]
     * @param  {[type]}   file_after  [文件后60位md5]
     * @param  {Function} callback    [description]
     */
    async upload(file_name, file_size, file, file_before, file_after, processCallback, callback) {
        let file_before_md5 = MD5(file_before);
        let file_after_md5 = MD5(file_after);
        let blocks_total = Math.ceil(file_size/fileManageSDK.maxSize);
        let bucket_id ='';
        let upload_id = '';
        // 开始分片上传
        let startParams = `file_name=${file_name}&file_size=${file_size}&file_before_md5=${file_before_md5}&file_after_md5=${file_after_md5}`;
        Axios.get(fileManageSDK._URLPrefix + "/fileupload/createMultipartUpload" + '?' + startParams).then(async res => {
            res = res.data;
            if (res.code == 200) {
                bucket_id = res.bucket_id
                upload_id = res.upload_id
                // [[循环单片上传
                for (let i = 0; i < blocks_total; i++) {
                    processCallback(Math.round(i / blocks_total * 10000) / 100.00);
                    // 分片
                    var start = i * fileManageSDK.maxSize; // 开始
                    var end = Math.min(file_size, start + fileManageSDK.maxSize); // 结束
                    let itemParams = `file_name=${file_name}&file_size=${file_size}&bucket_id=${bucket_id}&upload_id=${upload_id}&part_number=${i}&blocks_total=${blocks_total}&block_size=${end}`;
                    let itemURI = fileManageSDK._URLPrefix + "/fileupload/iterUploadPart";
                    var block_entity = file.slice(start, end);

                    await Axios({
                        method: 'post',
                        url: itemURI + '?' + itemParams,
                        headers: { 'Content-Type': 'application/octet-stream' },
                        data: block_entity
                    }).catch(error => {
                        let resp = {Ret: -1};
                        callback(resp)
                    })
                }
                processCallback(100);
                // 分片上传结束]]
                let overParams = `file_name=${file_name}&file_size=${file_size}&bucket_id=${bucket_id}&upload_id=${upload_id}&blocks_total=${blocks_total}&block_size=${end}&notify_url=''&file_before_md5=${file_before_md5}&file_after_md5=${file_after_md5}`;
                let overURI = fileManageSDK._URLPrefix + "/fileupload/overMultipartUpload?" + overParams;
                Axios.get(overURI).then(res => {
                    let resp = {}
                    if (res.data.code == 200 && res.data.media_id) {
                        resp.Ret = 0
                        resp.mediaID = res.data.media_id;
                    } else {
                        resp.Ret = -1
                    }
                    callback(resp)
                })
            }
        }).catch(error => {
            let resp = {Ret: -1};
            callback(resp)
        });
    },
    /**
     * [download 下载]
     * @param  {[type]} media_id      [description]
     * @param  {[type]} previous_flag [description]
     * @param  {[type]} attach_name   [description]
     */
    download(media_id, previous_flag, attach_name) {
        let url = fileManageSDK._URLPrefix + "/filedownload/getContent";
        let params = `media_id=${media_id}&previous_flag=${previous_flag}&attach_name=${attach_name}`
        let openwin = window.open(url + "?" + params);
    },
}
export default fileManageSDK