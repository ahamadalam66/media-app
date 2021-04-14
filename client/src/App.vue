<template>
  <v-app>
    <appbar/>
    <v-main class="grey lighten-4">
      <router-view></router-view>

      <v-snackbar
        v-model="snackbar.show"
        :timeout="2000"
        top
      >
        {{ snackbar.message }}

        <template v-slot:action="{ attrs }">
          <v-btn
            text
            v-bind="attrs"
            @click="snackbar.show = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>

      <upload-dialog />
      <edit-dialog />

    </v-main>
  </v-app>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState: snackbarMapState } = createNamespacedHelpers('snackbar')

import Appbar from '@/components/Appbar.vue'
import UploadDialog from '@/components/dialogs/upload/UploadDialog.vue'
import EditDialog from '@/components/dialogs/edit/EditDialog.vue'


export default {
  name: 'App',

  components: {
    Appbar,
    UploadDialog,
    EditDialog
  },

  computed: {
    ...snackbarMapState({ snackbar: state => state })
  }
}
</script>

<style>
.selection-box .v-input__slot {
  width: 10rem;
}
/*.search-box .v-input__slot {
  width: 14rem;
}
.tags-box .v-input__slot {
  width: 16rem;
}*/
</style>
