<template>
	<v-container>
		<div class="d-flex ma-2 mb-4">
			<div class="text-h5">Upload New Media</div>
			<v-spacer></v-spacer>
			<v-btn 
				text 
				color="error" 
				@click="files = []"
				:disabled="!files.length || uploading"
			>
				Delete
			</v-btn>
			<v-btn 
				text 
				color="primary" 
				@click="uploadFiles"
				:disabled="!files.length || uploading"
			>
				Upload
			</v-btn>
		</div>
		<drop-zone 
			:files="files"  
			:progress="progress" 
			:errors="errors"
			:setError="setError"
			:setProgress="setProgress" />

		<upload-grid-view 
			:medias="files" 
			:onRemoveFile="onRemoveFile" 
			:progress="progress"
			:errors="errors" />

	</v-container>
</template>

<script>

import axios from 'axios'

import DropZone from '@/components/DropZone.vue'
import UploadGridView from '@/components/dialogs/upload/UploadGridView.vue'

export default {
	name: 'UploadPage',

	components: {
		DropZone,
		UploadGridView
	},

	data: function() {
		return {
			files: [],
			progress: [],
			errors: [],
			uploading: false,
		}
	},

	methods: {
		onRemoveFile: function(id) {
			this.files = this.files.filter(file => file.id != id)
		},
		uploadFiles: function() {

			this.uploading = true

			const files = this.files.filter(file => (file.allowed && !file.sizelimit))
			const totalFilesToUpload = files.length
			let filesUploaded = 0

			files.forEach(file => {
				this.progress[file.id] = false
				const formData = new FormData()
				formData.append('files', file)

				axios.post('/api/medias', formData, {
					headers: {
	            'Content-Type': 'multipart/form-data'
	        },
	        onUploadProgress: ( progressEvent ) => {
	        	const progress = parseInt( Math.round( ( progressEvent.loaded / progressEvent.total ) * 100 ))
	        	this.progress = { ...this.progress, [file.id]: progress }
	      	}
				}).then(() => {
				    this.files = this.files.filter(f => f.id != file.id)
				}).catch((err) => {
				    this.errors = { ...this.errors, [file.id]: true }
				}).finally(() => {
					filesUploaded++
					if(filesUploaded === totalFilesToUpload) {
						this.uploading = false
					}
				})
			})
		},

		setProgress: function(value) {
			this.progress = value
		},
		setError: function(value) {
			this.errors = value
		}
	}
}
</script>
