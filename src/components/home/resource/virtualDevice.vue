<template>
    <div class="virtual-wrapper">
        <div class="virtual-list" @click="setDefault(item)" :class="defaultId == item.resId ? 'active' : ''" v-for="(item, index) in virtualList" :key="index">
            <span class="content">{{ item.resName }}</span>
        </div>
        <span @click="closeVirtual" class="el-icon-close"></span>
    </div>
</template>
<script>
export default {
    name: 'virtualDevice',
    props: {
        virtualId: {
            type: String
        }
    },
    data() {
        return {
            id: this.virtualId,
            virtualList: [],
            defaultId: ''
        }
    },
    mounted() {
        this.getVirtualList()
        this.getDefault()
    },
    methods: {
        getVirtualList() {
            this.apiSDK.getResourcesByVirtualId(this.id, res => {
                this.virtualList = res
            })
        },
        getDefault() {
            this.apiSDK.getDefaultDeviceForVirtual(this.id, res => {
                if (res.Ret == '0') {
                    this.defaultId = res.resId
                }
            })
        },
        setDefault(data) {
            this.apiSDK.setDefaultDeviceForVirtual(data.virtualId, data.resourceId, data.resourceCh, res => {
                if (res.Ret == '0') {
                    this.defaultId = data.virtualId
                }
            })
        },
        closeVirtual() {
            this.$emit('closeVirtaul', '')
        }
    }
}
</script>
<style scoped>
.virtual-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #e9f3fa;
    width: 100%;
    font-size: 0;
}
.virtual-list {
    position: relative;
    display: inline-block;
    width: 75px;
    height: 72px;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 18px;
    font-size: 12px;
    color: #666;
    background-image: url(../../../../static/resource_tree/virtual_video.png);
    background-position: 50% 0;
    background-size: 40px auto;
    background-repeat: no-repeat;
    cursor: pointer;
}
.active {
    background-image: url(../../../../static/resource_tree/virtual_video_hover.png);
}
.content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
}
.virtual-wrapper .el-icon-close {
    position: absolute;
    font-size: 16px;
    color: #666;
    right: 5px;
    top: 5px;
    cursor: pointer;
}
</style>