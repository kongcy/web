<template>
    <el-dialog :visible.sync="visible"  title="切换会商" width="1100px" center class="custom-dialog">
        <div class="main-changeMeeting">
            <div class="changeMeeting-content">
                <div class="meeting-list">
                    <div class="meeting-item" v-for="(item,index) in meetingList" :key="item.id" 
                    :class="{inMeeting:item.id == meetingID,'check-meeting':item.id == ckMeetingID} "  @click="checkMeeting(item,index)">
                        <div class="img-box">
                            <img :src="item.imgUrl" alt="">
                        </div>
                        <div class="item-txt">
                            <p>会商主题:{{item.title}}</p>
                            <p>主持人:{{item.toastmaster}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn-box">
                <el-button type="primary" @click="changeMeetingFn()">切换</el-button>
                <el-button @click="closeDialog">取消</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'changeMeetingDialog',
    data() {
        return {
            visible: false,
            meetingID:1,
            inMeeting:'inMeeting',
            meetingList:[{
                id:1,
                title:'关于XXX的会议',
                toastmaster:'张三',
                imgUrl:'../../../static/face/front.png',
                isCK:false
            },{
                id:2,
                title:'关于XXX的会议',
                toastmaster:'李四',
                imgUrl:'../../../static/face/front.png',
                isCK:false
            },{
                id:3,
                title:'关于XXX的会议',
                toastmaster:'王五',
                imgUrl:'../../../static/face/front.png',
                isCK:false
            },{
                id:4,
                title:'关于XXX的会议',
                toastmaster:'马六',
                imgUrl:'../../../static/face/front.png',
                isCK:false
            },{
                id:5,
                title:'关于XXX的会议',
                toastmaster:'琪琪',
                imgUrl:'../../../static/face/front.png',
                isCK:false
            }],
            ckMeetingID:''
        }
    },
    methods: {
        showDialog(data) {
            this.visible = true;
        },
        checkMeeting(item){
            this.ckMeetingID = item.id;
        },
        closeDialog(){
            this.ckMeetingID = '';
            this.visible = false;
        },
        changeMeetingFn(){
            console.log('点击切换按钮===>',this.ckMeetingID)
        }
    }
}
</script>

<style scoped>
.main-changeMeeting{
    height: 600px;
    padding-left:15px;
}
.changeMeeting-content{
    height: 550px;
    overflow: auto;
}
.btn-box{
    height: 50px;
    line-height: 50px;
    text-align: center;
}
.btn-box button{
    width: 110px;
}
.meeting-list{
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
}
.meeting-item{
    width: 220px;
    height: 185px;
    margin: 15px 18px;
    box-sizing: border-box;
    border: 2px solid transparent;
}
.meeting-item .img-box{
    height: 135px;
    width: 216px;
}
.meeting-item .img-box img{
    width:100% ;
    height: 100%;
}

.meeting-item .item-txt{
    height: 46px;
    line-height: 20px;
    background-color: #303133;
    color: #fff;
    padding: 5px 0;
    box-sizing: border-box;
}
.inMeeting{
    border: 2px solid #409EFF;
    position: relative;
}
.inMeeting::after{
    content: '进行中';
    position: absolute;
    left: 0;
    top: 0;
    color: #fff;
    display: inline-block;
    width: 55px;
    height: 26px;
    background-color: #409EFF;
    border-radius: 3px;
    line-height: 26px;
    text-align: center;
}
.check-meeting{
    border: 2px solid goldenrod;
}

</style>>
