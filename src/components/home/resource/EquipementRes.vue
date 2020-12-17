<template>
  <div class="EquipementResArea" width="414px">
      
    <!-- 资源显示区域 -->
    <div class="EquipementResWrap" style="height:100%">
        <el-tabs v-model="activeName" class="divSelectItemTab" @tab-click="tabClickHandler">
        <!-- <el-tabs v-model="activeName" class="divSelectItemTab"> -->
            <el-tab-pane v-for="(item, index) in editableTabs" :label="item.title" :name="item.name" :key="item.name" style="height:100%">
                <span slot="label"><i class="tabtree-icon" :class="item.icon"></i> {{item.title}}</span>
                <component :is="item.content" :ref="item.ref" :treeId="item.treeId" v-on="$listeners"></component>
            </el-tab-pane>
        </el-tabs>
        <!-- 设备资源树筛选弹出框 -->
        <device-tree-popper ref="devicetreepopper"/>
    </div>
  </div>
</template>

<script>

import CommonUse from "@/components/home/resource/CommonUse.vue";
import DeviceTree from "@/components/home/resource/DeviceTree3.vue";
import DeviceTreePopper from "@/components/home/resource/DeviceTreePopper.vue";
import Enum from "@/common/enum";
import Fun from '@/common/fun'

export default {
  name: "EquipementRes",
  components: {
    CommonUse,
    DeviceTree,
    DeviceTreePopper
  },
  data() {
    return {
      activetabName:'',
      activeName: "DeviceTree",
      
      editableTabs: [
       {
            title: '最近点播',
            icon:"icontree-emphasis",
            name: 'CommonUse',
            content: 'CommonUse',
            ref: 'commonUse',
            treeId: 'MainDevicesStatus',
            isIndeterminate:false,
            checkAll:false,
            selectItem:[]
        },
        {
            title: '组织单位',
            icon:"icontree-department",
            name: 'DeviceTree',
            content: 'DeviceTree',
            ref: 'deviceTree',
            treeId: 'MainDevicesStatus',
            isIndeterminate:false,
            checkAll:false,
            selectItem:[
                {text:'克拉',id:'Dkl'},
                {text:'迪那',id:'Ddn'},
                {text:'英买',id:'Dym'},
                {text:'塔中',id:'Dtz'},
                {text:'哈得',id:'Dhd'},
                {text:'东河',id:'Ddh'},
                {text:'轮南',id:'Dln'},
                {text:'博大',id:'Dbd'},
                {text:'泽普',id:'Dzp'},
                {text:'运销',id:'Dyx'},
                {text:'塔石化',id:'Ddsh'},
                {text:'南疆利民',id:'Dnjlm'},
                {text:'基地',id:'Djd'},
            ]
        }
      ],
      searchV:["123","456"],
      checkedItems:[],//设备资源树筛选数据
      isTreeItemShow:false,//设备资源树筛选框是否显示
      TreeItem:[],//设备资源树筛选数据

   };
  },
  mounted() {
    this.activetabName=xtxk.cache.get('activeName');
  },
  methods: {
    initTree: function() {
      this.$nextTick(() => {
        const self = this;
        const organId = "";
        let subjectId = 0;
        //获取设备组织结构
        this.apiSDK.getOrganizationDevice(organId, Enum.enumSubscribeType.main.subscribeOrganizationDevice, subjectId, function(obj){
          //console.log(obj);
          self.$refs.deviceTree[0]&& self.$refs.deviceTree[0].setReceiveInformAddDepartmentCallback(obj);
        });
          // 资源状态回调
        this.apiSDK.setReceiveResourceStatusQueryCallback("main", function(obj) {
          // self.$refs.commonUse[0]&&self.$refs.commonUse[0].setReceiveInformResourceStatusCallback(obj);
          self.$refs.deviceTree[0]&&self.$refs.deviceTree[0].setReceiveInformResourceStatusCallback(obj);
        });
        //获取常用结构
        this.$refs.commonUse[0]&&this.$refs.commonUse[0].getTreeNode();
      
     })
    },
    //全部离线
    offline(){
         Fun.transformTreeToArray(this.$refs.deviceTree[0].treeData).forEach(item => {
            if(item.resourceType==1){
                item.nodeStatus="device_offline"
            }
        });
    },
    //菜单单击
    tabClickHandler(tab){
      this.activeName=tab.name;
      console.log( this.activeName)
      //条件弹出框
      // var list=this.editableTabs.filter(item=>item.name==tab.name)
      // this.$refs.devicetreepopper.showpop(list[0]);
      console.log(tab.name)
      if(tab.name=="CommonUse")this.$refs.commonUse[0]&&this.$refs.commonUse[0].getTreeNode();
    },
   
  },
};
</script>
<style>
.tabMenu-popover{
  min-width: 90px !important;
  border: 1px solid #c2dff3;
}
</style>
<style scoped>
.EquipementResArea {
  position: relative;
  float: left;
  padding: 0px;
  width: 412px;
  height: 100%;
   background: url(../../../../static/main/screen/resource_bg.png) no-repeat 0px -2px;
  background-size: 100% 100%;
}

.el-tabs{
  width: 412px;
  float: left;
  height: 100%;
}

/* ui tab样式12.12 */
.divSelectItemTab{
 /* background:url(../../../../static/main/screen/bg.png) no-repeat center; */
} 
.el-tabs.divSelectItemTab /deep/ .el-tabs__header{
    background: transparent!important;
    /* background:#f00 */
     /* background:url(../../../../static/main/screen/bg.png) no-repeat center; */
}
.el-tabs.divSelectItemTab /deep/ .el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item{
  padding: 0 12px;
  color:#B7C1D0;
  font-size:15px;
}
.el-tabs.divSelectItemTab /deep/ .el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item::after{
  content:'';
  margin: 0;
}
.el-tabs.divSelectItemTab /deep/ .el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item.is-active{
  font-size:15px;
  color:#fff;
}
.el-tabs.divSelectItemTab /deep/ .el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__active-bar{
  height: 3px;
} */
/deep/ .el-icon-arrow-left:before,
/deep/ .el-icon-arrow-right:before {
    color: #D7E7FF;
}

/deep/ .el-tabs__active-bar{
    background-image: linear-gradient(90deg, #68B5FF 0%, #2B6EFF 100%);
}

.tabtree-icon{
    display: inline-block;
    width:16px;
    height: 16px;
    vertical-align: middle;
    cursor: pointer;
    margin:-4px 2px 0 0;
}
/* 常用 */
 .icontree-emphasis{
    background:url(../../../../static/resource_tree/tab/emphasis.png) no-repeat center;
    background-size: 18px;
}
/deep/  .el-tabs__item.is-active .icontree-emphasis{
    background:url(../../../../static/resource_tree/tab/emphasis_active.png) no-repeat center;
    background-size: 18px;
}

/* 部门 */
 .icontree-department{
    background:url(../../../../static/resource_tree/tab/department.png) no-repeat center;
    background-size: 18px;
}
/deep/  .el-tabs__item.is-active .icontree-department{
    background:url(../../../../static/resource_tree/tab/department_active.png) no-repeat center;
    background-size: 18px;
}

</style>
