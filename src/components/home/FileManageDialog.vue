<template>
<div>
    <el-dialog :visible.sync="isVisible" title="文件频道管理" width="1000px" class="custom-dialog">
        <div class="FileManageMain">
            <div class="allChannelBox">
                <div class="allChannelBoxTitle">
                    <div class="titleName">全部频道</div>
                    <div class="titleBtn" @click="handleAddChannel"></div>
                </div>
                <div class="channelBoxMain">
                    <div class="channelBoxMainTitle">
                        <span>频道名称</span>
                        <span>操作</span>
                        <span>是否共享</span>
                    </div>
                    <ul id="channelBoxMain_ul">
                        <template v-for="item in channelArr">
                        <li :id="item.id" :key="item.id" :class="item.active===true?'active' : '' " @click="handleClickChannelLi(item)">
                            <!-- <span class="group_name">{{item.name}}</span> -->
                            <input type="text" :readonly="item.readonly" v-model="item.name" class="groupInput_name" @blur="item.readonly === false && handleSaveChannel(item)">
                            <el-switch
                                class="channelSwitch"
                                v-model="item.isShare"
                                active-color="#128bf1"
                                inactive-color="#999"
                                @change="handleChannelSwitchChange(item)">
                            </el-switch>
                            <span class="group_delete_icon" @click.prevent="handleDeleteChannel(item)"></span>
                            <span class="group_edit_icon" @click.prevent="handleUpdateChannel(item,$event)"></span>
                        </li>
                        </template>
                        <li v-if="showNewChannelLi">
                            <input type="text" v-model="newChannelName" class="groupInput_name newGroupBorder" @blur="handleSaveChannel" id="newGroupInput">
                            <!-- <span class="group_delete_icon"></span> -->
                        </li>
                    </ul>
                </div>
            </div>
            <div class="fileManageBox">
                <div class="allChannelBoxTitle">
                    <!-- <el-upload
                        class="fileUpload"
                        :action="actionUrl"
                        :show-file-list="false"
                        :before-upload="handleBeforeUpload"
                        :on-progress="handleOnProgress"
                        :on-success="handleOnSuccess"
                        :file-list="fileList">
                        <div class="uploadBtn">上传</div>
                    </el-upload> -->
                    <button class="uploadingBtn fileMBtn moveBtn" @click="clickFileMBtn">上传</button>
                    <!-- <el-button type="primary fileMBtn moveBtn"  @click="clickFileMBtn">上传</el-button> -->
                    <el-input class="hidden fileMBtn moveBtn" type="file" id="file_name" v-model="file"  @change="handlerFiles" accept=".avi,.asf,.wmv,.rm,.mp3,.mp4,.mov,.swf,.flv,.mkv,.pmp">上传</el-input>
                    <div class="fileMBtn moveBtn" @click="handleMoveUpFile">上移</div>
                    <div class="fileMBtn moveBtn" @click="handleMoveDownFile">下移</div>
                </div>
                <div class="filesTableWrap">
                    <el-table
                        :data="filesArr"
                        ref="filesTable"
                        height="678"
                        border
                        class="custom-table"
                        style="width: 100%"
                        highlight-current-row
                        @row-click="handleClickRow"
                        @current-change="handleCurrentChange">
                        <el-table-column prop="name" label="文件名" align="left">
                            <template slot-scope="scope">
                                <span class="fileNameSpan">{{scope.row.name}}</span>
                                <el-progress class="fileProgress" v-if="!scope.row.id" :text-inside="true" :stroke-width="14" :percentage="scope.row.uploadProcess"></el-progress>
                            </template>
                        </el-table-column>
                        <el-table-column prop="fileSize" label="文件大小" align="center"  width="135">
                            <template slot-scope="scope">
                                {{scope.row.fileSize}}MB
                            </template>
                        </el-table-column>
                        <el-table-column prop="operate" label="操作" align="center"  width="135">
                            <template slot-scope="scope">
								<div class="downloadFile_disabled listIcon" title="暂无法下载" v-if="scope.row.status == 0"></div>
								<div class="downloadFile listIcon" title="下载" @click="handleDownloadFile(scope.row)"></div>
								<div class="deleteFile listIcon" title="删除" @click="handleDeleteFile(scope.row)"></div>
							</template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </el-dialog>
</div>
</template>

<script>
import fileManageSDK from '@/sdk/fileSDK/fileManage'
export default {
    name: "FileManageDialog",
    components: {},
    data() {
        return {
            isVisible: false,
            channelArr:[],
            showNewChannelLi:false,
            newChannelName:'',
            // 当前选择频道
            currentSelectChannel:{
                id:'',
                name:'',
                order:'',
            },
            filesArr:[],
            // 当前选择文件
            currentSelectFile:null,
            actionUrl:'',
            fileList:[],
            filePercentage:0,
            currentRow:null,
            file: ''
        }
    },
    mounted(){},
    methods: {
        showDialog() {
            this.isVisible = true;
            this.$nextTick(() => {
                xtxk.media.setDialogTop('文件频道管理');
            });
            this.showNewChannelLi = false;
            this.newChannelName = '';
            this.currentSelectChannel = {
                id:'',
                name:'',
                order:'',
            };
            this.filesArr = [];
            this.currentSelectFile = null;
            this.getAllChannelList();
            fileManageSDK.setURLPrefix(xtxk.config.api.fileUploadURL);
        },
        // 获取所有频道
        getAllChannelList(){
            this.channelArr = [];
            this.apiSDK.getFileChannels((obj)=>{
                if( obj && obj.length >0 ){
                    obj.forEach((item,index)=>{
                        this.channelArr.push({
                            name: item.channelName,
                            id: item.channelID,
                            readonly: true,
                            active: 'false',
                            isShare: item.isShare,
                        })
                    })
                    this.handleClickChannelLi(this.channelArr[0]);
                }
            });
            // 刷新资源区文件频道
            this.$parent.$parent.$refs.resourcecontainer.refershFileStatusV6();
        },
        // 新增频道按钮
        handleAddChannel(){
            this.showNewChannelLi = true;
            setTimeout(function(){
                var newGroupInput = document.getElementById('newGroupInput');
                newGroupInput.focus();
            },500)
        },
        // 保存/修改频道
        handleSaveChannel(item){
            if(!item.id){
                // console.log('新增频道：'+this.newChannelName);
                if (!/^[\u4e00-\u9fa5A-Za-z0-9]{2,20}$/.test(this.newGroupName)) {
                    this.$message({
                        message: '新增频道名称不合法',
                        type: 'error'
                    })
                    return
                }
                if(!this.newChannelName){
                    this.showNewChannelLi = false;
                    return;
                }
                this.apiSDK.addFileChannel('', this.newChannelName, false, (res) => {
                    if (res.Ret == 0) {
                        this.$message({
                            type: 'success',
                            message: '创建频道成功'
                        })
                        this.getAllChannelList()
                    }
                })
            }else{
                // console.log('修改频道：'+item.name+'，id='+item.id);
                if (!/^[\u4e00-\u9fa5A-Za-z0-9]{2,20}$/.test(item.name)) {
                    this.$message({
                        message: '修改频道名称不合法',
                        type: 'error'
                    })
                    return
                }
                this.apiSDK.editFileChannel(item.id, item.name, item.isShare, (res) => {
                    if (res.Ret == 0) {
                        this.$message({
                            type: 'success',
                            message: '修改频道成功'
                        })
                        this.getAllChannelList()
                    }
                })
            }
        },
        // 删除频道按钮
        handleDeleteChannel(item){
            this.$confirm('确认删除此频道吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.apiSDK.removeChannel(item.id, res => {
                    if (res.Ret == 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                    this.getAllChannelList()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 编辑频道按钮
        handleUpdateChannel(item,$event){
            item.readonly = false;
            var target = $event.target.parentNode.parentNode.children[0].children[0];
            target.focus();
        },
        // 开启/关闭共享
        handleChannelSwitchChange(item){
            let channelId = item.id;
            let isShare = item.isShare;
            // 接口暂未实现
            /*
            this.apiSDK.setFileChannelShare(channelId,isShare,(res)=>{
                // console.log(res);
                if( obj && obj.Ret === 0 ){
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    })
                }else{
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    })
                }
            });
            */
        },
        // 选择频道
        handleClickChannelLi(item){
            this.currentSelectChannel = item;
            for(let i=0;i<this.channelArr.length;i++){
                this.channelArr[i].active = false;
            }
            item.active = true;
            let channelId = item.id;
            this.getFilesByChannelId(channelId);
        },
        // 通过频道id获取文件
        getFilesByChannelId(channelId){
            this.filesArr = [];
            this.filePercentage = 0;
            this.apiSDK.getFilesByChannelId(channelId, (obj)=>{
                if( obj && obj.length > 0 ){
                    this.filesArr = obj && obj.map(item => {
                        return {
                            order:item.order,
                            name:item.fileName,
                            id:item.fileId,
                            channelId: item.channelId,
                            url:item.fileUrl,
                            fileSize:item.fileSize,
                        }
                    });
                }
            });
            // 刷新资源区文件频道
            this.$parent.$parent.$refs.resourcecontainer.refershFileStatusV6();
        },
        // 点击上传按钮
        clickFileMBtn(){
           let fileName = document.getElementById('file_name');
           fileName.click();
        },
        handlerFiles() {
            if( !this.currentSelectChannel.id ){
                this.$message({
                    type: 'info',
                    message: '请先选择频道!'
                });
                return false;
            }
            this.$nextTick(() => {
                var file = document.getElementById('file_name').files[0];
                if (!!file) {
                    // 文件上传进度
                    this.filesArr.unshift({
                        name:file.name,
                        uploadProcess: 0,
                        fileSize:file.size,
                    })
                    let reader = new FileReader();
                    reader.readAsArrayBuffer(file.slice(0, 64));
                    reader.onload = (result) => {
                        let file_before_md5 = new Uint8Array(result.target.result);
                        reader.readAsArrayBuffer(file.slice(file.size - 64));
                        reader.onload = (result) => {
                            let file_after_md5 = new Uint8Array(result.target.result);
                            fileManageSDK.upload(file.name, file.size, file, file_before_md5, file_after_md5, uploadProcess => {
                                let fileObj = this.filesArr.find(item => (item.name === file.name));
                                if(fileObj) fileObj.uploadProcess = uploadProcess;
                            }, res => {
                                if (res.Ret == 0) {
                                    let mediaID = res.mediaID;
                                    let list = {
                                        mediaID:mediaID,
                                        fileName:file.name,
                                        fileSize:Math.ceil(file.size/1000/1000),   // MB
                                    };
                                    this.apiSDK.uploadToFileChannel(this.currentSelectChannel.id, list, res=>{
                                        if(res.Ret == 0){
                                            this.$message({
                                                type: 'success',
                                                message: '上传成功'
                                            });
                                            this.getFilesByChannelId(this.currentSelectChannel.id);
                                        }else{
                                            this.$message({
                                                type: 'error',
                                                message: '上传失败'
                                            })
                                        }
                                    });
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: '上传失败'
                                    })
                                }
                            })
                        }
                    }
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请选择上传文件'
                    })
                }
            });
        },
        // 
        handleBeforeUpload(file){
            console.log(file)
            if( !this.currentSelectChannel.id ){
                this.$message({
                    type: 'info',
                    message: '请先选择频道!'
                });
                return false;
            }
            console.log('before-upload');
            console.log(JSON.stringify(file));
            let len = this.filesArr.length;
            if( file ){
                this.filesArr.push({
                    order:len+1,
                    name:file.name,
                    id:'',
                    channelId: '',
                    url:'',
                    fileSize:file.size,
                    status:0,
                });
            }
            // console.log(JSON.stringify(this.filesArr));
        },
        handleOnProgress(event, file, fileList){
            console.log('on-progress');
            // console.log(event.percent);
            // console.log(JSON.stringify(file));
            // console.log(JSON.stringify(fileList));
            this.filePercentage = event.percent;
        },
        handleOnSuccess(response, file, fileList){
            console.log('on-success');
            // console.log(response);
            // console.log(JSON.stringify(file));
            // console.log(JSON.stringify(fileList));
        },
        // 上移按钮
        handleMoveUpFile(){
            if( !this.currentSelectFile || !this.currentSelectFile.name ){
                this.$message({
                    type: 'info',
                    message: '请先选择文件!'
                });
                return;
            }
            var currId = this.currentSelectFile.id;
            var index = 0;
            for( var i=0;i<this.filesArr.length;i++ ){
                if( this.filesArr[i].id == currId ){
                    index = i;
                    break;
                }
            }
            if( index-1 == -1 ){
                return;
            }
            var temp = {
                // order:this.filesArr[index].order,
                name:this.filesArr[index].name,
                id:this.filesArr[index].id,
                url:this.filesArr[index].url,
                fileSize:this.filesArr[index].fileSize,
                status:this.filesArr[index].status,
            };
            this.filesArr[index].name = this.filesArr[index-1].name;
            this.filesArr[index].id = this.filesArr[index-1].id;
            this.filesArr[index].url = this.filesArr[index-1].url;
            this.filesArr[index].fileSize = this.filesArr[index-1].fileSize;
            this.filesArr[index].status = this.filesArr[index-1].status;
            this.filesArr[index-1].name = temp.name;
            this.filesArr[index-1].id = temp.id;
            this.filesArr[index-1].url = temp.url;
            this.filesArr[index-1].fileSize = temp.fileSize;
            this.filesArr[index-1].status = temp.status;
            // console.log('上移后');
            // console.log(JSON.stringify(this.filesArr));

            this.currentSelectFile = this.filesArr[index-1];
            this.$refs.filesTable.setCurrentRow(this.currentSelectFile);
            // 接口暂未实现
        },
        // 下移按钮
        handleMoveDownFile(){
            if( !this.currentSelectFile || !this.currentSelectFile.name ){
                this.$message({
                    type: 'info',
                    message: '请先选择文件!'
                });
                return;
            }
            var currId = this.currentSelectFile.id;
            var index = 0;
            for( var i=0;i<this.filesArr.length;i++ ){
                if( this.filesArr[i].id == currId ){
                    index = i;
                    break;
                }
            }
            if( index+1 === this.filesArr.length ){
                return;
            }
            var temp = {
                name:this.filesArr[index].name,
                id:this.filesArr[index].id,
                url:this.filesArr[index].url,
                fileSize:this.filesArr[index].fileSize,
                status:this.filesArr[index].status,
            };
            this.filesArr[index].name = this.filesArr[index+1].name;
            this.filesArr[index].id = this.filesArr[index+1].id;
            this.filesArr[index].url = this.filesArr[index+1].url;
            this.filesArr[index].fileSize = this.filesArr[index+1].fileSize;
            this.filesArr[index].status = this.filesArr[index+1].status;
            this.filesArr[index+1].name = temp.name;
            this.filesArr[index+1].id = temp.id;
            this.filesArr[index+1].url = temp.url;
            this.filesArr[index+1].fileSize = temp.fileSize;
            this.filesArr[index+1].status = temp.status;
            // console.log('下移后：');
            // console.log(this.filesArr);

            this.currentSelectFile = this.filesArr[index+1];
            this.$refs.filesTable.setCurrentRow(this.currentSelectFile);
            // 接口暂未实现
        },
        handleCurrentChange(val){
            this.currentRow = val;
        },
        handleClickRow(row, event, column){
            // console.log(JSON.stringify(row));
            this.currentSelectFile = {
                id:row.id,
                name:row.name,
            };
        },
        // 下载文件按钮
        handleDownloadFile(row){
            fileManageSDK.download(row.id, 0, row.name);
            // console.log(JSON.stringify(row));
            // console.log('下载文件：'+row.name+'，url='+row.url);
            // window.open(row.url);
        },
        // 删除文件按钮
        handleDeleteFile(row){
            // console.log(JSON.stringify(row));
            // console.log('删除文件：'+row.name+'，id='+row.id);
            this.$confirm('确认删除此文件吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 接口暂未实现
                this.apiSDK.removeToFileChannel(row.channelId, res => {
                    if (res.Ret == 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getFilesByChannelId(this.currentSelectChannel.id);
                    } else {
                        this.$message({
                            type: 'error',
                            message: '删除失败'
                        })
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
    },
}
</script>

<style scoped>
.FileManageMain{
    height: 730px;
}
.allChannelBox{
    display: inline-block;
    width:355px;
    height: 100%;
    border:1px solid #dcdfe6;
    box-sizing: border-box;
    float: left;
    margin-right: 10px;
}
.allChannelBox .allChannelBoxTitle{
    width: 100%;
    height: 40px;
    padding:0 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #c2dff3;
    background: #e9f3fa;
}
.allChannelBox .allChannelBoxTitle .titleName{
    display: inline-block;
    float: left;
    color:#2e3c42;
    font-size: 14px;
    line-height: 40px;
}
.allChannelBox .allChannelBoxTitle .titleBtn{
    display: inline-block;
    float: right;
    width: 16px;
    height: 16px;
    margin-top: 11px;
    cursor:pointer;
    background: url(../../../static/prepointsManage/addBtn_b.png) no-repeat;
    background-size:100% 100%;
}
.allChannelBox .allChannelBoxTitle .titleBtn:hover{
    background: url(../../../static/prepointsManage/addBtn_b_hover.png) no-repeat;
    background-size:100% 100%;
}

.channelBoxMain{
    height: calc(100% - 40px);
    overflow: auto;
}
.channelBoxMain .channelBoxMainTitle{
    height: 40px;
    line-height: 40px;
    padding:0 20px;
    border-bottom: 1px solid #c2dff3;
}
.channelBoxMain .channelBoxMainTitle span{
    display: inline-block;
    font-size: 14px;
    color: #2e3c42;
}
.channelBoxMain .channelBoxMainTitle span:nth-child(2){
    /* margin-left: 110px; */
    float: right;
    margin-right: 15px;
}
.channelBoxMain .channelBoxMainTitle span:nth-child(3){
    float: right;
    margin-right: 30px;
}
.channelBoxMain ul{
    padding: 0;
    margin: 0;
}
.channelBoxMain ul li{
    list-style-type: none;
    text-align: left;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
}
.channelBoxMain ul li.active{
    background: #b1e0ff;
}
.channelBoxMain ul li .group_name{
    display: inline-block;
    width: 170px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:14px;
    line-height: 24px;
    vertical-align: middle;
    color: #333;
    margin-right: 20px;
}
.channelBoxMain ul li .groupInput_name{
    display: inline-block;
    width:170px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:14px;
    line-height: 24px;
    vertical-align: middle;
    color: #333;
    border: none;
    background: transparent;
    margin-right: 20px;
}
.channelBoxMain ul li .newGroupBorder{
    border:1px solid #ddd;
}
.channelBoxMain ul li .channelSwitch{
    width: 32px;
    height: 17px;
}
.channelBoxMain ul li .group_edit_icon{
    display: inline-block;
    float: right;
    width: 20px;
    height: 20px;
    background:url("../../../static/prepointsManage/update_icon.png");
    background-repeat:no-repeat;
    background-size:cover;
    vertical-align: middle;
    margin-top: 10px;
    margin-right: 20px;
    cursor:pointer;
}
.channelBoxMain ul li .group_delete_icon{
    display: inline-block;
    float: right;
    width: 20px;
    height: 20px;
    background:url("../../../static/prepointsManage/delPrepare.png");
    background-repeat:no-repeat;
    background-size:cover;
    vertical-align: middle;
    margin-top: 10px;
    margin-right: 20px;
    cursor:pointer;
}

.fileManageBox{
    display: inline-block;
    width:calc(100% - 365px);
    height: 100%;
    border:1px solid #c8cdd5;
    border-left: none;
    box-sizing: border-box;
}
.fileManageBox .allChannelBoxTitle{
    width: 100%;
    height: 40px;
    padding:0 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #c2dff3;
    border-left: 1px solid #c2dff3;
    background: #e9f3fa;
    position: relative;
}
.fileManageBox .fileMBtn{
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
.fileManageBox .fileUpload{
    display: inline-block;
    width: 60px;
    height: 30px;
    line-height: 30px;
    color:#fff;
    background: #128bf1;
    border-radius: 6px;
    margin-top: 4px;
    margin-right: 15px;
    float: left;
}
/deep/.fileManageBox .fileUpload .el-upload{
    display: inline-block;
    width: 60px;
    height: 30px;
}
.fileManageBox .uploadBtn{
    color:#fff;
}
.fileManageBox .moveBtn{
    background-color: #fff;
    color:#666;
    border: solid 1px #dcdfe6;
}
.fileManageBox .filesTableWrap{
    width: calc(100% - 10px);
    height: calc(100% - 50px);
    margin-top: 10px;
    margin-right: 10px;
    /* border: solid 1px #dcdfe6; */
    /* box-sizing: border-box; */
}
.filesTableWrap .listIcon {
		display: inline-block;
		width: 20px;
		height: 20px;
		cursor: pointer;
}
.filesTableWrap .downloadFile {
    background:url("../../../static/common/download_normal_icon.png");
    margin-right: 15px;
}
.filesTableWrap .downloadFile_disabled{
    background:url("../../../static/common/download_disabled_icon.png");
    margin-right: 15px;
    cursor: default;
}
.filesTableWrap .deleteFile {
    background:url("../../../static/prepointsManage/delPrepare.png");
}
.filesTableWrap .fileNameSpan{
    display: inline-block;
    width: 150px;
}
.filesTableWrap .fileProgress{
    display: inline-block;
    width: 110px;
}
.hidden {
    display: none !important;
}
div.allChannelBoxTitle > button.uploadingBtn {
    background: #66b1ff;
    border-color: #66b1ff;
    color: #FFF;
}
div.allChannelBoxTitle > button.uploadingBtn:hover{
    background: #409EFF;
}
</style>