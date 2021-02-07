/* eslint-disable */
import axios from 'axios'

export function login(credentials) {
	return new Promise((res, rej) => {
		axios.post('/api/auth/login', credentials).then((response) => {
			res(response.data);
		})
			.catch((err) => {
				rej("Wrong email or password");
			})
	})
}

export function getLocalUser() {
	const userStr = localStorage.getItem("user");
	if (!userStr) {
		return null;
	}
	return JSON.parse(userStr);
}

export function initialize(store, router) {
	// store.commit('LOGOUT');
	router.beforeEach((to, from, next) => {
		const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
		const currentUser = store.getters.currentUser;
		if (requiresAuth && !currentUser)
			next('/login');
		else if (requiresAuth && !currentUser && to.path == '/login')
			next('/login');
		else if (to.path == '/login' && currentUser) {
			next('/brands');
		} else {
			axios.interceptors.response.use(null, (error) => {
				if (error.response.status == 401 && to.path != '/login') {
					store.commit('LOGOUT');
					router.push('/login');
				}
				return Promise.reject(error);
			});
			next();
		}
	});

	if (store.getters.currentUser) {
		setAuthorization(store.state.currentUser.token);
	}
}

export function setAuthorization(token) {
	axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
}