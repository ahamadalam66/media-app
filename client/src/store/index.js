import Vue from 'vue'
import Vuex from 'vuex'

import gallery from './modules/gallery'
import upload from './modules/upload'
import edit from './modules/edit'
import snackbar from './modules/snackbar'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
  	gallery,
  	upload,
  	edit,
  	snackbar
  }
})

export default store
