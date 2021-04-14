<template>
	<div class="mb-2">
		<v-text-field
      placeholder="File name"
      v-model="edit.file.name"
      dense
      outlined
      single-line
      hide-details="auto"
      class="mb-2"
    ></v-text-field>
    <v-text-field
      placeholder="Alt Text"
      v-model="edit.file.alt"
      dense
      outlined
      hide-details="auto"
      class="mb-2"
      v-if="edit.file.mime_type.split('/')[0] === 'image'"
    ></v-text-field>
    <v-text-field
      placeholder="Description"
      v-model="edit.file.description"
      dense
      outlined
      single-line
      hide-details="auto"
      class="mb-2"
    ></v-text-field>
    <div class="d-flex">
      <v-combobox
        v-model="select"
        :items="items"
        hide-details="auto"
        :search-input.sync="search"
        single-line
        outlined
        dense
        :loading="loading"
        hide-no-data
        label="Tags"
        placeholder="Tags"
        class="mb-2"
      >
      </v-combobox>
      <v-btn color="primary" class="ml-2" @click="addTag" :disabled="addingTag">Add</v-btn>
    </div>


    <div 
      class="d-flex mb-2"
      v-if="['image/jpeg', 'image/png', 'image/webp'].includes(edit.file.mime_type)"
    >
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
          @click="resize"
        >
          Resize
        </v-btn>
      </div>

	</div>
</template>

<script>
import axios from 'axios'
import { createNamespacedHelpers } from 'vuex'
const { mapState: editMapState, mapActions: editMapActions } = createNamespacedHelpers('edit')
const { mapActions: snackbarMapActions } = createNamespacedHelpers('snackbar')
export default {
	name: 'FileInfoEdit',

	data: function() {
		return {
      addingTag: false,
      timer: null,
      tagName: null,
      tagList: [],
      items: [],
      select: null,
      search: null,
      loading: false,
      width: undefined,
      height: undefined,
		}
	},
  computed: {
    ...editMapState({ edit: state => state })
  },
  methods: {
    ...editMapActions(['fetchFile', 'setQuery']),
    ...snackbarMapActions('setSnackbar'),

    remove (item) {
      this.select = this.select.filter(val => val !== item)
    },
    resize: async function() {
      let w = parseInt(this.width) === 'NaN' ? undefined: parseInt(this.width)
      let h = parseInt(this.height) === 'NaN' ? undefined: parseInt(this.height)

      if((w && w < 1) || (h && h < 1)) {
        return this.setSnackbar('Width and height should be a positive number.')
      }

      try {

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
      }
      
    },
    async addTag() {
      if(!this.search) return

      this.addingTag = true
      try {
        const { data } = await axios.post('/api/tags', { name: this.search, mediaId: this.edit.file.id })
        this.search = ''
        this.fetchFile(this.edit.file.id)
        this.setTagItems()
        this.addingTag = false
      } catch(err) {
        this.setSnackbar(err.response.data.message || err.message)
        this.addingTag = false
      }
    },
    setTagItems() {
      this.items = this.tagList.filter(tagName => !this.edit.file.Tags.find(item => item.name === tagName))
    }
  },

  async created() {
    try {
      this.loading = true
      const { data } = await axios.get('/api/tags')
      this.loading = false
      this.tagList = data.map(item => item.name)
      this.setTagItems()
    } catch(err) {
      this.loading = false
    }
  },

  watch: {
    search() {
      this.setTagItems()
    }
  }
}
</script>
