<template>
  
    <div v-if="tags.length">
      <div class="text-subtitle-2 mb-1">Tags</div>
      <v-chip
        v-for="tag in tags"
        :key="tag.id"
        color="primary"
        class="mr-2 mb-2"
        close
        @click:close="deleteTag(tag.id)"
      >
        {{ tag.name }}
      </v-chip>
    </div>
</template>

<script>
import axios from 'axios'
import { createNamespacedHelpers } from 'vuex'
const { mapState: editMapState, mapActions: editMapActions } = createNamespacedHelpers('edit')
const { mapActions: snackbarMapActions } = createNamespacedHelpers('snackbar')
export default {
  name: 'Tags',

  computed: {
    ...editMapState({ tags: state => state.file.Tags, id: state => state.file.id })
  },
  methods: {
    ...editMapActions(['fetchFile']),
    ...snackbarMapActions(['setSnackbar']),

    async deleteTag(tagId) {
      if(!confirm('Are you sure want to remove this tag')) return
        
      try {
        const { data } = await axios.delete(`/api/tags/${tagId}`)
        this.fetchFile(this.id) 

      } catch(err) {
        console.log(err)
        if(err.response) {
          return this.setSnackbar(err.response.data.message)
        }
        this.setSnackbar('Something went wrong.')
      }
    }
  }
}
</script>
