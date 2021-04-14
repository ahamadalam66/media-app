<template>
	<div class="mt-2">
    <div class="text-subtitle-2 mb-1">Resize Cache</div>
      <v-chip
        color="primary"
        class="mr-2 mb-2"
        @click:close="deleteResized(null)"
        :outlined="query !== null"
        @click="setQuery(null)"
      >
        Original
      </v-chip>
      <v-chip
        v-for="generatedImage in generatedImages"
        :key="generatedImage.id"
        :outlined="generatedImage.query !== query"
        color="primary"
        class="mr-2 mb-2"
        :close="!deleteDisabled(generatedImage.query)"
        @click:close="deleteResized(generatedImage)"
        @click="setQuery(generatedImage.query)"
      >
        {{ generatedImage.dimensions }}
      </v-chip>
  </div>
</template>

<script>
import axios from 'axios'
import { createNamespacedHelpers } from 'vuex'
const { mapState: editMapState, mapActions: editMapActions } = createNamespacedHelpers('edit')
const { mapActions: snackbarMapActions } = createNamespacedHelpers('snackbar')
export default {
	name: 'Resizes',

  computed: {
    ...editMapState({ 
      generatedImages: state => state.file.GeneratedImages,
      query: state => state.query,
      fileId: state => state.file.id
    })
  },

  methods: {
    ...editMapActions(['setQuery', 'fetchFile']),
    ...snackbarMapActions(['setSnackbar']),

    async deleteResized(image) {

      if(!confirm(`Are you sure want to delete, ${image.dimensions} resized image?`)) return

      try {
        const { data } = await axios.delete(`/api/resizes/${image.id}`)
        this.setQuery(JSON.stringify({ w: 400 }))
        this.fetchFile(this.fileId)
      } catch(err) {
        this.setSnackbar(err.response.data.message || err.message)
      }
    },
    deleteDisabled(query) {
      return (query === JSON.stringify({ w: 200 }) || query === JSON.stringify({ w: 400 }))
    },
  },
}
</script>

