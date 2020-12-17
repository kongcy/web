<template>
  <el-dialog :visible.sync="isVisible" title="选择资源" width="450px" class="custom-dialog personTreeDialog" customClass="selectResource" center 
    :modal="false"
    :close-on-click-modal="true"
    @closed="closedDialog">
        <div class="selectResourceContent">
            <!-- <div
                class="resourceTitle"
                v-for="item in titleData"
                :key="item"
                :class="active === item ? 'active' : ''"
                @click="active = item"
            >{{ item }}</div> -->
            <template v-for="item in titleData">
                <div
                class="resourceTitle"
                v-if="item.isShow"
                :key="item.label"
                :class="active === item.label ? 'active' : ''"
                @click="active = item.label"
            >{{ item.label }}</div>
            </template>
    </div>
    <div>
      <p></p>
      <p v-show="active === '组织结构' && titleData[0].isShow" class="tree">
        <person-tree ref="personTreeSelect" :subscribeType="subscribeType" />
      </p>
      <!-- <p v-show="active === '设备资源' && titleData[1].isShow" class="tree">
        <device-tree ref="deviceTreeSelect" :subscribeType="subscribeType" />
      </p>
      <p v-show="active === '常用资源' && titleData[2].isShow" class="tree">
        <common-res ref="commonTreeSelect" :subscribeType="subscribeType" />
      </p> -->
    </div>
    <span slot="footer" class="dialog-footer">
      <!-- <el-checkbox >确定后关闭弹框</el-checkbox> -->
      <el-button type="primary" @click="handleConfirm">确定</el-button>
      <el-button @click="closeDialog" class="no-background">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import PersonTree from "@/components/home/selectRes/PersonTreeRes.vue";
// import DeviceTree from "@/components/home/selectRes/DeviceTreeRes.vue";
// import CommonRes from "@/components/home/selectRes/CommonRes.vue";
import Enum from "@/common/enum";

export default {
  name: "SelectResourceDialog",
  components: {
    PersonTree,
    // DeviceTree,
    // CommonRes
  },
  data() {
    return {
      subscribeType: '',
      options: [
          { label: '搜索', value: 1 },
          { label: '在线', value: 2 },
          { label: '离线', value: 3 },
      ],
      level: [
        { label: '一级', value: 1 },
        { label: '二级', value: 2 },
        { label: '三级', value: 3 },
      ],
        
      isVisible: false,
      active: "组织结构",
    //   titleData: ["组织结构", "设备资源", "常用资源"],
      titleData:[
          {
              label:'组织结构',
              isShow:true,
          },
          // {
          //     label:'设备资源',
          //     isShow:true,
          // },
          // {
          //     label:'常用资源',
          //     isShow:true,
          // },
      ],
      storey: ["一级", "二级", "三级"],
      butData: ["搜索", "在线", "离线", "全部", "无"],
      fromType:null
    };
  },
  created() {},
  mounted() {},
  methods: {
    initTree: function(subscribeType, hasPersonTree, hasDeviceTree, hasCommonTree) {
        // console.log('hasPersonTree='+hasPersonTree+',hasDeviceTree='+hasDeviceTree+',hasCommonTree='+hasCommonTree);
        this.titleData[0].isShow = hasPersonTree == 0 ? false : true;
        // this.titleData[1].isShow = hasDeviceTree == 0 ? false : true;
        // this.titleData[2].isShow = hasCommonTree == 0 ? false : true;
        // console.log(this.titleData);

        this.$nextTick(() => {
            const self = this;
            const organId = "";
            this.subscribeType = subscribeType;

            let subjectId = 0;
            // dj 默认行政隶属
            self.$refs.personTreeSelect.relationshipValue = subjectId;
            // self.$refs.deviceTreeSelect.relationshipValue = subjectId;
            
            //订阅用户组织结构
            if( this.titleData[0].isShow ){
                this.apiSDK.getOrganizationUser(organId, subscribeType.subscribeOrganizationUser, subjectId ,function(obj) {
                    self.$refs.personTreeSelect && self.$refs.personTreeSelect.setReceiveInformAddDepartmentCallback(obj);
                });
            }
          
            //获取设备组织结构
            // if( this.titleData[1].isShow ){
            //     this.apiSDK.getOrganizationDevice(organId, subscribeType.subscribeOrganizationDevice, subjectId, function(obj){
            //         self.$refs.deviceTreeSelect && self.$refs.deviceTreeSelect.setReceiveInformAddDepartmentCallback(obj);
            //     });
            // }
          
            //获取常用资源树
            // if( this.titleData[2].isShow ){
            //     this.apiSDK.subscribeCommonRes("", "", "", subscribeType.subscribeCommonResources);
            // }
          
            //资源回调
            this.apiSDK.setReceiveResourceStatusQueryCallback("selectRes", function(obj) {
                //console.log(obj);
                self.$refs.personTreeSelect && self.$refs.personTreeSelect.setReceiveInformResourceStatusCallback(obj);
                // self.$refs.deviceTreeSelect && self.$refs.deviceTreeSelect.setReceiveInformResourceStatusCallback(obj);
                // self.$refs.commonTreeSelect && self.$refs.commonTreeSelect.setReceiveInformResourceStatusCallback(obj);
            });
        });      
    },
    showDialog(subscribeType, hasPersonTree, hasDeviceTree, hasCommonTree,fromType) {
        this.isVisible = true;
        this.initTree(subscribeType, hasPersonTree, hasDeviceTree, hasCommonTree);
        this.fromType=fromType;
    },
    closeDialog() {
        this.isVisible = false;
    },
    handleConfirm() {
        var userNodes = [];
        var deviceNodes = [];

        //人员树
        var userCheckNodes = this.$refs.personTreeSelect.$refs.SelectResUsersStatus.getCheckedNodes();
        userCheckNodes && userCheckNodes.forEach(item => {
            item.nodeStatus != "department" && userNodes.push(item)
        })
        // //设备树
        // var devCheckNodes = this.$refs.deviceTreeSelect.$refs.SelectResDevicesStatus.getCheckedNodes();
        // devCheckNodes && devCheckNodes.forEach(item => {
        //     item.nodeStatus != "department" && deviceNodes.push(item)
        // })
        // //常用树
        // var comCheckNodes = this.$refs.commonTreeSelect.$refs.SelectResCommonsStatus.getCheckedNodes();
        // comCheckNodes && comCheckNodes.forEach(item => {
        //     item.nodeStatus.indexOf("person") > -1 && userNodes.push(item)
        //     item.nodeStatus.indexOf("device") > -1 && deviceNodes.push(item)
        // })

        // if(this.fromType==='指挥呼叫'){
        //   if(userNodes.length>1||userNodes.length===0){
        //         this.$message({message: '请选择一名在线参加成员', type: 'warning'});                
        //   }else if(userNodes[0].nodeStatus!=='person_online'){
        //         this.$message({message: '请选择一名在线参加成员', type: 'warning'});                
        //   }else if(userNodes[0].inGroup===true){
        //         this.$message({message: '不能呼叫已加入成员', type: 'warning'});               
        //   }
        //   else if(userNodes[0].parentId!==xtxk.cache.get('USER').userId){
        //         this.$message({message: '只能呼叫下一级未加入成员', type: 'warning'});               
        //   }else{
        //     this.$emit("resourceEvent", [userNodes, deviceNodes]);
        //     this.isVisible = false;
        //   }
        // }else{
          // 选中的数据传出去
          this.$emit("resourceEvent", [userNodes, deviceNodes]);
          this.isVisible = false;
        // }
    },
    closedDialog(){
        // 清空下拉值
        this.$refs.personTreeSelect.input_person = '';
        this.$refs.personTreeSelect.treeType = 'all';
        this.$refs.personTreeSelect.statusValue = 'all';
        this.$refs.personTreeSelect.levelValue = '';
        // this.$refs.deviceTreeSelect.treeType = 'all';
        // this.$refs.deviceTreeSelect.input_device = '';
        // this.$refs.deviceTreeSelect.statusValue = 'all';
        // this.$refs.deviceTreeSelect.levelValue = '';
        //清空树
        this.$refs.personTreeSelect.clearTree();
        // this.$refs.deviceTreeSelect.clearTree();
        // this.$refs.commonTreeSelect.clearTree();
        //取消订阅
        // const subIDs = new Array(
        // this.subscribeType.subscribeOrganizationUser,this.subscribeType.subscribeUsersStatus,this.subscribeType.subscribeUsersStatusByKey,this.subscribeType.subscribeUsersStatusByStatus,
        // this.subscribeType.subscribeOrganizationDevice,this.subscribeType.subscribeDevicesStatus,this.subscribeType.subscribeDevicesStatusByKey,this.subscribeType.subscribeDevicesStatusByStatus,
   		// this.subscribeType.subscribeCommonResources,this.subscribeType.subscribeCommonResourcesByKey,this.subscribeType.subscribeCommonResourcesByStatus);
      
        var tempArr = [];
        if( this.titleData[0].isShow ){
            tempArr.push(this.subscribeType.subscribeOrganizationUser);
            tempArr.push(this.subscribeType.subscribeUsersStatus);
            tempArr.push(this.subscribeType.subscribeUsersStatusByKey);
            tempArr.push(this.subscribeType.subscribeUsersStatusByStatus);
        }
        // if( this.titleData[1].isShow ){
        //     tempArr.push(this.subscribeType.subscribeOrganizationDevice);
        //     tempArr.push(this.subscribeType.subscribeDevicesStatus);
        //     tempArr.push(this.subscribeType.subscribeDevicesStatusByKey);
        //     tempArr.push(this.subscribeType.subscribeDevicesStatusByStatus);
        // }
        // if( this.titleData[2].isShow ){
        //     tempArr.push(this.subscribeType.subscribeCommonResources);
        //     tempArr.push(this.subscribeType.subscribeCommonResourcesByKey);
        //     tempArr.push(this.subscribeType.subscribeCommonResourcesByStatus);
        // }
        const subIDs = tempArr;
        this.apiSDK.cancelSubscribeResourceStatus(subIDs.join(","), "all");
    },
  }
};
</script>

<style>
.selectResource div.el-dialog__body {
  padding: 0 0px;
}
</style>

<style scoped>
div > div.resourceTitle.active {
  color: #fff;
  border-bottom: 2px solid #128bf1;
}
/deep/ .el-tabs__active-bar{
     /* background-image: linear-gradient(90deg, #68B5FF 0%, #2B6EFF 100%); */
     background: url(../../../../static/common/tabtitle_bg_active.png) no-repeat center;
     background-size: 100% 100%;
}
.selectResourceContent {
  color: #fff;
  box-sizing: border-box;
  display: flex;
  line-height: 40px;
}
.selectResourceContent .resourceTitle {
  /* flex: 1; */
  cursor: pointer;
  color: #b7c1d0;
  text-align: center;
  width:80px;
}
.selectResourceContent + div {
  /* border: 1px solid #c2dff3; */
}
.selectResourceContent + div > p {
  margin: 0;
}
.selectResourceContent + div > p:nth-child(1) {
  background: rgb(44, 78, 120);
  color: #ffffff;
  /* height: 50px; */
  font-size: 12px;
  line-height: 50px;
  position: relative;
}
.selectResourceContent + div > p:nth-child(1) > div {
  width: 100px;
  font-size: 12px;
}
.selectResourceContent + div > p:nth-child(1) > img {
  position: absolute;
  top: 20px;
  z-index: 1;
  left: 96px;
  cursor: pointer;
}
.selectResourceContent + div > p.tree {
  height: 436px;
  /* overflow: auto; */
}
.selectResourceContent + div > div {
  background: rgb(44, 78, 120);
  height: 36px;
  line-height: 36px;
}
.selectResourceContent + div > div > input {
  width: 120px;
  text-indent: 5px;
  font-size: 12px;
}
.operate > button {
  font-size: 10px;
}
.el-button{
    width: 88px;
    height: 32px;
    padding: 6px 20px;
    border-radius: 2px;
    margin-left: 24px;
}
</style>