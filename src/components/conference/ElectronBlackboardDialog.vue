<template>
    <el-dialog :visible.sync="visible" el-drag-dialog title="电子白板" :width="largeOrSmall?'1300px':maxWidth+'px'" :top="largeOrSmall?'10vh':'0px'" :style="{'marginLeft': largeOrSmall?left+'px':'0px'}" id="ElectronBlackboard" class="custom-dialog" :modal=false :close-on-click-modal=false :close-on-press-escape=false @close="closeDialog" style="background:#fff;">
        <div>
            <span slot="footer" class="dialog-footer">
                <i :class="largeOrSmall?'el-icon-recover':'el-icon-minus'" @click="changeWindowSize"></i>
            </span>
            <iframe ref="iframe" id="aIframe" name="bIframe" :src="blackBoardUrl" width="100%" :height="largeOrSmall?'700px':maxHeight+'px'" frameborder="0" scrolling="no">
            </iframe>
        </div>
    </el-dialog>
</template>
<script>
export default {
    name: "ElectronBlackboardDialog",
    data() {
        return {
            visible: false,
            blackBoardUrl: "",
            largeOrSmall: true,
            maxWidth: "",
            maxHeight: "",
            left: 160,
            data: null,
        };
    },
    methods: {
        showDialog(data) {
            if (!this.data) {
                this.data = data;
            }
            this.visible = true;
            let baseUrl = this.apiSDK.config.electronBlackboardUrl;
            let { userId, userName } = xtxk.cache.get("USER");
            let isChairman = userName === this.data.chairman ? true : false;
            this.blackBoardUrl = `${baseUrl}?room=${this.data.sceneID}&isChairman=${isChairman}&user=${userId}|${userName}&width=${this.maxWidth}$height=${this.maxHeight}`;
            console.log("电子白板地址", this.blackBoardUrl);
            //发送电子白板通知
            this.apiSDK.publishWhiteBoard(this.data.sceneID, userId, true);
        },
        closeDialog() {
            this.blackBoardUrl = "";
            this.visible = false;
            this.largeOrSmall = true;
            let { userId, userName } = xtxk.cache.get("USER");
            this.apiSDK.publishWhiteBoard(this.data.sceneID, userId, false);
            // this.data = null;
        },
        // 获取白板最大尺寸
        getSize() {
            this.maxHeight = window.innerHeight - 46;
            this.maxWidth = window.innerWidth;
        },
        //动态修改窗口尺寸
        changeWindowSize() {
            //计算电子白板最大弹窗尺寸
            this.largeOrSmall = !this.largeOrSmall;
            if (!this.largeOrSmall) {
                this.getSize();
            } else {
                this.left = 40 + (window.innerWidth - 40 - 40 - 300 - 1300) / 2;
            }
            this.showDialog();
        }
    },
    created() {
        if (this.largeOrSmall) {
            this.getSize();
        }
    },
    mounted() {
        window.addEventListener("message", event => {
            setTimeout(() => {
                this.closeDialog();
            }, 2000);
        });
    }
};
</script>

<style scoped>
#ElectronBlackboard /deep/ .el-dialog{
    background:#fff;
}
/deep/ .el-dialog__body,
/deep/ .custom-dialog .el-dialog__body,
/deep/ .el-dialog--center .el-dialog__body {
    padding: 0px !important;
}

.dialog-footer {
    position: absolute;
    right: 35px;
    top: 12px;
}
.dialog-footer {
    cursor: pointer;
    color: #fff;
}
/deep/ .el-dialog {
    margin: 0px;
}
.el-icon-recover{
    width: 16px;
    height: 16px;
    background: url(../../../static/scene/ico_maximize.png) center no-repeat;
}
</style>