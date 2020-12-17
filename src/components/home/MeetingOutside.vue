<template>
  <div id="divContainer" :style="mainStyle">
        <iframe :src="url" frameborder="0" style="width:100%;height:100%;"></iframe>
  </div>
</template>

<script>
import ImageNav from "@/components/home/layout/ImageNav.vue";
import Fun from "@/common/fun";
import Enum from "@/common/enum";

export default {
  name: "HomeContainer",
  components: {
    ImageNav,
    
  },
  props:['data'],
  data() {
    return {
      url:this.data.tourl,
      mainStyle:'',
      
    }
  },
  mounted() {
    const self = this;
    //渲染页面
    this.initLayout();
    // 事件
    window.addEventListener("resize", this.resize);
  },
  methods: {
   
    //窗口大小变动
    resize() {
      let self = this;
      self.initLayout();
    },
    //初始化布局
    initLayout() {
      var screenWidth = document.body.clientWidth;
      // var screenWidth        = window.screen.width;
      var screenHeight = document.body.clientHeight;
      var headerWidth = screenWidth;
       var headerHeight = 72;
      var mainWidth = screenWidth;
      var mainHeight = screenHeight - headerHeight;
      this.mainStyle ="width:" + mainWidth + "px" + ";height:" + mainHeight + "px";
    },

  },
  destroyed: function() {
    //注销事件
    window.removeEventListener("resize", this.resize);
  },
 };
</script>

<style scoped>
#divContainer {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  margin: 0px auto;
  padding: 0px;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
}
#divHeader {
  padding: 0px;
  margin: 0px;
}
#divFooter {
  padding: 0px;
  margin: 0px;
  color: #ffffff;
  background: #0f5794;
  /* height: 5px !important; */
  /* position: absolute; */
  /* bottom: 0; */
}
#divMain {
  padding: 0px;
  margin: 0px;
  /* position: absolute; */
  /* height: calc(100% - 65px) !important; */
  overflow: hidden;
}
#divImageContent {
  float: left;
  padding: 0px;
  margin: 0px;
  height: 100%;
  width: calc(100% - 302px);
  position: relative;
}
#divImageContent,
#divImageContent > div {
  /*height: 100% !important;*/
  background-color: #dbf0fe;
}
#divImageOperate,
#divImageNav {
  width: 40px !important;
}
#divImageNav {
  float: left;
  padding: 0px;
  margin: 0px;
}
div > div#divImageContent > div#divImageShow {
  float: left;
  padding: 0px;
  margin: 0px;
  /* zld 调整插件自适应所改 */
  /* height: 100% !important; */
  width: calc(100% - 84px) !important;
  border: 1px solid #358bd5;
  border-top: none;
  border-bottom: none;
}
#divImageFooter {
  padding: 0px;
  margin: 0px;
  color: #fff;
}
#divImageOperate {
  float: right;
  padding: 0px;
  margin: 0px;
}
#divResourceArea {
  float: left;
  padding: 0px;
  margin: 0px;
  height: 100% !important;
}

.footerMenu{
  position:absolute;
  left: 40px;
  bottom: 0;
  border: 1px solid #c2dff3 ;
}
</style>