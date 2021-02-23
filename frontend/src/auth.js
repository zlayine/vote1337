/* eslint-disable */
import axios from 'axios'

export async function login(user_id) {
	const res = await axios({
		url: process.env.VUE_APP_GRAPHQL_API,
		method: 'post',
		data: {
			query: `
					query { 
						login (userId: "${user_id}") {
							user {
								_id
								username
								displayname
								image_url
								staff
								campus
							}
							token
						}
					}
				`
		}
	});
	// console.log(res.data);
	return res.data;
}

export function getLocalUser() {
	const userStr = localStorage.getItem("user");
	if (!userStr) {
		return null;
	}
	return JSON.parse(userStr);
}

export function initialize(store, router) {
	router.beforeEach((to, from, next) => {
		const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
		const currentUser = store.getters.currentUser;
		if (requiresAuth && !currentUser)
			next('/auth');
		else if (requiresAuth && !currentUser && to.path == '/auth')
			next('/auth');
		else if (to.path == '/auth' && currentUser) {
			next('/');
		} else {
			axios.interceptors.response.use(null, (error) => {
				if (error.response && error.response.status == 401 && to.path != '/auth') {
					store.commit('LOGOUT');
					router.push('/auth');
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