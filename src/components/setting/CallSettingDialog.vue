<template>
    <el-dialog 
        :visible.sync="isVisible" 
        class="custom-dialog"
        title="呼叫上屏" 
        append-to-body
        width="560px">
        <div class="call-setting">
            <div class="call-setting-modul">
                <div class="call-modul-title">大屏模式</div>
                <div class="call-modul-split" :class="splitClass">
                    <div v-for="item in splitArr" :class="activeNum == item ? 'active' : ''" :key="item.pos" @click="checkModul(item)">
                        <span>{{ item.code }}</span>
                    </div>
                </div>
            </div>
            <div class="call-setting-modul">
                <div class="call-modul-title">大屏模式</div>
                <div class="call-modul-content">
                    <div class="module-content-left">
                        <div class="module-list">
                            <label>模式屏位置</label>
                            <el-input readonly class="module-list-input" v-model="result" />
                        </div>
                        <div class="module-list">
                            <label>大屏音量</label>
                            <el-input-number class="module-list-input" v-model="voiceNum" controls-position="right" :min="0" :max="100"></el-input-number>
                        </div>
                    </div>
                    <div class="module-content-right">
                        <div v-for="(item, index) in screenSplitArr" :class="item.isActive ? 'active' : ''" @click="checkScreen(item)"  :key="index">{{ item.id }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleConfirm">保存</el-button>
            <el-button @click="closeDialog">关闭</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
    name: 'callSetting',
    data() {
        return {
            isVisible: false,
            splitNum: 9,
            splitClass: '',
            splitArr: [],
            screenSplitNum: 9,
            screenSplitArr: [],
            voiceNum: 0,
            result: '',
            activeNum: 1,
            checkArr: [],
            code: ''
        }
    },
    created() {
        for (let i=0; i<this.screenSplitNum; i++) {
            this.screenSplitArr.push({id: i + '', isActive: false})
        }
    },
    methods: {
        checkScreen(item) {
            if (!this.code) {
                this.$message({
                    message: '请选择大屏模式',
                    type: 'info'
                });
                return;
            }
            if (this.checkArr.length < 2) {
                this.checkArr.push(item)
            } else {
                this.checkArr = this.checkArr.splice(1, 1)
                this.checkArr.push(item)
            }
            this.checkArr.splice(0, 0)
            let checkResult = '';
            this.checkArr.forEach(it => {
                checkResult += this.code + '|' + it.id + ','
            })
            this.result = checkResult.substring(0, checkResult.length - 1);
            for (let i=0; i<this.screenSplitArr.length; i++) {
                for (let j=0; j<this.checkArr.length; j++) {
                    if (this.screenSplitArr[i].id == this.checkArr[j].id) {
                        this.screenSplitArr[i].isActive = true;
                        break;
                    } else {
                        this.screenSplitArr[i].isActive = false;
                    }
                }
            }
            this.screenSplitArr.splice(0, 0)

        },
        checkModul(data) {
            this.code = data.code
            this.resetData();
            this.activeNum = data;
        },
        showDialog() {
            this.isVisible = true;
            this.splitArr = this.$parent.$parent.$data.callData;
            this.splitNum = this.splitArr.length
            this.splitClass = 'split-' + this.splitNum;
            this.$nextTick(() => {
                xtxk.media.setDialogTop('呼叫上屏');
            });
        },
        handleConfirm() {
            this.$emit('confirm', {result: this.result})
            this.isVisible = false
        },
        closeDialog() {
             this.isVisible = false
             this.resetData()
             this.code = ''
             this.activeNum = ''
        },
        resetData() {
            this.checkArr.length = 0;
            this.result = '';
            this.screenSplitArr.forEach(item => {
                item.isActive = false
            })
            this.screenSplitArr.splice(0, 0)
        }
    }
}
</script>
<style scoped>
.call-setting {
    position: relative;
    padding: 0 15px 10px 15px;
    box-sizing: border-box;
}
.call-setting-modul {
    margin-top: 10px;
    border: 1px solid #c8cdd5;
    box-sizing: border-box;
}
.call-modul-title {
    height: 36px;
    line-height: 36px;
    background-color: #e9f3fa;
    box-sizing: border-box;
    padding-left: 20px;
    font-size: 16px;
}
.call-modul-split {
    position: relative;
    padding: 10px 15px;
    box-sizing: border-box;
    font-size: 0;
    width: 100%;
    height: 210px;
}
.call-modul-split > div {
    display: inline-block;
    font-size: 14px;
    box-sizing: border-box;
    border: 1px solid #fff;
    background-color: #dcdcdc;
    cursor: pointer;
}
.call-modul-split > div > span {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
.split-1 > div {
    width: 100%;
    height: 100%;
}
.split-2 > div {
    width: 50%;
    height: 100%;
}
.split-3 > div,
.split-4 > div {
    width: 50%;
    height: 50%;
}
.split-5 > div, 
.split-6 > div {
    width: 33.3%;
    height: 50%;
}
.split-7 > div, 
.split-8 > div,
.split-9 > div {
    width: 33.3%;
    height: 33.3%;
}
.call-modul-content {
    height: 160px;
    box-sizing: border-box;
    padding: 10px 15px;
    font-size: 0;
}
.module-content-left, .module-content-right {
    width: 50%;
    height: 100%;
    display: inline-block;
    vertical-align: top;
    box-sizing: border-box;
}
.module-content-left {
    padding-top: 6px;
    font-size: 16px;
}
.module-list {
    margin-top: 10px;
    height: 40px;
}
.module-list > label {
    display: inline-block;
    width: 80px;
    height: 100%;
    text-align: right;
    line-height: 40px; 
}
.module-list-input {
    display: inline-block;
    width: 158px;
    height: 40px;
}
.module-content-right {
    padding-left: 20px;
    height: 138px;
}
.module-content-right > div {
    display: inline-block;
    font-size: 14px;
    box-sizing: border-box;
    border: 1px solid #fff;
    background-color: #dcdcdc;
    width: 33.3%;
    height: 33.3%;
    line-height: 46px;
    text-align: center;
    cursor: pointer;
}
.call-modul-split .active {
    background-color: #128bf1;
    color: #fff;
}
.module-content-right .active {
    background-color: #128bf1;
    color: #fff;
}
</style>