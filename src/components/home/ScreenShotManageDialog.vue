<template>
<div>
    <el-dialog :visible.sync="isVisible" title="截图管理" width="1300px" class="custom-dialog" @closed="closedDialog">
        <div class="screenShotMain">
            <div class="leftTreeWrap">
                <el-tabs>
                    <el-tab-pane label="组织结构">
                        <person-tree ref="personTreeScreenShot" :subscribeType="subscribeType" style="height: 688px;" @currentChange="personTreeCurrentChange"/>
                    </el-tab-pane>
                    <el-tab-pane label="设备资源">
                        <device-tree ref="deviceTreeScreenShot" :subscribeType="subscribeType" style="height: 688px;" @currentChange="deviceTreeCurrentChange"/>
                    </el-tab-pane>
                    <el-tab-pane label="常用资源">
                        <common-res ref="commonTreeScreenShot" :subscribeType="subscribeType" style="height: 693px;" @currentChange="commonTreeCurrentChange"/>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="recordWrap">
                <div class="recordSearchBox">
                    <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
                        <el-form-item label="检索对象" prop="name">
                            <el-input v-model="form.name" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="检索时段">
                            <el-form-item prop="startTime" style="margin-bottom:0">
                                <el-date-picker
                                    v-model="form.startTime"
                                    type="datetime"
                                    placeholder="选择开始日期时间">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item prop="endTime" style="margin-bottom:0">
                                <el-date-picker
                                    v-model="form.endTime"
                                    type="datetime"
                                    placeholder="选择结束日期时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item label="">
                            <div class="recordSearchBtn confirmSearchBtn" @click="submitForm('form')">检索</div>
                            <div class="recordSearchBtn concelSearchBtn" @click="resetForm('form')">重置</div>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="recordListBox">
                    <div class="recordListTitle">
                        <span>文件名</span>
                        <span>操作</span>
                    </div>
                    <div class="recordListMain">
                        <ul>
                            <li v-for="item in recordListArr" id="item.id" :key="item.id" :class="item.active===true?'active':''" @click="handleClickPicLi(item)">
                                <!-- <span class="picName">{{item.name}}</span> -->
                                <input type="text" :readonly="item.readonly" v-model="item.name" class="picInput_name" @blur="item.readonly === false && handleSavePic(item)">
                                <span class="group_delete_icon" @click="handleDeletePic(item)"></span>
                                <span class="group_edit_icon" @click="handleUpdatePic(item,$event)"></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="screenShotWrap">
                <div class="picWrap">
                    <!-- <img :src="previewPicUrl" alt="" :style="previewPicStyle"> -->
                    <div class="previewPicBox" :style="previewPicBoxStyle"></div>
                </div>
                <div class="picBarWrap">
                    <span class="picBar_smallIcon realSizeIcon" title="实际尺寸" @click="handleClickRealSize"></span>
                    <span class="picBar_smallIcon autoSizeIcon" title="适应窗口" @click="handleClickAutoSize"></span>
                    <!-- <span class="picBar_smallIcon zoomInIcon" title="放大"></span> -->
                    <!-- <span class="picBar_smallIcon zoomOutIcon" title="缩小"></span> -->
                    <span class="picBar_bigIcon previousIcon" title="上一张" @click="handleClickPreviousPic"></span>
                    <span class="picBar_bigIcon nextIcon" title="下一张" @click="handleClickNextPic"></span>
                    <span class="picBar_smallIcon downloadIcon" title="下载到本地" @click="handleDownloadPic"></span>
                    <!-- <span class="picBar_smallIcon folderIcon" title="打开本地保存文件夹"></span> -->
                </div>
            </div>
        </div>
    </el-dialog>
</div>
</template>

<script>
import PersonTree from "@/components/home/selectRes/PersonTree.vue";
import DeviceTree from "@/components/home/selectRes/DeviceTree.vue";
import CommonRes from "@/components/home/selectRes/CommonRes.vue";
import Enum from "@/common/enum";
export default {
    name: "ScreenShotManageDialog",
    components: {
        PersonTree,
	    DeviceTree,
	    CommonRes,
    },
    data() {
        var validateEndTime = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请选择时间'));
            } else if (value < this.form.startTime) {
                callback(new Error('结束时间不能早于开始时间'));
            } else {
                callback();
            }
      };
        return {
            isVisible: false,
            subscribeType: '',
            form:{
                name:'',
                startTime:'',
                endTime:'',
            },
            formRules:{
                name:[
                    { required: true, message: '请选择资源'},
                ],
                startTime:[
                    { required: true, message: ''},
                ],
                endTime:[
                    { validator: validateEndTime, trigger: 'blur' },
                ],
            },
            recordListArr:[],
            previewPicUrl:'',
            previewPicIndex:0,
            previewPicBoxStyle:'',
        }
    },
    mounted(){},
    methods: {
        showDialog() {
            this.isVisible = true;
            this.$nextTick(() => {
                xtxk.media.setDialogTop('截图管理');
            });
			this.initTree();
        },
        initTree(){
            // console.log('-----------------screenShot initTree----------------------');
            this.$nextTick(() => {
	          	const organId = "";
	          	this.subscribeType = Enum.enumSubscribeType.screenShot;
                  //订阅用户组织结构
                let subjectId = 0;
                //dj 默认 行政隶属
                this.$refs.personTreeScreenShot.relationshipValue = subjectId;
                this.$refs.deviceTreeScreenShot.relationshipValue = subjectId;

	          	this.apiSDK.getOrganizationUser(organId, this.subscribeType.subscribeOrganizationUser, subjectId ,(obj) => {
	            	// console.log(obj);
	            	this.$refs.personTreeScreenShot.setReceiveInformAddDepartmentCallback(obj);
                  });
	          	//获取设备组织结构
	          	this.apiSDK.getOrganizationDevice(organId, this.subscribeType.subscribeOrganizationDevice, subjectId, (obj) =>{
	            	//console.log(obj);
	            	this.$refs.deviceTreeScreenShot.setReceiveInformAddDepartmentCallback(obj);
	          	});
	          	//获取常用资源树
	          	this.apiSDK.subscribeCommonRes("", "", "", this.subscribeType.subscribeCommonResources);
	          	//资源回调
	          	this.apiSDK.setReceiveResourceStatusQueryCallback("screenShot", (obj) => {
	            	//console.log(obj);
                    this.$refs.personTreeScreenShot.setReceiveInformResourceStatusCallback(obj);
                    this.$refs.deviceTreeScreenShot.setReceiveInformResourceStatusCallback(obj);
                    this.$refs.commonTreeScreenShot.setReceiveInformResourceStatusCallback(obj);
	          	});
	        });
        },
        // 人员树选中节点
        personTreeCurrentChange(data) {
            // console.log(data);
            // console.log(JSON.stringify(data.data));
            if( data.data.nodeStatus == 'department' ){
                return;
            }
            this.form.name = data.data.name;
        },
        // 设备树选中节点
        deviceTreeCurrentChange(data){
            if( data.data.nodeStatus == 'department' ){
                return;
            }
            this.form.name = data.data.name;
        },
        // 常用资源树选中节点
        commonTreeCurrentChange(data){
            this.form.name = data.data.name;
        },
        // 检索
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.recordListArr = [];
                    // 获取截图列表
                    /* 测试数据
                    this.recordListArr = [
                        {
                            id:'001',
                            name:'测试用户01_图片01测试测试测试测试测试.jpg',
                            url:'static/examplePicture/4.jpg',
                            pixelX:'',
                            pixelY:'',
                            readonly:true,
                            active:false,
                        },
                        {
                            id:'002',
                            name:'测试用户02_图片02.jpg',
                            url:'static/examplePicture/3.png',
                            pixelX:'',
                            pixelY:'',
                            readonly:true,
                            active:false,
                        },
                        {
                            id:'003',
                            name:'测试用户03_图片03.jpg',
                            url:'static/examplePicture/1.bmp',
                            pixelX:'',
                            pixelY:'',
                            readonly:true,
                            active:false,
                        },
                    ];
                    */ 
                    /*
                    // 接口未实现
                    let resourceName = this.form.name;
                    let beginTime = this.form.startTime;
                    let endTime = this.form.endTime;
                    this.apiSDK.queryImagesList(resourceName,beginTime, endTime,(res)=>{
                        // console.log(res);
                        // resp =[{fileId:"",fileName:"",url:"",pixelX:"",pixelY:""}]
                        // 其中：url:是图片在服务器上面的请求路径路径,pixelX:X方向像素大小，pixelY:Y方向像素大小
                        if( res && res.length>0 ){
                            res.forEach(item => {
                                this.recordListArr.push({
                                    id:item.fileId,
                                    name:item.fileName,
                                    url:item.url,
                                    pixelX:item.pixelX,
                                    pixelY:item.pixelY,
                                    active:false,
                                    readonly:true,
                                });
                            });
                        }
                    });
                    */ 
                } else {
                    // console.log('error submit!!');
                    return false;
                }
            });
        },
        // 重置
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
        // 选择图片
        handleClickPicLi(item){
            // console.log('选择图片：'+item.name);
            for(let i=0;i<this.recordListArr.length;i++){
                this.recordListArr[i].active = false;
                if( item.id == this.recordListArr[i].id ){
                    this.previewPicIndex = i;
                }
            }
            item.active = true;
            this.previewPicUrl = item.url;
            this.previewPicBoxStyle = {
                backgroundImage:'url('+this.previewPicUrl+')',
                // backgroundPosition: 'left top',
                backgroundSize:'contain',
            };
        },
        // 编辑图片按钮
        handleUpdatePic(item,$event){
            // console.log(JSON.stringify(item));
            item.readonly = false;
            // console.log($event);
            var target = $event.target.parentNode.children[1];
            // console.log(target);
            target.focus();
        },
        // 修改图片名称
        handleSavePic(item){
            console.log('修改图片：'+item.name+'，id='+item.id);
            // 接口暂未实现
        },
        // 删除图片按钮
        handleDeletePic(item){
            // console.log(JSON.stringify(item));
            // console.log('删除图片：'+item.name+'，id='+item.id);
            this.$confirm('确认删除此图片吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 接口暂未实现
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 实际尺寸
        handleClickRealSize(){
            if( !this.previewPicUrl ){
                return;
            }
            this.previewPicBoxStyle = {
                backgroundImage:'url('+this.previewPicUrl+')',
                backgroundSize:'contain',
            };
        },
        // 适应窗口
        handleClickAutoSize(){
            if( !this.previewPicUrl ){
                return;
            }
            this.previewPicBoxStyle = {
                backgroundImage:'url('+this.previewPicUrl+')',
                backgroundSize:'100% 100%',
            };
        },
        // 上一张
        handleClickPreviousPic(){
            if( !this.previewPicUrl ){
                return;
            }
            if( this.previewPicIndex === 0 ){
                return;
            }
            this.previewPicIndex = this.previewPicIndex - 1;
            this.previewPicUrl = this.recordListArr[this.previewPicIndex].url;
            this.previewPicBoxStyle = {
                backgroundImage:'url('+this.previewPicUrl+')',
                backgroundSize:'contain',
            };
        },
        // 下一张
        handleClickNextPic(){
            if( !this.previewPicUrl ){
                return;
            }
            let len = this.recordListArr.length;
            if( this.previewPicIndex === len - 1 ){
                return;
            }
            this.previewPicIndex = this.previewPicIndex + 1;
            this.previewPicUrl = this.recordListArr[this.previewPicIndex].url;
            this.previewPicBoxStyle = {
                backgroundImage:'url('+this.previewPicUrl+')',
                backgroundSize:'contain',
            };
        },
        // 下载
        handleDownloadPic(){
            if( !this.previewPicUrl ){
                return;
            }
            window.open(this.previewPicUrl);
        },
        closedDialog(){
            //清空
            this.$refs.personTreeScreenShot.clearTree();
            this.$refs.deviceTreeScreenShot.clearTree();
            this.$refs.commonTreeScreenShot.clearTree();
            //取消订阅
            const subIDs = new Array(this.subscribeType.subscribeOrganizationUser,this.subscribeType.subscribeUsersStatus,
   						 this.subscribeType.subscribeUsersStatusByKey,this.subscribeType.subscribeUsersStatusByStatus,this.subscribeType.subscribeOrganizationDevice,
   						 this.subscribeType.subscribeDevicesStatus,this.subscribeType.subscribeDevicesStatusByKey,this.subscribeType.subscribeDevicesStatusByStatus,
   						 this.subscribeType.subscribeCommonResources,this.subscribeType.subscribeCommonResourcesByKey,this.subscribeType.subscribeCommonResourcesByStatus);
            this.apiSDK.cancelSubscribeResourceStatus(subIDs.join(","), "all");
        },
    },
}
</script>

<style scoped>
.screenShotMain{
    height: 740px;
    overflow: hidden;
}
.screenShotMain .leftTreeWrap{
    display: inline-block;
    float: left;
    width: 300px;
    height: 100%;
    /* border:1px solid #c8cdd5; */
    box-sizing: border-box;
}

.screenShotMain .recordWrap{
    display: inline-block;
    float: left;
    width: 300px;
    height: 100%;
    margin-left: 10px;
    margin-right: 10px;
}
.recordWrap .recordSearchBox{
    display: inline-block;
    width: 100%;
    height: 192px;
    border:1px solid #c8cdd5;
    box-sizing: border-box;
    margin-bottom: 10px;
    float: left;
    background: #eee;
}
.recordSearchBox .el-form{
    padding-top: 15px;
}
.recordSearchBox .el-form-item{
    margin-bottom: 15px;
    padding-right: 15px;
}
/deep/.recordSearchBox .el-input.is-disabled .el-input__inner{
    color: #2e3c42;
}
/deep/.recordSearchBox .el-form-item__label,
/deep/.recordSearchBox .el-form-item__content,
/deep/.recordSearchBox .el-input__icon{
    line-height: 32px;
}
/deep/.recordSearchBox .el-input__inner{
    height: 32px;
    line-height: 32px;
}
/deep/.recordSearchBox .el-date-editor.el-input, 
/deep/.recordSearchBox .el-date-editor.el-input__inner{
    width: 100%;
}
/deep/.recordSearchBox .el-input--suffix .el-input__inner{
    padding-right: 0;
}
/deep/.recordSearchBox .el-input__suffix .el-input__icon{
    display: none;
}
.recordSearchBox .recordSearchBtn{
    display: inline-block;
    width: 60px;
    height: 30px;
    margin-top: 4px;
    margin-right: 10px;
    line-height: 30px;
    text-align: center;
    color:#fff;
    border-radius: 6px;
    cursor: pointer;
    box-sizing: border-box;
}
.recordSearchBox .confirmSearchBtn{
    background: #128bf1;
}
.recordSearchBox .concelSearchBtn{
    background-color: #fff;
    color:#666;
    border: solid 1px #dcdfe6;
}
.recordWrap .recordListBox{
    display: inline-block;
    width: 100%;
    height: calc(100% - 202px);
    border:1px solid #c8cdd5;
    box-sizing: border-box;
}
.recordListBox .recordListTitle{
    width: 100%;
    height: 36px;
    line-height: 36px;
	background-color: #e9f3fa;
    box-sizing: border-box;
    padding: 0 30px;
}
.recordListBox .recordListTitle span{
    color: #323232;
}
.recordListBox .recordListTitle span:nth-child(2){
    display: inline-block;
    float: right;
}
.recordListBox .recordListMain{
    width: 100%;
	height: calc(100% - 40px);
    overflow: auto;
}
.recordListMain ul{
    padding: 0;
    margin: 0;
}
.recordListMain ul li{
    list-style-type: none;
    text-align: left;
    height: 36px;
    line-height: 36px;
    padding-left: 10px;
}
.recordListMain ul li.active{
    background: #b1e0ff;
}
.recordListMain ul li .picName{
    display: inline-block;
    width:180px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:14px;
    line-height: 24px;
    vertical-align: middle;
    color: #333;
}
.recordListMain ul li .picInput_name{
    display: inline-block;
    width:180px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:14px;
    line-height: 24px;
    vertical-align: middle;
    color: #333;
    border: none;
    background: transparent;
}
.recordListMain ul li .group_edit_icon{
    display: inline-block;
    float: right;
    width: 20px;
    height: 20px;
    background:url("../../../static/prepointsManage/update_icon.png");
    background-repeat:no-repeat;
    background-size:cover;
    vertical-align: middle;
    margin-top: 8px;
    margin-right: 15px;
    cursor:pointer;
}
.recordListMain ul li .group_delete_icon{
    display: inline-block;
    float: right;
    width: 20px;
    height: 20px;
    background:url("../../../static/prepointsManage/delPrepare.png");
    background-repeat:no-repeat;
    background-size:cover;
    vertical-align: middle;
    margin-top: 8px;
    margin-right: 15px;
    cursor:pointer;
}

.screenShotMain .screenShotWrap{
    display: inline-block;
    /* float: left; */
    width: calc(100% - 620px);
    height: 100%;
    border:1px solid #c8cdd5;
    box-sizing: border-box;
}
.screenShotWrap .picWrap{
    width: 100%;
	height: calc(100% - 70px);
}
.screenShotWrap .previewPicBox{
    width: 100%;
    height: 100%;
    background-image:url(../../../static/screenShot/img_photo.png);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 160px 120px;
}
.screenShotWrap .picBarWrap{
    width: 100%;
	height: 70px;
	background-color: #e9f3fa;
	border-top: solid 1px #c2dff3;
    box-sizing: border-box;
}
.picBarWrap .picBar_smallIcon{
    display: inline-block;
    width: 24px;
    height: 24px;
    /* background: pink; */
    margin: 22px 0;
    cursor: pointer;
}
.picBarWrap .picBar_bigIcon{
    display: inline-block;
    width: 48px;
    height: 48px;
    /* background: pink; */
    margin: 11px 0;
    cursor: pointer;
}
.picBarWrap .realSizeIcon{
    background: url(../../../static/screenShot/icon_photo_actualsize.png);
    margin-left: 10px;
}
.picBarWrap .realSizeIcon:hover{
    background: url(../../../static/screenShot/icon_photo_actualsize_click.png);
    margin-left: 10px;
}
.picBarWrap .autoSizeIcon{
    background: url(../../../static/screenShot/icon_photo.png);
    margin-left: 20px;
}
.picBarWrap .autoSizeIcon:hover{
    background: url(../../../static/screenShot/icon_photo_click.png);
    margin-left: 20px;
}
.picBarWrap .zoomInIcon{
    background: url(../../../static/screenShot/icon_zoomin.png);
    margin-left: 40px;
}
.picBarWrap .zoomInIcon:hover{
    background: url(../../../static/screenShot/icon_zoomin_click.png);
    margin-left: 40px;
}
.picBarWrap .zoomOutIcon{
    background: url(../../../static/screenShot/icon_zoomout.png);
    margin-left: 40px;
}
.picBarWrap .zoomOutIcon:hover{
    background: url(../../../static/screenShot/icon_zoomout_click.png);
    margin-left: 40px;
}
.picBarWrap .previousIcon{
    background: url(../../../static/screenShot/icon_left.png);
    margin-left: 64px;
}
.picBarWrap .previousIcon:hover{
    background: url(../../../static/screenShot/icon_left_click.png);
    margin-left: 64px;
}
.picBarWrap .nextIcon{
    background: url(../../../static/screenShot/icon_right.png);
    margin-left: 50px;
}
.picBarWrap .nextIcon:hover{
    background: url(../../../static/screenShot/icon_right_click.png);
    margin-left: 50px;
}
.picBarWrap .downloadIcon{
    background: url(../../../static/screenShot/icon_download.png);
    margin-left: 60px;
}
.picBarWrap .downloadIcon:hover{
    background: url(../../../static/screenShot/icon_download_click.png);
    margin-left: 60px;
}
.picBarWrap .folderIcon{
    background: url(../../../static/screenShot/icon_folder.png);
    margin-left: 40px;
}
.picBarWrap .folderIcon:hover{
    background: url(../../../static/screenShot/icon_folder_click.png);
    margin-left: 40px;
}
</style>