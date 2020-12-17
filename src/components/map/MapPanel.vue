<template>
  <!-- <div>
  <button @click="setZoom">setZoom</button> -->
  <div style="height: 100%;margin-left: 40px;">
    <div id="cesiumContainer" style="height: 100%;"></div>
  </div>
  <!-- </div> -->
</template>

<script>
  import Fun from '@/common/fun';
  import {WebGIS, PointInfo, PointStyle, LineInfo, LineStyle} from '@/sdk/gis/gisSDK'
  import 'cesium/Widgets/widgets.css'

import pointImg from "../../../static/map/dept_green.png"
import pointHoverImg from "../../../static/map/dept_yellow.png"
import alarmImg from "../../../static/map/alarm_mid.png"

  export default {
    name: 'MapPanel',
    data () {
      return {
        cartographic: null,
        provincialDataShow: false,
      }
    },
    mounted:function () {
      // 地图点击反馈
      WebGIS.setMouseClickEvent(obj => {
        //console.log('点击事件' + obj);
        this.cartographic.longitude = obj.longitude;
        this.cartographic.latitude = obj.latitude;
        this.$emit('markPointClick', obj);
        this.$store.commit("setCartographic", this.cartographic);
      });
      // 地图层级高度反馈
      WebGIS.setZoomCallback(obj => {
        //console.log('层级' + obj);
        this.cartographic.height = obj.height;
        if (obj.level === 1) {
          if (!this.provincialDataShow) {
            //this.queryDirectoryGISList();
            this.provincialDataShow = true;
          }
        }
      });
      this.initWebGis();
      this.queryDirectoryGISList();
    },
    methods: {
      // 地图初始化
      initWebGis() {
        this.cartographic = this.$store.getters.getCartographic;
        let longitude = this.cartographic && this.cartographic.longitude || 117;
        let latitude = this.cartographic && this.cartographic.latitude || 40.3;
        let height = this.cartographic && this.cartographic.height || 18000000.0;
        WebGIS.init('cesiumContainer', xtxk.config.api.mapURL, longitude, latitude, height);
      },
      queryDirectoryGISList() {
        this.apiSDK.queryDirectoryGISList(res => {
          if (res.Ret === 0) {
            let data = res.data;
            data && data.forEach(item => {
              this.addPoint(item);
            });
          }
        });
      },
      addPoint(obj) {
        let point = new PointInfo();
        //point.id = obj.directoryID;
        point.id = obj.bindID;
        point.longitude = obj.longitude;
        point.latitude = obj.latitude;
        point.name = obj.directoryName;
        
        let pointStyle = new PointStyle();
        pointStyle.imageURL = pointImg;

        var pointHoverStyle = new PointStyle();
        pointHoverStyle.imageURL = pointHoverImg;

        WebGIS.drawPoint(point, pointStyle, pointHoverStyle);
      },
      changePoint(id) {
        var pointStyle = new PointStyle();
        pointStyle.imageURL = alarmImg;
        WebGIS.changePointStyle(id, pointStyle);
      },
      flyTo(id) {
        let map = WebGIS._pointInfos;
        if (map.size > 0) {
          let entries = [...map].filter(([k, v]) => k === 'p_' + id);
          // console.log(entries);
          if (entries.length > 0) {
            let longitude = entries[0][1].longitude;
            let latitude = entries[0][1].latitude;

            if (typeof(longitude) === 'number' && typeof(latitude) === 'number') {
              WebGIS.flyTo(longitude, latitude);
            }
          }
        }
      },
    }
  }
</script>