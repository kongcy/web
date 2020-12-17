/**
 * [getUserMedia 获取用户媒体]
 * @param  {[object]} constraints     [媒体类型]
 * @param  {[function]} successCallback [调用成功回调]
 * @param  {[function]} errorCallback   [调用失败回调]
 */
const getUserMedia = function (constraints, successCallback, errorCallback) {
	if (navigator.mediaDevices.getUserMedia) {
        //最新的标准API
        navigator.mediaDevices.getUserMedia(constraints).then(successCallback).catch(errorCallback);
  	} else if (navigator.webkitGetUserMedia) {
        //webkit核心浏览器
        navigator.webkitGetUserMedia(constraints,successCallback, errorCallback)
  	} else if (navigator.mozGetUserMedia) {
        //firfox浏览器
        navigator.mozGetUserMedia(constraints, successCallback, errorCallback)
  	} else if (navigator.getUserMedia) {
        //旧版API
        navigator.getUserMedia(constraints, successCallback, errorCallback)
  	} else {
  		this.$message('浏览器不支持访问用户媒体');
  	}
}

/**
 * [getStreamUrl 兼容获取流文件]
 * @param  {[type]} stream [视频流]
 * @return {[type]}        [description]
 */
const getStreamUrl = function(stream) {
	//兼容webkit核心浏览器
    let CompatibleURL = window.URL || window.webkitURL
    let streamUrl = CompatibleURL.createObjectURL(stream)
    return streamUrl
}

/**
 * [setDialogTop 设置弹框垂直居中]
 * @param {[string]} val [弹框title]
 */
const setDialogTop = function(title) {
    let $dialog = document.querySelectorAll(`[aria-label=${title}]`);
    let top = 0;
    if ($dialog.length > 1) {
      [].forEach.call($dialog, (item) => {
        top = (document.body.clientHeight - item.offsetHeight);
        top = top > 0 ? top/2 : 50;
        item.style.marginTop = `${top}px`;
      });
      // debugger
    } else {
      top = (document.body.clientHeight - $dialog[0].offsetHeight);
      top = top > 0 ? top/2 : 50;
      //console.log(document.body.clientHeight + "--" +$dialog[0].offsetHeight+"--"+top)
      $dialog[0].style.marginTop = `${top}px`;
    }
    
}

export default { getUserMedia, getStreamUrl, setDialogTop }