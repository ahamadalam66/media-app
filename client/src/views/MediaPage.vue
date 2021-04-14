<template>
  <v-container>
    <div class="d-flex ma-2 mb-2">
      <div>
        <div class="text-h5">Media Library</div>
        <div class="text-caption grey--text">{{ gallery.totalFilesCount || 0 }} assets</div>
      </div>
      <!-- <v-spacer></v-spacer> -->
      <v-btn 
        color="primary" 
        class="ml-2" 
        text
        @click="setUploadDialog(true)"
      >
        <!-- <v-icon left>mdi-plus-circle</v-icon>  -->
          Add new
      </v-btn>
    </div>

      <toolbar />

      <v-card class="pa-2">
      <grid-view />
      <v-divider v-if="gallery.files.length"></v-divider>
      <v-card-actions v-if="gallery.files.length">
        <!-- <v-row class="ma-4 d-flex justify-end">
          <v-col xs="12" md="6" class="d-flex justify-end"> -->
            <v-spacer></v-spacer>
            <v-pagination
              v-model="page"
              :length="gallery.totalFilesCount ? Math.ceil(gallery.totalFilesCount / gallery.per_page) : 0"
            ></v-pagination>
          <!-- </v-col>
        </v-row> -->
      </v-card-actions>

      </v-card>

    </v-container>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import GridView from '@/components/GridView.vue'

import Toolbar from '@/components/Toolbar.vue'

import { createNamespacedHelpers } from 'vuex'
const { mapState: galleryMapState, mapActions: galleryMapActions } = createNamespacedHelpers('gallery')
const { mapActions: uploadMapActions } = createNamespacedHelpers('upload')
const { mapActions: editdMapActions } = createNamespacedHelpers('edit')

export default {
  name: 'MediaPage',

  components: {
    GridView,
    Toolbar
  },

  computed: {
    ...galleryMapState({ gallery: state => state }),
    page: {
      get() {
        this.gallery.page
      },
      set(page) {
        this.setPage(page)
      }
    }
  },

  methods: {
    ...galleryMapActions(['fetchFiles', 'setPage', 'deleteFiles', 'selectFile']),
    ...uploadMapActions(['setUploadDialog', 'setDialogFile']),
    ...editdMapActions({ openEditDialog: 'openDialog' }),
    onChangeOption: function() {
      this.page = 1
      this.fetchFiles()
    },
    onChangeSearch: function() {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => { 
        this.page = 1
        this.fetchFiles()
      }, 500)
    }
  },

  created: async function() {
    this.fetchFiles()
  }
}
</script>
