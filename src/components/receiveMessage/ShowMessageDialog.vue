<template>
	<el-dialog
		:ref="message.sessionId"
      	:title="message.title"
      	:visible.sync="visible"
      	:show-close="true"
      	:center="true"
      	:close-on-press-escape="false"
      	:close-on-click-modal="false"
      	class="custom-dialog" 
      	width="420px">
      	<span>{{message.content}}</span>
      	<span slot="footer" class="dialog-footer">
        	<el-button size="small" @click="cancel">{{message.cancelText}}</el-button>
        	<el-button size="small" type="primary" @click="success">{{message.submitText}}</el-button>
      	</span>
    </el-dialog>
</template>
<script>
export default {
	data() {
		return {
			visible: false,
			message: {
				id: '',
				title: '',
				content: '',
				submitText: '',
				cancelText: '',
				success: null,
				cancel: null
			}
		}
	},
	methods: {
		showDialog(data) {
			this.visible = true;
			this.message = Object.assign({}, data);
		},
		closeDialog() {
			this.visible = false;
		},
        cancel() {
            this.visible = false;
            this.message.cancel();
        },
        success() {
            this.visible = false;
            this.message.success();
        }
	}
}	
</script>