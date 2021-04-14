<template>
	<div class="ma-2 display-relative">
		<slot name="close-icon"></slot>
		<div :class="['dropzone mb-2', { 'dropzone-active': dropzoneActive } ]" ref="dropzone">
			<div class="text-body-1">Drop files to upload</div>
			<div class="text-body-2">or</div>
			<div class="fileinput my-2">
				<label for="files">Select Files</label>
				<input :accept="MIME_TYPES.join(',')" type="file" name="files" id="files" @change="onFileChange" multiple />
			</div>
		    <div class="text-body-2">Maximum upload file size: {{ MAX_FILE_SIZE }} MB.</div>
		</div>
	</div>
</template>

<script>

import { uuid } from 'vue-uuid'
import { MIME_TYPES, MAX_FILE_SIZE } from '../../../config.js'

export default {
	name: 'DropZone',
	props: ['files', 'progress', 'setProgress', 'setError', 'errors'],
	components: { },

	data: function() {
		return {
			MIME_TYPES: [],
			MAX_FILE_SIZE: 0,
			dropzoneActive: false
		}
	},

	methods: {
		onFileChange: function(e) {
			e.target.files.forEach(file => {
				this.addFile(file)
			})
			e.target.value = ''
		},

		addFile: function(file) {
			const fileId = uuid.v4()
			file.id = fileId
			file.allowed = true
			file.sizelimit = false

			this.setProgress({...this.progress, [fileId]: 0 })
			this.setError({...this.errors, [fileId]: false })

			if(file.size > MAX_FILE_SIZE * 1024 * 1024) {
				file.sizelimit = true
			}

			if(!MIME_TYPES.includes(file.type)) {
				file.allowed = false
				this.files.push(file)

			}else if(file.type.split('/')[0] === 'image') {
				const fileReader = new FileReader()
				fileReader.onload = e => {
					file.src = e.target.result 
					this.files.push(file)
				}
				fileReader.readAsDataURL(file)

			}else{
				this.files.push(file)
			}
		}
	},

	created: function() {
		this.MIME_TYPES = MIME_TYPES
		this.MAX_FILE_SIZE = MAX_FILE_SIZE
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
			this.dropzoneActive = true
		}.bind(this))

		this.$refs.dropzone.addEventListener('dragleave', function(e) {
			counter--
			if(counter === 0) this.dropzoneActive = false
		}.bind(this))

		this.$refs.dropzone.addEventListener('drop', function(e) {
			this.dropzoneActive = false

			e.dataTransfer.files.forEach(file => {
				this.addFile(file)
			})
		}.bind(this))
	}
}
</script>

<style scoped>
.display-relative {
	position: relative;
}
.dropzone {
	width: 100%;
	text-align: center;
	padding-top: 4rem;
	padding-bottom: 4rem;
	margin-right: 10rem;
	border: 2px dashed #1976d2;
}

.dropzone.dropzone-active {
	background-color: #bbd3fb;
}

.fileinput input {
	background: #ddd;
	width: 50px;
	height: 50px;
	display: none;
}

.fileinput label {
	align-items: center;
  display: inline-flex;
  cursor: pointer;
  background-color: #1976d2;
  color: #fff;
	height: 36px;
  min-width: 64px;
  padding: 0 16px;
  font-size: 1rem;
}

.close-icon {
  position: absolute;
  top: 0;
  right: 0;
}
</style>