<template>
  <el-dialog title="会议详情" :append-to-body="true" :visible.sync="visible" width="700px" class="custom-dialog" center>
    <div class="detail">
      <el-row class="ie-align">
          <span class="label">会议类型</span>
          <span class="value">{{data.confMode == 'speak' ? '快速会议' : '预约会议'}}</span>
      </el-row>
      <el-row class="ie-align">
          <span class="label">会议名称</span>
          <span class="value">{{data.groupName}}</span>
      </el-row>
      <el-row class="ie-align">
          <span class="label">会议ID</span>
          <span class="value">{{data.conferenceId}}</span>
      </el-row>
      <el-row class="ie-align">
          <span class="label">开始时间</span>
          <span class="value">{{data.beginTime}}</span>
      </el-row>
      <el-row class="ie-align">
          <span class="label">会议时长</span>
          <span class="value">{{data.conferenceDuration}}</span>
      </el-row>
      <el-row class="ie-align">
          <span class="label">主持人</span>
          <span class="value">{{data.chairMan}}</span>
      </el-row>
      <el-row class="ie-align">
          <span class="label">备注</span>
          <span class="value">{{data.description}}</span>
      </el-row>
      <el-row class="ie-align">
          <span class="label title-label">会议文件</span>
      </el-row>
      <el-row class="ie-align">
          <span class="label">录制文件</span>
          <span class="value">无可查看记录</span>
      </el-row>
      <el-row class="ie-align">
          <span class="label">共享文件</span>
          <span class="value">无可查看记录</span>
      </el-row>
      <el-row class="ie-align">
          <span class="label">聊天记录</span>
          <span class="value">无可查看记录</span>
      </el-row>
      <el-row class="ie-align">
          <span class="label">参会人员</span>
          <span class="value">{{allUsers.join('， ')}}</span>
      </el-row>
      <!-- <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>参会人员</span>
        </div>
        <div class="persons">
          {{allUsers.join('， ')}}
        </div>
      </el-card> -->
    </div>
    <div slot="footer">
      <el-button type="primary" @click="visible = false">确 定</el-button>
      <el-button @click="visible = false" class="no-background">关 闭</el-button>
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
.detail{
  padding: 0px 130px;
}
.detail .label{
  display: inline-block;
  color: #d3dcf0;
  line-height: 35px;
  text-align: left;
  width: 120px;
}
.detail .value{
  /* float: left;  *0629 dj  */
  color: #9ca4af;
  line-height: 35px;
  width: calc(100% - 125px);
  display: inline-block;
  text-align: right;
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

.custom-dialog /deep/ .el-card__body{
  height: 215px;
}
/deep/ .el-card__header{
  background: none;
}
.el-card{
  background: none;
  color: #d3dcf0;
}
.label.title-label{
  font-size: 16px;
  color: #ffffff;
  line-height: 50px;
}
.el-button{
    width: 88px;
    height: 32px;
    padding: 6px 20px;
    border-radius: 2px;
    margin-left: 24px;
}
</style>