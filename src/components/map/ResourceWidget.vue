<template>
  <div>
    <el-collapse v-model="collapse">
      <el-collapse-item title="组织机构" name="1" class="resource_widget" id="resourceWidget">
        <!-- <div class="directory_level">
		    		<div class="title">目录层级</div>
		          	<el-radio-group v-model="dirLevelValue" @change="dirLevelChange">
			            <el-radio v-for="item in dirLevelType" :key="item.key" :label="item.value">{{item.label}}</el-radio>
		          	</el-radio-group>
        </div>-->
        <el-tree
          ref="organization_tree"
          :style="'height:'+ treeHeight + 'px;overflow:auto;'"
          :data="organizationData"
          :props="props"
          :render-content="renderContent"
          :expand-on-click-node="false"
          current-node-key
          default-expand-all
          node-key="id"
          highlight-current
          @node-click="orgaNodeClick"
          @node-contextmenu="nodeRightClick"
        >
          <!-- :default-expanded-keys="expandedNodes" -->
        </el-tree>
        <!-- <div class="organization_name">资源【{{currentOrga.name}}】</div> -->
        <el-tabs v-model="activeTab" stretch>
          <el-tab-pane label="监控" name="first">
            <el-tree
              ref="device_tree"
              :style="'height:'+ treeHeight + 'px;overflow:auto;'"
              :data="deviceData"
              :props="props"
              :render-content="renderContent"
              current-node-key
              node-key="id"
              @node-click="resourceNodeClick"
              @node-contextmenu="nodeRightClick"
            ></el-tree>
          </el-tab-pane>
          <el-tab-pane label="人员" name="second">
            <el-tree
              ref="user_tree"
              :style="'height:'+ treeHeight + 'px;overflow:auto;'"
              :data="userData"
              :props="props"
              :render-content="renderContent"
              node-key="id"
              @node-click="resourceNodeClick"
              @node-contextmenu="nodeRightClick"
            ></el-tree>
          </el-tab-pane>
        </el-tabs>
        <!-- <div class="resource_oprate">
		    		<el-select placeholder="请选择" v-model="staus" style="width: 80px;">
					    <el-option v-for="item in resourceStatus" :key="item.key" :label="item.label" :value="item.value"></el-option>
					</el-select>
		    		<button class="btn_play"></button>
		    		<button class="btn_call"></button>
        </div>-->
      </el-collapse-item>
    </el-collapse>
    <tree-right-menu
      ref="treeRightMenu"
      @openAlarmMessageDialog="openAlarmMessageDialog"
      @openMediaDialog="openMediaDialog"
    ></tree-right-menu>
  </div>
</template>
<script>
import TreeRightMenu from "./TreeRightMenu";
import Enum from "@/common/enum";
import Fun from "@/common/fun";
export default {
  name: "ResourceWidget",
  components: {
    TreeRightMenu
  },
  data() {
    return {
      collapse: "0",
      activeTab: "first",
      dirLevelValue: "",
      dirLevelType: [
        { label: "1级", value: 1 },
        { label: "2级", value: 2 },
        { label: "3级", value: 3 },
        { label: "4级", value: 4 }
      ],
      // currentOrga: {},
      currentResource: {},
      organizationData: [],
      props: {
        label: "name",
        children: "children",
        isLeaf: "leaf"
      },
      userData: [],
      deviceData: [],
      treeHeight: null,
      expandedNodes: [],
      staus: "0",
      resourceStatus: [
        { label: "全部", value: "0" },
        { label: "在线", value: "1" },
        { label: "告警", value: "2" },
        { label: "离线", value: "3" }
      ]
      // alarmDevice: null
    };
  },
  mounted() {
    this.setTreeHeight();
  },
  methods: {
    initTree: function() {
      this.$nextTick(() => {
        const self = this;
        const organId = "";
        let subjectId = 0;
        //订阅用户组织结构
        this.apiSDK.getOrganizationUser(organId, Enum.enumSubscribeType.map.subscribeOrganizationUser, subjectId,
          obj => {
            if (obj && obj.rows) {
              if (obj.subscribeId == Enum.enumSubscribeType.map.subscribeOrganizationUser) {
                this.organizationData = [];
                this.organizationData = Fun._initDepartmentTreeData(obj.rows);
                //默认展开一级节点
                this.organizationData.forEach(item => {
                  this.expandedNodes.push(item.nodeId);
                });
              }
            }
          }
        );
        // 资源状态回调
        this.apiSDK.setReceiveResourceStatusQueryCallback("map", obj => {
          // console.log('获取资源：'+ JSON.stringify(obj));
          if (obj && obj.nodes) {
            let subscribeId = obj.subscribeId;
            let list = obj.nodes;
            // var list = this.resourcesFormat(obj.nodes);
            if (subscribeId === Enum.enumSubscribeType.map.subscribeUsersStatus) {
              if (obj.operate === "init") {
                Fun._appendPersonTreeData(this.$refs.user_tree, list);
              } else if (obj.operate === "add") {
                Fun._appendPersonTreeData(this.$refs.user_tree, list);
              } else if (obj.operate === "remove") {
                Fun._removePersonTreeData(this.$refs.user_tree, list);
              } else if (obj.operate === "refresh") {
                Fun._refreshPersonTreeData(this.$refs.user_tree, list);
              }
            } else if (subscribeId === Enum.enumSubscribeType.map.subscribeDevicesStatus) {
              if (obj.operate === "init") {
                // this.deviceData = Fun._initDeviceTreeData(list);
                Fun._appendDeviceTreeData(this.$refs.device_tree, list);
              } else if (obj.operate === "add") {
                Fun._appendDeviceTreeData(this.$refs.device_tree, list);
              } else if (obj.operate === "remove") {
                Fun._removeDeviceTreeData(this.$refs.device_tree, list);
              } else if (obj.operate === "refresh") {
                Fun._refreshDeviceTreeData(this.$refs.device_tree, list);
              }
            }
          }
        });
      });
    },
    //设置告警标示
    setDeviceAlarmStatusByTip(departId, deviceId) {
      //标示部门
      let orgDataArr = Fun.transformTreeToArray(this.organizationData);
      let index = orgDataArr.findIndex(item => item.id === departId);
      if(index > -1) orgDataArr[index].alarm = true;
      //标示设备
      let dIndex = this.deviceData.findIndex(item => item.id === deviceId);
      if(dIndex > -1) this.deviceData[dIndex].alarm = true;
    },
    setDeviceAlarmStatusByClick(data){
        let departId = data.id
        setTimeout(() => {
          // 点击部门，设备资源返回后，再调  获取部门下未读告警设备接口
          this.apiSDK.queryResourceReaded(departId, res => {
            if (res.responseCode && res.responseCode == 0 && res.data && res.data.length > 0) {
              data.alarm = true;
              res.data.forEach(dataItem => {              
                let dIndex = this.deviceData.findIndex(item => item.id == dataItem.deviceID);
                this.deviceData[dIndex].alarm = true;
              });
            } else {
              data.alarm = false;
            }
          });
        }, 1000);
    },
    offline() {},
    // 获取树的高度
    setTreeHeight() {
      this.treeHeight = (document.querySelector("body").offsetHeight - 140) / 2;
    },
    dirLevelChange() {},
    setOrgaCurrentNode(id) {
      this.collapse = "1";
      let arrayData = Fun.transformTreeToArray(this.organizationData);
      let index = arrayData.findIndex(item => item.id === id);
      if (index !== -1) {
        this.$refs.organization_tree.setCurrentKey(id);
      } else {
        this.$refs.organization_tree.setCurrentKey(null);
      }
    },
    orgaNodeClick(data) {
      this.$emit("organizationNodeClick", data);
      // this.currentOrga = data;
      this.subscribeResource(data);
    },
    // 订阅资源
    subscribeResource(data) {
      this.userData = [];
      this.deviceData = [];
      let organId = data.id
      // 订阅设备
      this.apiSDK.subscribeDeviceStatus(
        organId,
        Enum.enumSubscribeType.map.subscribeDevicesStatus
      );
      // 订阅用户
      this.apiSDK.subscribeUserStatus(
        organId,
        Enum.enumSubscribeType.map.subscribeUsersStatus
      );

      this.setDeviceAlarmStatusByClick(data)
    },
    nodeRightClick(event, data, node, tree) {
      this.$refs.treeRightMenu.showRightMenu(event, data);
    },
    //单击事件--实现双击
    resourceNodeClick(data, node, tree) {
      //console.log(node.data)
      if (
        this.currentResource.id == data.id &&
        new Date().getTime() - this.currentResource.time < 250
      ) {
        if (data.nodeStatus == "person_online") {
          this.openMediaDialog(data);
          // Fun.startPlayPerson(this, data);
        } else if (data.nodeStatus == "person_playing") {
          Fun.stopPlayPerson(this.apiSDK, data);
        } else if (data.nodeStatus == "person_offline") {
          this.showremind("点播提示", "人员不在线，不允许点播！");
        } else if (data.nodeStatus == "person_fault") {
          this.showremind("点播提示", "人员绑定设备异常，不允许点播！");
        } else if (data.nodeStatus == "device_online") {
          this.openMediaDialog(data);
          // Fun.startPlayDevice(this, data);
        } else if (data.nodeStatus == "device_playing") {
          Fun.stopPlayDevice(this.apiSDK, data);
        } else if (data.nodeStatus == "device_offline") {
          this.showremind("点播提示", "设备不在线，不允许点播！");
        } else if (data.nodeStatus == "virtual_online") {
          this.openMediaDialog(data);
          // Fun.startPlayDevice(this, data);
        } else if (data.nodeStatus == "virtual_playing") {
          Fun.stopPlayDevice(this.apiSDK, data);
        } else if (data.nodeStatus == "virtual_offline") {
          this.showremind("点播提示", "设备不在线，不允许点播！");
        }
      }
      this.currentResource.id = data.id;
      this.currentResource.time = new Date().getTime();

      this.$refs.treeRightMenu.closeRightMenu();
      if (data.nodeStatus != "department") {
        node.checked = !node.checked;
      }
    },
    openAlarmMessageDialog(data) {
      this.$emit("openAlarmMessageDialog", data);
    },
    openMediaDialog(data) {
      this.$emit("openMediaDialog", data);
    },
    showremind(title, message) {
      this.$notify({
        title: title,
        message: message,
        position: "bottom-right",
        type: "warning"
      });
    },
    renderContent(h, { node, data, store }) {
      let icon = data.nodeStatus
      let alarm = data.alarm ? "alarm" : ''
      return (
        <span class={"custom-tree-node " + icon + " " + alarm}>
          <span class="node-icon"></span>
          <span>{node.label}</span>
        </span>
      );
    }
  }
};
</script>
