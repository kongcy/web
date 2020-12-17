<template>
    <el-dialog
            :visible.sync="isVisible"
            title="编码源设置"
            width="300px"
            class="custom-dialog"
            :before-close="handleClose">
            <div class="cscWrap">
                <div class="codingSourceItem">
                    <span class="label">帧&nbsp;&nbsp;&nbsp;&nbsp;率</span>
                    <el-input v-model="IFameRateValue" placeholder="请输入" @blur="handleIFameRateInputBlur"></el-input>
			        <span class="unitLabel">帧</span>
			        <!-- <span class="setBtn IFameRate">设置</span> -->
                </div>
                <div class="codingSourceItem">
                    <span class="label">比特率</span>
                    <el-input v-model="bitRateValue" placeholder="请输入" @blur="handleBitRateInputBlur"></el-input>
			        <span class="unitLabel">Kbps</span>
			        <!-- <span class="setBtn IFameRate">设置</span> -->
                </div>
                <div class="codingSourceItem">
                    <span class="label">分辨率</span>
                    <el-select v-model="resolutionRateValue" placeholder="请选择">
                        <el-option
                            v-for="item in resolutionRateItems"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
			        <!-- <span class="unitLabel">帧</span> -->
			        <!-- <span class="setBtn IFameRate">设置</span> -->
                </div>
                <span class="newSetBtn" @click="handleSetImageParameters">设置</span>
            </div>
            <div class="cscWrap cscWrap01">
                <div class="codingSourceItem">
                    <span class="label">I帧间隔</span>
                    <el-input v-model="IFameIntervalValue" placeholder="请输入" @blur="handleIFameIntervalInputBlur"></el-input>
			        <span class="unitLabel">秒</span>
			        <!-- <span class="setBtn IFameRate">设置</span> -->
                </div>
                <span class="newSetBtn" @click="handleSetIFameInterval">设置</span>
            </div>
            <div class="cscWrap">
                <div class="codingSourceItem">
                    <span class="label">I帧更新</span>
                    <span class="newSetBtn2" @click="handleSetIFrame">设置</span>
                </div>
            </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'codingSourceConfig',
    data() {
        return {
            isVisible: false,
            deviceId:'',
            IFameRateValue:'5',
            bitRateValue:'64',
            resolutionRateValue:'1920*1080',
            resolutionRateItems:[
                {label:'1920*1080',value:'1920*1080'},
                {label:'1280*800',value:'1280*800'},
                {label:'1280*720',value:'1280*720'},
                {label:'1024*768',value:'1024*768'},
                {label:'720*576',value:'720*576'},
                {label:'704*576',value:'704*576'},
                {label:'352*288',value:'352*288'},
                {label:'176*144',value:'176*144'},
            ],
            IFameIntervalValue:'30',
        }
    },
    methods: {
        showDialog(deviceId) {
            this.isVisible = true;
            this.deviceId = deviceId;
        },
        handleIFameRateInputBlur(){
            if( this.IFameRateValue < 5 ){
                this.IFameRateValue = 5;
            }else if( this.IFameRateValue > 60 ){
                this.IFameRateValue = 60;
            }
        },
        handleBitRateInputBlur(){
            if( this.bitRateValue < 64 ){
                this.bitRateValue = 64;
            }else if( this.bitRateValue > 1200 ){
                this.bitRateValue = 1200;
            }
        },
        handleIFameIntervalInputBlur(){
            if( this.IFameIntervalValue < 30 ){
                this.IFameIntervalValue = 30;
            }else if( this.IFameIntervalValue > 65535 ){
                this.IFameIntervalValue = 65535;
            }
        },
        // 设置图像参数
        handleSetImageParameters(){
            let framerate = this.IFameRateValue;
			let bitrate = this.bitRateValue;
			let resolutionrate = this.resolutionRateValue;
            if( framerate && bitrate && resolutionrate ){
                this.apiSDK.setImageSession(this.deviceId, framerate, bitrate, resolutionrate);
            }
        },
        // 设置I帧间隔
        handleSetIFameInterval(){
            let interval = this.IFameIntervalValue;
            if( interval ){
			    this.apiSDK.setIFrameInterval(this.deviceId, interval);
            }
        },
        // 强制I帧
        handleSetIFrame(){
            this.apiSDK.setIFrame(this.deviceId);
        },
        handleClose() {
            this.isVisible = false;
        },
    },
}
</script>

<style scoped>
.cscWrap {
    width: 100%;
    box-sizing: border-box;
}
.cscWrap01{
    padding-top: 20px;
    padding-bottom: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    border-top:1px solid #ddd;
    border-bottom:1px solid #ddd;
}
.cscWrap .codingSourceItem{
    align-items: center;
	margin: 10px 0;
	font-size: 12px;
}
.cscWrap .codingSourceItem .label{
    display: inline-block;
    width: 42px;
    height: 26px;
    line-height: 26px;
	text-align: center;
	font-size: 12px;
}
.cscWrap .codingSourceItem .unitLabel{
	display: inline-block;
    width: 40px;
    height: 26px;
    line-height: 26px;
	text-align: left;
	font-size: 12px;
	margin-left: 2px;
}
.cscWrap .codingSourceItem .el-input,
.cscWrap .codingSourceItem .el-select{
	display: inline-block;
	width:150px;
	height: 26px;
	/* border-style: none; */
	/* border:1px solid #409eff; */
	border-radius: 4px;
	box-sizing: border-box;
	color:#409eff;
	/* background:transparent; */
	margin-left: 10px;
}
/deep/.cscWrap .codingSourceItem .el-input__inner{
    height: 26px;
    line-height: 26px;
    font-size: 12px;
}
/deep/.cscWrap .codingSourceItem .el-input__icon{
    line-height: 26px;
}
/deep/.cscWrap .codingSourceItem .el-select-dropdown__item{
    height: 26px;
    line-height: 26px;
}
.cscWrap .codingSourceItem .setBtn{
	display: inline-block;
	float: right;
    width: 40px;
    height: 26px;
    box-sizing: border-box;
    border: 1px solid #409eff;
    border-radius: 5px;
    text-align: center;
    line-height: 26px;
    cursor: pointer;
    font-size: 12px;
	margin-right: 5px;
}
.cscWrap .newSetBtn{
	display: block;
	width: 50px;
	height: 24px;
	box-sizing: border-box;
    border: 1px solid #409eff;
    border-radius: 5px;
    text-align: center;
    line-height: 24px;
    cursor: pointer;
    font-size: 12px;
	margin: 0px auto;
}
.cscWrap .newSetBtn2{
    display: inline-block;
    width: 50px;
	height: 24px;
	box-sizing: border-box;
    border: 1px solid #409eff;
    border-radius: 5px;
    text-align: center;
    line-height: 24px;
    cursor: pointer;
    font-size: 12px;
	margin-left: 10px;
}
</style>