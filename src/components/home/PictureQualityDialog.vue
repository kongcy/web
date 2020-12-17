<template>
    <div>
        <el-dialog :visible.sync="isVisible" title="画质调节[资源对象名]" width="560px" height="520px" 
            :close-on-click-modal="false">
            <div class="picQuality">
                <div class="qualityItem color">
                    <span class="iconSpan"></span>
                    <span class="itemSpan">色&nbsp;&nbsp;&nbsp;&nbsp;彩</span>
                    <span class="plusSpan" @click="handlePlusColorValue"></span>
                    <el-slider class="qualitySlider" v-model="colorValue" :max="colorMaxValue" :min="colorMinValue"></el-slider>
                    <span class="minusSpan" @click="handleMinusColorValue"></span>
                    <span class="valueSpan">{{colorValue}}%</span>
                </div>
                <div class="qualityItem contrast">
                    <span class="iconSpan"></span>
                    <span class="itemSpan">对比度</span>
                    <span class="plusSpan" @click="handlePlusContrastValue"></span>
                    <el-slider class="qualitySlider" v-model="contrastValue" :max="contrastMaxValue" :min="contrastMinValue"></el-slider>
                    <span class="minusSpan" @click="handleMinusContrastValue"></span>
                    <span class="valueSpan">{{contrastValue}}%</span>
                </div>
                <div class="qualityItem brightness">
                    <span class="iconSpan"></span>
                    <span class="itemSpan">亮&nbsp;&nbsp;&nbsp;&nbsp;度</span>
                    <span class="plusSpan" @click="handlePlusBrightnessValue"></span>
                    <el-slider class="qualitySlider" v-model="brightnessValue" :max="brightnessMaxValue" :min="brightnessMinValue"></el-slider>
                    <span class="minusSpan" @click="handleMinusBrightnessValue"></span>
                    <span class="valueSpan">{{brightnessValue}}%</span>
                </div>
                <div class="qualityItem definition">
                    <span class="iconSpan"></span>
                    <span class="itemSpan">清晰度</span>
                    <span class="plusSpan" @click="handlePlusDefinitionValue"></span>
                    <el-slider class="qualitySlider" v-model="definitionValue" :max="definitionMaxValue" :min="definitionMinValue"></el-slider>
                    <span class="minusSpan" @click="handleMinusDefinitionValue"></span>
                    <span class="valueSpan">{{definitionValue}}%</span>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" class="btnCom" @click="handleConfirm">确定</el-button>
                <el-button class="btnCom" @click="closeDialog">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "PictureQualityControlDialog",
    components: {},
    data() {
        return {
            resourceId: '',
            resourceCh: 0,
            isVisible:false,
            colorValue:0,
            colorStep:1,
            colorMaxValue:100,
            colorMinValue:0,
            contrastValue:0,
            contrastStep:1,
            contrastMaxValue:100,
            contrastMinValue:0,
            brightnessValue:0,
            brightnessStep:1,
            brightnessMaxValue:100,
            brightnessMinValue:0,
            definitionValue:0,
            definitionStep:1,
            definitionMaxValue:100,
            definitionMinValue:0,
        }
    },
    methods:{
        showDialog(resourceId,resourceCh) {
            this.resourceId = resourceId;
            this.resourceCh=resourceCh;
            this.isVisible = true;
            this.colorValue = 0;
            this.contrastValue = 0;
            this.brightnessValue = 0;
            this.definitionValue = 0;
            this.getPictureQualities();
            this.$nextTick(() => {
              xtxk.media.setDialogTop('画质调节[资源对象名]');
            });
        },
        closeDialog(){
            this.isVisible = false;
        },
        // 获取调节参数
        getPictureQualities(){
            let that = this;
            this.apiSDK.getPictureQuality( this.resourceId, this.resourceCh, function(obj){
                // console.log(obj);   // {color:'',brightness:'',contrast:'',sharpness:''}
                if( obj ){
                    that.colorValue = obj.color;
                    that.contrastValue = obj.contrast;
                    that.brightnessValue = obj.brightness;
                    that.definitionValue = obj.sharpness;
                }
            });
        },
        // 色彩
        handlePlusColorValue(){
            if( this.colorValue === this.colorMaxValue || this.colorValue + this.colorStep >= this.colorMaxValue ){
                this.colorValue = this.colorMaxValue;
                return;
            }
            this.colorValue = this.colorValue + this.colorStep;
        },
        handleMinusColorValue(){
            if( this.colorValue === this.colorMinValue || this.colorValue - this.colorStep <= this.colorMinValue ){
                this.colorValue = this.colorMinValue;
                return;
            }
            this.colorValue = this.colorValue - this.colorStep;
        },
        // 对比度
        handlePlusContrastValue(){
            if( this.contrastValue === this.contrastMaxValue || this.contrastValue + this.contrastStep >= this.contrastMaxValue ){
                this.contrastValue = this.contrastMaxValue;
                return;
            }
            this.contrastValue = this.contrastValue + this.contrastStep;
        },
        handleMinusContrastValue(){
            if( this.contrastValue === this.contrastMinValue || this.contrastValue - this.contrastStep <= this.contrastMinValue ){
                this.contrastValue = this.contrastMinValue;
                return;
            }
            this.contrastValue = this.contrastValue - this.contrastStep;
        },
        // 亮度
        handlePlusBrightnessValue(){
            if( this.brightnessValue === this.brightnessMaxValue || this.brightnessValue + this.brightnessStep >= this.brightnessMaxValue ){
                this.brightnessValue = this.brightnessMaxValue;
                return;
            }
            this.brightnessValue = this.brightnessValue + this.brightnessStep;
        },
        handleMinusBrightnessValue(){
            if( this.brightnessValue === this.brightnessMinValue || this.brightnessValue - this.brightnessStep <= this.brightnessMinValue ){
                this.brightnessValue = this.brightnessMinValue;
                return;
            }
            this.brightnessValue = this.brightnessValue - this.brightnessStep;
        },
        // 清晰度
        handlePlusDefinitionValue(){
            if( this.definitionValue === this.definitionMaxValue || this.definitionValue + this.definitionStep >= this.definitionMaxValue ){
                this.definitionValue = this.definitionMaxValue;
                return;
            }
            this.definitionValue = this.definitionValue + this.definitionStep;
        },
        handleMinusDefinitionValue(){
            if( this.definitionValue === this.definitionMinValue || this.definitionValue - this.definitionStep <= this.definitionMinValue ){
                this.definitionValue = this.definitionMinValue;
                return;
            }
            this.definitionValue = this.definitionValue - this.definitionStep;
        },
        // 确定按钮
        handleConfirm(){
            let that = this;
            let color = that.colorValue + '%';
            let brightness = that.brightnessValue + '%';
            let contrast = that.contrastValue + '%';
            let sharpness = that.definitionValue + '%';
            // console.log('color='+color);
            // console.log('brightness='+brightness);
            // console.log('contrast='+contrast);
            // console.log('sharpness='+sharpness);
            this.apiSDK.adjustPictureQuality( this.resourceId, this.resourceCh, color, brightness, contrast, sharpness, function(obj){
                // console.log(obj); 
                if( obj && obj.Ret === 0 ){
                    that.getPictureQualities();
                    that.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                }else{
                    that.$message({
                        message: '保存失败',
                        type: 'error'
                    });
                }
            });
        },
    },
}
</script>

<style scoped>
/deep/ .el-dialog {
  border: 1px solid #0f5794;
  /* box-shadow: -3px 2px 12px 0px  rgba(0, 0, 0, 0.2); */
    /* border-radius: 5px; */
    background: #fff;
}
/deep/ .el-dialog__header {
  padding: 0px 15px;
  border-bottom: 1px solid rgb(52, 84, 151);
  text-align: -moz-left;
  background-color: #0f5794;
  text-align: left;
  height: 43px;
  line-height: 43px;
}
/deep/ .el-dialog__title {
  line-height: 24px;
  font-size: 18px;
  color: #fff;
}
/deep/ .el-dialog__headerbtn {
  cursor: pointer;
  width: 16px;
  height: 16px;
  outline: none;
  position: absolute;
  top: 12px;
  right: 15px;
}
/deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #fff;
  font-size: 18px;
}
/deep/ .el-dialog__body {
  padding: 0px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
  text-align: center;
}
/deep/ .el-dialog__footer {
  padding: 0;
  margin-top: 40px;
  margin-bottom: 40px;
  text-align: center;
}
/deep/ .btnCom {
  border: 0;
  width: 100px;
  height: 40px;
  border: 1px solid #ccc;
  background-size: 100% 100%;
  cursor: pointer;
  padding: 0;
  box-sizing: border-box;
}

.picQuality{
    padding: 50px 70px;
    margin: 10px;
    text-align: left;
    border-bottom: 1px solid #eee;
}
.picQuality .qualityItem{
    overflow: hidden;
}
.picQuality .color,
.picQuality .contrast,
.picQuality .brightness{
    margin-bottom: 60px;
}
.picQuality .qualityItem .iconSpan{
    display: inline-block;
    float: left;
    width:30px;
    height: 30px;
}
.picQuality .qualityItem.color .iconSpan{
    background:url("../../../static/pictureQualityControl/color.png") no-repeat;
    background-size:100% 100%;
}
.picQuality .qualityItem.contrast .iconSpan{
    background:url("../../../static/pictureQualityControl/contrast.png") no-repeat;
    background-size:100% 100%;
}
.picQuality .qualityItem.brightness .iconSpan{
    background:url("../../../static/pictureQualityControl/brightness.png") no-repeat;
    background-size:100% 100%;
}
.picQuality .qualityItem.definition .iconSpan{
    background:url("../../../static/pictureQualityControl/definition.png") no-repeat;
    background-size:100% 100%;
}
.picQuality .qualityItem .itemSpan{
    display: inline-block;
    float: left;
    width:45px;
    height: 30px;
    line-height: 30px;
    margin-left: 15px;
}
.picQuality .qualityItem .plusSpan{
    display: inline-block;
    float: left;
    width:35px;
    height: 26px;
    background:url("../../../static/holderControl/add.png") no-repeat;
    background-size:100% 100%;
    margin-left: 10px;
    margin-top: 2px;
    cursor: pointer;
}
.picQuality .qualityItem .qualitySlider{
    display: inline-block;
    float: left;
    width:140px;
    height: 30px;
    margin-left: 15px;
}
/deep/.picQuality .qualityItem .el-slider__runway{
    margin:12px 0;
}
.picQuality .qualityItem .minusSpan{
    display: inline-block;
    float: left;
    width:35px;
    height: 26px;
    background:url("../../../static/holderControl/reduce.png") no-repeat;
    background-size:100% 100%;
    margin-left: 15px;
    margin-top: 2px;
    cursor: pointer;
}
.picQuality .qualityItem .valueSpan{
    display: inline-block;
    float: left;
    width:45px;
    height: 30px;
    line-height: 30px;
    margin-left: 10px;
}
</style>