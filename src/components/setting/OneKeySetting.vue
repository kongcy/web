<template>
    <el-dialog 
        :visible.sync="isVisible" 
        class="custom-dialog"
        title="上屏配置" 
        append-to-body
        width="560px">
        <div class="call-setting">
            <div class="call-setting-modul">
                <div class="call-modul-title">大屏模式</div>
                <div class="call-modul-split" :class="splitClass">
                    <div v-for="item in splitArr" :class="item.isActive ? 'active' : ''" :key="item.pos" @click="checkScreen(item)">
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
                            <el-input class="module-list-input" readonly v-model="result" />
                        </div>
                        <div class="module-list">
                            <label>上屏按钮预览</label>
                            <el-select class="select-image" :class="showClassOne" v-model="posIndex1" @change="changeBtn" v-if="this.checkArr.length > 0">
                                <el-option value="leftBtn" label=""><span class="common-screen show-left"></span></el-option>
                                <el-option value="rightBtn" label=""><span class="common-screen show-right"></span></el-option>
                            </el-select>
                            <el-select class="select-image" :class="showClassTwo" disabled v-model="posIndex2" v-if="this.checkArr.length > 1">
                                <el-option value="leftBtn" label=""><span class="common-screen show-left"></span></el-option>
                                <el-option value="rightBtn" label=""><span class="common-screen show-right"></span></el-option>
                            </el-select>
                        </div>
                        <div class="module-list">
                            <label>大屏音量</label>
                            <el-input-number class="module-list-input" v-model="voiceNum" controls-position="right" :min="0" :max="100"></el-input-number>
                        </div>
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
    name: 'oneKeySetting',
    data() {
        return {
            isVisible: false,
            splitNum: 9,
            splitClass: '',
            splitArr: [],
            voiceNum: 0,
            result: '',
            activeNum: 1,
            checkArr: [],
            posIndex2: '',
            posIndex1: '',
            showClassOne: 'check-left-btn',
            showClassTwo: 'check-right-btn'
        }
    },
    methods: {
        changeBtn() {
            if (this.posIndex1 === 'leftBtn') {
                this.showClassOne = 'check-left-btn'
                if (this.checkArr.length == 2) {
                    this.posIndex2 = 'rightBtn'
                    this.showClassTwo = 'check-right-btn'
                } else {
                    this.posIndex2 = ''
                    this.showClassTwo = ''
                }
             } else {
                this.showClassOne = 'check-right-btn'
                if (this.checkArr.length == 2) {
                    this.posIndex2 = 'leftBtn'
                    this.showClassTwo = 'check-left-btn'
                }else {
                    this.posIndex2 = ''
                    this.showClassTwo = ''
                }
            }
        },
        checkScreen(item) {
            if (this.checkArr.length < 2) {
                this.checkArr.push(item)
            } else {
                this.checkArr = this.checkArr.splice(1, 1)
                this.checkArr.push(item)
            }
            this.checkArr.splice(0, 0)
            let checkResult = '';
            this.checkArr.forEach(it => {
                checkResult += it.code + ','
            })
            this.result = checkResult.substring(0, checkResult.length - 1);
            for (let i=0; i<this.splitArr.length; i++) {
                for (let j=0; j<this.checkArr.length; j++) {
                    if (this.splitArr[i].pos == this.checkArr[j].pos) {
                        this.splitArr[i].isActive = true;
                        break;
                    } else {
                        this.splitArr[i].isActive = false;
                    }
                }
            }
            this.splitArr.splice(0, 0)
        },
        showDialog() {
            this.isVisible = true;
            this.splitArr = this.$parent.$parent.$data.oneKeyData;
            this.splitArr.forEach(item => {
                item.isActive = false
            })
            this.splitArr.splice(0, 0)
            this.splitNum = this.splitArr.length
            this.splitClass = 'split-' + this.splitNum
        },
        handleConfirm() {
            let arr = [this.posIndex1]
            if (this.checkArr.length == 2) {
               arr.push(this.posIndex2) 
            }
            this.$emit('confirmKey', {result: this.result, imgBtn: arr})
            this.resetData()
            this.isVisible = false
        },
        closeDialog() {
            this.resetData()
            this.posIndex2 = ''
            this.posIndex1 = ''
            this.isVisible = false
        },
        resetData() {
            this.checkArr.length = 0;
            this.result = '';
            this.splitArr.forEach(item => {
                item.isActive = false
            })
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
    padding: 0 15px 10px;
    font-size: 0;
}
.module-content-left {
    width: 100%;
    height: 100%;
    display: inline-block;
    vertical-align: top;
    box-sizing: border-box;
    font-size: 16px;
}
.module-list {
    height: 40px;
    margin-top: 10px;
}
.module-list > label {
    display: inline-block;
    width: 100px;
    height: 100%;
    text-align: right;
    line-height: 40px; 
}
.module-list-input {
    display: inline-block;
    width: 148px;
    height: 40px;
}
.call-modul-split .active {
    background-color: #128bf1;
    color: #fff;
}
.select-image {
    width: 72px;
    font-size: 0;
}
.common-screen {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 34px;
  padding: 0 4px;
  background-position: -6px 50%;
  background-size: 32px auto;
}
.show-left {
    background-image: url(../../../static/common/left_btn.png);
    background-size: 28px auto;
    background-repeat: no-repeat;
    background-position: 50% 50%;
}
.show-right {
    background-image: url(../../../static/common/right_btn.png);
    background-size: 28px auto;
    background-repeat: no-repeat;
    background-position: 50% 50%;
}
/deep/.select-image .el-input .el-input__inner {
  background-position: 10px 50%;
  background-size: 25px auto;
  padding-left: 30px;
  background-repeat: no-repeat;
  font-size: 0;
}
/deep/.check-left-btn .el-input .el-input__inner {
  background-image: url(../../../static/common/left_btn.png);
}
/deep/.check-right-btn .el-input .el-input__inner {
  background-image: url(../../../static/common/right_btn.png);
}
</style>