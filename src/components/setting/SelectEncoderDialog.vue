<template>
  <el-dialog :visible.sync="isVisible" title="编码器绑定" width="600px" center class="custom-dialog"
	:append-to-body="true">
    <div class="selectEncoderWrap">
      <!-- <div class="search-row">
        <span class="title">已绑定解码器：</span>
        <input type="text" id="inputValue"  readonly="true"/>
        <span class="search-btn pointer"></span>
      </div> -->

      <!-- <div class="firstList">
        <img src="../../../static/common/search01.png" @click="queryDevicesForCustom" />
        <el-input v-model="searchInput" placeholder="请输入内容" @keyup.enter.native="queryDevicesForCustom"></el-input>
      </div> -->

      <el-table :data="tableData" stripe highlight-current-row row-key="nodeId" class="custom-table" height="400" style="height:400px"
          @row-click="rowClick">
        <el-table-column type="index" width="60"></el-table-column>
        <!-- <el-table-column prop="id" label="选择" width="80">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.row.nodeId" @change="changeRadio(scope.row)"></el-radio>
          </template>
        </el-table-column> -->
        <el-table-column prop="deviceName" label="设备名称">
          <template slot-scope="scope">
            {{scope.row.deviceName}}{{scope.row.nodeId == bandNodeId ? "(已绑定)":""}}
          </template>
        </el-table-column>
        <el-table-column prop="ipAddress" label="设备IP" width="150"></el-table-column>
      </el-table>
      <div class="selectedTip">
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button type="primary" @click="handleConfirm">确定</el-button>
          <el-button @click="closeDialog" class="btnCom">关闭</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "SelectedEncodeDialog",
  data() {
    return {
      isVisible: false,
      tableData: [],
      bandNodeId: null,
      selectRow: null,
      searchInput: ""
    };
  },
  mounted() {},
  methods: {
    showDialog(deviceId,deviceCh, encoderItemName) {
      this.isVisible = true;
      this.bandNodeId = deviceId+"_"+deviceCh;
      let that = this;

      this.$nextTick(() => {
        xtxk.media.setDialogTop('编码器绑定');
        //this.searchInput = encoderItemName||""
        
        // 请求编码器列表
        this.apiSDK.getEncodersByLimit(1, 1024, function(obj) {
          if (obj && obj.data) {
            that.tableData = obj.data.map((item, index) => {
              var data ={
                nodeId      :  item.deviceId+"_"+item.deviceCh,
                deviceId    :  item.deviceId,
                deviceCh    :  item.deviceCh,
                deviceName  :  item.deviceName,
                ipAddress   :  item.ipAddress
              }
              return data;
            });
          }
        });
      })      
    },
    closeDialog() {
      this.isVisible = false;
      this.selectRow = null;
    },
    rowClick(row) {
      this.selectRow = row;
    },
    handleConfirm() {
      if(this.selectRow){
        var data ={
                deviceId    :  this.selectRow.deviceId,
                deviceCh    :  this.selectRow.deviceCh,
                deviceName  :  this.selectRow.deviceName,
                ipAddress   :  this.selectRow.ipAddress
              }
        this.$emit("selectEncoders", data);
        this.isVisible = false;
      }else{
        this.$message({message: '请选择编码器', type: 'warning'});
      }      
    },
    // 根据条件查询设备列表
    queryDevicesForCustom() {
      this.apiSDK.queryDevicesForCustom(this.searchInput, obj => {
        if (obj && obj.data && obj.data.length) {
          this.tableData = obj.data.map(item =>{
            return {
              nodeId      :  item.deviceId+"_"+item.deviceCh,
              deviceId    :  item.deviceId,
              deviceCh    :  item.deviceCh,
              deviceName  :  item.deviceName,
              ipAddress   :  item.ipAddress
            }
          });
        }
      });
    }
  }
};
</script>
<style scoped>
 /deep/.custom-table .el-table__body tr.current-row>td{
  background-color: #8EC2FB;
}
.selectEncoderWrap .search-row {
  margin: 0 0 20px 0;
  height: 40px;
  line-height: 40px;
  /*padding: 0 36px;*/
}
.selectEncoderWrap .search-row .title{
  float: left;
  margin-left: 35px;
}
.selectEncoderWrap .search-row input {
  height: 40px;
  width: 360px;
  padding: 0 5px;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
}
/* .selectEncoderWrap .bmList {
  width: 550px;
  height: 200px;
  border: 1px solid #ccc;
  margin-left: 23px;
  padding: 0;
  color: #0f5794;
}
.selectEncoderWrap .bmList li {
  list-style: none;
  height: 34px;
  border-bottom: 1px solid #ccc;
  line-height: 34px;
} */
.selectEncoderWrap .selectedTip {
  margin-top: 20px;
  overflow: hidden;
}
.selectEncoderWrap .firstList {
  height: 40px;
  background-color: #e9f3fa;
  border: solid 1px #c2dff3;
}
.selectEncoderWrap .firstList .el-input {
  display: inline-block;
  float: right;
  width: 180px;
}
.selectEncoderWrap .firstList img {
  display: inline-block;
  float: right;
  width: 36px;
  height: 28px;
  margin: 6px 20px 6px 5px;
  cursor: pointer;
}
.selectEncoderWrap /deep/ .firstList .el-input__inner {
  width: 180px;
  height: 28px;
  background-color: #ffffff;
  border: solid 1px #dcdfe6;
  box-sizing: border-box;
  padding: 0 5px;
  margin-top: 6px;
}
.selectEncoderWrap .radioStyle {
  margin-left: 20px;
}
.selectEncoderWrap .bmName {
  margin-left: 80px;
}
.selectEncoderWrap .bmAddress {
  margin-left: 100px;
}
</style>
