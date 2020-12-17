<template>
	<div>
    <div id="cesiumContainer" style="height:800px;"></div>
    <div style="float:left;margin-left: 10px; ">
      <br />
      <input type="button" value="开启标注" style="width: 150px; height: 25px" @click="startMark"/>
      <input type="button" value="停止标注" style="width: 150px; height: 25px" @click="endMark"/>
      <input type="button" value="添加标注点" style="width: 150px; height: 25px" @click="addPoints"/>
      <input type="button" value="改变标注点样式" style="width: 150px; height: 25px" @click="changePointsStyle"/>
      <input type="button" value="添加标注线" style="width: 150px; height: 25px" @click="addLines"/>
      <input type="button" value="改变标注线样式" style="width: 150px; height: 25px" @click="changeLinesStyle"/>
      <input type="button" value="删除标注" style="width: 150px; height: 25px" @click="removePointsAndLines"/>
      <input type="button" value="坐标跳转" style="width: 150px; height: 25px" @click="flyTo"/>
    </div>
  </div> 
</template>
<script>
import {WebGIS, PointInfo, PointStyle, LineInfo, LineStyle} from '@/sdk/gis/gisSDK'
import 'cesium/Widgets/widgets.css'
export default {
  name: 'TestContainer',
  components: {
  },
  data () {
    return {
      defaultLongitude: 117,
      defaultLatitude: 40.3,
      defaultHeight: 18000000.0,
      sourceURL: 'http://localhost:8081/static/GISDataWeb'
    }
  },
  mounted(){
    WebGIS.setMouseClickEvent(obj => {
      alert(obj.data);
    });        
    WebGIS.setMarkEvent((x, y) => {
      alert("经度= " + x + ",纬度=" + y);
    });
    WebGIS.init('cesiumContainer', this.sourceURL, this.defaultLongitude, this.defaultLatitude, this.defaultHeight); 
  },
  methods: {
    startMark() {
      var markStyle = new PointStyle();
      markStyle.imageURL = '../../static/gis/marker.png';
      WebGIS.setMarkStyle(markStyle);
      WebGIS.beginMark(); 
    },
    endMark() {
      WebGIS.endMark();
    },
    addPoints(){
      var point = new PointInfo();
      point.id = "AAAA";
      point.longitude = 127.0;
      point.latitude = 45.0;
      point.data = "Hello,world...";
      
      var pointStyle1 = new PointStyle();
      pointStyle1.imageURL = "../../static/gis/1_29.png";
      WebGIS.drawPoint(point, pointStyle1);
      WebGIS.flyTo(point.longitude, point.latitude);
    },
    changePointsStyle() {
      var pointStyle2 = new PointStyle();
      pointStyle2.imageURL = "../../static/gis/1_34.png";
      WebGIS.changePointStyle('AAAA', pointStyle2);
    },
    addLines(){
      let line = new LineInfo();
      line.id = "BBBB";
      line.longitudeStart = -75.0;
      line.latitudeStart = 35.0;
      line.longitudeEnd = -125.0;
      line.latitudeEnd = 35.0;

      let lineStyle1 = new LineStyle();
      lineStyle1.width = 5;
      lineStyle1.colorR = 255;
      lineStyle1.colorG = 0;
      lineStyle1.colorB = 0;
      lineStyle1.colorA = 255; 
      WebGIS.drawLine(line, lineStyle1);
      WebGIS.flyTo(line.longitudeStart, line.latitudeStart);  
    },
    changeLinesStyle() {
      var lineStyle2 = new LineStyle();
      lineStyle2.width = 5;
      lineStyle2.colorR = 0;
      lineStyle2.colorG = 255;
      lineStyle2.colorB = 0;
      lineStyle2.colorA = 255;
      WebGIS.changeLineStyle('BBBB', lineStyle2);
    },
    removePointsAndLines(){ 
      WebGIS.removeAll(); 
    },
    flyTo(){ 
      WebGIS.flyTo(135.0, 50.0); 
    }
  },
}
</script>

<style>
html, body{
  height: 100%;
}
</style>
<style scoped>

</style>