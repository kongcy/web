<template>
    <div>
        <el-dialog :visible.sync="isVisible" title="会场通知" width="1000px" @close="closeDialog" >
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="发送通知" name="first">
                    <div class="sendMsgWrap">
                        <div class="msgUersBox">
                            <div class="magUserTitle">
                                <span>通知人员</span>
                                <el-checkbox v-model="checkAllUsersValue" @change="handleCheckAllChange">全部/取消</el-checkbox>
                            </div>
                            <el-checkbox-group v-model="checkedUsers" @change="handleCheckedUsersChange">
                                <el-checkbox v-for="item in magUersData" :label="item.id" :key="item.id">
                                <!-- <el-checkbox v-for="item in magUersData" :label="item" :key="item"> -->
                                    <span class="user_icon"></span>
                                    <span>{{item.name}}</span>
                                    <!-- <span>{{item}}</span> -->
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="msgStyleBox">
                            <div class="styleAndTemplateBox">
                                <div class="styleWrap">
                                    <div class="previewBox">
                                        <p id="previewContent">{{msgContentValue}}</p>
                                    </div>
                                    <div class="templatesBox">
                                        <div class="templatesTitle">样式模板</div>
                                        <ul>
                                            <template v-for="item in msgTemplateData">
                                                <li :id="item.id" :key="item.id" :class="item.active===true?'active' : '' " @click="handleClickTemplateLi(item)">
                                                    <!-- <span class="template_icon"></span> -->
                                                    <span class="template_name">{{item.name}}</span>
                                                    <span class="template_delete_icon" @click="deleteMsgStyleTemplate(item)"></span>
                                                </li>
                                            </template>
                                        </ul>
                                    </div>
                                </div>
                                <div class="templateInfoWrap">
                                    <el-form :inline="true" :model="templateForm" ref="templateForm" :rules="templateFormRules" class="demo-form-inline">
                                        <div class="formDiv">
                                            <el-form-item label="模板名称" prop="name">
                                                <el-input v-model="templateForm.name" placeholder="模板名称" class="templateNameInput"></el-input>
                                                <span class="templateBtn_icon addTemplate" title="保存新增模板" @click="addMsgStyleTemplate"></span>
                                                <span class="templateBtn_icon editTemplate" title="保存修改模板" @click="editMsgStyleTemplate"></span>
                                            </el-form-item>
                                        </div>
                                        <div class="formDiv">
                                            <el-form-item label="字体">
                                                <el-select v-model="templateForm.fontFamilyValue" placeholder="字体" @change="handleFontFamilyChange">
                                                    <el-option v-for="item in templateForm.fontFamilyData" :label="item.name" :value="item.value" :key="item.id"></el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="字号">
                                                <el-select v-model="templateForm.fontSizeValue" placeholder="字号" @change="handleFontSizeChange">
                                                    <el-option v-for="item in templateForm.fontSizeData" :label="item" :value="item" :key="item"></el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="字型">
                                                <el-select v-model="templateForm.fontStyleValue" placeholder="字型" @change="handleFontStyleChange">
                                                    <el-option v-for="item in templateForm.fontStyleData" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="颜色">
                                                <el-color-picker v-model="templateForm.color" color-format="rgb" @change="handleFontColorChange"></el-color-picker>
                                            </el-form-item>
                                        </div>
                                        <div class="formDiv">
                                            <el-form-item label="方向">
                                                <el-select v-model="templateForm.fontDirectionValue" placeholder="方向">
                                                    <el-option v-for="item in templateForm.fontDirectionData" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="位置">
                                                <el-select v-model="templateForm.fontPositionValue" placeholder="位置">
                                                    <el-option v-for="item in templateForm.fontPositionData" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="速度">
                                                <el-select v-model="templateForm.fontSpeedValue" placeholder="速度">
                                                    <el-option v-for="item in templateForm.fontSpeedData" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="滚动时间">
                                                 <el-checkbox v-model="templateForm.noScrollTimeLimit">不限</el-checkbox>
                                                 <el-input-number v-model="templateForm.ScrollTime" controls-position="right" :min="1" :max="10" class="limitInput"></el-input-number>
                                                 分钟
                                            </el-form-item>
                                        </div>
                                    </el-form>
                                </div>
                            </div>
                            <div class="msgContentBox">
                                <p>通知内容（64个汉字以内）：</p>
                                <el-input type="textarea" :rows="3" placeholder="请输入通知内容" v-model="msgContentValue" resize="none" maxlength="64"> </el-input>
                            </div>
                            <div class="sendMsgBtnsWrap">
                                <div class="switchBox">
                                    <el-switch v-model="fullScreenScrollValue" active-color="#409EFF" inactive-color="#DCDFE6"></el-switch>
                                    <span class="switchSpan">{{fullScreenScrollTip}}</span>
                                </div>
                                <div class="centerBtnBox">
                                    <el-button type="primary" class="btnCom" @click="handleConfirmSendMsg">发送</el-button>
                                    <el-button class="btnCom" @click="handleCancelSendMsg">取消</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="已发通知" name="second">
                    <div class="sendedMsgWrap">
                        <el-table :data="sendedMsgTableData" height="565" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="55">
                            </el-table-column>
                            <el-table-column prop="msgTime" label="通知时间" align="center" width="160">
                            </el-table-column>
                            <el-table-column prop="msgSenderName" label="通知人" align="center" width="100">
                            </el-table-column>
                            <!-- <el-table-column prop="msgReceiverName" label="接收人" align="center" width="280" show-overflow-tooltip>
                            </el-table-column> -->
                            <el-table-column label="接收人" align="center" width="280" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-for="(item,index) in scope.row.msgReceiverData" :key="item.receiverName" class="name_span">
                                        {{item.receiverName}}
                                        <span v-if="index < scope.row.msgReceiverData.length-1"> ,</span>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="msgContent" label="通知内容" align="center" show-overflow-tooltip>
                            </el-table-column>
                        </el-table>
                        <div class="sendedMsgBtnsWrap">
                            <el-button type="primary" class="btnCom" @click="handleStopAll">全部停止</el-button>
                            <el-button type="primary" class="btnCom" @click="handleStopOne">停止</el-button>
                            <el-button class="btnCom" @click="handleCancel">取消</el-button>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "MeetingMassageDialog",
    components: {},
    data() {
        return {
            isVisible:false,
            activeName:'first',
            checkAllUsersValue:false,
            checkedUsers:[],
            magUersData:[],
            msgTemplateData:[],
            selectedTemplate:{},
            templateForm:{
                name:'',
                id:'',
                // fontFamilyValue:'SIM_SUN',  // SIM_SUN/SIM_HEI/SIM_KAI/SIM_SUN_EX/SIM_LI
                fontFamilyValue:1,
                fontFamilyData:[
                    {
                        value:1,
                        id:'SIM_SUN',
                        // name:'SimSun',
                        name:'宋体',
                    },
                    {
                        value:2,
                        id:'SIM_HEI',
                        // name:'SimHei',
                        name:'黑体',
                    },
                    {
                        value:3,
                        id:'SIM_KAI',
                        // name:'KaiTi',
                        name:'楷体',
                    },
                    {
                        value:4,
                        id:'SIM_SUN_EX',
                        // name:'FangSong',
                        name:'仿宋',
                    },
                    {
                        value:5,
                        id:'SIM_LI',
                        // name:'LiSu',
                        name:'隶书',
                    },
                ],
                fontSizeValue:20,
                fontSizeData:[8,10,12,14,16,20,24,28,32,36,40,44,48,50],
                fontStyleValue:'normal',  // 常规:normal,斜体:italic,粗体:bold,粗斜体:boldItalic
                fontStyleData:[
                    {
                        id:'normal',
                        name:'常规',
                    },
                    {
                        id:'italic',
                        name:'斜体',
                    },
                    {
                        id:'bold',
                        name:'粗体',
                    },
                    {
                        id:'boldItalic',
                        name:'粗斜体',
                    },
                ],
                color:'rgb(0, 0, 0)',
                fontDirectionValue:'fromRightToLeft',
                fontDirectionData:[
                    {
                        id:'fromRightToLeft',
                        name:'从右到左',
                    },
                    {
                        id:'fromDownToTop',
                        name:'从下到上',
                    },
                ],
                fontPositionValue:'center',
                fontPositionData:[
                    {
                        id:'top',
                        name:'顶部',
                    },
                    {
                        id:'center',
                        name:'居中',
                    },
                    {
                        id:'bottom',
                        name:'底部',
                    },
                ],
                fontSpeedValue:'normal',
                fontSpeedData:[
                    {
                        id:'slow',
                        name:'较慢',
                    },
                    {
                        id:'normal',
                        name:'普通',
                    },
                    {
                        id:'fast',
                        name:'较快',
                    },
                ],
                noScrollTimeLimit:false,
                ScrollTime:1,
            },
            templateFormRules:{
                name:[
                    { required: true, message: "请输入模板名称", trigger: "blur" },
                ],
            },
            msgContentValue:'',
            fullScreenScrollValue:false,
            fullScreenScrollTip:'内容未满屏进行滚动',
            sendedMsgTableData:[],
            multipleSelection:[],
        }
    },
    methods:{
        showDialog(){
            this.isVisible = true;
            this.$nextTick(() => {
              xtxk.media.setDialogTop('会场通知');
            });
            this.getMsgUsersList();
            this.getMsgStyleTemplateList();
            this.getSendedMsgTableData();
        },
        closeDialog(){
            this.isVisible = false;
        },
        handleClick(tab, event){
            // console.log(tab, event);
        },
        // 获取人员列表
        getMsgUsersList(){
            this.magUersData = [
                // '测试用户001','测试用户002','测试用户003'
                /* 测试数据
                {
                    id:'001',
                    name:'测试用户001',
                },
                {
                    id:'002',
                    name:'测试用户002',
                },
                {
                    id:'003',
                    name:'测试用户003',
                },
                */
            ];
        },
        // 全部/取消
        handleCheckAllChange(val){
            // this.checkedUsers = val ? this.magUersData : [];
            if( val === true ){
                this.magUersData.forEach((item)=>{
                    this.checkedUsers.push(item.id);
                });
            }else{
                this.checkedUsers = [];
            }
            // console.log(JSON.stringify(this.checkedUsers));
        },
        handleCheckedUsersChange(value){
            let checkedCount = value.length;
            this.checkAllUsersValue = checkedCount === this.magUersData.length;
        },
        // 获取所有样式模板列表
        getMsgStyleTemplateList(){
            let that = this;
            this.msgTemplateData = [];
            this.msgTemplateData = [
                /* 测试数据
                {
                    id:'111',
                    name:'样式模板01',
                    active:false,
                    info:{
                        fontFamily:'',
                        fontSize:'',
                        // ...
                    },
                },
                {
                    id:'222',
                    name:'样式模板02',
                    active:false,
                },
                {
                    id:'333',
                    name:'样式模板03',
                    active:false,
                },
                */
            ];
            /* 当前接口不具备，会报错
            this.apiSDK.getNotificationTemplateList(function(obj){
                console.log(obj);
                // resp =[{templateId:"",templateName:""}...]
                if( obj ){
                    obj.forEach((item)=>{
                        that.msgTemplateData.push({
                            id:item.templateId,
                            name:item.templateName,
                            active:false,
                        });
                    });
                    console.log(JSON.stringify(that.msgTemplateData));
                }
            });
            */
        },
        // 选择模板
        handleClickTemplateLi(item){
            let that = this;
            // 选择模板样式
            this.msgTemplateData.forEach((item)=>{
                item.active = false;
            });
            item.active = true;
            this.selectedTemplate.name = item.name;
            this.selectedTemplate.id = item.id;
            this.templateForm.name = item.name;
            this.templateForm.id = item.id;
            /* 当前接口不具备，会报错
            // 根据模板id获取模板详细信息
            this.apiSDK.getNotificationTemplateById(item.id, function(obj){
                console.log(obj);
                // resp ={templateId:"",templateName:"", fontFamily:"", fontSize:"", fontPattern:"", color:{R:'',G:'',B:''},rollStyle:"", rollPos:"", rollspeed:"", rollTime:"", isNotLimit:true/false}
                if( obj ){
                    that.selectedTemplate = obj;
                    // that.templateForm.fontFamilyValue =  obj.fontFamily;
                    that.templateForm.fontFamilyData.forEach((item,index)=>{
                        if( obj.fontFamily === item.id  ){
                            that.templateForm.fontFamilyValue = item.value;
                        }
                    });
                    that.templateForm.fontSizeValue =  obj.fontSize;
                    that.templateForm.fontStyleValue =  obj.fontPattern;
                    that.templateForm.color =  obj.color;
                    that.templateForm.fontDirectionValue =  obj.rollStyle;
                    that.templateForm.fontPositionValue =  obj.rollPos;
                    that.templateForm.fontSpeedValue =  obj.rollspeed;
                    that.templateForm.ScrollTime =  obj.rollTime;
                    that.templateForm.noScrollTimeLimit =  obj.isNotLimit;
                }
            });
            */
            /* 测试数据
            if( item.id === '111'){
                this.templateForm.fontFamilyValue =  1;
                this.templateForm.fontSizeValue =  '20';
                this.templateForm.fontStyleValue =  'normal';
                this.templateForm.color =  'rgb(64, 158, 255)';
                this.templateForm.fontDirectionValue =  'fromRightToLeft';
                this.templateForm.fontPositionValue =  'center';
                this.templateForm.fontSpeedValue =  'normal';
                this.templateForm.ScrollTime =  '1';
                this.templateForm.noScrollTimeLimit =  true;
            }else if( item.id === '222'){
                this.templateForm.fontFamilyValue =  2;
                this.templateForm.fontSizeValue =  '40';
                this.templateForm.fontStyleValue =  'italic';
                this.templateForm.color =  'rgb(203, 57, 239)';
                this.templateForm.fontDirectionValue =  'fromDownToTop';
                this.templateForm.fontPositionValue =  'top';
                this.templateForm.fontSpeedValue =  'slow';
                this.templateForm.ScrollTime =  '5';
                this.templateForm.noScrollTimeLimit =  false;
            }else if( item.id === '333'){
                this.templateForm.fontFamilyValue =  3;
                this.templateForm.fontSizeValue =  '50';
                this.templateForm.fontStyleValue =  'bold';
                this.templateForm.color =  'rgb(238, 222, 41)';
                this.templateForm.fontDirectionValue =  'fromRightToLeft';
                this.templateForm.fontPositionValue =  'bottom';
                this.templateForm.fontSpeedValue =  'fast';
                this.templateForm.ScrollTime =  '9';
                this.templateForm.noScrollTimeLimit =  false;
            }
            */
            let target = document.getElementById('previewContent');
            // font-style onft-weight font-size/line-height font-family
            if( this.templateForm.fontStyleValue === 'normal' || this.templateForm.fontStyleValue === 'italic' ){
                target.style.fontStyle = this.templateForm.fontStyleValue;
                target.style.fontWeight = 'normal';
            }else if( this.templateForm.fontStyleValue === 'bold' ){
                target.style.fontStyle = 'normal';
                target.style.fontWeight = 'bold';
            }else if( this.templateForm.fontStyleValue === 'boldItalic' ){
                target.style.fontStyle = 'italic';
                target.style.fontWeight = 'bold';
            }
            target.style.fontSize = this.templateForm.fontSizeValue+'px';
            // target.style.fontFamily = this.templateForm.fontFamilyValue;
            this.templateForm.fontFamilyData.forEach((item,index)=>{
                if( this.templateForm.fontFamilyValue === item.value  ){
                    target.style.fontFamily = item.name;
                }
            });
            target.style.color = this.templateForm.color;
        },
        // 改变字体
        handleFontFamilyChange(){
            let target = document.getElementById('previewContent');
            // target.style.fontFamily = this.templateForm.fontFamilyValue;
            // console.log(this.templateForm.fontFamilyValue);
            // console.log(JSON.stringify(this.templateForm.fontFamilyData));
            this.templateForm.fontFamilyData.forEach((item,index)=>{
                if( this.templateForm.fontFamilyValue === item.value  ){
                    target.style.fontFamily = item.name;
                }
            });
        },
        // 改变字号
        handleFontSizeChange(){
            let target = document.getElementById('previewContent');
            target.style.fontSize = this.templateForm.fontSizeValue+'px';
        },
        // 改变字型
        handleFontStyleChange(){
            let target = document.getElementById('previewContent');
            if( this.templateForm.fontStyleValue === 'normal' || this.templateForm.fontStyleValue === 'italic' ){
                target.style.fontStyle = this.templateForm.fontStyleValue;
                target.style.fontWeight = 'normal';
            }else if( this.templateForm.fontStyleValue === 'bold' ){
                target.style.fontStyle = 'normal';
                target.style.fontWeight = 'bold';
            }else if( this.templateForm.fontStyleValue === 'boldItalic' ){
                target.style.fontStyle = 'italic';
                target.style.fontWeight = 'bold';
            }
        },
        // 改变字体颜色
        handleFontColorChange(){
            let target = document.getElementById('previewContent');
            target.style.color = this.templateForm.color;
        },
        // 添加会场通知模版
        addMsgStyleTemplate(){
            let that = this;
            console.log(JSON.stringify(this.templateForm));
            this.$refs.templateForm.validate((valid) => {
                if (valid) {
                    console.log('submit!');
                    let templateName = this.templateForm.name;
                    // let fontFamily = this.templateForm.fontFamilyValue;
                    this.templateForm.fontFamilyData.forEach((item,index)=>{
                        if( this.templateForm.fontFamilyValue === item.value  ){
                            let fontFamily = item.id;
                        }
                    });
                    let fontSize = this.templateForm.fontSizeValue;
                    let fontPattern = this.templateForm.fontStyleValue;
                    let color = this.templateForm.color;
                    let rollStyle = this.templateForm.fontDirectionValue;
                    let rollPos = this.templateForm.fontPositionValue;
                    let rollspeed = this.templateForm.fontSpeedValue;
                    let rollTime = this.templateForm.ScrollTime;
                    let isNotLimit = this.templateForm.noScrollTimeLimit;
                    /* 当前接口不具备，会报错
                    this.apiSDK.addNotificationTemplate(templateName, fontFamily, fontSize, fontPattern, color, rollStyle, rollPos, rollspeed, rollTime, isNotLimit,function(obj){
                        console.log(obj);
                        if( obj && obj.Ret === 0 ){
                            that.$notify({
                                title: '会场通知',
                                message: '添加会场通知模版成功',
                                position: 'bottom-right'
                            });
                            that.getMsgStyleTemplateList();
                        }else{
                            that.$notify({
                                title: '会场通知',
                                message: '添加会场通知模版失败',
                                position: 'bottom-right'
                            });
                        }
                    });
                    */
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 删除会场通知模版
        deleteMsgStyleTemplate(item){
            let that = this;
            let templateId = item.id;
            this.apiSDK.deleteNotificationTemplate(templateId, function(obj){
                console.log(obj);
                if( obj && obj.Ret === 0 ){
                    that.$message({
                        message: '删除会场通知模版成功',
                        type: 'success'
                    });
                    that.getMsgStyleTemplateList();
                }else{
                    that.$message({
                        message: '删除会场通知模版失败',
                        type: 'error'
                    });
                }
            });
        },
        // 修改会场通知模版
        editMsgStyleTemplate(){
            let that = this;
            console.log(JSON.stringify(this.templateForm));
            this.$refs.templateForm.validate((valid) => {
                if (valid) {
                    console.log('submit!');
                    let templateId = this.templateForm.id;
                    let templateName = this.templateForm.name;
                    // let fontFamily = this.templateForm.fontFamilyValue;
                    this.templateForm.fontFamilyData.forEach((item,index)=>{
                        if( this.templateForm.fontFamilyValue === item.value  ){
                            let fontFamily = item.id;
                        }
                    });
                    let fontSize = this.templateForm.fontSizeValue;
                    let fontPattern = this.templateForm.fontStyleValue;
                    let color = this.templateForm.color;
                    let rollStyle = this.templateForm.fontDirectionValue;
                    let rollPos = this.templateForm.fontPositionValue;
                    let rollspeed = this.templateForm.fontSpeedValue;
                    let rollTime = this.templateForm.ScrollTime;
                    let isNotLimit = this.templateForm.noScrollTimeLimit;
                    /* 当前接口不具备，会报错
                    this.apiSDK.updateNotificationTemplate(templateId,templateName, fontFamily, fontSize, fontPattern, color, rollStyle, rollPos, rollspeed, rollTime, isNotLimit, function(obj){
                        console.log(obj);
                        if( obj && obj.Ret === 0 ){
                            that.$notify({
                                title: '会场通知',
                                message: '修改会场通知模版成功',
                                position: 'bottom-right'
                            });
                            that.getMsgStyleTemplateList();
                        }else{
                            that.$notify({
                                title: '会场通知',
                                message: '修改会场通知模版失败',
                                position: 'bottom-right'
                            });
                        }
                    });
                    */
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 发送按钮
        handleConfirmSendMsg(){
            // console.log(JSON.stringify(this.checkedUsers));
            if( this.checkedUsers.length === 0 ){
                this.$message({
                    message: '请选择需要通知的人员',
                    type: 'warning'
                });
                return;
            }
            // console.log('this.msgContentValue='+this.msgContentValue);
            if( !this.msgContentValue ){
                this.$message({
                    message: '请填写通知内容',
                    type: 'warning'
                });
                return;
            }
            console.log(JSON.stringify(this.selectedTemplate));
            if( !this.selectedTemplate.id ){
                this.$message({
                    message: '请选择通知的样式模板',
                    type: 'warning'
                });
                return;
            }
            // console.log('this.fullScreenScrollValue='+this.fullScreenScrollValue);
            /* 当前接口不具备，会报错
            let conferenceId;
            let notificationTemplateId = this.selectedTemplate.id;
            let isCanRoll = this.templateForm.noScrollTimeLimit;
            let message = this.templateForm.msgContentValue;
            this.apiSDK.sendConferenceNotification(conferenceId,notificationTemplateId,isCanRoll, message);
            */
        },
        // 取消按钮
        handleCancelSendMsg(){
            this.closeDialog();
        },
        // 获取已发通知列表
        getSendedMsgTableData(){
            let that = this;
            this.sendedMsgTableData = [
                /* 测试数据
                {
                    msgTime:'2019-09-30 15:32:00',
                    msgSenderName:'管理员001',
                    msgSenderId:'A001',
                    // msgReceiverName:'张三，李四，王五',
                    // msgReceiverId:'001，002，003',
                    msgReceiverData:[
                        {
                            receiverName:'张三',
                            receiverId:'001',
                        },
                        {
                            receiverName:'李四',
                            receiverId:'002',
                        },
                        {
                            receiverName:'王五',
                            receiverId:'003',
                        },
                    ],
                    msgContent:'下午15:00在一号会议室开会',
                },
                {
                    msgTime:'2019-09-30 15:32:00',
                    msgSenderName:'管理员001',
                    msgSenderId:'A001',
                    // msgReceiverName:'张三测试，李四，王五，张三测试，张三测试，张三测试，张三测试，张三测试，张三测试，张三测试，张三测试',
                    // msgReceiverId:'001，002，003',
                    msgReceiverData:[
                        {
                            receiverName:'张三',
                            receiverId:'001',
                        },
                        {
                            receiverName:'李四',
                            receiverId:'002',
                        },
                        {
                            receiverName:'王五',
                            receiverId:'003',
                        },
                        {
                            receiverName:'张三',
                            receiverId:'001',
                        },
                        {
                            receiverName:'李四',
                            receiverId:'002',
                        },
                        {
                            receiverName:'王五',
                            receiverId:'003',
                        },
                        {
                            receiverName:'张三',
                            receiverId:'001',
                        },
                        {
                            receiverName:'李四',
                            receiverId:'002',
                        },
                        {
                            receiverName:'王五',
                            receiverId:'003',
                        },
                    ],
                    msgContent:'下午15:00在一号会议室开会,下午15:00在一号会议室开会,下午15:00在一号会议室开会,下午15:00在一号会议室开会,下午15:00在一号会议室开会',
                },
                */
            ];
            // TODO
            /* 当前接口不具备，会报错
            this.apiSDK.querySendedNotifications(function(obj){
                console.log(obj);
                // resp =[{notificationId:"",notificationTime:"",notifyUserId:"",notifyUserName:"",resources:[{receiverId:"",receiverName:""}..],content:""}...]
                if( obj ){
                    obj.forEach((item)=>{
                        that.sendedMsgTableData.push({
                            msgId:item.notificationId,
                            msgTime:item.notificationTime,
                            msgSenderName:item.notifyUserName,
                            msgSenderId:item.notifyUserId,
                            msgReceiverData:item.resources,
                            msgContent:item.content,
                        });
                    });
                }
            });
            */
        },
        handleSelectionChange(val){
            this.multipleSelection = val;
            // console.log(JSON.stringify(this.multipleSelection));
        },
        // 全部停止按钮
        handleStopAll(){
            let that = this;
            /* 当前接口不具备，会报错
            this.apiSDK.stopAllNotification(function(obj){
                if( obj && obj.Ret === 0 ){
                    that.$notify({
                        title: '会场通知',
                        message: '停止成功',
                        position: 'bottom-right'
                    });
                }else{
                    that.$notify({
                        title: '会场通知',
                        message: '停止失败',
                        position: 'bottom-right'
                    });
                }
            });
            */
        },
        // 停止按钮
        handleStopOne(){
            let that = this;
            if( this.multipleSelection.length === 0 ){
                this.$message({
					message: '请先选择至少一条已发通知',
					type: 'warning'
				});
                return;
            }
            /* 当前接口不具备，会报错
            let notificationIds = [];
            this.multipleSelection.length.forEach((item)=>{
                notificationIds.push(item.msgId);
            });
            this.apiSDK.stopNotificationById(notificationIds, function(obj){
                if( obj && obj.Ret === 0 ){
                    that.$notify({
                        title: '会场通知',
                        message: '停止成功',
                        position: 'bottom-right'
                    });
                }else{
                    that.$notify({
                        title: '会场通知',
                        message: '停止失败',
                        position: 'bottom-right'
                    });
                }
            });
            */
        },
        // 取消按钮
        handleCancel(){
            this.closeDialog();
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

/deep/ .el-tabs--top{
    padding:15px;
}
/deep/ .el-tabs__header{
    margin: 0;
}
/deep/ .el-tabs__item{
    height: 30px;
    line-height: 16px;
    font-size: 16px;
    color:#666;
    padding:0 40px 10px 40px  !important;
}

.sendMsgWrap{
    width:100%;
    height: 640px;
    margin-top:10px;
    /* border:1px solid pink; */
    box-sizing: border-box;
    text-align: left;
}
.sendMsgWrap .msgUersBox{
    display: inline-block;
    float: left;
    width:305px;
    height: 100%;
    border:1px solid #dcdfe6;
    box-sizing: border-box;
}
.sendMsgWrap .msgUersBox  .magUserTitle{
    height: 40px;
    line-height: 40px;
    background: #e9f3fa;
	border-bottom: 1px solid #c2dff3;
    box-sizing: border-box;
    padding:0 20px;
    color: #2e3c42;
}
.sendMsgWrap .msgUersBox  .magUserTitle .el-checkbox{
    float: right;
}
/deep/ .magUserTitle .el-checkbox__label{
    padding-left: 3px;
    color: #2e3c42;
}
.el-checkbox-group{
    height: calc(100% - 40px);
    overflow: auto;
}
/deep/ .el-checkbox-group .el-checkbox{
    display: block;
    padding-left: 20px;
    height: 40px;
    line-height: 40px;
    margin: 0;
}
/deep/ .el-checkbox-group .el-checkbox .el-checkbox__label{
    color: #0f5794;
}
/deep/ .el-checkbox-group .el-checkbox:hover{
    background: #dbf0fe;
}
.el-checkbox-group .user_icon{
    display: inline-block;
    width: 20px;
    height: 20px;
    background:url("../../../static/resource_tree/person_online.png");
    background-repeat:no-repeat;
    background-size:cover;
    vertical-align: middle;
}
.sendMsgWrap .msgStyleBox{
    display: inline-block;
    width:calc(100% - 315px);
    height: 100%;
    margin-left: 10px;
}
.sendMsgWrap .msgStyleBox .styleAndTemplateBox{
    width:100%;
    /* height: 330px; */
    height: calc(100% - 155px);
    /* border:1px solid pink; */
    box-sizing: border-box;
}
.styleAndTemplateBox .styleWrap{
    /* height: calc(100% - 156px); */
    /* border:1px solid pink; */
}
.styleAndTemplateBox .styleWrap .previewBox{
    display: inline-block;
    width: 340px;
	height: 320px;
	background: #dcdcdc;
    float: left;
    position: relative;
    margin-bottom: 10px;
}
.styleWrap .previewBox p{
    width: 100%;
    position: absolute;
    left:50%;
    top:50%;
    transform: translateX(-50%) translateY(-50%);
    margin: 0;
    padding:0 10px;
    box-sizing: border-box;
    text-align: center;
}
.styleAndTemplateBox .styleWrap .templatesBox{
    display: inline-block;
    width: calc(100% - 350px);
	height: 320px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    margin-left: 10px;
    margin-bottom: 10px;
}
.styleWrap .templatesBox .templatesTitle{
    height: 40px;
    line-height: 40px;
    background: #e9f3fa;
	border-bottom: 1px solid #c2dff3;
    box-sizing: border-box;
    padding:0 20px;
    color: #2e3c42;
}
.templatesBox ul{
    padding: 0;
    margin: 0;
    height: calc(100% - 40px);
    overflow: auto;
}
.templatesBox ul li{
    list-style-type: none;
    text-align: left;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
}
.templatesBox ul li.active{
    background: #b1e0ff;
}
/* .templatesBox ul li.active .template_icon{
    visibility: visible;
}
.templatesBox ul li .template_icon{
    display: inline-block;
    width: 20px;
    height: 20px;
    background: pink;
    vertical-align: middle;
    visibility: hidden;
} */
.templatesBox ul li .template_name{
    display: inline-block;
    max-width: 190px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size:14px;
    line-height: 24px;
    vertical-align: middle;
    color: #333;
}
.templatesBox ul li .template_delete_icon{
    display: inline-block;
    width: 20px;
    height: 20px;
    background:url("../../../static/holderControl/delPrepare.png") no-repeat;
    background-size:100% 100%;
    vertical-align: middle;
    float: right;
    margin-top: 10px;
    margin-right: 10px;
    cursor: pointer;
}
.templatesBox ul li .template_delete_icon:hover{
    background:url("../../../static/holderControl/delPrepare_active.png") no-repeat;
    background-size:100% 100%;
}
.styleAndTemplateBox .templateInfoWrap{
    height: 156px;
}
.templateInfoWrap .el-form .formDiv{
    margin: 0;
}
.templateNameInput{
    float: left;
    width:206px;
}
.templateInfoWrap .el-form .templateBtn_icon{
    display: inline-block;
    width: 20px;
    height: 20px;
    background: pink;
    cursor: pointer;
    float: left;
}
.templateInfoWrap .el-form .addTemplate{
    margin-left: 20px;
    margin-right: 10px;
    margin-top: 10px;
    background:url("../../../static/resPanelControl/addTemplate.png") no-repeat;
    background-size:100% 100%;
}
.templateInfoWrap .el-form .addTemplate:hover{
    background:url("../../../static/resPanelControl/addTemplate_hover.png") no-repeat;
    background-size:100% 100%;
}
.templateInfoWrap .el-form .editTemplate{
    margin-top: 10px;
    background:url("../../../static/resPanelControl/editTemplate.png") no-repeat;
    background-size:100% 100%;
}
.templateInfoWrap .el-form .editTemplate:hover{
    background:url("../../../static/resPanelControl/editTemplate_hover.png") no-repeat;
    background-size:100% 100%;
}
.templateInfoWrap .el-form .el-select{
    width:100px;
}
/deep/.templateInfoWrap .el-form .el-form-item{
    margin-bottom: 10px;
}
/deep/.templateInfoWrap .el-form--inline .el-form-item__label{
    padding-right: 5px;
}
/deep/.templateInfoWrap .el-form .el-form-item__content{
    height: 40px;
}
/deep/.templateInfoWrap .el-form .el-input{
    height: 40px;
    box-sizing: border-box;
}
/deep/.templateInfoWrap .el-form .el-input__inner{
    padding-left: 5px;
    height: 100%;
    box-sizing: border-box;
}
/deep/.templateInfoWrap .el-form .el-checkbox__label{
    padding-left: 3px;
}
/deep/.templateInfoWrap .el-form .el-checkbox__input{
    line-height: 40px;
}
/deep/.templateInfoWrap .el-form .el-form-item__error{
    display: none;
}
.templateInfoWrap .el-form .limitInput{
    width: 60px;
}
/deep/.templateInfoWrap .el-form .el-input-number__decrease,
/deep/.templateInfoWrap .el-form .el-input-number__increase{
    width: 30px;
}
/deep/.el-input-number.is-controls-right .el-input__inner{
    padding-right: 35px;
}
.sendMsgWrap .msgStyleBox .msgContentBox{
    width:100%;
    /* height: 138px; */
    border-top:1px solid #dcdfe6;;
    box-sizing: border-box;
    margin-bottom:15px;
}
.sendMsgWrap .msgStyleBox .msgContentBox p{
    color: #2e3c42;
    margin: 0;
    height: 36px;
    line-height: 36px;
}
.sendMsgWrap .msgStyleBox .msgContentBox .el-textarea{
    height: 62px;
    font-size: 14px;
    color: #666;
}
/deep/.msgContentBox .el-textarea__inner{
    height: 100%;
}
.sendMsgWrap .msgStyleBox .sendMsgBtnsWrap{
    width:100%;
    height: 40px;
    /* border:1px solid pink; */
    box-sizing: border-box;
    text-align: center;
    position: relative;
}
.sendMsgWrap .msgStyleBox .sendMsgBtnsWrap .switchBox{
    position: absolute;
    left:40px;
    top:50%;
    transform:translateY(-50%);
}
.sendMsgWrap .msgStyleBox .sendMsgBtnsWrap .centerBtnBox{
    position: absolute;
    left:50%;
    top:50%;
    transform: translateX(-50%) translateY(-50%);
}
.sendedMsgWrap{
    width:100%;
    height: 640px;
    margin-top:10px;
    /* border:1px solid pink; */
    box-sizing: border-box;
    text-align: left;
}
.sendedMsgWrap .name_span{
    margin-right: 5px;
}
/deep/.sendedMsgWrap .el-table thead{
    height: 36px;
    border-color: #c8cdd5;
}
/deep/.sendedMsgWrap .el-table thead th{
    padding:0;
    color: #323232;
    background: #e9f3fa;
    font-family: 'MicrosoftYaHei';
	font-size: 16px;
	font-weight: normal;
}
/deep/.sendedMsgWrap .el-table tbody tr{
    /* padding:0; */
    height: 36px;
    color: #666;
    font-family: 'MicrosoftYaHei';
	font-size: 14px;
	font-weight: normal;
}
/deep/.sendedMsgWrap .el-table tbody tr td{
    padding:0;
}
.sendedMsgWrap .sendedMsgBtnsWrap{
    margin-top: 35px;
    text-align: center;
}
</style>