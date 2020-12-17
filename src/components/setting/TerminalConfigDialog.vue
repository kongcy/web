<template>
  <el-dialog :visible.sync="isVisible" title="终端配置" class="custom-dialog" center>
    <div class="terminal-setting">
      <div class="mainWrap">
        <!-- <div class="user-setting-btn">
          <span>常用配置</span>
        </div> -->
        <div class="user-setting-list">
          <div class="strip strip1">业务习惯</div>
          <div class="strip strip2">
            <div class="float-left callSettingBox">呼叫响应</div>
            <div>
              <div class="callrespond">
                <el-radio v-model="callItemVal" label="0" class="radioMargin">自动响应</el-radio>
                <el-radio v-model="callItemVal" label="1">手动响应</el-radio>
              </div>
            </div>
          </div>
          <div class="strip strip3">编码器绑定</div>
          <div class="strip strip4 select">
            <div>
              <span>本地软编</span>
              <el-switch v-model="isLocalEncoderID" style="margin-left: 15px;"></el-switch>
            </div>
            <div>
            <div class="float-left">选择设备</div>
            <div class="float-left urlClass">
              <input type="text" class="iput_sty" id="encodeVal" v-model="userCustom.encoderName"/>
            </div>
            <div class="float-left selectUrlClass">
              <el-button class="select_point selectedEncode pointer" v-on:click="selectedEncode" :disabled="isLocalEncoderID"></el-button>
            </div>
            </div>
          </div>
          <div class="strip strip3">呼叫上屏</div>
          <div class="item-wrapper">
            <div class="item-content">
              <div class="item-list">
                <div class="item-list-restar">
                  <span>启用呼叫上大屏：</span>
                  <el-switch v-model="isOutScreen">
                  </el-switch>
                </div>
                <div class="item-list-content">
                  <div class="item-list-select">
                    <label>大屏选择</label>
                    <el-select class="item-select" v-model="screens.screenId" @change="getTypeList(screens.screenId)">
                      <el-option v-for="item in bigHallList" :value="item.screenId" :label="item.screenName" :key="item.hallId"></el-option>
                    </el-select>
                  </div>
                  <div class="item-list-select">
                    <label>模式选择</label>
                    <el-select class="item-select" v-model="screens.screenMode">
                      <el-option v-for="list in screenTypeList" :key="list.modeId" :label="list.modeName" :value="list.modeCode"></el-option>
                    </el-select>
                  </div>
                  <div class="item-list-input">
                    <label>显示位置</label>
                    <el-input class="item-input" readonly v-model="screens.detail" />
                  </div>
                  <div class="item-list-other">
                    <el-button class="item-list-btn" :disabled="!isOutScreen" @click="settingCall" type="primary" size="small">配置</el-button>
                  </div>
                </div>
              </div>
              <div class="item-list">
                <div class="item-list-restar">
                  <span>启用一键上大屏：</span>
                  <el-switch v-model="isOneKeyToScreen">
                  </el-switch>
                </div>
                <div class="item-list-content">
                  <div class="item-list-select">
                    <label>大屏选择</label>
                    <el-select class="item-select" v-model="screensForOneKey.screenId" @change="getTypeList(screens.screenId)">
                      <el-option v-for="item in bigHallList" :value="item.screenId" :label="item.screenName" :key="item.hallId"></el-option>
                    </el-select>
                  </div>
                  <div class="item-list-select">
                    <label>模式选择</label>
                    <el-select class="item-select" v-model="screensForOneKey.screenMode">
                      <el-option v-for="list in screenTypeList" :key="list.modeId" :label="list.modeName" :value="list.modeCode"></el-option>
                    </el-select>
                  </div>
                  <div class="item-list-input">
                    <label>显示位置</label>
                    <el-input class="item-input" readonly v-model="screensForOneKey.detail" />
                  </div>
                  <div class="item-list-other">
                    <img v-if="imgShow.length >0 && imgShow[0] == 'leftBtn'" src="../../../static/common/left_btn.png" />
                    <img v-if="imgShow.length >0 && imgShow[0] == 'rightBtn'" src="../../../static/common/right_btn.png" />
                    <img v-if="imgShow.length >1 && imgShow[1] == 'leftBtn'" src="../../../static/common/left_btn.png" />
                    <img v-if="imgShow.length >1 && imgShow[1] == 'rightBtn'" src="../../../static/common/right_btn.png" />
                    <el-button class="item-list-btn" :disabled="!isOneKeyToScreen" @click="oneKeySetting" type="primary" size="small">配置</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleConfirm">保存</el-button>
          <el-button @click="closeDialog">取消</el-button>
      </div>
      <selected-encode-dialog ref="selectedEncodeDialog" v-on:selectEncoders="selectEncoders" />
    </div>

    <call-setting-dialog @confirm="setDetailData" ref="callSetting" />
    <one-key-setting @confirmKey="setKeyDetailData" ref="oneKeySetting" />
  </el-dialog>
</template>

<script>
import SelectedEncodeDialog from "@/components/setting/SelectEncoderDialog.vue";
import CallSettingDialog from "@/components/setting/CallSettingDialog.vue";
import OneKeySetting from "@/components/setting/OneKeySetting.vue";
export default {
  name: "TerminalConfigDialog",
  components: {
    SelectedEncodeDialog,
    CallSettingDialog,
    OneKeySetting
  },
  data() {
    return {
      isVisible: false,
      isLocalEncoderID: true,
      callItemVal: '0',
      // meetingItemVal: '0',
      userCustom: {
        encoderName: ''
      },
      isOutScreen: true,
      screens: { // 呼叫上大屏模块数据
        screenId:"",
        screenMode:"",
        code:"",
        pos:"",
        detail: ''
      },
      isOneKeyToScreen:　true,
      screensForOneKey: { // 一键上大屏
        screenId:"",
        screenMode:"",
        code:"",
        imagesKey:"",
        detail: ''
      },
      bigHallList: [], // 大屏选择
      hallId: '', // 用户绑定的大厅ID
      screenTypeList: [],// 大屏模式选择

      callData: [], // 呼叫设置需要的传参
      oneKeyData: [], // 一键设置需要的传参
      imgShow: []

    };
  },
  mounted() {
    // 后台暂未实现，接口请求报错，暂时注释掉接口
    // this.getBigHall()
  },
  methods: {
    settingCall() {
      for (let i=0; i<this.screenTypeList.length; i++) {
        let item = this.screenTypeList[i]
        if (item.modeCode == this.screens.screenMode) {
          this.callData = item.screens
          break;
        }
      }
      this.$refs.callSetting.showDialog();
    },
    oneKeySetting() {
      for (let i=0; i<this.screenTypeList.length; i++) {
        let item = this.screenTypeList[i]
        if (item.modeCode == this.screensForOneKey.screenMode) {
          this.oneKeyData = item.screens
          break;
        }
      }
      this.$refs.oneKeySetting.showDialog();
    },
    showDialog() {
      this.getUserCustom()
      this.isVisible = true;
      this.$nextTick(() => {
          xtxk.media.setDialogTop('终端配置');
      });
    },
    closeDialog() {
      this.isVisible = false;
    },
    // 根据用户查询绑定的大厅 再根据大厅Id查询所有的大屏
    getBigHall() {
      this.apiSDK.getBigHall(res => {
        if (res) {
          this.hallId = res.hallId
          this.apiSDK.getBigScreenByHallId(this.hallId, res => {
            if (res) {
              this.bigHallList = res
            }
          })
        }
      })
    },
    // 根据选择的大屏id查询所有的模式
    getTypeList(id) {
      this.apiSDK.getBigHallModes(id, res => {
        if (res) {
          this.screenTypeList = res
        }
      })
    },
    // 接收呼叫上屏设置返回的字段，对应页面上上屏设置中位置的显示
    setDetailData(data) {
      this.screens.detail = data.result
    },
    // 接收一键上屏设置返回的字段，对应页面上上屏设置中位置的显示
    setKeyDetailData(data) {
      this.screensForOneKey.detail = data.result
      this.imgShow = data.imgBtn
    },
    getUserCustom() {
      var self=this
      // var resp={userID:'',callItem:'',encoderId:'',encoderCh:'',encoderName:'',decoderId:'',decoderName:'',meetingItem:'',isOutScreen:0,screens:[],isRing:0/1}
      this.apiSDK.getUserCustom((res) => {
        if(res) {
          this.isLocalEncoderID = res.isLocalEncoderID
          this.userCustom = res
          this.callItemVal = res.callItem+''
          // this.meetingItemVal = res.meetingItem || '0'
          this.isOutScreen = res.isOutScreen == '0' ? false : true
          this.isOneKeyToScreen = res.isOneKeyToScreen == '0' ? false : true
          let result = ''
          if (res.screens && res.screens.length > 0) {
            res.screens.forEach(element => {
              result += element.code + '|' + element.pos + ','
            })
            this.screens.detail = result.substring(0, result.length - 1)
            this.screens.screenId = res.screens[0].screenId
            this.screens.screenMode = res.screens[0].screenMode
            this.getTypeList(this.screens.screenId)

          }
          let keyResult = ''
          if (res.screensForOneKey && res.screensForOneKey.length > 0) {
            this.imgShow.length = 0
            res.screensForOneKey.forEach(element => {
              keyResult += element.code +  ','
              this.imgShow.push(element.imagesKey)
            })
            this.screensForOneKey.detail = keyResult.substring(0, keyResult.length - 1)
            this.screensForOneKey.screenId = res.screensForOneKey[0].screenId
            this.screensForOneKey.screenMode = res.screensForOneKey[0].screenMode
          }
        }
      })
    },
    handleConfirm() {
      let that = this;
      //以下参数为后续待补
      let decoderItem = "";
      let meetingItem = "1";
      let isOutScreen = this.isOutScreen ? 1: 0;
      let screens = [];
      if (this.screens.detail) {
        let screenArr = this.screens.detail.split(',');
        screenArr.forEach(item => {
          let codeArr = item.split('|')
          let screenObj = {}
          screenObj.screenId = this.screens.screenId
          screenObj.screenMode = this.screens.screenMode
          screenObj.code = codeArr[0]
          screenObj.pos = codeArr[1]
          screens.push(screenObj)
        })
      }
      let isRing = 0;
      let isOneKeyToScreen = this.isOneKeyToScreen ? 1 : 0;
      let screensForOneKey = [];

      if (this.screensForOneKey.detail) {
        let OneKeyArr = this.screensForOneKey.detail.split(',');
        for (let i=0; i<OneKeyArr.length; i++) {
          let OneKeyObj = {}
          OneKeyObj.screenId = this.screensForOneKey.screenId
          OneKeyObj.screenMode = this.screensForOneKey.screenMode
          OneKeyObj.code = OneKeyArr[i]
          OneKeyObj.imagesKey = this.imgShow[i]
          screensForOneKey.push(OneKeyObj)
        }
      }
      this.apiSDK.setUserCustom(
        xtxk.cache.get("USER").userId,
        this.callItemVal?this.callItemVal:'1',
        this.userCustom.encoderId,
        decoderItem, meetingItem,
        this.userCustom.encoderCh,
        isOutScreen, screens, isRing,
        isOneKeyToScreen, screensForOneKey,
        this.isLocalEncoderID,
        function(obj) {
          if (obj && obj.Ret == 0) {
            that.$message.success('保存成功');
            that.isVisible = false;
          }else{
              if( obj.message ){
                that.$message.error(obj.message);
              }else{
                that.$message.error('保存失败');
              }
          }
        }
      );
    },
    selectedEncode() {
      this.$refs.selectedEncodeDialog.showDialog(this.userCustom.encoderId,this.userCustom.encoderCh, this.userCustom.encoderName);
    },
    selectEncoders(encoder) {
      console.log(encoder)
      this.userCustom.encoderId = encoder.deviceId;
      this.userCustom.encoderCh = encoder.deviceCh;
      this.userCustom.encoderName = encoder.deviceName;
      this.userCustom = Object.assign({}, this.userCustom);
    },
  }
};
</script>
<style scoped>
 /deep/ .el-dialog {
  width: 780px;
  color: #fff;
}
.terminal-setting {
  /* height: 388px; */
  /* color: #0f5794; */
  text-align: -moz-left;
  /* overflow: hidden; */
}
.float-left {
  float: left;
}
.terminal-setting .mainWrap {
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.terminal-setting .user-setting-btn {
  width: 100px;
  height: 100%;
  float: left;
  box-sizing: border-box;
  background: #e9f3fa;
  text-align: center;
  border: 1px solid #c2dff3;
}
.terminal-setting .user-setting-btn > span {
  display: inline-block;
  /* width:80%; */
  height: 42px;
  /* border:1px solid #e9f3fa; */
  text-align: center;
  line-height: 42px;
  /* background:#e9f3fa; */
  /* margin-left: 20px; */
  /* margin-top: 3px; */
  color: #2e3c42;
  font-size: 14px;
}
.terminal-setting .user-setting-list {
  float: right;
  /* width: 610px; */
  width: 100%;
  height: 72%;
  border: 1px solid #c2dff3;
  box-sizing: border-box;
  /* margin-left: 20px; */
  /* margin-top: 3px; */
}
.terminal-setting .user-setting-list .strip {
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  box-sizing: border-box;
  /* border-top: 1px solid #95bad0; */
}
.terminal-setting .user-setting-list .strip1 {
  border-bottom: 1px solid #c2dff3;
  color: #2e3c42;
}
.terminal-setting .user-setting-list .strip2 {
  color: #0f5794;
}
.terminal-setting .user-setting-list .strip3 {
  border-top: 1px solid #c2dff3;
  border-bottom: 1px solid #c2dff3;
  color: #2e3c42;
}
.terminal-setting .user-setting-list .strip4 {
  height: 75px;
  margin-bottom: 20px;
  color: #2e3c42;
}
.terminal-setting .user-setting-list .strip4 .urlClass {
  /* width: calc(100% - 130px); */
  margin-left: 20px;
}
.terminal-setting .user-setting-list .strip4 .urlClass input {
  width: 380px;
  height: 40px;
  border: 1px solid #c2dff3;
  color: #2e3c42;
  padding: 0 5px;
}
.terminal-setting .user-setting-list .strip4 .selectUrlClass {
  width: 36px;
  height: 40px;
  margin-left: 10px;
  /* border: 1px solid #c2dff3; */
}
.terminal-setting .user-setting-list .strip4 .selectUrlClass .select_point {
  display: inline-block;
  cursor: pointer;
  border: 0;
  border-radius: 0;
  width: 100%;
  height: 100%;
  background: url(../../../static/common/more_icon.png) no-repeat;
}
.terminal-setting
  .user-setting-list
  .strip4
  .selectUrlClass
  .select_point:hover {
  background: url(../../../static/common/more_icon_active.png)
    no-repeat;
}
.terminal-setting
  .user-setting-list
  .strip4
  .selectUrlClass
  .select_point.is-disabled{
    background: url(../../../static/common/more_icon_disabled.png)
    no-repeat;
    cursor: default;
  }
.terminal-setting .user-setting-list .strip:nth-child(2n + 1) {
  background: #e9f3fa;
  text-align: left;
}
.terminal-setting .termina-setting-btn {
  position: absolute;
  bottom: 20px;
  right: 24px;
}
.terminal-setting .firstInput,
.terminal-setting .secondInput {
  display: inline-block;
  position: relative;
  width: 80px;
  margin-left: 20px;
}
.terminal-setting .form-input-block {
  margin-left: 0;
  width: 100%;
}
.terminal-setting .form-input-block input {
  position: absolute;
  top: 10px;
  left: -20px;
}
.terminal-setting .form-input-block input:nth-child(2) {
  margin-left: 10px;
}
.terminal-setting .dialog-footer {
  margin-top: 20px;
  text-align: center;
}
.callSettingBox{
    margin-right: 100px;
}
.radioMargin{
  margin-right: 90px;
}
.item-wrapper {
  padding-bottom: 20px;
}
.item-content {
  margin: 20px;
}
.item-list {
  margin-top: 10px;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
}
.item-list-restar {
  padding-left: 20px;
  background-color: #e9f3fa;
  height: 36px;
  line-height: 36px;
}
.item-list-content {
  box-sizing: border-box;
  padding: 10px 20px;
  font-size: 0;
}
.item-list-select {
  display: inline-block;
  width: 50%;
  font-size: 14px;
  height: 40px;
}
.item-list-select label,
.item-list-input label {
  display: inline-block;
  width: 60px;
  vertical-align: middle;
  font-size: 14px;
}
.item-list-select .item-select {
  display: inline-block;
  vertical-align: middle;
  height: 40px;
  width: 170px
}
.item-list-input {
  display: inline-block;
  vertical-align: middle;
  width: 300px;
  height: 40px;
  line-height: 40px;
  font-size: 0;
}
.item-list-input .item-input {
  display: inline-block;
  width: 240px;
  height: 40px;
  font-size: 14px;
}
.item-list-input label {
  vertical-align: top;
}
/deep/.item-list-input .item-input .el-input__inner {
  padding: 0;
}
.item-list-other {
  display: inline-block;
  width: 172px;
  height: 40px;
  text-align: right;
  margin-top: 10px;
}
.item-list-btn {
  height: 40px;
}
.item-list-other img {
  width: 32px;
  display: inline-block;
  vertical-align: middle;
  padding-right: 13px;
}
</style>
