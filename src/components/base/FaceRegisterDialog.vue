<template>
  <el-dialog :visible.sync="isVisible" title="人脸采集" width="560px" center class="custom-dialog" @closed="closedDialog">
    <div class="faceRegWrap">
      <div class="user-media-error" v-if="mediaState === 0">
          <img src="../../../static/face/error.png" style="width:100px;height:100px">
          <p>未找到媒体设备</p>
          <br />
      </div>
      <div v-if="mediaState === 1">
        <div class="user-media-error" v-if="isFinshed">
          <br/>
          <img src="../../../static/face/error.png" v-if="resMessage.type=='error'" style="width:100px;height:100px">
          <img src="../../../static/face/error.png" v-if="resMessage.type=='noface'" style="width:100px;height:100px">
          <img src="../../../static/face/success.png" v-if="resMessage.type=='success'" style="width:100px;height:100px"><br/>
          <p>&nbsp;{{resMessage.title}}</p>
          <br />
        </div>
        <div v-else>
          <el-row style="height: 85px;line-height: 85px;border-bottom: 1px solid #ddd;">
            <div class="xtxk-step">
              <el-steps :space="100" :active="step" finish-status="success">
                <el-step v-for="i in 5" :key="i"></el-step>
              </el-steps>
            </div>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <div class="user-media">
                <p class="msg-title">{{tipsList[step]}}</p>
                <video id="video" width="210" height="240" style="object-fit: fill;"></video>
                <canvas style="display:none;" id="canvas" width="210" height="240"></canvas>
                <div style="margin-top: 10px;"></div>
                <!-- <p class="tips">人脸信息采集中</p> -->
              </div>
            </el-col>
            <el-col :span="12">
              <div class="user-photo">
                <p>&nbsp;</p>
                <img v-if="photo !== ''" :src="photo" width="210" height="240" />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <div v-if="!isFinshed">
          <el-button @click="getImage">拍照</el-button>
          <el-button :disabled="nextDisabled" v-if="!isSaveBtn" @click="next">下一步</el-button>
          <el-button v-if="isSaveBtn" :disabled="nextDisabled" @click="saveAPI">保存</el-button>
        </div>
        <el-button v-else @click="isVisible = false">关闭</el-button>
        <el-button v-if="isRestart" @click="clearData">重新采集</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "FaceRegisterDialog",
  data() {
    return {
      isVisible: false,
      tipsList: [
        "请正脸面对摄像头",
        "请像右扭头20°",
        "向左扭头20°",
        "请向上抬头20°",
        "请向下低头20°",
        ""
      ],
      resMessage: {
        title: "访问摄像头失败",
        type: 'error'
      },
      step: 0,
      mediaState: 1, 
      photo: '',
      photoList: [],
      nextDisabled: true,
      isSaveBtn: false,
      isFinshed: false, // 流程结束
      isRestart: false, // 重新采集
      streamObj: null,
    };
  },
  created() {
    this.mediaState = 1;
  },
  mounted() {},
  methods: {
    getUserMedia() {
      xtxk.media.getUserMedia(
        { video: { width: 210, height: 240 } },
        this.getMediaSuccess,
        this.getMediaError
      );
    },
    getMediaSuccess(stream) {
      this.mediaState = 1;
      this.streamObj = stream;
      let video = document.getElementById("video");
      if ("srcObject" in video) {
        video.srcObject = stream;
      } else {
        video.src = xtxk.media.getStreamUrl(stream);
      }
      video.play();
    },
    getMediaError() {
      this.mediaState = 0;
      this.isFinshed = true;
      console.log("未找到媒体设备！！");
    },
    getImage() {
      let video = document.getElementById("video");
      let canvas = document.getElementById("canvas");
      let context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, 210, 240);
      let image = canvas.toDataURL("image/png");
      this.photo = image;
      this.nextDisabled = false;
    },
    next() {
      // photo保存数组
      this.photoList.push(this.photo);
      this.photo = '';
      this.step += 1;
      this.nextDisabled = true;
      if (this.step === 4) {
        this.isSaveBtn = true;
      }
    },
    saveAPI() {
      // 最后一张图片保存数组
      if (this.photoList.length === 5) {
        this.photoList.splice(4, 1, this.photo);
      } else {
        this.photoList.push(this.photo);
      }
      this.step += 1;
      this.nextDisabled = true;
      this.apiSDK.recognizationRegister(this.photo, res => {
        this.isFinshed = true;
        if (res && res.Ret === 0) {
          this.resMessage = {
            title: "采集成功",
            type: 'success'
          }
        }else if (res && res.Ret === 1) {
          this.resMessage = {
            title: "未识别到人脸",
            type: 'noface'
          }
          this.isRestart = true;
          this.streamObj.getTracks()[0].stop();
        } else {
          this.resMessage = {
            title: "采集失败",
            type: 'error'
          }
          this.isRestart = true;
          this.streamObj.getTracks()[0].stop();
        }
      });
    },
    // stopUserMedia() {
    //   if (this.mediaState === 1) {
    //     let video = document.getElementById("video");
    //     video.srcObject.getTracks()[0].stop();
    //     video.src = null;
    //   }
    // },
    showDialog() {
      this.clearData();
      this.isVisible = true;
      this.isFinshed = false;
      this.$nextTick(() => {
          xtxk.media.setDialogTop('人脸采集');
          this.getUserMedia();
      });
    },
    closedDialog(){
      if(this.streamObj) this.streamObj.getTracks()[0].stop();
    },
    clearData() {
      this.step = 0;
      this.photo = '';
      this.photoList = [];
      this.nextDisabled = true;
      this.isSaveBtn = false;
      this.isFinshed = false;
      this.isRestart = false;
      this.getUserMedia();
    }
  }
};
</script>
<style scoped>
.xtxk-step {
  width: 400px;
  margin: 0 auto;
}
.user-media {
  text-align: center;
}
.user-media .tips {
  color: #ccc;
}
.user-media-error {
  text-align: center;
}
.msg-title {
  height: 16px;
}
/*.user-media-error p{}*/

.faceRegWrap {
  padding: 0px 20px;
}
.dialog-footer {
  padding: 20px 0;
  text-align: center;
}
/deep/ .el-dialog__body {
  padding: 0px;
}
/deep/ .is-process .el-step__icon.is-text {
  border-color: #128bf1;
  background-color: #128bf1;
  width: 36px;
  height: 36px;
}
/deep/ .is-wait .el-step__icon.is-text {
  border-color: #b9d0ef;;
  background-color: #b9d0ef;
  width: 36px;
  height: 36px;
}
/deep/ .el-step__icon-inner {
  color: #fff;
  font-size: 16px;
}
/deep/ .el-step__icon-inner.el-icon-check {
  color: inherit;
  font-size: 16px;
}
/deep/ .el-step.is-horizontal .el-step__line {
  position: absolute;
  top: 42px;
  left: 38px;
  width: 40px;
}
</style>