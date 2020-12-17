<template>
    <el-dialog :visible.sync="visible"  title="会议点名" width="700px" center class="custom-dialog">
        <el-tabs v-model="tabsActive" class="no-border">
            <el-tab-pane label="已入会" name="first">
                <div class="personList">
                    <div class="item" v-for="item in data.inGroup" :key="item.key">
                        <span class="node-icon" :class="item.nodeStatus"></span>
                        <span>{{item.name}}</span>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="未入会" name="second">
                <div class="personList">
                    <div class="item" v-for="item in data.outGroup" :key="item.key">
                        <span class="node-icon" :class="item.nodeStatus"></span>
                        <span>{{item.name}}</span>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>
<script>
 export default {
    name: 'ConferencePersonDialog',
    data() {
        return {
            visible: false,
            data: {
                inGroup: [{status: 'person_online', name: 'test'},{status: 'person_offline', name: 'test'}],
                outGroup: [{status: 'online', name: 'test'}]
            },
            tabsActive: 'first'
        }
    },
    methods: {
        showDialog(data) {
            this.visible = true;
            this.data = [];
            this.data = data;
        }
    }
 }   
</script>
<style scoped>
.personList{
    border: 1px solid #ddd;
    max-height: 400px;
    overflow: auto;
    padding: 5px 0;
}
.personList .item{
    border: 1px solid #ddd;
    padding: 5px;
    margin:  10px 15px;
    width: 100px;
    display: inline-block;
    font-size: 16px;
}
.personList .node-icon {
    margin-right: 2px;
    vertical-align: bottom;
    background-repeat: no-repeat;
    background-size: cover;
    width: 20px;
    height: 20px;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
}
.personList .person_online{
    background: url("../../../static/resource_tree/person_online.png");
}
.personList .person_offline{
    background: url("../../../static/resource_tree/person_offline.png");
}
</style>