import axios from 'axios'
/* eslint-disable */

import { getLocalUser } from './auth.js';

const user = getLocalUser();

export default {
	state: {
		reports: [],
		meals: [],
		user: null,
		currentUser: user,
		isLogged: !!user,
		loading: false,
		notification: false,
		notification_msg: "",
	},
	getters: {
		reports: state => state.reports,
		meals: state => state.meals,
		user: state => state.user,
		currentUser: state => state.currentUser,
		isLogged: state => state.isLogged,
		notification: state => state.notification,
		notification_msg: state => state.notification_msg,
		loading: state => state.loading,
	},
	mutations: {
		LOGIN(state, payload) {
			state.isLogged = true;
			state.currentUser = Object.assign({}, { id: payload.user._id }, { token: payload.token });
			state.user = payload.user;
			localStorage.setItem("user", JSON.stringify(state.currentUser));
			axios.defaults.headers.common["Authorization"] = `Bearer ${state.currentUser.token}`
		},
		LOGOUT(state) {
			localStorage.removeItem("user");
			state.isLogged = false;
			state.currentUser = null;
			state.user = null;
		},
		UPDATE_REPORTS(state, payload) {
			state.reports = payload;
		},
		UPDATE_MEALS(state, payload) {
			state.meals = payload;
		},
		ADD_MEAL(state, payload) {
		},
		UPDATE_MEAL(state, payload) {
		},
		SET_USER(state, payload) {
			state.user = payload;
		},
		UPDATE_LOADING(state) {
			state.loading = !state.loading;
		},
		SET_NOTIFICATION(state, msg) {
			state.notification = true;
			state.notification_msg = msg;
		},
		CLOSE_NOTIFICATION(state) {
			state.notification = false;
		}
	},
	actions: {
		async getMeals({ commit }) {
			try {
				commit("UPDATE_LOADING")
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
				commit("UPDATE_LOADING")
				return "success";
			} catch (error) {
				console.log(error)
			}
			commit("UPDATE_LOADING")
		},
		async getReports({ commit }, id) {
			try {
				const res = await axios({
					url: 'http://localhost:3000/graphql',
					method: 'post',
					data: {
						query: `
						query { 
							getReports (page: 1, meal: "${id}") {
								page
								totalPages
								reports {
									_id
									description
									meal_item {
										_id
									}
									meal {
										_id
									}
									user {
										username
										image_url
									}
								}
							}
						}
						`
					}
				});
				commit('UPDATE_REPORTS', res.data.data.getReports.reports);
				return "success";
			} catch (error) {

			}
		},
		async addMeal({ commit }, data) {
			// commit("UPDATE_LOADING")
			try {
				const createdMeal = await axios({
					url: 'http://localhost:3000/graphql',
					method: 'post',
					data: {
						query: `
						mutation { 
							createMeal (mealName: "${data.meal_name}"){
								_id
							}
						}`
					}
				});
				const id = createdMeal.data.data.createMeal._id;
				await data.items.forEach(async item => {
					const query = `{"query": "mutation ($file: Upload!){ createMealItem (input: {meal: \\"${id}\\", name: \\"${item.name}\\", image: $file })}", "variables": {"file": null}}`;
					const map = `{"0": ["variables.file"]}`;
					const formdata = new FormData();
					formdata.append("operations", query)
					formdata.append("map", map)
					formdata.append("0", item.file);

					await axios({
						url: 'http://localhost:3000/graphql',
						method: 'post',
						data: formdata
					});
				});

				// let mutationParams = `mutation (`;
				// let variables = `"variables": {`;
				// let items = `[`;
				// let map = `{`

				// mutationParams += `$file${index}: Upload!`
				// items += `{name: \\"${item.name}\\", image: $file${index}}`
				// variables += `"file${index}": null`;
				// map += `"${index}": ["variables.file${index}"]`;

				// if (index != data.items.length - 1) {
				// 	mutationParams += ',';
				// 	items += `,`;
				// 	variables += `,`;
				// 	map += `,`;
				// }
				// items += `]`;
				// mutationParams += `)`;
				// variables += `}`;
				// map += `}`;

				// const query = `{ "query": "${mutationParams} { createMeal( mealInput: { name: \\"${data.meal_name}\\", items: ${items} } ) { name createdAt user {username} meals {_id name image_url votes_up votes_down votes { user { _id }}} } }", ${variables} }`;
				// formdata.append("operations", query)
				// formdata.append("map", map)
				// data.items.forEach((item, index) => {
				// 	formdata.append(`${index}`, item.file)
				// })


				commit('ADD_MEAL', res.data);
				// commit("UPDATE_LOADING");

			} catch (error) {
				console.log(error)
			}
			// commit("UPDATE_LOADING");
		},
		async submitVotes({ commit }, data) {
			try {
				// console.log(data);
				commit("UPDATE_LOADING")

				let votes = "[";
				data.votes.forEach(vote => {
					votes += `{vote: "${vote.vote}", meal_item_id: "${vote.meal_item_id}", report: "${vote.report}"}`
				});
				votes += "]";
				const res = await axios({
					url: 'http://localhost:3000/graphql',
					method: 'post',
					data: {
						query: `
						mutation { 
							addVotes (voteInput: ${votes}, meal: "${data.meal}"){
								_id
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
						}`
					}
				});
				commit('UPDATE_MEAL', "");
				commit("UPDATE_LOADING")

				return "success";
			} catch (error) {
				console.log(error);
			}
			commit("UPDATE_LOADING")

		},
		async createUser({ commit }, code) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: 'http://localhost:3000/graphql',
					method: 'post',
					data: {
						query: `
						mutation { 
							createUser (code: "${code}") {
								user{
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
				console.log(res);
				commit("LOGIN", res.data.data.createUser)
				commit("UPDATE_LOADING")

				return "1";
			} catch (error) {
				console.log(error)
			}
			commit("UPDATE_LOADING")

		},
		async getUser({ commit }, id) {
			try {
				commit("UPDATE_LOADING")

				const res = await axios({
					url: 'http://localhost:3000/graphql',
					method: 'post',
					data: {
						query: `
								query { 
									getUser (userId: "${id}") {
										_id
										username
										displayname
										image_url
										staff
										campus
									}
								}
							`
					}
				});
				commit("SET_USER", res.data.data.getUser);
				commit("UPDATE_LOADING")

				return "1";
			} catch (error) {
				console.log(error)
			}
			commit("UPDATE_LOADING")

		}

	}
}