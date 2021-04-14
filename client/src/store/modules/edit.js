import axios from 'axios'

export default {

	namespaced: true,

	state: () => ({
		dialog: false,
		file: null,
		loading: false,
		query: JSON.stringify({ w: 400 }),
		form: {
			name: '',
			description: '',
			alt: '',
			tags: ''
		}
	}),

	mutations: {
		setLoading(state, loading) {
			state.loading = loading
		},
		setDialog(state, dialog) {
			state.dialog = dialog
		},
		setFile(state, file) {
			state.file = file
		},
		setQuery(state, query) {
			state.query = query
		}
	},

	actions: {
		async fetchFile({ commit, dispatch }, id) {

			try {
        const { data } = await axios.get(`/api/medias/${id}`)
        commit('setFile', data)
        commit('setLoading', false)

        return Promise.resolve()
      } catch(err) {
        dispatch('snackbar/setSnackbar', err.response.data.message || err.message, { root: true })
        commit('setLoading', false)
        return Promise.reject()
      }

		},
		async openDialog({ commit, dispatch }, id) {

			commit('setQuery', JSON.stringify({ w: 400 }))
			commit('setLoading', true)
			commit('setDialog', true)
			dispatch('fetchFile', id)
   
		},
		closeDialog({ commit }) {
			commit('setDialog', false)
			commit('setFile', null)
		},
		setLoading({ commit }, loading) {
			commit('setLoading', loading)
		},
		setQuery({ commit }, query) {
			commit('setQuery', query)
		}
	},

	getters: {}

}
