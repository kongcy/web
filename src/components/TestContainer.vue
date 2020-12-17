<template>
	<div>
    <!-- <div style="padding: 10px">
      本地:
      <button @click="initLayout">初始化</button>
      <button @click="startPlayLocal(4)">点播4路</button>
      <button @click="startPlayLocal(9)">点播9路</button>
      <button @click="stopAllLocal">停止点播</button>
      <button @click="setOSD">设置字幕样式</button>
      <button @click="cancelOSD">停止字幕样式</button>
      <input type="file" id="selectFile" ref="selectFile" v-for="item in 1" :key="item" @change="e => readFileLocal(e, item)"/>
    </div> -->

    <div style="padding: 10px">
      socket:
      <button @click="initSocket">初始化</button>
      <button @click="startPlaySocket(1)">点播1路</button>
      <button @click="startPlaySocket(2)">2路</button>
      <button @click="startPlaySocket(3)">3路</button>
      <button @click="startPlaySocket(4)">4路</button>
      <button @click="startPlaySocket(6)">6路</button>
      <button @click="startPlaySocket(9)">9路</button>
      <button @click="stopAllSocket">停止点播</button>
      <button @click="setVolume(0, 100)">设置声音</button>
      <button @click="test">测试</button>
    </div>

    <!-- <div style="padding: 10px">
      http:
      <button @click="initLayout">初始化</button>
      <button @click="startPlayHttp(1)">点播1路</button>
      <button @click="startPlayHttp(2)">点播2路</button>
      <button @click="startPlayHttp(4)">点播4路</button>
      <button @click="startPlayHttp(9)">点播9路</button>
      <button @click="stopAllLocal">停止点播</button>
    </div> -->
    
    <div style="padding: 10px">
      分屏:
      <button @click="splitScreen(1)">1</button>
      <button @click="splitScreen(12)">2</button>
      <button @click="splitScreen(4)">4</button>
      <button @click="splitScreen(100)">6</button>
      <button @click="splitScreen(9)">9</button>
      <button @click="splitScreen(15)">12</button>
      <button @click="splitScreen(16)">16</button>
      <button @click="splitScreen(24)">24</button>
      <button @click="splitScreen(32)">32</button>
      <button @click="splitScreen(6)">1+5</button>
      <button @click="splitScreen(8)">1+7</button>
    </div>

    <div id="canvasContainer">
    </div>

    <div>
      <button @click="testWS1()">测试1</button>
      <button @click="testWS2()">测试2</button>
      <button @click="testFn()">bbbbbbbbbbbbbbb</button>
    </div>
  </div> 
</template>
<script>
import {playerSDKNew} from '@/sdk/player/playerSDK'
import axios from 'axios'

//import { Connection, Ping, Message, buildMessage, upload, emotions } from '@/sdk/imSdk/core/index';

export default {
  name: 'TestContainer',
  components: {
  },
  data () {
    return {
      canvasList: [], //id, index, status, data, screen
      screenCount: 0,
      count: 0,
      btnClickCB:null
    }
  },
  mounted(){
    this.startTest()
  },
  methods: {
    initSocket(){
      playerSDKNew.init("canvasContainer", 1200, 800);

      //按钮回调
      playerSDKNew.setPlayerBtnEventCallback((screenIndex, btnKey) => {
        console.log(screenIndex, btnKey)
        if(btnKey == 'Pause'){
          playerSDKNew.isSuspendPlay(screenIndex, true);
        }else if(btnKey == 'Play'){
          playerSDKNew.isSuspendPlay(screenIndex, false);
        }else if(btnKey == 'Nor_StopPlay'){
          playerSDKNew.stopPlay(screenIndex);
        }else if(btnKey == 'Nor_FullScreen'){
          playerSDKNew.setFullScreen(screenIndex, true);
        }
      });
      //业务回调
      playerSDKNew.setPlayerBusinessEventCallback((eventType, result) => {

      });
    },
    //开启
    startPlaySocket(count){
      this.screenCount = count;
      for (let index = 0; index < this.screenCount; index++) {
        let screenIndex = index;
        playerSDKNew.startPlay(screenIndex, 0, 172, "172.16.3.208", 0)   
      }
    },
    //停止所有
    stopAllSocket(){
      playerSDKNew.stopAllPlay();
    },
    // 分屏
    splitScreen(split) {
      playerSDKNew.splitScreen(split);
    },    
    // 设置字幕样式
    setOSD() {
      this.count += 1;
      //webglPlayer.setOSD(this.count, `osd${this.count}`, 'date', '微软雅黑', '200,100,120', 0, 1, 0.03307086614173228, 0.07333333333333333, 4, 18, 0.0111111111118);
    },
    cancelOSD() {
      //webglPlayer.cancelOSD(1, ['osd1'])
    },
    setVolume(screenIndex, vol) {
      playerSDKNew.setVolume(screenIndex, vol);
    },
    test(){
      console.log('test-----------------------')
    },



    //以下两个是js方法
    startTest(){
      this.initSDK(this.btnClick);
    },
    btnClick(cb){
      //点击按钮时触发
      setTimeout(() => {
        //cb('index', 'key');
      }, 5000);
    },


    //以下两个是c++提供的接口
    initSDK(cb){
      //此处是重点，执行回调函数，并传入另一个回调函数作为参数
      //cb(this.btnProcss);
      this.initMedia(cb);
      this.btnCB(this.btnProcss);
    },
    btnProcss(index, key){
      console.log(index, key)
    },




    //以下两个是c++提供的接口
    initMedia(cb){//相当于媒体控制层的init方法，入参是按钮点击回调
      this.btnClickCB = cb//this.btnClickCB成员变量
    },
    btnCB(cb){//相当于媒体控制层的setBtnCB方法，入参是按钮逻辑回调
      this.btnClickCB(cb)//这里是重点
    },

    

    testWS1(){
      var ws = new WebSocket('wss://xtxk.com/websocket_im')
      ws.onopen = function(){console.log('open1-----------------')}
      ws.onerror = function(){console.log('error1-----------------')}
    },
    testWS2(){

      this.initServer().then(() => {
        console.log('error1')
        this.imSdk.connection.connect('caiqiang', 'testpassword', startalkNav.baseaddess.domain, false);
      },  (msg) => {
          console.log('error2', msg)
      });
      
    },
        configCompute(){
          startalkNav.baseaddess.IMBaseURL = 'https://172.16.100.99';
          startalkNav.baseaddess.fileurl = 'https://172.16.100.99';
          startalkNav.baseaddess.xmpp = '172.16.100.99';
          startalkNav.baseaddess.socketurl = 'ws://172.16.100.99:5280/websocket';
        },
        initServer() {
            var _this = this;
            return new Promise((reslove, reject) => {
                // global.startalkNav = {"Login":{"loginType":"password"},"baseaddess":{"simpleapiurl":"http://172.16.100.57:8080","fileurl":"http://172.16.100.57:8080","domain":"qtalk","javaurl":"http://172.16.100.57:8080/package","protobufPcPort":5202,"xmpp":"172.16.100.57","xmppport":5222,"protobufPort":5202,"socketurl":"ws://172.16.100.57:5280/websocket","pubkey":"rsa_public_key","xmppmport":5222,"httpurl":"http://172.16.100.57:8080/newapi","apiurl":"http://172.16.100.57:8080/api","shareurl":"http://172.16.100.57:8080/py/sharemsg","domainhost":"172.16.100.57","appWeb":"http://172.16.100.57:8080/appWeb","resetPwdUrl":"http://172.16.100.57:8080/static/reterievepassword.html"},"imConfig":{"isToC":false,"RsaEncodeType":1,"showOrganizational":true,"mail":"qtalk","foundConfigUrl":"http://172.16.100.57:8080//startalk/management/find/get/navigation"},"ability":{"searchurl":"http://172.16.100.57:8080/py/search","new_searchurl":"http://172.16.100.57:8080/py/search","showmsgstat":true},"RNAndroidAbility":{"RNMineView":true,"RNGroupCardView":true,"RNPublicNumberListView":false,"RNAboutView":false,"RNGroupListView":false,"RNContactView":true,"RNSettingView":true,"RNUserCardView":true},"RNAbility":{"RNMineView":true,"RNGroupCardView":true,"RNPublicNumberListView":true,"RNAboutView":false,"RNGroupListView":true,"RNContactView":true,"RNSettingView":true,"RNUserCardView":true},"version":1};
                // this.configCompute();
                // global.startalkKeys = {"data": {"pub_key_fullkey":"-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCy2VXDAlCZlj7gPHvC/vwvbpTN/GyW0tmNCqh0UPitdTTGZk3UcLqu9lWMGPViL/5lhboiSogsDxJLHdwo91DDBjTX1HbuyuOhvsvayV7Yc8t+ajFW/8RwlvhGSzVplthoU+md9kGeZ8t73VWWZUEB0iyWx7Y/RjUwTdnOlNXDzQIDAQAB-----END PUBLIC KEY-----"}};
                global.startalkNav = {"Login":{"loginType":"password"},"baseaddess":{"simpleapiurl":"http://172.16.100.99:8080","fileurl":"http://172.16.100.99:8080","domain":"qtalk","javaurl":"http://172.16.100.99:8080/package","protobufPcPort":5202,"xmpp":"172.16.100.99","xmppport":5222,"protobufPort":5202,"socketurl":"ws://172.16.100.99:5280/websocket","pubkey":"rsa_public_key","xmppmport":5222,"httpurl":"http://172.16.100.99:8080/newapi","apiurl":"http://172.16.100.99:8080/api","shareurl":"http://172.16.100.99:8080/py/sharemsg","domainhost":"172.16.100.99","appWeb":"http://172.16.100.99:8080/appWeb","resetPwdUrl":"http://172.16.100.99:8080/static/reterievepassword.html"},"imConfig":{"isToC":false,"RsaEncodeType":1,"showOrganizational":true,"mail":"qtalk","foundConfigUrl":"http://172.16.100.99:8080//startalk/management/find/get/navigation"},"ability":{"searchurl":"http://172.16.100.99:8080/py/search","new_searchurl":"http://172.16.100.99:8080/py/search","showmsgstat":true},"RNAndroidAbility":{"RNMineView":true,"RNGroupCardView":true,"RNPublicNumberListView":false,"RNAboutView":false,"RNGroupListView":false,"RNContactView":true,"RNSettingView":true,"RNUserCardView":true},"RNAbility":{"RNMineView":true,"RNGroupCardView":true,"RNPublicNumberListView":true,"RNAboutView":false,"RNGroupListView":true,"RNContactView":true,"RNSettingView":true,"RNUserCardView":true},"version":1}
                this.configCompute();
				global.startalkKeys = {"data": { "pub_key_fullkey": "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCy2VXDAlCZlj7gPHvC/vwvbpTN\n/GyW0tmNCqh0UPitdTTGZk3UcLqu9lWMGPViL/5lhboiSogsDxJLHdwo91DDBjTX\n1HbuyuOhvsvayV7Yc8t+ajFW/8RwlvhGSzVplthoU+md9kGeZ8t73VWWZUEB0iyW\nx7Y/RjUwTdnOlNXDzQIDAQAB\n-----END PUBLIC KEY-----"}}
                import('@/sdk/imSdk/entry').then((res) => {
                    const { baseaddess: {domain, xmpp, xmppmport, fileurl, javaurl, socketurl} = {} } = startalkNav
                    _this.imSdk = new QtalkSDK({
                      debug: false,
                      xmpp:"",
                      // 链接配置
                      connect: {
                        reconnectCount: 10, // 最多重连10次
                        delay: 5000, // 重新连接间隔
                        host: socketurl, // 主机名
                        // port: 80, // 端口
                        path: '' // 路径
                      },
                      maType: 6, // 平台类型web端：6
                      // 20 秒ping一次
                      pingInterval: 20
                    });
                    reslove();
                });
            })
            //reject('IM服务连接错误');
        },
      
      testFn(){
          let httpReq = new XMLHttpRequest();
          var fd = new FormData();
          fd.set('strategyType', 0);
          httpReq.open('post', 'http://172.16.12.19:7070/patrolStrategy/queryList', true);
          httpReq.send(fd);
          httpReq.onreadystatechange = function(){
            if(httpReq.readyState == 4 && httpReq.status == 200){
              console.log("readyState"+httpReq.readyState + "-status:"+httpReq.status)
              console.log(httpReq.response)
            }else{
              console.log('bbbbbbbb',httpReq.status)
            }
          };
      },

  },
}
</script>

<style>
html, body{
  height: 100%;
}
</style>
<style scoped>
#divContainer {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0px auto; 
	padding: 0px; 
  background-attachment: fixed; 
  background-repeat:no-repeat; 
  background-size:cover;
}
</style>