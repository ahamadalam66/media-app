import { uuid } from 'vue-uuid'
import axios from 'axios'
import { MIME_TYPES, MAX_FILE_SIZE } from '@/../../config.js'

export default {

	namespaced: true,

	state: () => ({
		dialog: false,
		files: [],
		uploading: false,
		progress: [],
    errors: []
	}),

	mutations: {
		setFiles(state, files) {
			state.files = files
		},
		setDialog(state, dialog) {
			state.dialog = dialog
		},
		setUploading(state, uploading) {
			state.uploading = uploading
		},
		addFile(state, file) {
			state.file = state.files.push(file)
		},
		setProgress(state, value) {
			state.progress = value
		},
		setError(state, value) {
			state.errors = value
		},
		removeFile(state, id) {
			state.files = state.files.filter(file => file.id != id)
		}
	},

	actions: {
		setUploadDialog({ dispatch, commit, state }, dialog) {
			commit('setDialog', dialog)
			if(!dialog) {
				dispatch('gallery/fetchFiles', null, { root: true })
			}
		},
		setUploading({ commit }, uploading) {
			commit('setUploading', uploading)
		},
		removeFile({ commit }, id) {
			commit('removeFile', id)
		},
		addFile({ commit, state }, file) {
			const fileId = uuid.v4()
			file.id = fileId
			file.allowed = true
			file.sizelimit = false

			commit('setProgress', {...state.progress, [fileId]: 0 })
			commit('setError', {...state.errors, [fileId]: false })

			if(file.size > MAX_FILE_SIZE * 1024 * 1024) {
				file.sizelimit = true
			}

			if(!MIME_TYPES.includes(file.type)) {
				file.allowed = false
				commit('addFile', file)

			}else if(file.type.split('/')[0] === 'image') {
				const fileReader = new FileReader()
				fileReader.onload = e => {
					file.src = e.target.result 
					commit('addFile', file)
				}
				fileReader.readAsDataURL(file)

			}else{
				commit('addFile', file)
			}
		},
		uploadFiles({ dispatch, commit, state }) {

	    commit('setUploading', true)

	    const files = state.files.filter(file => (file.allowed && !file.sizelimit))
	    const totalFilesToUpload = files.length
	    let filesUploaded = 0

	    files.forEach(file => {
	      state.progress[file.id] = false
	      const formData = new FormData()
	      formData.append('files', file)

	      axios.post('/api/medias', formData, {
	        headers: {
	            'Content-Type': 'multipart/form-data'
	        },
	        onUploadProgress: ( progressEvent ) => {
	          const progress = parseInt( Math.round( ( progressEvent.loaded / progressEvent.total ) * 100 ))
	          commit('setProgress', { ...state.progress, [file.id]: progress })
	        }
	      }).then(() => {
	         	commit('setFiles', state.files.filter(f => f.id != file.id))
	      }).catch((err) => {
	          commit('setError', { ...this.errors, [file.id]: true })
	      }).finally(() => {
	        filesUploaded++
	        if(filesUploaded === totalFilesToUpload) {
	          commit('setUploading', false)
	          if(state.files.length === 0) {
	            dispatch('setUploadDialog', false)
	          }
	          return Promise.resolve()
	        }
	      })
	    })
	  },
	},

	getters: {}

}
