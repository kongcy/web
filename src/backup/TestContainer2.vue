<template>
	<div>
    <div style="padding: 10px">
      本地:
      <button @click="initLayout">初始化</button>
      <button @click="startPlayLocal(1)">点播1路</button>
      <button @click="startPlayLocal(4)">点播4路</button>
      <button @click="startPlayLocal(9)">点播9路</button>
      <button @click="stopAllLocal">停止点播</button>
      <!-- <br> -->
      <input type="file" id="selectFile" ref="selectFile" v-for="item in 1" :key="item" @change="e => readFileLocal(e, item)"/>
    </div>

    <div style="padding: 10px">
      socket:
      <!-- <input type="file" id="selectFile" ref="selectFile" @change="readFile"/> -->
      <button @click="initSocket">初始化</button>
      <button @click="startPlaySocket(1)">点播1路</button>
      <button @click="startPlaySocket(4)">点播4路</button>
      <button @click="startPlaySocket(9)">点播9路</button>
      <button @click="stopAllSocket">停止点播</button>
    </div>

    <div style="padding: 10px">
      http:
      <!-- <input type="file" id="selectFile" ref="selectFile" @change="readFile"/> -->
      <button @click="initLayout">初始化</button>
      <button @click="startPlayHttp(1)">点播1路</button>
      <button @click="startPlayHttp(2)">点播2路</button>
      <button @click="startPlayHttp(4)">点播4路</button>
      <button @click="startPlayHttp(9)">点播9路</button>
      <button @click="stopAllLocal">停止点播</button>
    </div>
    
    <div style="padding: 10px">
      分屏:
      <button @click="splitScreen(1)">1</button>
      <button @click="splitScreen(2)">2</button>
      <button @click="splitScreen(4)">4</button>
      <button @click="splitScreen(6)">6</button>
      <button @click="splitScreen(9)">9</button>
      <button @click="splitScreen(12)">12</button>
      <button @click="splitScreen(16)">16</button>
      <button @click="splitScreen(24)">24</button>
      <button @click="splitScreen(32)">32</button>
      <button @click="splitScreen(5)">1+5</button>
      <button @click="splitScreen(8)">1+7</button>
    </div>

    <div id="canvasContainer">
    </div>
  </div> 
</template>
<script>
import {businessSDKC, businessSDKD} from '@/sdk/player/lib/businessSDK'
import {webglPlayer} from '@/sdk/player/lib/webglPlayer'
export default {
  name: 'HomeContainer',
  components: {
  },
  data () {
    return {
      canvasList: [], //id, index, status, data, screen
      screenCount: 0,
    }
  },
  mounted(){
    let reader = new FileReader();
    let data_buffer, data_uint8, headBuffer, headParams16, headParams32;
    let formatBuffer, format, widthBuffer, width, heightBuffer, height, screenIndexBuffer, screenIndex, frameIndex;

    businessSDKD.setReceiveMediaDataCallback(res => {
      data_uint8 = new Uint8ClampedArray(res, 10);
      headParams16 = new Int16Array(res, 0, 10);
      format = headParams16[0], width = headParams16[1], height = headParams16[2], screenIndex = headParams16[3], frameIndex = headParams16[4];
      console.log("format:"+headParams16[0]+"--width:"+headParams16[1]+"--height:"+headParams16[2]+"--screenIndex:"+headParams16[3]  +"--frameIndex:"+headParams16[4]);
      if(frameIndex != 0){//拆包

      }
      webglPlayer.refreshDataByIndex(screenIndex, data_uint8, width, height);
      data_uint8.length = 0;
      data_uint8 = null;
      headParams16.length = 0;
      headParams16 = null;
      return;




      reader.readAsArrayBuffer(res);
      reader.onload = function(e){
        data_buffer   = e.target.result;
        //console.log(data_buffer)
        //data_uint8    = new Uint8Array(data_buffer);
        data_uint8    = new Uint8ClampedArray(data_buffer);
        
        // formatBuffer  = new Uint8Array(data_uint8.subarray(0, 4)).buffer;
        // format        = new Int16Array(formatBuffer)[0];
        // widthBuffer   = new Uint8Array(data_uint8.subarray(4, 6)).buffer;
        // width         = new Int16Array(widthBuffer)[0];
        // heightBuffer  = new Uint8Array(data_uint8.subarray(6, 8)).buffer;
        // height        = new Int16Array(heightBuffer)[0];
        // screenIndexBuffer = new Uint8Array(data_uint8.subarray(8, 12)).buffer;
        // screenIndex   = new Int16Array(screenIndexBuffer)[0];
        // console.log("format:"+format+"--width:"+width+"--height:"+height+"--index:"+screenIndex)
        //console.log("--index:"+screenIndex)
        headBuffer = new Uint8ClampedArray(data_uint8.subarray(0, 10));
        headParams16 = new Int16Array(headBuffer.buffer);
        //headParams32 = new Int32Array(headBuffer.buffer);
        console.log("format:"+headParams16[0]+"--width:"+headParams16[1]+"--height:"+headParams16[2]+"--index:"+headParams16[3]  +"--index:"+headParams16[4]);
        //webglPlayer.refreshDataByIndex(headParams16[3], data_uint8.subarray(8), headParams16[1], headParams16[2]);
      };
      reader.onerror = function(e){
        console.log(e)
      };
      reader.onloadend = function(){
        res.length = 0;
        data_buffer.length = 0;
        data_uint8.length = 0;
        formatBuffer.length = 0;
        format.length = 0;
        widthBuffer.length = 0;
        width.length = 0;
        heightBuffer.length = 0;
        height.length = 0;
        screenIndexBuffer.length = 0;
        screenIndex.length = 0;
        headBuffer.length = 0;
        headParams16.length = 0;
        headParams32.length = 0;
      };
    });
  },
  methods: {
    initLayout(){
      webglPlayer.init("canvasContainer", 1920, 1080)
    },
    initSocket(){
      this.initLayout();

      let url1 = "ws://127.0.0.1:4443";
      businessSDKC.initScoket(url1, function(){
        businessSDKC.initServer();
      });

      let url2= "ws://127.0.0.1:4444";
      businessSDKD.initScoket(url2, function(){
        
      });
    },
    //开启
    startPlaySocket(count){
      this.screenCount = count;
      for (let index = 0; index < this.screenCount; index++) {
        let screenIndex = index;
        businessSDKC.startPlay(screenIndex);
        webglPlayer.startShow(screenIndex, "resId", "resName", "User");        
      }
    },
    startPlayLocal(count){
      this.screenCount = count;
      // for (let index = 1; index < this.screenCount; index++) {
      //   //this.canvasList[index] = this.canvasList[0];
      //   Object.assign(this.canvasList[index], this.canvasList[0])
      //   this.canvasList[index].index = index;
      // }

      for (let index = 0; index < this.screenCount; index++) {
        let screenIndex = index;
        //let screenItem = this.canvasList.find(it => it.index == screenIndex);
        let screenItem = this.canvasList.find(it => it.index == 0);
        if(!screenItem) continue;

        webglPlayer.startShow(screenIndex);

        let data = screenItem.data;
        let width = screenItem.width;
        let height = screenItem.height;
        let speed = screenItem.speed;

        let frameItemSize = width*height*3/2; // 一帧的大小
        let frameCount = data.length/frameItemSize; // 总帧数
        let freshTime = parseInt(1000/speed); // 每隔多少毫秒渲染一帧
        let curFrame = 0; // 当前第几帧
        let interval = setInterval(() => {
            webglPlayer.refreshDataByIndex(screenIndex, data.subarray(curFrame*frameItemSize, (curFrame+1)*frameItemSize), width, height);
            curFrame++;
            if(curFrame >= frameCount){
                clearInterval(interval);
            }
        }, freshTime);
      }
    },
    startPlayHttp(count){
      this.screenCount = count;

      let data_buffer, data_uint8;
      let width = 1920, height = 1080, speed = 10;
      let freshTime = parseInt(1000/speed); // 每隔多少毫秒渲染一帧

      let reader = new FileReader();

      for (let index = 0; index < this.screenCount; index++) {
        let screenIndex = index;
        webglPlayer.startShow(screenIndex, "resId", "resName", "User");
        let httpReq = new XMLHttpRequest();
        //let reader = new FileReader();
        let times = 1;

        setInterval(() => {
          getFileFromHttp(screenIndex, httpReq, reader, times);
          times++;
          if(times > 90) times = 1;
        }, freshTime);
      }

      function getFileFromHttp(screenIndex, httpReq, reader, times){
        httpReq.open('GET', 'http://localhost:8080/static/yuv/test'+times+'.yuv', true);
        //httpReq.setRequestHeader("Access-Control-Allow-Origin", "*")
        httpReq.responseType = "blob";
        httpReq.send();
        httpReq.onreadystatechange = function(){
          if(httpReq.readyState == 4 && httpReq.status == 200){
            console.log("readyState"+httpReq.readyState + "-status:"+httpReq.status)
            console.log(httpReq.response)
            
            let resp = httpReq.response;

            reader.readAsArrayBuffer(resp);
            reader.onload = function(e){
              data_buffer   = e.target.result;
              data_uint8    = new Uint8Array(data_buffer);
              //console.log("screenIndex"+screenIndex)
              webglPlayer.refreshDataByIndex(screenIndex, data_uint8, width, height);
            };
            reader.onloadend = function(){
              resp.length = 0;
              data_buffer.length = 0;
              data_uint8.length = 0;
            };
            reader.onerror = function(){
              console.log("error")
            }
          }
        };
      }
    },
    //停止
    stopAllSocket(){
      for (let index = 0; index < this.screenCount; index++) {
        let screenIndex = index;
        businessSDKC.stopPlay(screenIndex);
      }
      webglPlayer.stopAllShow();
    },
    stopAllLocal(){
      webglPlayer.stopAllShow();
    },
    // 分屏
    splitScreen(split) {
      webglPlayer.splitScreen(split);
    },
    //从本地读文件
    readFileLocal(e, index){
      //let width = 352, height = 288, speed = 25;
      let width = 1920, height = 1080, speed = 25;
      
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsArrayBuffer(file)
      let self = this;
      let itemData;
      reader.onload = function(e){
        let data = e.target.result;
        itemData = {
          width: width,
          height: height,
          speed: speed,
          data: new Uint8Array(data),
        };
        itemData.index = index - 1;
        self.canvasList.push(itemData);
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