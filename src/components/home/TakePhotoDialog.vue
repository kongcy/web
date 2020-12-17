<template>
    <el-dialog
            :visible.sync="isVisible"
            title="抓拍预览"
            width="562px"
            class="custom-dialog"
            :before-close="handleClose">
        <div class="take-photo-dialog">
            <div class="take-photo-wrapper" :class="spliceNum">
                <div v-for="(item, index) in imgData" :key="index">
                    <img :src="item.url" />
                    <!-- <img src="D:/XtImg/YPSQ0728000003190202054162937.bmp"/> -->
                    <!-- <el-image :src="require('file:///D:/XtImg/YPSQ0728000003190202054162937.bmp')"/> -->
                    <span>{{ item.setIndex }}</span>
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import { setTimeout } from 'timers';
export default {
    name: 'takePhoto',
    props: {
        imgList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            imgData: this.imgList,
            isVisible: false,
            countNum: 3,
            interValBtn: {},
        }
    },
    computed: {
        spliceNum() {
            return 'split-' + this.imgData.length;
        }
    },
    methods: {
        showDialog(imgData) {
            console.log('图片地址', JSON.stringify(imgData) );
            this.isVisible = true;
            this.imgData = imgData;
            this.interValBtn = setInterval(() => {
                if (this.countNum <= 0) {
                    clearInterval(this.interValBtn);
                    this.isVisible = false;
                    this.countNum = 3;
                }
                this.countNum --;
            }, 1000);
        },
        handleClose() {
            this.isVisible = false;
            this.countNum = 3;
            clearInterval(this.interValBtn);
        },
    }
}
</script>
<style scoped>
.take-photo-dialog {
    width: 100%;
    padding: 22px 24px 0;
    box-sizing: border-box;
    height: 388px;
}
.take-photo-wrapper {
    width: 100%;
    height: 340px;
}
.take-photo-wrapper > div {
    position: relative;
    display: inline-block;
    font-size: 0;
}
.take-photo-wrapper > div > span {
    position: absolute;
    left: 10px;
    top: 10px;
    font-size: 12px;
    color: #fff;
}
.take-photo-wrapper > div > img {
    width: 100%;
    height: 100%;
}
.split-1 div {
    width: 100%;
    height: 100%;
}
.split-2 div {
    width: 50%;
    height: 100%;
}
.split-3 div, .split-4 div {
    width: 50%;
    height: 50%;
}
.split-5 div, .split-6 div {
    width: 33.3%;
    height: 50%;
}
.split-7 div, .split-8 div, .split-9 div {
    width: 33.3%;
    height: 33.3%;
}
/* .take-photo-foot {
    margin-top: 20px;
    border-top: 1px solid #ecedef;
}
.photo-foot-line {
    margin-top: 10px;
    font-size: 12px;
    color: #666;
    line-height: 12px;
} */
</style>