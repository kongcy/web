<template>
   <div class="setting">
         <el-dialog  :visible.sync="visible" title="我的设置" width="800px" center class="custom-dialog" @close="closeDialog">
            <el-container style="height: 500px; border: 1px solid #eee">
                <el-aside width="200px" style="height: 500px;background-color: rgb(238, 241, 246)">
                    <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" @select="handleSelect">
                        <el-menu-item index="1">
                            <i class="el-icon-menu"></i>
                            <span slot="title">常规设置</span>
                        </el-menu-item>
                        <el-menu-item index="2">
                            <i class="el-icon-menu"></i>
                            <span slot="title">视频</span>
                        </el-menu-item>
                        <el-menu-item index="3">
                            <i class="el-icon-menu"></i>
                            <span slot="title">音频</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-container>
                    <el-main>
                        <div v-show="activeIndex == '1'" style="height: 100%; width:100%">
                            <div class="setting-item">
                                <el-checkbox v-model="isOpenCamera" @change="changeCheckBoxValue(isOpenCamera,'isOpenCamera')">开启摄像头</el-checkbox>
                            </div>
                            <div class="setting-item">
                                <el-checkbox v-model="isOpenMIC" @change="changeCheckBoxValue(isOpenMIC,'isOpenMIC')">开启麦克风</el-checkbox>
                            </div>
                            <div class="setting-item">
                                <el-checkbox v-model="isOpenAudio" @change="changeCheckBoxValue(isOpenAudio,'isOpenAudio')">入会时使用电脑音频</el-checkbox>
                            </div>
                            <div class="setting-item">
                                <el-checkbox v-model="audioType" @change="changeCheckBoxValue(audioType,'audioType')">语音模式</el-checkbox>
                                <span class="ck-desc">停止接收其他成员视频,仅保留屏幕共享。</span>
                            </div>
                            <div class="setting-item">
                                <el-checkbox v-model="inMeetingTime" @change="changeCheckBoxValue(inMeetingTime,'inMeetingTime')">显示参会时长</el-checkbox>
                            </div>
                        </div>
                        <div v-show="activeIndex == '2'">
                            <div>
                                <span>选择设备</span>
                                <el-select v-model="videoDecoder" :placeholder="placeholderTxt" class="decoder-select">
                                    <el-option
                                        v-for="item in videoDecoderList"
                                        :key="item.key"
                                        :label="item.svideoDecoderName"
                                        :value="item.videoDecoderId">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="setting-item">
                                <span>视频画面</span>
                                <div class="canvas-box">

                                </div>
                            </div>
                            <div class="setting-item">
                                <el-checkbox v-model="audioType" @change="changeCheckBoxValue(audioType,'audioType')">视频降噪</el-checkbox>
                                <span class="ck-desc">实时降低视频画面噪声，使画面更清晰。</span>
                            </div>
                        </div>
                        <div v-show="activeIndex == '3'">
                            音频
                        </div>
                    </el-main>
                    <el-footer>
                        <div class="btn-box">
                            <el-button>保存</el-button>
                            <el-button>取消</el-button>
                        </div>
                    </el-footer>
                </el-container>
            </el-container>
        </el-dialog>
   </div> 
</template>

<script>
export default {
    name:'settingConference',
    data () {
        return {
            visible:false,
            activeIndex:'1',
            isOpenCamera:false,
            isOpenMIC:false,
            audioType:false,
            isOpenAudio:false,
            inMeetingTime:false,
            placeholderTxt:'未检测到设备',
            videoDecoder:'',
            videoDecoderList:[]
        }
    },
    mounted(){

    },
    methods: {
        showDialog(){
            this.visible = true
        },
        closeDialog(){
            this.visible = false;   
            this.isOpenCamera = false;
            this.isOpenMIC = false;
            this.audioType = false;        
        },
        handleSelect(key, keyPath) {
            this.activeIndex = key
        },
        changeCheckBoxValue(value,type){
            console.log(type,value)
            if(type == 'isOpenCamera'){ 

            }else if(type == 'isOpenMIC'){

            }else if(type == 'isOpenAudio'){
                
            }else if(type == 'audioType'){
                
            }
        }
    }
}
</script>

<style scoped>
.el-menu-vertical-demo{
    height: calc(100% - 2px);
}
.setting-item{
    width: 100%;
    height: 50px;
    line-height: 30px;
}
.setting-item .el-checkbox{
    color: #333;
    font-weight: bolder;
}
/deep/ .el-checkbox__input.is-checked+.el-checkbox__label{
    color: #333;
    font-weight: bolder;
}
.ck-desc{
    display: block;
    line-height: 7px;
    margin-left: 24px;
    font-size: 13px;
    color: #909399;
}
.decoder{
    display: inline-block;
    width: 70%;
}
</style>