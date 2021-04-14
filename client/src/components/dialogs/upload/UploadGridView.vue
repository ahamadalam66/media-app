<template>
  <v-row no-gutters>
    <v-col
      v-for="(media , i) in medias"
      :key="i"
      class="d-flex child-flex pa-2"
      sm="4"
      md="3"
      xl="2"
    >
      <div class="cursor">
        <div class="selection-box">
          <v-btn icon small @click="onRemoveFile(media.id)">
            <v-icon 
              small
              color="error"
              class="white"
            >
                mdi-trash-can-outline
            </v-icon>
          </v-btn>
        </div>
        <div>
          <v-img
            v-if="media.type.split('/')[0] === 'image'"
            contain
            :src="media.src"
            :lazy-src="media.src"
            :aspect-ratio="16/10"
            class="grey darken-4"
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
            v-if="media.type.split('/')[0] === 'video'"
            :aspect-ratio="16/10"
            class="d-flex text-center align-center grey lighten-2"
          >
            <v-icon size="64">mdi-file-video-outline</v-icon>
          </v-responsive>

          <v-responsive 
            v-if="!(media.type.split('/')[0] === 'image') && !(media.type.split('/')[0] === 'video')"
            :aspect-ratio="16/10"
            class="d-flex text-center align-center grey lighten-2"
          >
            <v-icon size="64">mdi-file-outline</v-icon>
          </v-responsive>
        </div>

        <div class="media-detail">
          <div class="name">{{ media.name }}</div>
          <div class="size">{{ getFileExtension(media) }} - {{ getFileSize(media) }}</div>


          <div class="progress-container" 
          v-if="media.allowed && !media.sizelimit && progress[media.id] > 0 && !errors[media.id]"
          >
            <v-progress-linear
              v-model="progress[media.id]"
              height="25"
              color="primary"
              class="white--text"
            >
              {{ Math.ceil(progress[media.id]) }}%
            </v-progress-linear>
          </div>

          <div 
            class="red lighten-4 progress-container" 
            v-if="!media.allowed || media.sizelimit || errors[media.id]"
          >
            <div 
              class="text-caption font-italic pa-1"
            >
                {{ !media.allowed ? 'This file type is not allowed.': errors[media.id] ? 'Failed uploading.' : 'File size limit.' }}
            </div>
          </div>
        </div>
      </div>

    </v-col>
  </v-row>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'UploadGridView',

  props: ['medias', 'onRemoveFile', 'progress', 'errors'],

  data: function() {
    return {
    }
  },
  methods: {
    getFileExtension: function(file) {
      const filename = file.name
      const ext = filename.split('.')
      return ext[ext.length - 1] || ''
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
  },
}
</script>

<style scoped>
.cursor {
  position: relative;
}

.selection-box {
  position: absolute;
  z-index: 1;
  /*left: 100%;
  bottom: 100%;
  transform: translateX(-50%) translateY(50%);*/
  top: 0;
  right: 0;
}
.image-container {
  outline: 2px solid #1976d2;
}
.media-detail {
  margin-top: -0.5rem;
  position: relative;
}

.progress-container {
  position: absolute;
  bottom:100%;
  width: 100%;
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
