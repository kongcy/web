<template>
    <el-dialog :visible.sync="visible"  title="开启会议" width="700px" center class="custom-dialog" :close-on-click-modal="false">
        <el-tabs v-model="tabsActive" class="no-border">
            <el-tab-pane label="发言会议" name="speakConference">
                <speak-conference ref="speakConference"></speak-conference>
            </el-tab-pane>
            <el-tab-pane label="讨论会议" name="talkConference">
                <talk-conference ref="talkConference"></talk-conference>
            </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer" style="display: block;text-align: right;">
            <el-button type="primary" @click="startConference">开启</el-button>
            <el-button @click="closeDialog">关闭</el-button>
        </span>
    </el-dialog>
</template>
<script>
import SpeakConference from "@/components/conference/SpeakConference.vue";
import TalkConference from '@/components/conference/TalkConference.vue';
export default {
    name: 'ConferenceSceneDialog',
    components: {
        SpeakConference,
        TalkConference
    },
    data() {
        return {
            tabsActive: 'speakConference',
            visible: false,
        }
    },
    methods: {
        showDialog(data) {
            this.visible = true;
            this.$nextTick(() => {
              xtxk.media.setDialogTop('开启会议');
              this.$refs.speakConference.init(data, 'temp');
            });
        },
        closeDialog() {
            this.visible = false;
            this.tabsActive = 'speakConference';
            this.$refs.speakConference.show();
            this.$refs.talkConference.show();
        },
        startConference() {
            // console.log(this.tabsActive);
            this.$refs[this.tabsActive].startConference().then(() => {
                this.closeDialog();
            });
        },
    }
}
</script>
