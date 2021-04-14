<template>
  <div class="d-flex mb-2">
    <v-text-field
        placeholder="width"
        v-model="width"
        dense
        outlined
        single-line
        type="number"
        hide-details="auto"
      ></v-text-field>
      <span class="pa-2">x</span>
      <v-text-field
        placeholder="height"
        v-model="height"
        dense
        outlined
        single-line
        type="number"
        hide-details="auto"
      ></v-text-field>
      <v-btn 
        color="primary"
        class="ml-2"
        :loading="resizing"
        :disabled="resizing"
        @click="resize"
      >
        Resize
      </v-btn>
    </div>
</template>

<script>
import axios, { isAxiosError} from 'axios'
import { createNamespacedHelpers } from 'vuex'
const { mapState: editMapState, mapActions: editMapActions } = createNamespacedHelpers('edit')
const { mapActions: snackbarMapActions } = createNamespacedHelpers('snackbar')
export default {
	name: 'FileInfoEdit',

	data: function() {
		return {
      resizing: false,
      width: undefined,
      height: undefined,
		}
	},
  computed: {
    ...editMapState({ edit: state => state })
  },
  methods: {
    ...editMapActions(['fetchFile', 'setQuery']),
    ...snackbarMapActions(['setSnackbar']),

    resize: async function() {
      let w = parseInt(this.width) === 'NaN' ? undefined: parseInt(this.width)
      let h = parseInt(this.height) === 'NaN' ? undefined: parseInt(this.height)

      if((w && w < 1) || (h && h < 1)) {
        return this.setSnackbar('Width and height should be a positive number.')
      }

      try {
        this.resizing = true
        const { data } = await axios.post('/api/resizes', {
                        mediaId: this.edit.file.id, w, h
                      }, {
                        headers: {
                          'Content-Type': 'application/json'
                        }
                      })
        
        await this.fetchFile(this.edit.file.id)
        this.setQuery(JSON.stringify({ w, h }))
        this.width = undefined
        this.height = undefined
      } catch(err) {
          this.setSnackbar(err.response.data.message || err.message)
      } finally {
        this.resizing = false
      }
      
    }
  },
}
</script>
