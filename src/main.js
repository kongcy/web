import '@babel/polyfill'
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store/index.js'
import axios from 'axios'
import './assets/common.css'
import './assets/dialog.css'
import './assets/tree.css'
import './assets/popover.css'
import './assets/table.css'
import "@/assets/layout.css";
import common from './common'
import apiSDK from './sdk/apiSDK'
import '@/common/directives' 
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(common)

Vue.prototype.apiSDK = apiSDK
Vue.prototype.$http = axios
console.log('%c当前版本时间:' + new Date(version).formatDate('yyyy-MM-dd HH:mm:ss'), 'color:#ff6a00')
// 获取配置文件方法
const setConfigInstance = () => {
  const configFilePath =  window.location.pathname + `static/config/config.json`
  return axios.create().get(configFilePath).then(res => {
      xtxk.config = res.data
      //初始化sdk配置
      apiSDK.initConfig({
        version       : res.data.version,
        dataURL       : res.data.api.dataURL,
        businessURL   : res.data.api.businessURL,
        strategeURL   : res.data.api.strategeURL,
        electronBlackboardUrl : res.data.api.electronBlackboardUrl,
        pluginVersion : res.data.pluginVersion,
        platformVersion: res.data.platformVersion,   // 0-标准音视频平台 1-互联互通平台
        diagnoseUrl: res.data.api.diagnoseUrl
      });
  })
}
 // 初始化
 setConfigInstance().then(() => {
    // 配置即时通讯服务方法
    new Vue({
        el: '#app',
        store,
        router,
        render: h => h(App)
    })
})




