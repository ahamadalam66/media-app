<template>
	<div 
    ref="dropzone"
  	:class="['fill-height', { 'dropzone-active': dropzone }]"
	>

		<upload-grid-view 
      :medias="upload.files" 
      :onRemoveFile="removeFile" 
      :progress="upload.progress"
      :errors="upload.errors" 
    />

    <div 
    	class="d-flex justify-center align-center fill-height flex-column dropzone"
    	v-if="upload.files.length === 0"
    >
    	<v-icon :size="56" color="primary">mdi-file</v-icon>
    	<div class="text-h6">Drop files here</div>
    </div>

  </div>
</template>

<script>
import UploadGridView from '@/components/dialogs/upload/UploadGridView.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapState: uploadMapState, mapActions: uploadMapActions } = createNamespacedHelpers('upload')
export default {
	name: 'DialogContent',

	components: {
		UploadGridView
	},

	data() {
		return {
			dropzone: false
		}
	},

	computed: {
		...uploadMapState({ upload: state => state })
	},

	methods: {
		...uploadMapActions(['removeFile', 'addFile'])
	},

	mounted: function() {
		['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function(evt) {
			this.$refs.dropzone.addEventListener(evt, function(e) {
				e.preventDefault()
				e.stopPropagation()
			}.bind(this), false)
		}.bind(this))

		let counter = 0

		this.$refs.dropzone.addEventListener('dragenter', function(e) {
			counter++
			this.dropzone = true
		}.bind(this))

		this.$refs.dropzone.addEventListener('dragleave', function(e) {
			counter--
			if(counter === 0) {
				this.dropzone = false
			}
		}.bind(this))

		this.$refs.dropzone.addEventListener('drop', function(e) {
			counter = 0
			this.dropzone = false

			e.dataTransfer.files.forEach(file => {
				this.addFile(file)
			})
		}.bind(this))
	}
}
</script>

<style scoped>
.dropzone {
	border: 2px dashed #bbd3fb;
}
.dropzone-active {
	background-color: #bbd3fb;
}
</style>
