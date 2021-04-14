<template>
  <v-row no-gutters>

    <div v-if="loading" class="d-flex justify-center align-center">
      <v-progress-circular
        color="primary"
        indeterminate
        class="ma-4"
      ></v-progress-circular>
    </div>

    <div 
      v-if="(medias && medias.length === 0 && !loading) || (medias.length === 0 && !loading)" 
      class="ma-4 text-body-1"
    >
        No media available.
    </div>

    <v-col
      v-if="!loading"
      v-for="media in medias"
      :key="media.id"
      class="d-flex child-flex pa-2"
      sm="4"
      md="3"
      xl="2"
    >
      <div class="cursor" @click="openEditDialog(media.id)">
        <div class="selection-box">
          <v-btn 
            :class="[{ 'primary--text': selected.includes(media.id) }]" 
            @click.stop="selectFile(media.id)"
            icon
          >
            <v-icon>{{ selected.includes(media.id) ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}</v-icon>
          </v-btn>
        </div>
        <div :class="[{'image-container': selected.includes(media.id) }]">
          <v-img
            contain
            :src="getImageUrl(media)"
            :lazy-src="getImageUrl(media)"
            :aspect-ratio="16/10"
            class="grey darken-4"
            v-if="media.mime_type.split('/')[0] === 'image'"
          >
            <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <v-responsive 
            v-if="media.mime_type.split('/')[0] === 'video'"
            :aspect-ratio="16/10"
            class="d-flex text-center align-center grey lighten-2"
          >
            <v-icon size="64">mdi-file-video-outline</v-icon>
          </v-responsive>

          <v-responsive 
            v-if="!(media.mime_type.split('/')[0] === 'image') && !(media.mime_type.split('/')[0] === 'video')"
            :aspect-ratio="16/10"
            class="d-flex text-center align-center grey lighten-2"
          >
            <v-icon size="64">mdi-file-outline</v-icon>
          </v-responsive>
        </div>
        <div class="media-detail">
          <div class="name">{{ media.name }}</div>
          <div class="size">{{ getFileExtension(media) }} - {{ getFileSize(media) }}</div>
        </div>
      </div>

    </v-col>
  </v-row>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState: galleryMapState, mapActions: galleryMapActions } = createNamespacedHelpers('gallery')
const { mapActions: editMapActions } = createNamespacedHelpers('edit')
export default {
  name: 'GridView',

  computed: {
    ...galleryMapState({ 
      medias: state => state.files, 
      loading: state => state.loading,
      selected: state => state.selected
    })
  },

  data: function() {
    return {
    }
  },
  methods: {
    ...galleryMapActions(['selectFile']),
    ...editMapActions({ openEditDialog: 'openDialog'}),

    getFileExtension: function(file) {
      const filename = file.name
      const ext = filename.split('.')
      return ext[ext.length - 1]
    },
    getFileSize: function(file) {
      let size = file.size

      const sizes = ['B', 'KB', 'MB', 'GB']
      let i = 0

      while(size > 1023 && i < sizes.length) {
        size /= 1024
        i++
      }

      size = Math.floor(size)

      return `${size}${sizes[i]}`
    },
    disablePropagation: function(e) {
      e.preventDefault()
      e.stopPropagation()
    },
    getImageUrl: function(media) {
      if(['image/jpeg', 'image/png', 'image/webp'].includes(media.mime_type)) {
        return `${media.url}?w=200`
      }

      return media.url
    }
  },
}
</script>

<style scoped>
.cursor {
  cursor: pointer;
  position: relative;
}
.selection-box {
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
}
.image-container {
  outline: 2px solid #1976d2;
}
.media-detail {
  margin-top: -0.5rem;
}
.media-detail .name {
  font-size: 0.8rem;
  font-weight: 500;
  color: #333;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  height: 2rem;
  line-height: 0.8rem;
  padding-top: 1rem;
}

.media-detail .size {
  font-size: 0.7rem;
  line-height: 0.8rem;
  font-weight: 500;
  color: #777;
  overflow: hidden;
  text-transform: uppercase;
}
</style>
