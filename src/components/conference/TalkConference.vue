<template>
<div>
    <el-tag type="warning" style="margin-bottom: 10px;">讨论会议中：所有参会人员可以自由发言。</el-tag>
    <el-form :model="form" :rules="rules" ref="form" label-width="85px">
        <el-row :gutter="15">
            <el-col :span="12">
                <el-form-item label="会议名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="会议密码">
                    <el-checkbox v-model="form.needPassword"></el-checkbox>
                    <el-input v-model="form.password" maxlength="6" style="width: 207px;margin-left:10px;" :disabled="!form.needPassword"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="会议模式">
                    <el-radio v-model="form.mediaType" label="VideoAndAudio">视频会议</el-radio>
                    <el-radio v-model="form.mediaType" label="Audio">音频会议</el-radio>
                </el-form-item>
                <el-form-item >
                    <el-radio v-model="form.startType" label="immediately">立即开会</el-radio>
                    <el-radio v-model="form.startType" label="arrange">预约开会</el-radio>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="15" v-if="form.startType === 'arrange'">
            <el-col :span="12">
                <el-form-item label="预约时间" prop="desc" >
                    <el-date-picker
                        v-model="form.arrangeTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        style="width: 235px;"
                        type="datetime"
                        :picker-options="{disabledDate:val=>val.getTime() < (new Date().getTime() - 3600 * 1000 * 24 * 1)}"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="会议时长" prop="desc" >
                    <el-input-number v-model="form.arrangeLength" :min="1" :max="form.arrangeUnit === 'minute' ? 180 : 3" size="small" style="width:120px;"></el-input-number>
                    <el-select v-model="form.arrangeUnit" placeholder="请选择" style="width:80px;" size="small" @change="changeArrangeUnit">
                        <el-option label="分钟" value="minute"></el-option>
                        <el-option label="小时" value="hour"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <div style="padding: 0 0 10px 85px;">
            <el-checkbox v-model="form.microphoneAbility">&nbsp;闭麦入会</el-checkbox>
        </div>
        <el-form-item label="描述简介" prop="desc">
            <el-input type="textarea" v-model="form.description" maxlength="100" resize="none"></el-input>
            <span id="descErrorMsg" style="color: #999">字数不超过100字</span>
        </el-form-item>
    </el-form>
</div>
</template>
<script>
export default {
    name: 'TalkConference',
    data() {
        let validateName = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入会议名称'));
            } else if (!/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(value)) {
              callback(new Error('会议名称为包含中文、英文字母(大小写)、数字、下划线的组合!'));
            } else {
              callback();
            }
        }
        let validateDesc = (rule, value, callback) => {
            if (value && value.length > 100) {
                document.getElementById('descErrorMsg').style = 'color:#F56C6C'
                callback(new Error(' '));
            } else {
                document.getElementById('descErrorMsg').style = ''
                callback();
            }
        }
        return {
            form: {
                sceneID: '',
                name: '会议'+ new Date().formatDate('yyyyMMdd'),
                needPassword: false,
                password: '',
                arrangeTime: '',
                description: '会议'+ new Date().formatDate('yyyyMMdd'),
                mediaType: 'VideoAndAudio',
                startType: 'immediately', // 是否预设会议
                microphoneAbility: false,
                arrangeLength: 30,
                arrangeUnit: 'minute'
            },
            rules: {
                name: [
                    { required: true, message: '请输入会议名称', trigger: 'blur' },
                    { min: 4, max: 18, message: '长度在 4 到 18 个字符', trigger: 'blur' },
                    { validator: validateName, trigger: 'blur'  }
                ],
                desc: [{ validator: validateDesc, trigger: 'blur'  }]
            },
        }
    },
    methods: {
        // 开启会议
        startConference(){
            return new Promise((reslove, reject) => {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        let arrangeLength = this.arrangeUnit === 'hour' ? this.form.arrangeLength * 60 : this.form.arrangeLength;
                        this.apiSDK.publishDiscussConference(this.form.sceneID, this.form.name, this.form.description, true, '', this.form.needPassword, this.form.password, this.form.mediaType, this.form.startType, this.form.arrangeTime, this.form.microphoneAbility, [], arrangeLength);
                        reslove();
                    }
                })
            });
        },
        show() {
            this.form = {
                name: '会议'+ new Date().formatDate('yyyyMMdd'),
                needPassword: false,
                password: '',
                arrangeTime: '',
                description: '会议'+ new Date().formatDate('yyyyMMdd'),
                mediaType: 'VideoAndAudio',
                startType: 'immediately', // 是否预设会议
                microphoneAbility: false,
                arrangeLength: 30,
                arrangeUnit: 'minute'
            };
        },
        changeArrangeUnit(value) {
            if (value === 'minute') {
                this.form.arrangeLength = 30;
            } else if(value === 'hour') {
                this.form.arrangeLength = 1;
            }
        }
    }
}    
</script>