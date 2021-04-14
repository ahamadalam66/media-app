import axios from 'axios'
import { PAGE_SIZE } from '@/../../config'

export default {

	namespaced: true,

	state: () => ({
		files: [],
		totalFilesCount: 0,
		loading: false,
		page: 1,
    selected: [],
    selectOptions: [
      { name: 'All items', value:'' },
      { name: 'Images', value: 'image' }, 
      { name: 'Videos', value: 'video'},
      { name: 'Tags', value: 'tag'}
    ],
		per_page: PAGE_SIZE,
		filter: {
      s: '',
      searchType: ''
    }
	}),

	mutations: {
		setFiles(state, files) {
			state.files = files
		},
		setTotalFilesCount(state, count) {
			state.totalFilesCount = count
		},
		setLoading(state, loading) {
			state.loading = loading
		},
		setPage(state, page) {
			state.page = page
		},
    setSelected(state, selected) {
      state.selected = selected
    },
    setSearchType(state, searchType) {
      state.filter = { ...state.filter, searchType }
    },
    setSearch(state, search) {
      state.filter = { ...state.filter, s: search }
    }
	},

	actions: {
		async fetchFiles({ commit, state, dispatch }) {
      state.loading = true
      let range = [(state.page - 1) *  state.per_page, (state.page - 1) *  state.per_page + state.per_page - 1]
      range = JSON.stringify(range)

      const filter = JSON.stringify(state.filter)
      const query = `filter=${filter}&range=${range}`

      try {
      	const { data } = await axios.get(`/api/medias?${query}`)

      	commit('setTotalFilesCount', data.count)
      	commit('setFiles', data.rows)
        commit('setLoading', false)
      	commit('setSelected', [])

      } catch(err) {
        commit('setLoading', false)
        dispatch('snackbar/setSnackbar', err.response.data.message || err.message, { root: true })
      }
    },
    setPage({ commit }, page) {
    	commit('setPage', page)
    },
    async deleteFile({ commit, state, dispatch }, id) {
    	if(confirm('Are you sure want to delete this file?')) {
        try {
          await axios.delete(`/api/medias/${id}`)
          dispatch('edit/closeDialog', null, { root: true })
          dispatch('fetchFiles')
          return Promise.resolve()
        } catch(err) {
          dispatch('snackbar/setSnackbar', err.response.data.message || err.message, { root: true })
          return Promise.reject()
        }
        
      }
    },
    async deleteFiles({ commit, dispatch, state }) {

      if(confirm(`Are you sure want to delete this ${state.selected.length} files?`)) {

      	try {
      		const ids = JSON.stringify(state.selected)
      		const { data } = await axios.delete(`/api/medias?ids=${ids}`)
          state.selected = []
      		if((state.selected.length === state.files.length) && state.page > 1) {
            state.page = state.page - 1
          }
      		dispatch('snackbar/setSnackbar', data.message, { root: true })
      		dispatch('fetchFiles')
      		return Promise.resolve()
      	} catch(err) {
      		dispatch('snackbar/setSnackbar', err.response.data.message || err.message, { root: true })
          return Promise.reject()
      	}
      }
    },
    setSelected({ commit }, selected) {
      commit('setSelected', selected)
    },
    selectFile({ commit, state }, id) {
      const exists = state.selected.find(fileId => fileId === id)
      if(!exists) {
        state.selected = [...state.selected, id]
      }else{
        state.selected = state.selected.filter(fileId => fileId !== id)
      }
    },
    selectAll({ commit, getters }) {
      if(getters.allSelected) {
        return commit('setSelected', [])
      }
      commit('setSelected', getters.files.map(file => file.id))
    },
    setSearch({ commit }, search) {
      commit('setSearch', search)
    },
    setSearchType({ commit, dispatch }, searchType) {
      commit('setSearchType', searchType)
      commit('setSelected', [])
      commit('setSearch', '')
      commit('setPage', 1)
      dispatch('fetchFiles')
    },
    search({ commit, dispatch }) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => { 
        commit('setPage', 1)
        dispatch('fetchFiles')
      }, 500)
    }
	},

	getters: {
    allSelected(state) {
      return state.selected.length === state.files.length && state.files.length !== 0
    },
    files(state) {
      return state.files
    },
    selected(state) {
      return state.selected
    }
  }

}
