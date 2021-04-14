<template>
	<v-dialog
		v-model="upload.dialog"
		width="75%"
		persistent
		no-click-animation
	>
		<v-card 
			class="d-flex flex-column" 
			style="height: 90vh"
		>	
			<v-card-title class="d-flex py-2 pb-1">
				<div v-if="!link" class="text-subtitle-2">
					{{ upload.files.length }} files selected
				</div>

				<v-btn v-if="link" text color="primary" @click="setLink(false)">
					Done
				</v-btn>

				<v-spacer></v-spacer>
				<v-btn 
					text
					color="primary"
					@click="openSelectFile"
				>
					<v-icon
						left
						:size="20"
						color="primary"
					>
						mdi-desktop-classic
					</v-icon>
						Select file
				</v-btn>
				<v-btn 
					text
					color="primary"
					@click="link = true"
				>
					<v-icon
						left
						:size="20"
						color="primary"
					>
						mdi-link-variant
					</v-icon>
						Link upload
				</v-btn>
			</v-card-title>

			<v-divider></v-divider>

			<div 
		    style="overflow-y: scroll;"
		  	class="flex-grow-1 ma-2"
			>

				<input 
					:accept="MIME_TYPES.join(',')" 
					type="file" ref="file" 
					@change="onFileInputChange" 
					multiple 
					style="display: none;"
				/>

				<dialog-content v-if="!link" />
				<link-upload @setLink="setLink" v-if="link" />

			</div>

			<v-divider></v-divider>

			<v-card-actions v-if="!link">
			<v-btn 
				color="primary"
				@click="uploadFiles"
				:disabled="upload.uploading || upload.files.length === 0"
				:loading="upload.uploading"
			>
				Upload
			</v-btn>
			<v-btn 
				text 
				@click="closeDialog"
				:disabled="upload.uploading"
			>
				Close
			</v-btn>
		</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import axios from 'axios'
import LinkUpload from '@/components/dialogs/upload/LinkUpload.vue'
import DialogContent from '@/components/dialogs/upload/DialogContent.vue'
import { MIME_TYPES } from '@/../../config.js'

import { createNamespacedHelpers } from 'vuex'
const { mapState: uploadMapState, mapActions: uploadMapActions } = createNamespacedHelpers('upload')
export default {
	name: 'UploadDialog',

	data() {
		return {
			link: false,
			url: '',
			importing: false,
			dropzone: false
		}
	},

	components: {
		LinkUpload,
		DialogContent,
	},

	computed: {
    ...uploadMapState({ upload: state => state })
  },

	methods: {
		...uploadMapActions(['setUploadDialog', 'removeFile', 'uploadFiles', 'addFile']),

		closeDialog() {
			this.setUploadDialog(false)
		},
		openSelectFile() {
			this.$refs.file.click()
			this.link = false
		},
		onFileInputChange(e) {
			e.target.files.forEach(file => {
				this.addFile(file)
			})
			e.target.value = ''
		},
		setLink(value) {
			this.link = value
		}
	},

	created() {
		this.MIME_TYPES = MIME_TYPES
	},
}
</script>
