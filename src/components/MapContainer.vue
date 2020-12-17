<template>
  <div class="map_container">
    <div class="left_menu">
      <div class="bottom">
        <button class="alarm_btn btn" @click="$refs.alarmMessageDialog.showDialog()"></button>
      </div>
    </div>
    <map-panel ref="mapPanel" @markPointClick="markPointClick" />
    <resource-widget
      ref="resourceWidget"
      @openAlarmMessageDialog="openAlarmMessageDialog"
      @openMediaDialog="openMediaDialog"
      @organizationNodeClick="organizationNodeClick"
    ></resource-widget>
    <alarm-message-dialog ref="alarmMessageDialog"></alarm-message-dialog>
    <media-dialog ref="mediaDialog"></media-dialog>
  </div>
</template>

<script>
import MapPanel from "@/components/map/MapPanel.vue";
import ResourceWidget from "@/components/map/ResourceWidget";
import AlarmMessageDialog from "@/components/map/AlarmMessageDialog";
import MediaDialog from "@/components/map/MediaDialog";
import Enum from "@/common/enum";
import "@/assets/map.css";
export default {
  name: "HomeContainer",
  components: {
    MapPanel,
    ResourceWidget,
    AlarmMessageDialog,
    MediaDialog
  },
  data() {
    return {
      
    };
  },
  mounted: function() {
    const self = this;

    //在其它页面刷新后再进入本页面时执行，此时socket已连接
    if (this.apiSDK.socketStatus != -1) {
      //资源树
      self.$refs.resourceWidget.initTree();
      //插件
      self.$refs.mediaDialog.initMXTC(100, 100);
    }

    //socket状态
    this.apiSDK.setSocketReconnectCallback("main", function(obj) {
      if (obj.state == -1) {
        //断开
        self.$refs.resourceWidget.offline();
        self.apiSDK.stopPlayAllForPlugin();
      } else if (obj.state == 2) {
        //重连
        //资源树
        self.$refs.resourceWidget.initTree();
      } else if (obj.state == 1) {
        //首次
        //资源树
        self.$refs.resourceWidget.initTree();
        //插件
        self.$refs.mediaDialog.initMXTC(100, 100);
      }
    });

    //告警时的事件处理
    this.$root.$on('alarmEvent', (data) => {
      //console.log('on------------------', data)
      //1、地图图标变红；2、树节点标红
      this.$refs.mapPanel && this.$refs.mapPanel.changePoint(data.locationId);
      this.$refs.resourceWidget && this.$refs.resourceWidget.setDeviceAlarmStatusByTip(data.locationId, data.deviceId);
    })

    // 事件
    window.addEventListener("resize", this.resize);
  },
  methods: {
    organizationNodeClick(data) {
      this.$refs.mapPanel.flyTo(data.id);
    },
    markPointClick(data) {
      this.$refs.resourceWidget.setOrgaCurrentNode(data.id);
      this.$refs.resourceWidget.orgaNodeClick(data);
    },
    openAlarmMessageDialog(data) {
      this.$refs.alarmMessageDialog.showDialog(data);
    },
    openMediaDialog(data) {
      this.$refs.mediaDialog.showDialog(data);
    },

    // 分时防抖函数
    debounce(event, time) {
      let timer = null;
      return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          event.apply(this, args);
        }, time);
      };
    },
    resize() {
      this.$refs.resourceWidget.setTreeHeight();
      this.$refs.mediaDialog.resize();
    }
  },
  destroyed: function() {
    //注销事件
    window.removeEventListener("resize", this.resize);
  },
  beforeRouteLeave(to, from, next) {
    //取消订阅
    var subscribeType = Enum.enumSubscribeType.map;
    const subIDs = new Array(
      subscribeType.subscribeOrganizationUser,
      subscribeType.subscribeUsersStatus,
      subscribeType.subscribeOrganizationDevice,
      subscribeType.subscribeDevicesStatus
    );
    this.apiSDK.cancelSubscribeResourceStatus(subIDs.join(","), "all");
    //停止所有业务
    this.apiSDK.stopAll();
    //注销插件
    //this.apiSDK.unInitMXTC();
    next();
  }
};
</script>
