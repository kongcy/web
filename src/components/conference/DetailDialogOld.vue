<template>
  <el-dialog title="会议详情" :append-to-body="true" :visible.sync="visible" width="560px" class="custom-dialog" center>
    <div class="detail">
      <el-row class="ie-align">
        <el-col :span="12">
          <span class="label">会议名称：</span>
          <span class="value">{{data.groupName}}</span>
        </el-col>
        <el-col :span="12">
          <span class="label">显示方案：</span>
          <span class="value">{{data.schemeName}}</span>
        </el-col>
      </el-row>
      <el-row class="ie-align" v-if="data.isHistoryMeetingDetail == true">
        <el-col :span="12">
          <span class="label">开会时间：</span>
          <span class="value">{{data.beginTime}}</span>
        </el-col>
        <el-col :span="12">
          <span class="label">结束时间：</span>
          <span class="value">{{data.endTime}}</span>
        </el-col>
      </el-row>
      <el-row class="ie-align" v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6">
        <el-col :span="12">
          <span class="label">会议时长：</span>
          <span class="value">{{data.conferenceDuration}}</span>
        </el-col>
        <!-- <el-col :span="12">
          <span class="label">会议密码：</span>
          <span class="value">{{data.password}}</span>
        </el-col> -->
        <el-col :span="12">
          <span class="label">会议模式：</span>
          <span class="value">{{data.confMode === 'discuss' ? '讨论会议' : '发言会议'}}</span>
          <!-- <span class="value">{{data.meetingMode === true?'拼接' : '常规'}}</span> -->
        </el-col>
      </el-row>
      <el-row class="ie-align">
        <!-- <el-col :span="12" v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6">
          <span class="label">自动录像：</span>
          <span class="value">{{data.isAutoRecord ? '开启' : '关闭'}}</span>
        </el-col> -->
        <el-col :span="12" v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6">
          <span class="label">是否加密会议：</span>
          <span class="value">{{data.needPassword ? '是' : '否'}}</span>
        </el-col>
        <el-col :span="12">
          <span class="label">会议主席：</span>
          <span class="value">{{data.chairMan}}</span>
        </el-col>
      </el-row>
      <el-row class="ie-align">
        <el-col :span="24">
          <span class="label">简要描述：</span>
          <!-- <div class="text-area">{{data.description}}</div> -->
          <span class="value">{{data.description}}</span>
        </el-col>
      </el-row>
      <el-card class="box-card" v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6">
        <div slot="header" class="clearfix">
          <span>参会人员</span>
        </div>
        <div class="persons">
          {{allUsers.join('， ')}}
        </div>
      </el-card>
      <el-row :gutter="20" v-if="this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5">
        <el-col :span="12">
          <el-card>
            <div class="card-title">
              分组人员
            </div>
            <div class="card-body">
              <div class="people-resource">
                <el-tree
                  :props="props"
                  :data="loopData"
                  :render-content="renderContent"
                  default-expand-all
                  node-key="id"
                  ref="tree"
                  highlight-current
                >
                </el-tree>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <div class="card-title">
              分组设备
            </div>
            <div class="card-body">
              <div class="people-resource">
                <el-tree
                  :props="props"
                  :data="fixData"
                  :render-content="renderContent"
                  default-expand-all
                  node-key="id"
                  ref="tree"
                  highlight-current
                >
                </el-tree>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="visible = false">确 定</el-button>
      <el-button @click="visible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Enum from "@/common/enum";
export default {
  name: "DetailDialog",
  data() {
    return {
      visible: false,
      data: {},
      allUsers: [],

        props: {
            label: "name",
            children: "children",
            isLeaf: "leaf"
        },
        loopData:[],
        fixData:[],
    };
  },
  methods: {
    showDialog(data) {
        this.data = data;
        if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion6 ){
            let user = data.users && data.users.map(item => { return item.userName}) || [];
            let device = data.devices && data.devices.map(item => { return item.deviceName}) || [];
            this.allUsers = [...user, ...device];
        }
        if( this.apiSDK.config.version === this.apiSDK.enumSDKVersion.SDKVersion5 ){
            let loopRersources = data.users.map(item => {
                return {
                    id: item.userId,
                    name: item.userName,
                    nodeStatus: 'person_online'
                };
            });
            let fixResources = data.devices.map(item => {
                return {
                    id: item.deviceId,
                    name: item.deviceName,
                    resCh: item.deviceCh,
                    nodeStatus: 'device_online'
                };
            });
            this.loopData = loopRersources;
            this.fixData = fixResources;
        }
        
        this.visible = true;
        this.$nextTick(() => {
            xtxk.media.setDialogTop('会议详情');
        });
    },
    // 树行样式(用户)
    renderContent(h, { node, data, store }) {
          return (
              <span class={"custom-tree-node " + data.nodeStatus}>
                <span class="node-icon"></span>
                <span>{node.label}</span>
              </span>
          );
    },
  }
};
</script>

<style scoped>
.detail .label{
  float: left;
  color: #2e3c42;
  line-height: 32px;
}
.detail .value{
  /* float: left;  *0629 dj  */
  color: #666666;
  line-height: 32px;
}
.detail .text-area{
  border: solid 1px #dcdfe6;
  padding: 5px;
  margin-left: 70px;
  margin-top: 11px;
  min-height: 80px;
  margin-bottom: 10px;
}
.detail .persons{
  padding: 10px;
}

  .card-title {
    position: relative;
    height: 40px;
    padding: 0 20px;
    line-height: 40px;
    background: #e9f3fa;
  }
  .card-body{
    border-top: 1px solid #c2dff3;
    overflow: auto;
  }

  /* 0629dj */
  .ie-align{
    text-align: left;
  }
</style>