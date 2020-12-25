<template>
   <div class="setting">
         <el-dialog  :visible.sync="visible" title="系统设置" width="1084px" center class="custom-dialog" @close="closeDialog">
                 <el-tabs v-model="TabName" tab-position="left" style="height: 580px;"  @tab-click="handleClick">
                        <!-- <el-tab-pane label="文件管理" name="fileTab">
                            <div class="main-content">
                                <div class="text-size18">图片抓拍</div>
                                <div class="filemanage">
                                    默认把抓拍的图片保存到此文件夹中：
                                    <el-input class="filePath" v-model="filePath" ></el-input>
                                    <el-button class="changePathbtn" type="text" >更改目录</el-button>
                                </div>
                            </div>
                        </el-tab-pane> -->
                        <el-tab-pane label="字符叠加" name="OsdTab"> 
                             <div class="main-content_Osd">
                              <osd-manage-dialog ref="osdManageDialog" @sendValue="sendValueFun"/>
                            </div>
                        </el-tab-pane>
                 </el-tabs>
                <div v-if="TabName=='fileTab'" class="footbtn"> 
                    <el-button class="canclebtn" @click="closeDialog" size="small">取 消</el-button>
                    <el-button type="primary" size="small">确 认</el-button>
                </div>
                 <div v-if="TabName=='OsdTab'" class="footbtn"> 
                     <el-button  type="primary" @click="applyOsFun" size="small">应用字幕</el-button>
                    <el-button class="canclebtn" @click="closeDialog" size="small">取 消</el-button>
                    <el-button type="primary" size="small" @click="saveOsd">确 认</el-button>
                </div>
        </el-dialog>

        <apply-os-dialog ref="applyOsDialog"/>
   </div> 
</template>

<script>
import OsdManageDialog from '@/components/home/OsdManageDialog6.vue';
import applyOsDialog from '@/components/home/applyOsDialog.vue';
export default {
    name:'settingConference',
     components: {
        OsdManageDialog,
        applyOsDialog
    },
   
    data () {
        return {
            visible:false,
            activeIndex:'1',
            savetype:"auto",
            filePath:'',
            timer:null,
            TabName:"OsdTab",
            applyOsdForm: {
                resName: '',
                resId: '',
                applyIndex: '1',
                applyType: '1',
            },
        }
    },
    mounted(){

    },
    methods: {
        empty(){
            this.applyOsdForm={
                resName: '',
                resId: '',
                applyIndex: '1',
                applyType: '1',
            }
        },
        showDialog(){
            this.visible = true
               this.$nextTick(() => {
            this.$refs.osdManageDialog.initTree();   
               })
        },
        closeDialog(){
            this.visible = false      
            this.$refs.osdManageDialog.closedDialog();    
            this.empty()
        },
        //点击tab按钮功能
        handleClick(tab, event){
            console.log(tab, event);
        //    if(tab.name=="osdTab"){
        //        this.$refs.osdManageDialog.showDialog();
        //    }
        },


        // handleSelect(key, keyPath) {
        //     this.activeIndex = key
        // },
        // changefilePathFun(){
        // //   var fileSave=new ActiveXObject("MSComDlg.CommonDialog");
        // //   fileSave.MaxFileSize=128;
        // //   fileSave.Filter="*.bmp";
        // //   fileSave.FilterIndex=2;
        // //   fileSave.fileName=mydate.toLocaleString().replace("","").replace("年","").replace("月","").replace("日","").replace(reg,"");
        // //   fileSave.DialogTitle="请选择图片存储路径";
        // //   fileSave.ShowSave();//指定目录
        // //   fileSave.ShowOpen();//打开文件
        // // document.execCommand("SaveAs")
        // this.saveImage()
        // },
        // saveImage(){
        //     event.returnValue=false;
        //     show.window.location.href=img.src;
        //     this.timer=setInterval(this.saveAs,500)
        // },
        // saveAs(){
        //     if(frame.readyState!=complete){
        //         frame.document.execCommand("SaveAs");
        //         clearInterval(this.timer)
        //     }
        // },


        // downLoadImage(imagePathUrl){
        //     if(!document.getElementById("_SAVEASIMAGE_TEMP_FRAME")){
        //         jQuery('<iframe style="display:none;" id="_SAVEASIMAGE_TEMP_FRAME" name="_SAVEASIMAGE_TEMP_FRAME" @onload="_doSaveAsImage();" width="0" height="0" src="about:blank"></iframe>').appendTo("body")
        //     }
        //     if(document.all._SAVEASIMAGE_TEMP_FRAME.src!=imagePathUrl){
        //         document.all._SAVEASIMAGE_TEMP_FRAME.src=imagePathUrl
        //     }else{
        //         this._doSaveAsImage();
        //     }


        // },
        // _doSaveAsImage(){
        //       if(document.all._SAVEASIMAGE_TEMP_FRAME.src!="about:blank"){
        //         document.frames("_SAVEASIMAGE_TEMP_FRAME").document.execCommand("SaveAs");
        //     }   
        // },
        //点击节点
        sendValueFun(value){
            this.applyOsdForm=value;
        },
        // 应用字幕
        applyOsFun(){
            this.$refs.applyOsDialog.showDialog(this.applyOsdForm);
        },
        //保 存
        saveOsd(){
            this.$refs.osdManageDialog.saveOsd();
        }
    }
}
</script>

<style scoped>
/deep/ .el-dialog{
    /* background: none!important; */
   
}
.setting .custom-dialog /deep/ .el-tabs{
border:none;
}
.setting .custom-dialog /deep/ .el-tabs__header{
    padding:0;
  background-color:transparent;
}

.setting  .custom-dialog /deep/ .el-dialog__body {
    padding: 15px 20px 20px 0;
}
.setting .custom-dialog /deep/ .el-tabs__item,
.setting .custom-dialog /deep/ .el-tabs__item:last-child,
.setting .custom-dialog /deep/ .el-tabs--top .el-tabs--left>.el-tabs__header .el-tabs__item:nth-child(2){
    color:#B7C1D0 ;
    padding:0 20px!important;
}
.setting .custom-dialog /deep/ .el-tabs__item.is-active{
    color:#fff;
}
.setting .custom-dialog /deep/ .el-tabs__active-bar{
    height: 0!important;
}
.setting .custom-dialog /deep/ .el-tabs__nav-wrap::after{
    background-color:transparent;
}
.setting .custom-dialog /deep/  .el-tabs--left .el-tabs__item.is-left{
    text-align: center;
}
.setting .custom-dialog /deep/  .el-tabs__content {
  background: transparent;
  height: 100%;
}
.el-tab-pane{
    width: 100%;
    height: 100%;
}
.main-content,
.main-content_Osd{
    height: 100%;
    /* height: calc(100% - 50px); */
    background: url(../../../static/stratege/form-bg.png) no-repeat;
    border: 2px solid #356BB0;
    background-size: 100% 100%;
    color:#B7C1D0;
    padding: 10px 20px;
    box-sizing: border-box;
    overflow: auto;
}
.main-content_Osd{
    padding: 0px;
}
.footbtn{
    margin-top: 10px;
    padding: 0 200px;
    text-align:center;
}
.canclebtn{
    border-color: #6B7C92;
      background-color:transparent;
      color:#ABB3C4
}
.canclebtn:hover{
    color:#fff;
}
.text-size18{
    font-size: 18px;
}
.filemanage{
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.filePath{
    width: 500px;
    margin: 0 5px;
}
.filePath /deep/ .el-input__inner{
    border-color: #6B7C92;
    background-color:transparent;
}
.custom-dialog  /deep/  .el-button--text.changePathbtn{
    text-decoration: underline;
}
</style>