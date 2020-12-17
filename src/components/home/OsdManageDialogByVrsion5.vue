<template>
    <div>
    <el-dialog :visible.sync="isVisible" class="custom-dialog" title="字幕管理" width="1000px" center @closed="closedDialog">
        <el-row :gutter="10">
            <el-col :span="8">
                <el-tabs v-model="tabActiveName">
                    <el-tab-pane label="组织结构" name="personTree">
                        <person-tree ref="personTree" :subscribeType="subscribeType" style="height: 559px;" @currentChange="currentChange" />
                    </el-tab-pane>
                    <el-tab-pane label="设备资源" name="deviceTree">
                        <device-tree ref="deviceTree" :subscribeType="subscribeType" style="height: 559px;" @currentChange="currentChange" />
                    </el-tab-pane>
                    <el-tab-pane label="常用资源" name="commonTree">
                        <common-res ref="commonTree" :subscribeType="subscribeType" style="height: 559px;" @currentChange="currentChange" />
                    </el-tab-pane>
                </el-tabs>
            </el-col>
            <el-col :span="16">
                <el-card class="box-card">
                    <div class="drag-content">
                        <div class="drag-item" v-for="item in osdList" :id="item.osdId" :key="item.key" 
                            :class="item.active?'active':''" :style="item.style" @mousedown="e => osdMoveHandle(item, e)">{{item.caption}}</div>
                    </div>
                </el-card>
                <el-card class="box-card" style="margin-top: 10px;">
                    <div slot="header">
                        <!-- <span>字幕个数:{{osdList.length}}/8</span>
                        <span class="warning-msg" v-if="osdList.length === 8">已达到字符条数上限！</span> -->

                        <el-button type="text" class="add-btn" title="新增字幕" style="float:left;margin:0 15px 0 0;vertical-align: bottom;" @click="addDefaultOsd(osdTypeValue)"></el-button>
                        <el-button type="text" class="remove-btn" title="删除字幕" style="float:left;margin:0 0px 0 0;vertical-align: bottom;" @click="deleteOsd"></el-button>

                        <span style="float:right;margin:0 15px 0 0;">字幕个数:{{osdList.length}}/8</span>
                    </div>
                    <div class="option-item">
                        <!-- <el-button type="text" class="add-btn" style="margin:0 10px 0 0;" @click="addDefaultOsd(osdTypeValue)"></el-button> -->
                        <div class="form-item">
                            <span>字幕类型</span>
                            <el-select placeholder="请选择" v-model="osdTypeValue" @change="osdTypeChange">
                                <el-option
                                  v-for="item in osdTypeOptions"
                                  :key="item.key"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="form-item" style="margin-right: 0;">
                            <span>字幕内容</span>
                            <el-input v-model="osdContentValue" @change="osdContentChange" />
                        </div>
                        <!-- <el-button type="text" icon="el-icon-delete" style="font-size: 22px;font-weight: bold;" @click="deleteOsd"></el-button> -->
                    </div>
                    <div class="option-item">
                        <div class="form-item">
                            <span>字体</span>
                            <el-select placeholder="请选择" v-model="osdFontValue" @change="osdFontSelectChange">
                                <el-option
                                  v-for="item in osdFontOptions"
                                  :key="item.key"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="form-item">
                            <span>字号</span>
                            <el-select placeholder="请选择" v-model="osdSizeValue" @change="osdSizeSelectChange">
                                <el-option
                                  v-for="item in osdSizeOptions"
                                  :key="item.key"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="form-item">
                            <span>颜色</span>
                            <el-color-picker v-model="osdColorValue" color-format="rgb" @change="osdColorChange"></el-color-picker>
                        </div>
                        <el-button type="primary" plain @click="applyOptions">应用效果</el-button>
                    </div>
                    <div class="option-item" style="border-bottom: 0;">
                        <div class="form-item">
                            <span>基准点</span>
                            <div class="base-point">
                                <el-radio v-model="osdBasePointValue" v-for="item in osdBasePointRadios" :label="item.value" :key="item.key" @change="osdBasePointChange">{{item.label}}</el-radio>
                            </div>
                        </div>
                        <div class="form-item">
                            <span>水平距离</span>
                            <el-input v-model="positionX" @change="setPositionX" />
                        </div>
                        <div class="form-item" style="margin-right: 0;">
                            <span>垂直距离</span>
                            <el-input v-model="positionY" @change="setPositionY"/>
                        </div>
                    </div>
                </el-card>

            </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-row>
                <el-col :span="24">
                    <!-- <el-button type="primary" @click="deleteOsd">删除</el-button> -->
                    <el-button type="primary" @click="saveOsd">保存</el-button>
                    <el-button @click="isVisible = false">关闭</el-button>
                </el-col>
            </el-row>
        </span>
    </el-dialog>
    </div>
</template>
<script>
import Fun from "@/common/fun";
import Enum from "@/common/enum";
import PersonTree from "@/components/home/selectRes/PersonTree.vue";
import DeviceTree from "@/components/home/selectRes/DeviceTree.vue";
import CommonRes from "@/components/home/selectRes/CommonRes.vue";
export default {
    name: 'OsdManageDialogByVrsion5',
    components: {
        PersonTree,
        DeviceTree,
        CommonRes
    },
    data() {
        return {
            subscribeType: '',
            tabActiveName: 'personTree',
            isVisible: false,
            curHighRes: {},
            osdList: [], //类型，内容，字体，字号，颜色，基准点，offsetX，offsetY：调接口用  //id，style：显示用
            positionX: 0,
            positionY: 0,
            
            osdStyleList: [{
                value: '1',
                label: 'OSD字幕1'
            },{
                value: '2',
                label: 'OSD字幕2'
            },{
                value: '3',
                label: 'OSD字幕3'
            },{
                value: '4',
                label: 'OSD字幕4'
            },{
                value: '5',
                label: 'OSD字幕5'
            }],
            osdStyleId: '1',

            osdContentValue: '',
            osdColorValue: 'rgb(19, 91, 206)',

            osdTypeOptions: [{
                value: 'ResourceName',
                label: '源名称'
            }, {
                value: 'Department',
                label: '单位名称'
            }, {
                value: 'Text',
                label: '自定义文本'
            }, {
                value: 'DateTime',
                label: '日期时间'
            }],
            osdTypeValue: 'ResourceName',//类型值

            //字体枚举：宋体，黑体，楷体，隶书，微软雅黑
            osdFontOptions: [{
                value: '宋体',// SIM_SUN
                label: '宋体'
            }, {
                value: '黑体',// SIM_HEI
                label: '黑体'
            }, {
                value: '楷体', // SIM_KAI
                label: '楷体'
            // }, {
            //     value: '隶书', // SIM_LI
            //     label: '隶书'
            }, {
                value: '微软雅黑', // SIM_MICRO
                label: '微软雅黑'
            }],
            osdFontValue: '微软雅黑',//字体值

            //字号枚举: 10，12，14，16，18，24，28，32，36px----分别对应1-9号字
            osdSizeOptions: [{
                value: Enum.enumFontSize.One,
                label: '1'
            }, {
                value: Enum.enumFontSize.Two,
                label: '2'
            }, {
                value: Enum.enumFontSize.Three,
                label: '3'
            }, {
                value: Enum.enumFontSize.Four,
                label: '4'
            }, {
                value: Enum.enumFontSize.Five,
                label: '5'
            }, {
                value: Enum.enumFontSize.Six,
                label: '6'
            }, {
                value: Enum.enumFontSize.Seven,
                label: '7'
            }, {
                value: Enum.enumFontSize.Eight,
                label: '8'
            }, {
                value: Enum.enumFontSize.Nine,
                label: '9'
            }],
            osdSizeValue: Enum.enumFontSize.Three,//字号值

            //leftTop/leftDown/rightTop/rightDown
            osdBasePointRadios: [{
                value: 'leftTop',
                label: '左上'
            }, {
                value: 'rightTop',
                label: '右上'
            }, {
                value: 'leftDown',
                label: '左下'
            }, {
                value: 'rightDown',
                label: '右下'
            }],
            osdBasePointValue: 'leftTop',//基准点值

            //应用弹窗
            applyOsdVisible: false,
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
        // 清空
        empty() {
            this.curHighRes = {};
            this.osdStyleId = '1';
            this.osdList = [];
            this.osdContentValue = '';
        },
        // 显示弹框
        showDialog() {
            this.isVisible = true;
            this.$nextTick(() => {
                xtxk.media.setDialogTop('字幕管理');
            });
            this.initTree();
            this.empty();
            this.resetForm();
            this.tabActiveName = 'personTree';
        },
        // 初始化树
        initTree() {
            this.$nextTick(() => {
                const organId = "";
                this.subscribeType = Enum.enumSubscribeType.osdMng;
                //订阅用户组织结构
                let subjectId = 0;
				// dj 默认行政隶属
				this.$refs.personTree.relationshipValue = subjectId;
                this.$refs.deviceTree.relationshipValue = subjectId;
                
                this.apiSDK.getOrganizationUser(organId, this.subscribeType.subscribeOrganizationUser, subjectId ,(obj) => {
                    //console.log(obj);
                    this.$refs.personTree && this.$refs.personTree.setReceiveInformAddDepartmentCallback(obj);
                    this.$refs.personTree.searchChange = false;
                    this.$refs.personTree.resetSearch();
                });
                //获取设备组织结构
                this.apiSDK.getOrganizationDevice(organId, this.subscribeType.subscribeOrganizationDevice, subjectId, (obj) =>{
                    //console.log(obj);
                    this.$refs.personTree && this.$refs.deviceTree.setReceiveInformAddDepartmentCallback(obj);
                    //初始化 设备组织结构
                    this.$refs.deviceTree.searchChange = true;
                    this.$refs.deviceTree.handleChangeSerachWrap();
                    
                });
                //获取常用资源树
                this.apiSDK.subscribeCommonRes("", "", "", this.subscribeType.subscribeCommonResources);
                //资源回调
                this.apiSDK.setReceiveResourceStatusQueryCallback("osdMng", (obj) => {
                    //console.log(obj);
                    this.$refs.personTree && this.$refs.personTree.setReceiveInformResourceStatusCallback(obj);
                    this.$refs.deviceTree && this.$refs.deviceTree.setReceiveInformResourceStatusCallback(obj);
                    this.$refs.commonTree && this.$refs.commonTree.setReceiveInformResourceStatusCallback(obj);
                });
                //组织 资源 单选
                this.$refs.personTree.isShowCheck = false;
                this.$refs.deviceTree.isShowCheck = false;
                this.$refs.commonTree.isShowCheck = false;
            });
        },
        // 当前选中节点变化时触发的事件
        currentChange(node) {
            if (node.data.nodeStatus == 'department' || this.curHighRes == node.data) {
                return;
            }
            this.curHighRes = node.data;
            this.getOSDByOsdStyleId()
        },
        // 根据 id 查询OSD样式详情
        getOSDByOsdStyleId(index) {
            this.resetForm();
            this.osdList = [];
            let resourceId = this.curHighRes.id;
            if(!resourceId){
                //this.$message({message: '请选择资源', type: 'warning'});
                return;
            }
            this.apiSDK.getOSDByOsdStyleId( resourceId,index,(res) => {
                if(res){
                    res.items && res.items.forEach(item => {
                        let ind = this.osdSizeOptions.findIndex(it => it.value == item.size);
                        item.osdId      = "s"+parseInt(Math.random()*1000)
                        item.active     = false
                        item.size       = this.osdSizeOptions[ind].value
                        item.caption    = item.caption || "文本"
                        item.font       = item.font || "微软雅黑"
                        let colorR  = (item.color >> 16) & 0xff
                        let colorG  = (item.color >> 8) & 0xff
                        let colorB  = item.color & 0xff
                        item.color = colorR + ',' + colorG + ',' + colorB
                        item.style  = this.refreshOsdStyle(item)
                        item.itemType  = item.itemType || 'Text'
                        this.osdList.push(item)
                    })
                    if(this.osdList.length > 0) {
                        this.osdSelectHandle(this.osdList[0]);
                    }
                }
            });
            this.osdBasePointValue = 'leftTop'
        },
        // 字幕显示样式
        refreshOsdStyle(data) {
            let style = '';
            if (Object.keys(data).length) {
                style = `font-family: ${data.font}; font-size: ${data.size}px; color: rgb(${data.color});`;
                if(data.basePoint == 'leftDown'){
                    style += `left: ${data.left}px; bottom: ${data.top}px;`
                }else if(data.basePoint == 'rightTop'){
                    style += `right: ${data.left}px; top: ${data.top}px;`
                }else if(data.basePoint == 'rightDown'){
                    style += `right: ${data.left}px; bottom: ${data.top}px;`
                }else{//leftTop
                    style += `left: ${data.left}px; top: ${data.top}px;`
                }
            }
            return style;
        },
        //字幕移动事件
        osdMoveHandle(item, e) {
            this.osdSelectHandle(item, e);
            let odiv = e.target;
            let disX = e.clientX - odiv.offsetLeft;
            let disY = e.clientY - odiv.offsetTop;
            document.onmousemove = (e) => {
                let left = e.clientX - disX;
                let top = e.clientY - disY;

                let dragContent = document.querySelector(".drag-content");
                if (left <= 0) {
                    left = 0
                } else if (left >= dragContent.offsetWidth - odiv.offsetWidth) {
                    left = dragContent.offsetWidth - odiv.offsetWidth
                }

                if (top <= 0) {
                    top = 0
                } else if (top >= dragContent.offsetHeight - odiv.offsetHeight) {
                    top = dragContent.offsetHeight - odiv.offsetHeight
                }

                if(item.basePoint == 'leftDown'){
                    item.left = left;
                    item.top = dragContent.offsetHeight - odiv.offsetHeight - top;
                }else if(item.basePoint == 'rightTop'){
                    item.left = dragContent.offsetWidth - odiv.offsetWidth - left;
                    item.top = top;
                }else if(item.basePoint == 'rightDown'){
                    item.left = dragContent.offsetWidth - odiv.offsetWidth - left;
                    item.top = dragContent.offsetHeight - odiv.offsetHeight - top;
                }else{//leftTop
                    item.left = left;
                    item.top = top;
                }
                item.style = this.refreshOsdStyle(item);
                this.positionX = item.left;
                this.positionY = item.top;
            }
            document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        },
        //字幕选中
        osdSelectHandle(item, e){
            if(e && e.ctrlKey){//多选
                this.osdList.forEach((item2, index) => {
                    if(item.osdId == item2.osdId){
                        item2.active = true;
                    }
                });
            }else{//单选
                this.osdList.forEach((item2, index) => {
                    if(item.osdId == item2.osdId){
                        item2.active = true;
                    }else{
                        item2.active = false;
                    }
                });
                //填充表单
                this.osdContentValue = item.caption;
                this.osdFontValue = item.font;
                this.osdSizeValue = item.size;
                this.osdColorValue = `rgb(${item.color})`;
                this.positionX = item.left;
                this.positionY = item.top;
                this.osdTypeValue = item.itemType ||'Text'
                this.osdBasePointValue = 'leftTop'
            }
        },
        //表单恢复默认
        resetForm(){
            this.osdTypeValue = "ResourceName"
            this.osdFontValue = "微软雅黑"
            this.osdSizeValue = Enum.enumFontSize.Three
            // this.osdBasePointValue = 'leftTop'
            this.osdContentValue = ''
            this.osdColorValue = 'rgb(19, 91, 206)'
            this.positionX = 0
            this.positionY = 0
        },
        //根据类型加入字幕
        addDefaultOsd(type){
            let resourceId = this.curHighRes.id;
            if(!resourceId){
                //获取高亮节点
                let nodes = this.getCheckedNodes(false);                
                if(nodes && nodes.length > 0) {
                    this.curHighRes = nodes[0];
                    resourceId = this.curHighRes.id;
                }
            }if(!resourceId){
                this.$message({message: '请选择资源', type: 'warning'});
                return;
            }
            // if(this.osdContentValue.trim() == ''){
            //     this.$message({message: '请输入字幕内容', type: 'warning'});
            //     return;
            // }
            if (this.osdList.length >= 8) {
                this.$message({message: "已超过最大设置数量", type: "warning"})
                return;
            }
            let dragContent = document.querySelector(".drag-content");
            let defaultLeft = 100, defaultTop = 50;
            // this.osdTypeChange(this.osdTypeValue)
            let rgbs = this.osdColorValue.substring(this.osdColorValue.indexOf('(')+1, this.osdColorValue.indexOf(')'))
            let rgbArr = rgbs.split(',')

            let item = {
                osdId       : "s"+parseInt(Math.random()*1000),
                caption     : this.osdContentValue,
                active      : true,
                itemType    : this.osdTypeValue,
                font        : this.osdFontValue,
                size        : this.osdSizeValue,
                fontColorR  : parseInt(rgbArr[0]),
                fontColorG  : parseInt(rgbArr[1]),
                fontColorB  : parseInt(rgbArr[2]),
                basePoint   : this.osdBasePointValue,
                left        : parseInt(defaultLeft),
                top         : parseInt(defaultTop),
                color       : parseInt(rgbArr[0]) + ',' + parseInt(rgbArr[1]) + ',' + parseInt(rgbArr[2])
            };
            item.style = this.refreshOsdStyle(item)
            this.osdList.push(item);
            this.osdSelectHandle(item);
        },
        // 类型下拉切换事件
        osdTypeChange(type) {
            if(type == "Text"){
                this.osdContentValue = "自定义文本";
            }else if(type == "DateTime"){
                this.osdContentValue = new Date().formatDate('yyyy-MM-dd HH:mm:ss');
            }else if(type == "ResourceName"){
                this.osdContentValue = this.curHighRes.name;
            }else if(type == "Department"){
                let nodeId = this.curHighRes.nodeId;
                let node;
                if(this.tabActiveName == "personTree"){
                    node = this.$refs.personTree.$refs.SelectResUsersStatus.getNode(nodeId);
                }else if(this.tabActiveName == "deviceTree"){
                    node = this.$refs.deviceTree.$refs.SelectResDevicesStatus.getNode(nodeId);
                } else if(this.tabActiveName == "commonTree"){
                    node = this.$refs.commonTree.$refs.SelectResCommonsStatus.getNode(nodeId);
                }
                this.osdContentValue = node.parent.data.name;
            }
            this.osdContentChange(this.osdContentValue,type)
        },
        // 字幕文本内容变化
        osdContentChange(val,type){
            if(val == '') this.osdContentValue = "文本"
            this.osdList.forEach((item, index) => {
                if(item.active){
                    item.caption = this.osdContentValue;
                    item.itemType = type || 'Text'
                    this.$set(this.osdList, index, item);
                }
            });
        },
        //字体下拉框切换事件
        osdFontSelectChange(val){
            this.osdList.forEach((item, index) => {
                if(item.active){
                    item.font = val;
                    item.style = this.refreshOsdStyle(item)
                    this.$set(this.osdList, index, item);
                }
            });
        },
        //字号下拉框切换事件
        osdSizeSelectChange(val){
            this.osdList.forEach((item, index) => {
                if(item.active){
                    item.size = val
                    item.style = this.refreshOsdStyle(item)
                    this.$set(this.osdList, index, item);
                }
            });
        },
        //颜色切换事件
        osdColorChange(val){
            if(val){
                let rgbs = val.substring(val.indexOf('(')+1, val.indexOf(')'))
                let rgbArr = rgbs.split(',');
                this.osdList.forEach((item, index) => {
                    if(item.active){
                        item.fontColorR = parseInt(rgbArr[0]);
                        item.fontColorG = parseInt(rgbArr[1]);
                        item.fontColorB = parseInt(rgbArr[2]);
                        item.color = item.fontColorR + ',' +item.fontColorG+','+item.fontColorB;
                        item.style = this.refreshOsdStyle(item)
                        this.$set(this.osdList, index, item);
                    }
                });
            }
        },
        //基准点切换事件
        osdBasePointChange(val){
            let selOsdCount = 0;
            this.osdList.forEach((item, index) => {
                if(item.active) selOsdCount++;
            });
            if(selOsdCount > 1){
                this.$message({message: '请选中单条字幕切换基准点', type: 'warning'});
                return;
            }
            let dragContent = document.querySelector(".drag-content");
            this.osdList.forEach((item, index) => {
                if(item.active){
                    let preBasePoint = item.basePoint;
                    item.basePoint = val;
                    let dragItem = document.querySelector("#"+item.osdId);
                    if(preBasePoint == 'leftTop'){
                        if(item.basePoint == 'leftDown'){
                            item.top = dragContent.offsetHeight - dragItem.offsetHeight - item.top;
                        }else if(item.basePoint == 'rightTop'){
                            item.left = dragContent.offsetWidth - dragItem.offsetWidth - item.left;
                        }else if(item.basePoint == 'rightDown'){
                            item.left = dragContent.offsetWidth - dragItem.offsetWidth - item.left;
                            item.top = dragContent.offsetHeight - dragItem.offsetHeight - item.top;
                        }else{//leftTop
                            
                        }
                    }else if(preBasePoint == 'leftDown'){
                        if(item.basePoint == 'leftDown'){
                            
                        }else if(item.basePoint == 'rightTop'){
                            item.left = dragContent.offsetWidth - dragItem.offsetWidth - item.left;
                            item.top = dragContent.offsetHeight - dragItem.offsetHeight - item.top;
                        }else if(item.basePoint == 'rightDown'){
                            item.left = dragContent.offsetWidth - dragItem.offsetWidth - item.left;
                        }else{//leftTop
                            item.top = dragContent.offsetHeight - dragItem.offsetHeight - item.top;
                        }
                    }else if(preBasePoint == 'rightTop'){
                        if(item.basePoint == 'leftDown'){
                            item.left = dragContent.offsetWidth - dragItem.offsetWidth - item.left;
                            item.top = dragContent.offsetHeight - dragItem.offsetHeight - item.top;
                        }else if(item.basePoint == 'rightTop'){
                            
                        }else if(item.basePoint == 'rightDown'){
                            item.top = dragContent.offsetHeight - dragItem.offsetHeight - item.top;
                        }else{//leftTop
                            item.left = dragContent.offsetWidth - dragItem.offsetWidth - item.left;
                        }
                    }else if(preBasePoint == 'rightDown'){
                        if(item.basePoint == 'leftDown'){
                            item.left = dragContent.offsetWidth - dragItem.offsetWidth - item.left;
                        }else if(item.basePoint == 'rightTop'){
                            item.top = dragContent.offsetHeight - dragItem.offsetHeight - item.top;
                        }else if(item.basePoint == 'rightDown'){
                            
                        }else{//leftTop
                            item.left = dragContent.offsetWidth - dragItem.offsetWidth - item.left;
                            item.top = dragContent.offsetHeight - dragItem.offsetHeight - item.top;
                        }
                    }
                    this.$set(this.osdList, index, item);
                    this.positionX = item.left;
                    this.positionY = item.top;
                }
            });
        },
        //删除字幕
        deleteOsd(){
            this.$confirm('确认删除字幕?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                closeOnClickModal: false
            }).then(() => {
                for(let i = this.osdList.length - 1; i >= 0; i--){
                    if(this.osdList[i].active) {
                        this.osdList.splice(i, 1);
                    }
                }
                this.resetForm();
            });

        },
        //保存
        saveOsd(){
            let self = this;
            let dragContent = document.querySelector(".drag-content");
            let screenWidth = dragContent.offsetWidth;
            let screenHeight = dragContent.offsetHeight;
            // if(this.osdList.length == 0){
            //     this.$message({message: '请在画布上设置字幕', type: 'warning'});
            //     return;
            // }
            let items = this.osdList.map((item, index) => {
                let el = document.querySelector('#'+item.osdId);
                let width = el.offsetWidth;
                let height = el.offsetHeight;
                let colorArr = item.color.split(',')
                let colorR  = (colorArr[0] << 16)
                let colorG  = (colorArr[1] << 8)
                let colorB  = colorArr[2] 
                return {
                    osdIndex    : index,
                    caption     : item.caption,
                    font        : item.font,
                    size        : item.size,
                    color       : colorR|colorG|colorB,
                    width       : width,
                    height      : height,
                    left        : parseInt(item.left),
                    top         : parseInt(item.top),
                    sizeRate    : item.fontSize/screenWidth,
                    leftRate    : parseInt(item.left)/screenWidth,
                    topRate     : parseInt(item.top)/screenHeight,
                    widthRate   : width/screenWidth,
                    heightRate  : height/screenHeight,
                    itemType    : item.itemType || 'Text',
                };
            })
            let resourceId = this.curHighRes.id;
            if(!resourceId){
                //获取高亮节点
                let nodes = this.getCheckedNodes(false);                
                if(nodes && nodes.length > 0) {
                    this.curHighRes = nodes[0];
                    resourceId = this.curHighRes.id;
                }
            }
            if(!resourceId){
                this.$message({message: '请选择资源', type: 'warning'});
                return;
            }
            console.log(items)
            this.apiSDK.updateOsdStyle(resourceId, this.osdStyleId, screenWidth, screenHeight, items, res => {
                if (res && res.ret == 0) {
                    this.$message({message: '保存成功', type: 'success'});
                } else {
                    this.$message({message: '保存失败', type: 'error'});
                }
            });
        },
        // 获取树选择用户
        //type: true:获取勾选  false：获取高亮
        getCheckedNodes(type) {
            let nodes = [];
            if(type){
                if(this.tabActiveName == "personTree"){
                    nodes = this.$refs.personTree.$refs.SelectResUsersStatus.getCheckedNodes();
                }else if(this.tabActiveName == "deviceTree"){
                    nodes = this.$refs.deviceTree.$refs.SelectResDevicesStatus.getCheckedNodes();
                } else if(this.tabActiveName == "commonTree"){
                    nodes = this.$refs.commonTree.$refs.SelectResCommonsStatus.getCheckedNodes();
                }
            }else{
                let node;
                if(this.tabActiveName == "personTree"){
                    node = this.$refs.personTree.$refs.SelectResUsersStatus.getCurrentNode();
                }else if(this.tabActiveName == "deviceTree"){
                    node = this.$refs.deviceTree.$refs.SelectResDevicesStatus.getCurrentNode();
                } else if(this.tabActiveName == "commonTree"){
                    node = this.$refs.commonTree.$refs.SelectResCommonsStatus.getCurrentNode();
                }
                if(node) nodes.push(node)
            }            
            nodes.forEach((item, index) => {
                if(item.nodeStatus == "department") nodes.splice(index, 1);
            })
            return nodes;
        },        
        // 应用效果
        applyOptions() {
            let rgb = Fun.hexToRGB(this.osdColorValue);
            this.osdList.forEach((item, index) => {
                if(item.active){
                    item.font = this.osdFontValue;
                    item.size = this.osdSizeValue;

                    let rgbs = this.osdColorValue.substring(this.osdColorValue.indexOf('(')+1, this.osdColorValue.indexOf(')'))
                    let rgbArr = rgbs.split(',');
                    item.fontColorR = parseInt(rgbArr[0]);
                    item.fontColorG = parseInt(rgbArr[1]);
                    item.fontColorB = parseInt(rgbArr[2]);
                    item.color      = rgbs;
                    item.style = this.refreshOsdStyle(item)
                    this.$set(this.osdList, index, item);
                }
            });
        },
        // 显示弹窗
        showApplyOsdDialog() {
            let resourceId = this.curHighRes.id;
            if(!resourceId){
                //获取高亮节点
                let nodes = this.getCheckedNodes(false);                
                if(nodes && nodes.length > 0) {
                    this.curHighRes = nodes[0];
                    resourceId = this.curHighRes.id;
                }
            }
            if(!resourceId){
                this.$message({message: '请选择资源', type: 'warning'});
                this.applyOsdVisible = false;
                return;
            }
            this.applyOsdForm.resId = this.curHighRes.id;
            this.applyOsdForm.resName = this.curHighRes.name
            this.applyOsdForm.applyIndex = this.osdStyleId
            this.applyOsdVisible = true;
        },
        // 应用字幕
        applyOsdStyle() {
            let items = [];
            items.push({
                resourceID : this.applyOsdForm.resId,
                applyIndex : this.applyOsdForm.applyIndex
            });

            let method = this.applyOsdForm.applyType === '1' ? 'applyOsdToNode' : 'applyOsdToAll';
            this.apiSDK[method](items, res => {
                if (res && res.Ret == 0) {
                    this.$message({message: '应用成功', type: 'success'});
                } else {
                    this.$message({message: '应用失败', type: 'error'});
                }
                this.applyOsdVisible = false;
            });
        },
        closedDialog(){
            //清空
            this.$refs.personTree.clearTree();
            this.$refs.deviceTree.clearTree();
            this.$refs.commonTree.clearTree();
            //取消订阅
            const subIDs = new Array(this.subscribeType.subscribeOrganizationUser,this.subscribeType.subscribeUsersStatus,
   						 this.subscribeType.subscribeUsersStatusByKey,this.subscribeType.subscribeUsersStatusByStatus,this.subscribeType.subscribeOrganizationDevice,
   						 this.subscribeType.subscribeDevicesStatus,this.subscribeType.subscribeDevicesStatusByKey,this.subscribeType.subscribeDevicesStatusByStatus,
   						 this.subscribeType.subscribeCommonResources,this.subscribeType.subscribeCommonResourcesByKey,this.subscribeType.subscribeCommonResourcesByStatus);
            this.apiSDK.cancelSubscribeResourceStatus(subIDs.join(","), "all");
        },
        setPositionX() {
            let positionX = Number(this.positionX);
            if( typeof positionX === 'number' && !isNaN(positionX)  ) {
                // 是数字 则进入
                this.positionX = (positionX < 0) ? 0 : positionX;
            } else {
                this.positionX = 0;
            }	    
	    
	        this.osdList.forEach((item, index) => {
                if(item.active){
                    item.left = this.positionX
                    item.style = this.refreshOsdStyle(item)
                    this.$set(this.osdList, index, item);
                }
            });
        },
        setPositionY() {
            let positionY = Number(this.positionY);
            if( typeof positionY === 'number' && !isNaN(positionY)  ) {
                // 是数字 则进入
                this.positionY = (positionY < 0) ? 0 : positionY;
            } else {
                this.positionY = 0;
            }
            
            this.osdList.forEach((item, index) => {
                    if(item.active){
                        item.top = this.positionY
                        item.style = this.refreshOsdStyle(item)
                        this.$set(this.osdList, index, item);
                    }
                });
            },
    }
}
</script>
<style scoped>
.drag-content {
    position: relative;
    height: 300px;
    background-color: #ddd;
}
.drag-item {
    position: absolute;
    cursor: pointer;
    display: inline;
    padding: 1px 2px;
    border: 1px dotted #ddd;
    white-space: nowrap;
    user-select: none;
}
.drag-item.active{
    border: 1px dotted #888;
}
.card-select{
    margin-top: -5px;
    vertical-align: middle;
}
.card-select /deep/ .el-input__inner{
    height: 30px;
    line-height: 30px;
    border-color: #c2dff3;
}
.card-select /deep/ .el-input__icon{
    line-height: 30px;
}
.option-item{
    display: flex;
    margin: 0 15px;
    padding: 10px 0;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dcdfe6;
}
.option-item .form-item{
    display: flex;
    align-items: center;
    margin-right: 15px;
}
.option-item .form-item span{
    word-break: keep-all;
    /*margin-top: 10px;*/
    margin-right: 5px;
}
.option-item .form-item .base-point{
    border: solid 1px #dcdfe6;
    padding: 0 12px;
    line-height: 36px;
}
.custom-dialog /deep/ .el-card__body{
    min-height: auto;
}
.warning-msg{
    color: #f90102;
    margin-left: 15px;
}
/* 0629 dj */
.el-cascader-node > .el-radio, :last-child.el-radio{
    margin-right: 30px\0; 
    margin-right: 30px\9; 
}
@media all and(min-width:0){
    .el-cascader-node > .el-radio, :last-child.el-radio{
        margin-right: 30px\9;
    }
}
</style>
