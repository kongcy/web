<template>
    <div>
        <el-row>
            <el-col :span="9">
                <div class="osdTreeTitle">设备资源</div>
                <!-- <device-tree ref="deviceTree" :subscribeType="subscribeType" style="height: 559px;" @currentChange="currentChange" />   -->
                <device-tree-res  ref="deviceTree" :subscribeType="subscribeType"  @currentChange="currentChange" />  
                <!-- <el-tabs v-model="tabActiveName">
                    <el-tab-pane label="组织结构" name="personTree">
                        <person-tree ref="personTree" :subscribeType="subscribeType" style="height: 559px;" @currentChange="currentChange" />
                    </el-tab-pane>
                    <el-tab-pane label="设备资源" name="deviceTree">
                        <device-tree ref="deviceTree" :subscribeType="subscribeType" style="height: 559px;" @currentChange="currentChange" />
                    </el-tab-pane>
                    <el-tab-pane label="常用资源" name="commonTree">
                        <common-res ref="commonTree" :subscribeType="subscribeType" style="height: 559px;" @currentChange="currentChange" />
                    </el-tab-pane>
                </el-tabs> -->
            </el-col>
            <el-col :span="15">
                <el-card class="box-card osd-card nobg">
                    <div slot="header">
                        <span>选择字幕样式</span>
                        <el-select placeholder="请选择" class="card-select" v-model="osdStyleId" @change="getOSDByOsdStyleId">
                            <el-option
                              v-for="item in osdStyleList"
                              :key="item.key"
                              :label="item.label"
                              :value="item.value">
                              <i v-if="osdStyleId == item.value"></i>
                              <span>{{item.label}}</span>
                            </el-option>
                        </el-select>
                    </div>
                    <el-scrollbar class="hiddenXScroll" style="height:100%">
                        <div class="drag-content">
                        <div class="drag-item" v-for="item in osdList" :id="item.osdId" :key="item.key" 
                            :class="item.active?'active':''" :style="item.style" @mousedown="e => osdMoveHandle(item, e)">{{item.caption}}</div>
                    </div>
                    </el-scrollbar>
                   
                </el-card>
                <el-card class="box-card  osd-card setOsdCard">
                    <div slot="header">
                        <span>字幕个数: <span class="osdNum">{{osdList.length}}</span>/8</span>
                        <el-button type="text" class="remove-btn" title="删除字幕" style="float:right;margin:0 0px 0 0;vertical-align: bottom;" @click="deleteOsd"></el-button>
                        <el-button type="text" class="add-btn" title="新增字幕" style="float:right;margin:0 15px 0 0;vertical-align: bottom;" @click="addDefaultOsd(osdTypeValue)"></el-button>
                    </div>
                    <div class="option-item">
                        <div class="form-item">
                            <span>字幕类型</span>
                            <el-select placeholder="请选择" v-model="osdTypeValue" @change="osdTypeChange">
                                <el-option
                                  v-for="item in osdTypeOptions"
                                  :key="item.key"
                                  :label="item.label"
                                  :value="item.value">
                                     <i v-if="osdTypeValue == item.value"></i>
                                    <span>{{item.label}}</span>
                                </el-option>
                            </el-select>
                        </div>
                        <div class="form-item">
                            <span>字体</span>
                            <el-select placeholder="请选择" v-model="osdFontValue" @change="osdFontSelectChange" style="width:110px">
                                <el-option
                                  v-for="item in osdFontOptions"
                                  :key="item.key"
                                  :label="item.label"
                                  :value="item.value">
                                  <i v-if="osdFontValue == item.value"></i>
                                  <span>{{item.label}}</span>
                                </el-option>
                            </el-select>
                        </div>
                        <div class="form-item">
                            <span>字号</span>
                            <el-select placeholder="请选择" v-model="osdSizeValue" @change="osdSizeSelectChange" style="width:67px">
                                <el-option
                                  v-for="item in osdSizeOptions"
                                  :key="item.key"
                                  :label="item.label"
                                  :value="item.value">
                                  <i v-if="osdSizeValue == item.value"></i>
                                  <span>{{item.label}}</span>
                                </el-option>
                            </el-select>
                        </div>
                        <div class="form-item last-item">
                            <span>颜色</span>
                            <el-color-picker v-model="osdColorValue" color-format="rgb" @change="osdColorChange"></el-color-picker>
                        </div>
                        <!-- <el-button type="primary" plain @click="applyOptions">应用效果</el-button> -->
                    </div>
                    <div class="option-item">
                        <div class="form-item" style="margin-right: 0;width:100%">
                            <span>字幕内容</span>
                            <el-input class="osdinput" minlength=4 maxlength=8 v-model="osdContentValue" @change="osdContentChange" placeholder="请输入4-8个字符的内容"/>
                        </div>
                    </div>
                    <div class="option-item" style="border-bottom: 0;">
                        <div class="form-item">
                            <span>基准位置</span>
                            <div class="base-point">
                                <el-radio v-model="osdBasePointValue" v-for="item in osdBasePointRadios" :label="item.value" :key="item.key" @change="osdBasePointChange">{{item.label}}</el-radio>
                            </div>
                        </div>
                        <div class="form-item">
                            <span>水平距离</span>
                            <el-input class="osdinput" v-model="positionX" @change="setPositionX" />
                        </div>
                        <div class="form-item" style="margin-right: 0;">
                            <span>垂直距离</span>
                            <el-input class="osdinput" v-model="positionY" @change="setPositionY"/>
                        </div>
                    </div>
                </el-card>

            </el-col>
        </el-row>
        <!-- <span slot="footer" class="dialog-footer">
            <el-row>
                <el-col :span="8">
                    <el-button type="primary" v-popover:applyOsdDialog>应用字幕</el-button>
                </el-col>
                <el-col :span="16">
                    <el-button type="primary" @click="deleteOsd">删除</el-button>
                    <el-button type="primary" @click="saveOsd">保存</el-button>
                    <el-button @click="isVisible = false">关闭</el-button>
                </el-col>
            </el-row>
        </span> -->
    <el-popover
        ref="applyOsdDialog"
        popper-class="custom-popover"
        placement="top"
        width="360"
        title="应用字幕"
        v-model="applyOsdVisible"
        @show="showApplyOsdDialog"
        trigger="click">
        <el-button type="text" class="btn-close" icon="el-icon-close" @click="applyOsdVisible = false"></el-button>
        <el-form ref="applyOsdForm" :model="applyOsdForm" label-width="120px">
            <el-form-item label="当前资源：" >
                <!--{{resource.hasOwnProperty('name') && resource.name}}-->
                {{applyOsdForm.resName}}
            </el-form-item>
            <el-form-item label="字幕样式22222：" prop="osdStyleId">
                <el-select placeholder="请选择" class="card-select" v-model="applyOsdForm.applyIndex">
                    <el-option
                      v-for="item in osdStyleList"
                      :key="item.key"
                      :label="item.label"
                      :value="item.value">
                       <i v-if="applyOsdForm.applyIndex == item.value"></i>
                       <span>{{item.label}}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label-width="0" style="text-align: center" prop="applyType">
                <el-radio v-model="applyOsdForm.applyType" label="1">应用到本节点23</el-radio>
                <!--<el-radio v-model="applyOsdForm.applyType" label="2">应用到全网</el-radio>-->
            </el-form-item>
        </el-form>
        <div class="dialog-footer" style="text-align:center">
            <el-button type="primary" @click="applyOsdStyle">确定</el-button>
            <el-button @click="applyOsdVisible = false">取消</el-button>
        </div>
    </el-popover>
    </div>
</template>
<script>
import Fun from "@/common/fun";
import Enum from "@/common/enum";
import PersonTree from "@/components/home/selectRes/PersonTree.vue";
import DeviceTree from "@/components/home/selectRes/DeviceTree.vue";
import DeviceTreeRes from "@/components/home/selectRes/DeviceTreeRes.vue";
import CommonRes from "@/components/home/selectRes/CommonRes.vue";
export default {
    name: 'OsdManageDialog',
    components: {
        PersonTree,
        DeviceTree,
        DeviceTreeRes,
        CommonRes
    },
    data() {
        return {
            subscribeType: '',
            tabActiveName: 'deviceTree',
            activeName:"department",
          
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
                value: 'sourceName',
                label: '源名称'
            }, {
                value: 'departmentName',
                label: '单位名称'
            }, {
                value: 'text',
                label: '自定义文本'
            }, {
                value: 'dateTime',
                label: '日期时间'
            }],
            osdTypeValue: 'sourceName',//类型值

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
        console.log("cccc")
      
        this.empty();
    },
    methods: {
        // 清空
        empty() {
            this.curHighRes = {};
            this.osdStyleId = '1';
            this.osdList = [];
        },
        // 显示弹框
        showDialog() {
            
            this.isVisible = true;
            this.$nextTick(() => {
                xtxk.media.setDialogTop('字幕管理');
            });
           
        },
        // 初始化树
        initTree() {
            this.empty();
            // this.$nextTick(() => {
                const organId = "";
                this.subscribeType = Enum.enumSubscribeType.osdMng;
                //订阅用户组织结构
                let subjectId = 0;
                //dj 默认 行政隶属
                this.$refs.deviceTree.relationshipValue = subjectId;
               
                //获取设备组织结构
                this.apiSDK.getOrganizationDevice(organId, this.subscribeType.subscribeOrganizationDevice, subjectId, (obj) =>{
                    //console.log(obj);
                    this.$refs.deviceTree && this.$refs.deviceTree.setReceiveInformAddDepartmentCallback(obj);
                });
               
                //资源回调
                this.apiSDK.setReceiveResourceStatusQueryCallback("osdMng", (obj) => {
                    //console.log(obj);
                    this.$refs.deviceTree && this.$refs.deviceTree.setReceiveInformResourceStatusCallback(obj);
                });
            // });
        },
        // 当前选中节点变化时触发的事件
        currentChange(node) {
            if (node.data.nodeStatus == 'department' || this.curHighRes == node.data) {
                return;
            }
            this.curHighRes = node.data;
            
            // 通过资源ID获取绑定的osd
            this.apiSDK.queryOSDstyleBind(this.curHighRes.id, res => {
                let index = '1';
                if(res && res.length > 0){
                    index = res[0].index+''
                }
                this.getOSDByOsdStyleId(index)
            });

            this.applyOsdForm.resId = this.curHighRes.id;
            this.applyOsdForm.resName = this.curHighRes.name
            this.applyOsdForm.applyIndex = this.osdStyleId
            this.$emit('sendValue', this.applyOsdForm);
        },
        // 根据 id 查询OSD样式详情
        getOSDByOsdStyleId(index) {
            this.osdStyleId = index;
            this.osdList = [];
            this.resetForm();

            let resourceId = this.curHighRes.id;
            if(!resourceId){
                //this.$message({message: '请选择资源', type: 'warning'});
                return;
            }
            this.apiSDK.getOSDByOsdStyleId(resourceId, index ,res => {
                if(res){
                    res.items && res.items.forEach(item => {
                        let ind = this.osdSizeOptions.findIndex(it => it.label == item.fontSize)

                        item.osdId      = "s"+parseInt(Math.random()*1000)
                        item.active     = false
                        item.fontSize   = this.osdSizeOptions[ind].value
                        item.caption    = item.caption || "文本"
                        item.fontFamily = item.fontFamily || "微软雅黑"
                        item.style      = this.refreshOsdStyle(item)
                        this.osdList.push(item)
                    })
                    if(this.osdList.length > 0) {
                        this.osdSelectHandle(this.osdList[0]);
                    }
                }
            });
        },
        // 字幕显示样式
        refreshOsdStyle(data) {
            let style = '';
            if (Object.keys(data).length) {
                style = `font-family: ${data.fontFamily}; font-size: ${data.fontSize}px; color: rgb(${data.fontColorR},${data.fontColorG},${data.fontColorB});`;
                
                if(data.basePoint == 'leftDown'){
                    style += `left: ${data.x}px; bottom: ${data.y}px;`
                }else if(data.basePoint == 'rightTop'){
                    style += `right: ${data.x}px; top: ${data.y}px;`
                }else if(data.basePoint == 'rightDown'){
                    style += `right: ${data.x}px; bottom: ${data.y}px;`
                }else{//leftTop
                    style += `left: ${data.x}px; top: ${data.y}px;`
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
                    item.x = left;
                    item.y = dragContent.offsetHeight - odiv.offsetHeight - top;
                }else if(item.basePoint == 'rightTop'){
                    item.x = dragContent.offsetWidth - odiv.offsetWidth - left;
                    item.y = top;
                }else if(item.basePoint == 'rightDown'){
                    item.x = dragContent.offsetWidth - odiv.offsetWidth - left;
                    item.y = dragContent.offsetHeight - odiv.offsetHeight - top;
                }else{//leftTop
                    item.x = left;
                    item.y = top;
                }
                item.style = this.refreshOsdStyle(item);
                this.positionX = item.x;
                this.positionY = item.y;
            }
            document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        },
        //字幕选中
        osdSelectHandle(item, e){
            console.log(item)
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
                this.osdTypeValue = item.itemType;
                this.osdContentValue = item.caption;
                this.osdFontValue = item.fontFamily;
                this.osdSizeValue = item.fontSize;
                this.osdColorValue = `rgb(${item.fontColorR},${item.fontColorG},${item.fontColorB})`;
                this.osdBasePointValue = item.basePoint;
                this.positionX = item.x;
                this.positionY = item.y;
            }
        },
        //表单恢复默认
        resetForm(){
            this.osdTypeValue = "sourceName"
            this.osdFontValue = "微软雅黑"
            this.osdSizeValue = Enum.enumFontSize.Three
            this.osdBasePointValue = 'leftTop'
            this.osdContentValue = ''
            this.osdColorValue = 'rgb(19, 91, 206)'
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
            }
            if(!resourceId){
                this.$message({message: '请选择资源', type: 'warning'});
                return;
            }
            if (this.osdList.length >= 8) {
                this.$message({message: "已超过最大设置数量", type: "warning"})
                return;
            }
            let dragContent = document.querySelector(".drag-content");
            let defaultLeft = 100, defaultTop = 50;
            this.osdTypeChange(this.osdTypeValue)
            let rgbs = this.osdColorValue.substring(this.osdColorValue.indexOf('(')+1, this.osdColorValue.indexOf(')'))
            let rgbArr = rgbs.split(',')

            let item = {
                osdId       : "s"+parseInt(Math.random()*1000),
                caption     : this.osdContentValue,
                active      : true,
                itemType    : this.osdTypeValue,
                fontFamily  : this.osdFontValue,
                fontSize    : this.osdSizeValue,
                fontColorR  : parseInt(rgbArr[0]),
                fontColorG  : parseInt(rgbArr[1]),
                fontColorB  : parseInt(rgbArr[2]),
                basePoint   : this.osdBasePointValue,
                x           : parseInt(defaultLeft),
                y           : parseInt(defaultTop),
            };
            item.style = this.refreshOsdStyle(item)
            this.osdList.push(item);
            this.osdSelectHandle(item);
        },
        // 字幕文本内容变化
        osdContentChange(val){
            if(val == '') this.osdContentValue = "文本"
            this.osdList.forEach((item, index) => {
                if(item.active){
                    item.caption = this.osdContentValue;
                    this.$set(this.osdList, index, item);
                }
            });
        },
        // 类型下拉切换事件
        osdTypeChange(type) {
            if(type == "text"){
                this.osdContentValue = "自定义文本";
            }else if(type == "dateTime"){
                this.osdContentValue = new Date().formatDate('yyyy-MM-dd HH:mm:ss');
            }else if(type == "sourceName"){
                this.osdContentValue = this.curHighRes.name;
            }else if(type == "departmentName"){
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
        },
        //字体下拉框切换事件
        osdFontSelectChange(val){
            this.osdList.forEach((item, index) => {
                if(item.active){
                    item.fontFamily = val;
                    item.style = this.refreshOsdStyle(item)
                    this.$set(this.osdList, index, item);
                }
            });
        },
        //字号下拉框切换事件
        osdSizeSelectChange(val){
            this.osdList.forEach((item, index) => {
                if(item.active){
                    item.fontSize = val
                    item.style = this.refreshOsdStyle(item)
                    this.$set(this.osdList, index, item);
                }
            });
        },
        //颜色切换事件
        osdColorChange(val){
            let rgbs = val.substring(val.indexOf('(')+1, val.indexOf(')'))
            let rgbArr = rgbs.split(',');
            this.osdList.forEach((item, index) => {
                if(item.active){
                    item.fontColorR = parseInt(rgbArr[0]);
                    item.fontColorG = parseInt(rgbArr[1]);
                    item.fontColorB = parseInt(rgbArr[2]);
                    item.style = this.refreshOsdStyle(item)
                    this.$set(this.osdList, index, item);
                }
            });
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
                            item.y = dragContent.offsetHeight - dragItem.offsetHeight - item.y;
                        }else if(item.basePoint == 'rightTop'){
                            item.x = dragContent.offsetWidth - dragItem.offsetWidth - item.x;
                        }else if(item.basePoint == 'rightDown'){
                            item.x = dragContent.offsetWidth - dragItem.offsetWidth - item.x;
                            item.y = dragContent.offsetHeight - dragItem.offsetHeight - item.y;
                        }else{//leftTop
                            
                        }
                    }else if(preBasePoint == 'leftDown'){
                        if(item.basePoint == 'leftDown'){
                            
                        }else if(item.basePoint == 'rightTop'){
                            item.x = dragContent.offsetWidth - dragItem.offsetWidth - item.x;
                            item.y = dragContent.offsetHeight - dragItem.offsetHeight - item.y;
                        }else if(item.basePoint == 'rightDown'){
                            item.x = dragContent.offsetWidth - dragItem.offsetWidth - item.x;
                        }else{//leftTop
                            item.y = dragContent.offsetHeight - dragItem.offsetHeight - item.y;
                        }
                    }else if(preBasePoint == 'rightTop'){
                        if(item.basePoint == 'leftDown'){
                            item.x = dragContent.offsetWidth - dragItem.offsetWidth - item.x;
                            item.y = dragContent.offsetHeight - dragItem.offsetHeight - item.y;
                        }else if(item.basePoint == 'rightTop'){
                            
                        }else if(item.basePoint == 'rightDown'){
                            item.y = dragContent.offsetHeight - dragItem.offsetHeight - item.y;
                        }else{//leftTop
                            item.x = dragContent.offsetWidth - dragItem.offsetWidth - item.x;
                        }
                    }else if(preBasePoint == 'rightDown'){
                        if(item.basePoint == 'leftDown'){
                            item.x = dragContent.offsetWidth - dragItem.offsetWidth - item.x;
                        }else if(item.basePoint == 'rightTop'){
                            item.y = dragContent.offsetHeight - dragItem.offsetHeight - item.y;
                        }else if(item.basePoint == 'rightDown'){
                            
                        }else{//leftTop
                            item.x = dragContent.offsetWidth - dragItem.offsetWidth - item.x;
                            item.y = dragContent.offsetHeight - dragItem.offsetHeight - item.y;
                        }
                    }
                    this.$set(this.osdList, index, item);
                    this.positionX = item.x;
                    this.positionY = item.y;
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
            }).catch(()=>{});
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
            var items=[];
            if(this.osdList.length>0){
                items = this.osdList.map((item, index) => {
                let ind = self.osdSizeOptions.findIndex(it => it.value == item.fontSize)
                let fontSize = self.osdSizeOptions[ind].label
                return {
                    index       : index,
                    caption     : item.caption,
                    itemType    : item.itemType,
                    fontFamily  : item.fontFamily,
                    fontSize    : fontSize,
                    fontColorR  : item.fontColorR,
                    fontColorG  : item.fontColorG,
                    fontColorB  : item.fontColorB,
                    basePoint   : item.basePoint,
                    x           : parseInt(item.x),
                    y           : parseInt(item.y),
                };
            })
            }

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
            // let resourceId = this.osdStyleObj.resourceId;
            // if(!resourceId){//新增
            //     let nodes = this.getCheckedNodes();
            //     if(nodes.length == 0){
            //         this.$message({message: '请选择资源', type: 'warning'});
            //         return;
            //     }
            //     if(nodes.length > 1){
            //         this.$message({message: '只能选择一个资源', type: 'warning'});
            //         return;
            //     }
            //     resourceId = nodes[0].id
            // }
            
            if(items.length>0){
                //画布上有字幕时调用接口
                this.apiSDK.updateOsdStyle(resourceId, this.osdStyleId, screenWidth, screenHeight, items, res => {
                    if (res && res.Ret == 0) {
                        this.$message({message: '保存成功', type: 'success'});
                    } else {
                        this.$message({message: '保存失败', type: 'error'});
                    }
                });
            }else{
                //画布上没有字幕时调用接口 2020.12.25
                this.apiSDK.deleteOsdStyle(resourceId, parseInt(this.osdStyleId),res => {
                    if (res && res== 1) {
                        this.$message({message: '保存成功', type: 'success'});
                    } else {
                        this.$message({message: '保存失败', type: 'error'});
                    }
                })
            }
           
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
                    item.fontFamily = this.osdFontValue;
                    item.fontSize = this.osdSizeValue;

                    let rgbs = this.osdColorValue.substring(this.osdColorValue.indexOf('(')+1, this.osdColorValue.indexOf(')'))
                    let rgbArr = rgbs.split(',');
                    item.fontColorR = parseInt(rgbArr[0]);
                    item.fontColorG = parseInt(rgbArr[1]);
                    item.fontColorB = parseInt(rgbArr[2]);
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
            // this.$refs.personTree.clearTree();
            this.$refs.deviceTree.clearTree();
            // this.$refs.commonTree.clearTree();
            //取消订阅
             const subIDs = new Array(this.subscribeType.subscribeOrganizationDevice,
   						 this.subscribeType.subscribeDevicesStatus,this.subscribeType.subscribeDevicesStatusByKey,this.subscribeType.subscribeDevicesStatusByStatus);
            // const subIDs = new Array(this.subscribeType.subscribeOrganizationUser,this.subscribeType.subscribeUsersStatus,
   			// 			 this.subscribeType.subscribeUsersStatusByKey,this.subscribeType.subscribeUsersStatusByStatus,this.subscribeType.subscribeOrganizationDevice,
   			// 			 this.subscribeType.subscribeDevicesStatus,this.subscribeType.subscribeDevicesStatusByKey,this.subscribeType.subscribeDevicesStatusByStatus,
   			// 			 this.subscribeType.subscribeCommonResources,this.subscribeType.subscribeCommonResourcesByKey,this.subscribeType.subscribeCommonResourcesByStatus);
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
                    item.x = this.positionX
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
                    item.y = this.positionY
                    item.style = this.refreshOsdStyle(item)
                    this.$set(this.osdList, index, item);
                }
            });
        },
    }
}
</script>
<style scoped>
.osdTreeTitle{
    height: 40px;
    background: #314D78;
    font-size: 18px;
    color: #B7C1D0;
    line-height: 48px;
    padding: 0px 15px;
}
/* el-card样式修改 */
.osd-card{
    background: transparent;
    border:none !important;
    color: #B7C1D0;
}
.custom-dialog .osd-card /deep/ .el-card__header{
    background:url(../../../static/main/screen/card_title_bg.png) no-repeat center;
    background-size:100% 100%;
    border-color: transparent;
}
.custom-dialog .osd-card.nobg /deep/ .el-card__header{
    background:none;
}
.custom-dialog .osd-card.setOsdCard /deep/ .el-card__body{
    height: auto;
}

.custom-dialog .osd-card /deep/ .el-card__header{
    padding:10px 15px;
}

.drag-content {
    position: relative;
    height: 300px;
     background-color: #314D78; 
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
.osdNum{
    color:#5C98FF;
    margin:0 0 0 5px
}
.card-select{
    margin-top: -5px;
    vertical-align: middle;
}
.card-select /deep/ .el-input__inner{
    height: 30px;
    line-height: 30px;
}
/deep/ .el-input__icon{
    line-height: 30px;
}
/deep/ .el-color-picker__trigger{
    border:none;
}
.option-item{
    display: flex;
    margin: 0 15px;
    padding: 5px 0;
    justify-content: space-between;
    align-items: center;
}
.option-item .form-item{
    display: flex;
    align-items: center;
    margin-right: 15px;
}
.option-item .last-item {
    margin-right: 0px;
}
.option-item .last-item /deep/ .el-color-picker__trigger{
    padding-right:0px;
}


/deep/ .el-select>.el-input {
    background-color:transparent;
}
.option-item .form-item span{
    word-break: keep-all;
    margin-right: 5px;
}
.option-item .form-item .base-point{
    padding: 0px;
    line-height: 36px;
    width: 175px;
}
.custom-dialog /deep/ .el-card__body{
    height: auto;
    min-height: auto;
}
.warning-msg{
    color: #f90102;
    margin-left: 15px;
}
.osdinput /deep/ .el-input__inner{
    background:transparent;
    border-color: #6B7C92;
    color: #fff;
    height: 32px;
}
.el-scrollbar.hiddenXScroll /deep/ .el-scrollbar__wrap{
    overflow-x: hidden;
        margin-bottom: -5px!important;
}

/* redio样式 */
/deep/ .el-radio{
   color: #B7C1D0;
   margin-right: 29px;
}
/deep/ .el-radio__input.is-checked .el-radio__inner {
    /* border-color: #409EFF;
    background: none; */
    border:none;
    background:url(../../../static/common/redio_active.png) no-repeat center;
}
/deep/ .el-radio__inner {
    /* border-color: #6B7C92;
    background: none; */
    width:20px;
    height:20px;
    border:none;
    background:url(../../../static/common/redio_no.png) no-repeat center;
}
/deep/ .el-radio__inner::after {
    /* border-radius: 50%;*/
    background:url(../../../static/common/redio_active.png) no-repeat center;
    /* background-color: #409EFF;  */
}
.base-point /deep/ .el-radio__inner::after {
    width: 8px;
    height: 8px;
}
/deep/ .el-radio__input.is-checked+.el-radio__label {
    color: #fff;
}
</style>
