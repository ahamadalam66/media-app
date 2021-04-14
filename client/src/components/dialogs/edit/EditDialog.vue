<template>
	<v-dialog
		v-model="edit.dialog"
    v-if="edit.dialog"
		width="75%"
    persistent
    no-click-animation
	>

	<v-card class="d-flex flex-column" style="height: 90vh">
		<v-card-title class="d-flex pt-2 pb-1">
			<div class="text-subtitle-2">Details</div>

			<v-spacer></v-spacer>

      <v-btn 
        icon
        @click="deleteFile" 
      >
  			<v-icon :size="20">
            mdi-trash-can-outline
        </v-icon>
      </v-btn>

      <v-btn 
        icon
        @click="copytoClipboard(image.url)" 
      >
        <v-icon :size="20">
            mdi-link-variant
        </v-icon>
      </v-btn>
      <v-btn 
        icon
        @click="closeDialog" 
      >
        <v-icon :size="20">
            mdi-close
        </v-icon>
      </v-btn>
		</v-card-title>

		<v-divider></v-divider>
    <div 
      class="flex-grow-1 pa-2 justify-center align-center d-flex"
      v-if="edit.loading"
    >

      <v-progress-circular
        color="primary"
        indeterminate
        class="align-self-center text-center"
      ></v-progress-circular>
    </div>

		<div 
      v-else 
      class="flex-grow-1 pa-2" 
      style="overflow-y: hidden;"
    >

	    <v-row class="mx-0 fill-height">
	    	<v-col cols="6" class="px-0 fill-height">
		    	<image-card 
	          :image="image"
	        />
	      </v-col>
	      <v-col cols="6" class="px-2 fill-height" style="overflow-y: scroll;">
		    	
          <file-info />
          <file-info-edit />
          <resize-image
            v-if="['image/jpeg', 'image/png', 'image/webp'].includes(edit.file.mime_type)"
          />
          <tags />
          <resizes
          	v-if="['image/jpeg', 'image/png', 'image/webp'].includes(edit.file.mime_type)"
          />
	      </v-col>
	    </v-row>

		</div>
		<v-divider></v-divider>
		<v-card-actions>
			<v-btn color="primary" @click="update">
				Update
			</v-btn>
			<v-btn text @click="closeDialog">
				Cancel
			</v-btn>
		</v-card-actions>
	</v-card>

	</v-dialog>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import axios from 'axios'
import FileInfo from '@/components/dialogs/edit/FileInfo.vue'
import FileInfoEdit from '@/components/dialogs/edit/FileInfoEdit.vue'
import ImageCard from '@/components/dialogs/edit/ImageCard.vue'
import Tags from '@/components/dialogs/edit/Tags.vue'
import ResizeImage from '@/components/dialogs/edit/ResizeImage.vue'
import Resizes from '@/components/dialogs/edit/Resizes.vue'

const { mapActions: galleryMapActions } = createNamespacedHelpers('gallery')
const { mapState, mapActions } = createNamespacedHelpers('edit')
const { mapActions: snackbarMapActions } = createNamespacedHelpers('snackbar')
export default {
	name: 'EditDialog',

  components: {
    FileInfo,
    FileInfoEdit,
    ImageCard,
    Tags,
    ResizeImage,
    Resizes
  },

  computed: {
    ...mapState({ 
      edit: state => state, 
      file: state => state.file, 
      generatedImages: state => state.file.GeneratedImages 
    }),

    image() {
      if(['image/jpeg', 'image/png', 'image/webp'].includes(this.file.mime_type)) {
        if(this.edit.query === null) {
          return {
            url: this.file.url,
            mime_type: this.file.mime_type
          }
        }
        const image = this.generatedImages.find(item => item.query == this.edit.query) || {}
        
        return {
          url: image.url,
          mime_type: this.file.mime_type
        }
        
      }

      return {
        url: this.file.url,
        mime_type: this.file.mime_type
      }
    }
  },

	methods: {
    ...mapActions(['closeDialog', 'setLoading', 'setQuery', 'fetchFile']),
    ...galleryMapActions({ deleteOriginal: 'deleteFile', fetchFiles: 'fetchFiles' }),
    ...snackbarMapActions(['setSnackbar']),

    copytoClipboard: function(value) {
      const textArea = document.createElement("textarea")
      textArea.textContent = value
      document.body.appendChild(textArea)

      const selection = document.getSelection()
      const range = document.createRange()

      range.selectNode(textArea)
      selection.removeAllRanges()
      selection.addRange(range)
      const copied = document.execCommand('copy')
      selection.removeAllRanges()
      document.body.removeChild(textArea)

      if(copied) {
        this.setSnackbar('Copied url to clipboard.')
      }

  	},
    async update() {
      try {
        const { data } = await axios.put('/api/medias', this.edit.file)
        this.setSnackbar(data.message)
        this.fetchFiles()
      } catch(err) {
        this.setSnackbar(err.response.data.message || err.message)
      }
    },
    deleteFile() {
      this.deleteOriginal(this.edit.file.id)
    }
  }
}
</script>