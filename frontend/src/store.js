import axios from 'axios'
/* eslint-disable */

// import { getLocalUser } from './auth.js';

// const user = getLocalUser();
const user = "";

export default {
	state: {
		reports: [],
		meals: [],
		currentUser: user,
		isLogged: !!user,
	},
	getters: {
		reports: state => state.reports,
		meals: state => state.meals,
		currentUser: state => state.currentUser,
		isLogged: state => state.isLogged,
	},
	mutations: {
		LOGIN(state, payload) {
			state.isLogged = true;
			state.currentUser = Object.assign({}, payload.user, { token: payload.access_token });
			localStorage.setItem("user", JSON.stringify(state.currentUser));
			// axios.defaults.headers.common["Authorization"] = `Bearer ${state.currentUser.token}`
		},
		LOGOUT(state) {
			localStorage.removeItem("user");
			state.isLogged = false;
			state.currentUser = null;
		},
		UPDATE_REPORTS(state, payload) {
			state.reports = payload;
		},
		UPDATE_MEALS(state, payload) {
			state.meals = payload;
		},
		ADD_MEAL(state, payload) {
		}
	},
	actions: {
		async getMeals({ commit }) {
			try {
				const res = await axios({
					url: 'http://localhost:3000/graphql',
					method: 'post',
					data: {
						query: `
						query { 
							getMeals (page: 1) {
								page
								totalPages
								meals {
									_id
									name
									createdAt
									user {
										username
									}
									meals {
										_id
										name 
										image_url 
										votes_up 
										votes_down
										votes {
											user {
												_id
											}
										}
									}
								}
							}
						}
						`
					}
				});
				commit('UPDATE_MEALS', res.data.data.getMeals.meals);
				return "success";
			} catch (error) {
				console.log(error)
			}
		},
		async addMeal({ commit }, data) {

			const formdata = new FormData();
			let mutationParams = `mutation (`;
			let variables = `"variables": {`;
			let items = `[`;
			let map = `{`
			data.items.forEach((item, index) => {
				mutationParams += `$file${index}: Upload!`
				items += `{name: \\"${item.name}\\", image: $file${index}}`
				variables += `"file${index}": null`;
				map += `"${index}": ["variables.file${index}"]`;

				if (index != data.items.length - 1) {
					mutationParams += ',';
					items += `,`;
					variables += `,`;
					map += `,`;
				}
			});
			items += `]`;
			mutationParams += `)`;
			variables += `}`;
			map += `}`;

			const query = `{ "query": "${mutationParams} { createMeal( mealInput: { name: \\"${data.meal_name}\\", items: ${items} } ) { name createdAt user {username} meals {_id name image_url votes_up votes_down votes { user { _id }}} } }", ${variables} }`;
			formdata.append("operations", query)
			formdata.append("map", map)
			data.items.forEach((item, index) => {
				formdata.append(`${index}`, item.file)
			})

			try {
				const res = await axios({
					url: 'http://localhost:3000/graphql',
					method: 'post',
					data: formdata
				});
				commit('ADD_MEAL', "");
				console.log(res);
			} catch (error) {
				console.log(error)
			}
		}
	}
}