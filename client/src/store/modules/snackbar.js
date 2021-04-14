export default {

	namespaced: true,

	state: () => ({
		show: false,
		message: ''
	}),

	mutations: {
		setShow(state, show) {
			state.show = show
		},
		setMessage(state, message) {
			state.message = message
		}
	},

	actions: {
		setSnackbar({ commit }, message) {
			commit('setShow', true)
			commit('setMessage', message)
		}
	},

	getters: {}

}
