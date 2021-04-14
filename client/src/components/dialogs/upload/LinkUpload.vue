<template>
  <div 
  	class="d-flex justify-center fill-height flex-column text-center"
  >
  <div>
  	<v-text-field
	      placeholder="Enter url to import a file"
	      v-model="url"
	      dense
	      outlined
	      single-line
	      autofocus
	      hide-details="auto"
	      width="auto"
	      class="mx-16 mb-2"
	    ></v-text-field>
	    <v-btn
					color="primary"
					:loading="importing"
					:disabled="importing"
					@click="importFile"
				>
						Import
				</v-btn>
	  </div>
  </div>
</template>

<script>
import axios from 'axios'
import { createNamespacedHelpers } from 'vuex'
const { mapActions: uploadMapActions } = createNamespacedHelpers('upload')
const { mapActions: snackbarMapActions } = createNamespacedHelpers('snackbar')
export default {
	name: 'LinkUpload',

	data() {
		return {
			url: '',
			importing: false
		}
	},

	methods: {
		...uploadMapActions(['addFile']),
		...snackbarMapActions(['setSnackbar']),

		async importFile() {
  		if(!this.url) return 

			this.importing = true
			try {
				const { data } = await axios.get(this.url, { responseType: 'blob' })

				if(!['image/jpeg', 'image/png', 'image/webp'].includes(data.type)) {
					return this.setSnackbar(`File type '${data.type}' is not supported.`)
				}

				let filename = this.url.split('/').pop()
				const ext = filename.split('.').pop()

				const KNOWN_EXT = ['jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'webp']

				if(!KNOWN_EXT.includes(ext)) {
					switch(data.type) {
						case 'image/jpeg': 
												filename = `${filename}.jpg`
												break
						case 'image/png': 
												filename = `${filename}.png`
												break
						case 'image/webp': 
												filename = `${filename}.webp`
												break
					}
				}

				const file = new File([data], filename, { type: data.type })
				this.addFile(file)
				this.importing = false
				this.url = ''
				this.$emit('setLink', false)
			} catch(err) {
				this.importing = false
				this.setSnackbar(err.response.data.message || err.message)
			}
		},
	}
}
</script>
