<template>
    <el-card class="treeRightMenu" :style="menuLoc" :class="{menuShow:isMenuShow}" :body-style="{padding:'0px'}">
        <div class="menuItemClass" v-for="(item,index) in moreBtns" :key="index" @click="hanldClickEvent(item,index)" v-show="item.isShow">{{item.title}}</div> 
    </el-card>     
</template>

<script>
import Fun from '@/common/fun';
import Enum from '@/common/enum';

export default {
    name: 'treeRighBtn',
    components: {
    },
    data () {
        return {
            currentUser: null,//当前用户
            currentNode: null,//当前选中的node
            conferenceId:'',//会议ID
            menuLoc: '',//样式
            isMenuShow: false,
            isChairman:false,//是为主席
            isCharimanPop:false,//是主持会商（true）还是成员列表（false）
            ckSpeak:'', //选中发言的人
            moreBtns:[]
        };
    },
    mounted(){
      this.currentUser = xtxk.cache.get('USER') || {};
      this.activetabName=xtxk.cache.get('activeName');
      //点击其他地方隐藏更多菜单
      document.addEventListener('click', e => {
        if(e.target.className == 'el-card__body'||e.target.className.indexOf("node-btn-more")>-1||e.target.className == 'btn-more'){
          this.isMenuShow = true;
        }else{
          this.isMenuShow = false;
        }
      });
    },
    methods: {
      showRightMenu(data,isCharimanPop,isChairman,conferenceId){
        this.currentNode=data;
        this.isMenuShow = true;
        this.isChairman=isChairman;
        this.isCharimanPop=isCharimanPop;
        this.conferenceId=conferenceId;
        this.moreBtns=[ 
          {title:'改名',isShow:true,event:'changeEdit'},
          {title:data.nodeStatus=="person_online"?'指定发言':'收回发言',isShow:isCharimanPop&&!isChairman,event:data.nodeStatus=="person_online"?'appointSpeaking':'cancelSpeakingByChairman'},
          {title:'设为主会场',isShow:isCharimanPop,event:'appointMainMeeting'},
          {title:'设为主持人',isShow:isCharimanPop&&!isChairman,event:'appointChairman'},
          {title:'移出会议',isShow:isCharimanPop&&!isChairman,event:'removeMember'},
        ]
        this.$nextTick(()=>{
            //更多功能按钮显示位置
            const right_ =-110;
            const top_ = event.clientY;
            let clientWidth = document.body.clientWidth;
            let w=clientWidth-right_;
            var thisW=110;
           
            let parentTop= parseFloat(this.$parent.top)/100*document.body.clientHeight;
            var h=top_-parentTop-42;
            var thisH=this.$children[0].$el.clientHeight;
          
             if(w>thisW){
                  this.menuLoc = 'right: '+ right_ +'px; top: '+h+'px';
            }else{
                  this.menuLoc = 'right: '+(clientWidth-thisW-20) +'px; top: '+h+'px';
               
            }
           
        })
         
      },
      closeRightMenu(){
        if(this.isMenuShow){
          this.isMenuShow = false;
        }
      },
      hanldClickEvent(item,index){
        this[item.event](item,index);
      },
      //改名
      changeEdit(){
         console.log('改名')
      },
      // 主席-指定发言
      appointSpeaking(item,index) {
        let memberIds = []
        memberIds.push({ userId: this.currentNode.id });
        if(memberIds.length > 0) this.apiSDK.appointSpeaking(this.conferenceId, memberIds)
         item.title="收回发言";
          item.event="cancelSpeakingByChairman"
      
      },
       // 主席-收回发言
      cancelSpeakingByChairman(item,index) {
          this.apiSDK.cancelSpeakingByChairman(this.conferenceId);
          item.title="指定发言";
          item.event="appointSpeaking"
      }, 
       // 主席-设为主会场
      appointMainMeeting(){
        console.log('设为主会场')
      },
       // 主席-设为主持人
      appointChairman() {
        console.log('设为主持人')
        let memberIds = []
          memberIds.push({ userId: this.currentNode.id });
        if(memberIds.length > 0) this.apiSDK.appointChairman(this.conferenceId, memberIds);
      },

      // 主席-强退成员
      removeMember() {
          let self = this;
          this.$confirm('确定强退选定成员吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              let memberIds = [];
              memberIds.push({ userId: self.currentNode.id });
              self.apiSDK.removeMember(self.conferenceId, memberIds);
           }).catch(()=>{});
      },
      
    },
}
</script>

<style scoped>
   .treeRightMenu {
    position: absolute;
    display: none;
    margin-left: -60px;
    margin-top: 10px;
    background: url(../../../static/main/screen/resouce_rightPop_bg.png) center top;
    background-size: 100% 100%;
    border:none;
    color:#D3DCF0;
    border-radius: 0;
    min-width: 110px;
    z-index: 20000;
  }
.custom-dialog .treeRightMenu /deep/ .el-card__body{
  height: auto;
  min-height:36px;
} 
  .menuShow {
    display: block;
  }

  .menuItemClass {
    font-size: 12px;
    padding: 10px 24px;
    cursor: pointer;
    min-width: 50px;
  }
  .menuItemClass:hover {
    background: #5C98FF;
    color:#fff;
  }
.play-file{
    max-height: 300px;
    margin: 0 10px;
    overflow: auto;
    border: solid 1px #c8cdd5;
}
.play-file .item{
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    cursor: pointer;
}
.play-file .item .icon{
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: -5px;
}
.play-file .item .icon.filelist{
    /* background: url(../../../../static/resource_tree/filelist_online.png) no-repeat center top; */
}
.play-file .item .icon.filevideo{
    /* background: url(../../../../static/resource_tree/filevideo_online.png) no-repeat center top; */
}
.play-file .item:hover{
    background-color: #e7f1f8;
}
.play-file .item.active{
    background-color: #b1e0ff;
} 
</style>
