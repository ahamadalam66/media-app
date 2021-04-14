<template>
	<v-row class="pa-2 mb-4 mt-2">
        <v-btn 
          :class="[{ 'primary--text': allSelected }]" 
          @click="selectAll"
          class="mt-0 ml-2"
          icon
        >
          <v-icon>{{ allSelected ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}</v-icon>
        </v-btn>
        <v-btn 
          color="error" 
          class="mt-0"
          :disabled="!gallery.selected.length"
          @click="deleteFiles"
          icon
        >
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
        <div class="selection-box">
          <v-select
              :items="gallery.selectOptions"
              label="All media items"
              item-text="name"
              item-value="value"
              single-line
              dense
              filled
              hide-details="auto"
              class="ml-2 "
              v-model="searchType"
            ></v-select>
        </div>
        <div class="search-box" v-if="!isTagSearch">
          <v-text-field
            v-model="s"
            @keydown="search"
            class="ml-2"
            filled
            label="Search"
            hide-details="auto"
            prepend-inner-icon="mdi-magnify" 
            single-line
            hide-no-data
            dense
          >    
            </v-text-field>
        </div>
        <div class="tags-box" v-if="isTagSearch">
          <v-autocomplete
              v-model="s"
              :items="items"
              @change="fetchFiles"
              hide-details="auto"
              single-line
              filled
              dense
              label="Search tag"
              placeholder="Search tag"
              class="ml-2"
            >
          </v-autocomplete>
        </div>
      </v-row>
</template>
<script>
import axios from 'axios'
import { createNamespacedHelpers } from 'vuex'
const { 
  mapState: galleryMapState, 
  mapActions: galleryMapActions,
  mapGetters: galleryMapGetters,
} = createNamespacedHelpers('gallery')
export default {
	name: 'Toolbar',

  data() {
    return {
      items: []
    }
  },

	computed: {
		...galleryMapState({ gallery: state => state }),
    ...galleryMapGetters(['allSelected']),

    s: {
      get() {
        return this.gallery.filter.s
      },
      set(value) {
        this.setSearch(value)
      }
    },
    searchType: {
      get() {
        return this.gallery.filter.searchType
      },
      set(value) {
        this.setSearchType(value)
      }
    },
    isTagSearch() {
      return this.gallery.filter.searchType === 'tag'
    }
	},

	methods: {
    ...galleryMapActions([
      'setOption', 'deleteFiles', 'setSearchType', 'setSearch', 'search', 'selectAll', 'fetchFiles'
      ])
	},

  async created() {
    try {
      const { data } = await axios.get('/api/tags')
      this.loading = false
      this.items = data.map(item => item.name)
    } catch(err) {
    }
  }
}
</script>
