<template>
	<div>
    <v-img
      contain
      :src="image.url"
      :lazy-src="image.url"
      :aspect-ratio="1"
      class="grey darken-4 rounded-sm"
      v-if="getMimeType === 'image'"
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
      v-else-if="getMimeType === 'video'"
      :aspect-ratio="1"
      class="d-flex text-center align-center grey darken-4 rounded-sm"
    >
      <video width="420" height="auto" controls>
        <source :src="image.url" :type="getMimeType">
      Your browser does not support the video tag.
      </video>
    </v-responsive>

    <v-responsive 
      v-else
      :aspect-ratio="16/10"
      class="d-flex text-center align-center grey lighten-2"
    >
      <v-icon size="64">mdi-file-outline</v-icon>
    </v-responsive>

  </div>
</template>

<script>

import axios from 'axios'
export default {
	name: 'ImageCard',
	props: ['image'],

	computed: {
    getMimeType() {
      return this.image.mime_type.split('/')[0]
    }
	}
}
</script>

