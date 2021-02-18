import axios from 'axios'
import { getLocalUser } from './auth.js';
import { saveAs } from 'file-saver'
import io from "socket.io-client";

const user = getLocalUser();

const createMealItems = async (commit, items, id) => {
	for (let i = 0; i < items.length; i++) {
		commit('UPDATE_PERCENTAGE', 0);
		const query = `{"query": "mutation ($file: Upload!){ createMealItem (input: {meal: \\"${id}\\", name: \\"${items[i].name}\\", image: $file })}", "variables": {"file": null}}`;
		const map = `{"0": ["variables.file"]}`;
		const formdata = new FormData();
		formdata.append("operations", query)
		formdata.append("map", map)
		formdata.append("0", items[i].file);
		const res = await axios({
			url: process.env.VUE_APP_GRAPHQL_API,
			method: 'post',
			onUploadProgress: function (progressEvent) {
				let uploadPercentage = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
				commit('UPDATE_PERCENTAGE', uploadPercentage);
			}.bind(this),
			data: formdata
		});
		if (res.data.errors)
			return 0;
	}
	return 1;
}

const getMeal = async (id) => {
	try {
		const res = await axios({
			url: process.env.VUE_APP_GRAPHQL_API,
			method: 'post',
			data: {
				query: `
				query { 
					getMeal (mealId: "${id}") {
						_id
						name
						enabled
						createdAt
						user {
							username
							_id
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
				`
			}
		});
		return res;
	} catch (error) {
		console.log(error);
	}
}

export default {
	state: {
		reports: [],
		meals: [],
		mealTotalPages: 1,
		user: null,
		currentUser: user,
		isLogged: !!user,
		loading: false,
		notification: 0,
		notification_msg: "",
		addMeal: false,
		uploadPercent: null,
		socket: null,
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
		addMeal: state => state.addMeal,
		mealTotalPages: state => state.mealTotalPages,
		uploadPercent: state => state.uploadPercent,
		socket: state => state.socket,
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
			state.meals = payload.meals;
			state.mealTotalPages = payload.totalPages;
		},
		ADD_MEAL(state, payload) {
			if (state.meals.length)
				state.meals[0].enabled = false;
			state.meals.unshift(payload);
			state.addMeal = false;
		},
		UPDATE_MEAL(state, payload) {
			state.meals = state.meals.map(m => {
				if (m._id == payload._id)
					m.meals = payload.meals;
				return m;
			})
		},
		SET_USER(state, payload) {
			state.user = payload;
		},
		UPDATE_LOADING(state) {
			state.loading = !state.loading;
		},
		SET_NOTIFICATION(state, data) {
			state.notification = 1 + data.error;
			state.notification_msg = data.msg;
			setTimeout(() => {
				state.notification = 0;
			}, 3100)
		},
		CLOSE_NOTIFICATION(state) {
			state.notification = 0;
		},
		SET_ADDMEAL(state, data) {
			state.addMeal = data;
		},
		DELETE_MEAL(state, id) {
			state.meals = state.meals.filter(m => m._id != id);
		},
		UPDATE_PERCENTAGE(state, total) {
			state.uploadPercent = total;
		},
		EXPORT_CSV(state, payload) {
			if (!payload.length)
				return;
			let data = payload
			let csvContent = "";
			csvContent += [
				Object.keys(data[0]).join(";"),
				...data.map(item => Object.values(item).join(";"))
			]
				.join("\n")
				.replace(/(^\[)|(\]$)/gm, "");
			var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
			saveAs(blob, `export_${data[0].mealName}_${data[0].mealDate}.csv`);
		},
		SET_SOCKET(state, payload) {
			if (!state.socket)
				state.socket = io("http://localhost:3000", { query: { token: payload } })
		},
		// SOCKET_LISTENERS(state, payload) {
		// 	const socket = state.socket;
		// 	socket.on("newMealAdded", (data) => {

		// 	});
		// },
		EMIT_ADD_MEAL(state, payload) {
			const socket = state.socket;
			socket.emit("newMeal", { id: payload });
		},
		EMIT_ADD_VOTE(state, payload) {
			const socket = state.socket;
			socket.emit("newVote", { id: payload });
		},
		EMIT_DELETE_MEAL(state, payload) {
			const socket = state.socket;
			socket.emit("deletedMeal", { id: payload });
		}
	},
	actions: {
		async getMeals({ commit }, page) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: process.env.VUE_APP_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						query { 
							getMeals (page: ${page}) {
								totalPages
								meals {
									_id
									name
									enabled
									createdAt
									user {
										username
										_id
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
				commit('UPDATE_MEALS', res.data.data.getMeals);
				commit("UPDATE_LOADING");
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Server error", error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async socketGetMeal({ commit }, data) {
			try {
				const res = await getMeal(data.id);
				commit("ADD_MEAL", res.data.data.getMeal);
				commit("SET_NOTIFICATION", { msg: "Today's meal was added few moments ago!", error: 0 });

			} catch (error) {
				console.log(error);
			}
		},
		async socketUpdateMeal({ commit }, data) {
			try {
				const res = await getMeal(data.id);
				commit("UPDATE_MEAL", res.data.data.getMeal);
			} catch (error) {
				console.log(error);
			}
		},
		async socketDeleteMeal({ commit }, data) {
			try {
				commit("DELETE_MEAL", data.id);
				commit("SET_NOTIFICATION", { msg: "Meal deleted by his owner!", error: 0 });
			} catch (error) {
				console.log(error);
			}
		},
		async getReports({ commit }, id) {
			try {
				const res = await axios({
					url: process.env.VUE_APP_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						query { 
							getReports (meal: "${id}") {
								_id
								report
								createdAt
								meal_item {
									_id
								}
								user {
									username
									image_url
								}
							}
						}
						`
					}
				});
				commit('UPDATE_REPORTS', res.data.data.getReports);
				return "success";
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Could not get reports", error: 1 });
			}
		},
		async addMeal({ commit }, data) {
			commit("UPDATE_LOADING")
			try {
				commit('UPDATE_PERCENTAGE', 0);
				const createdMeal = await axios({
					url: process.env.VUE_APP_GRAPHQL_API,
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
				if (createdMeal.data.errors) {
					commit("SET_NOTIFICATION", { msg: "Failed to add meal", error: 1 });
					commit("UPDATE_LOADING");
					return 0;
				}
				const id = createdMeal.data.data.createMeal._id;
				const items = await createMealItems(commit, data.items, id);
				if (!items) {
					commit("SET_NOTIFICATION", { msg: "Failed to add meal items", error: 1 });
					commit("UPDATE_LOADING");
					return 0;
				}
				const res = await axios({
					url: process.env.VUE_APP_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						query { 
							getMeal (mealId: "${id}") {
								_id
								name
								enabled
								createdAt
								user {
									username
									_id
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
						`
					}
				});
				commit('UPDATE_PERCENTAGE', null);
				if (res.data.errors) {
					commit("SET_NOTIFICATION", { msg: "Failed to add meal", error: 1 });
				}
				else {
					commit('EMIT_ADD_MEAL', res.data.data.getMeal._id);
					commit('ADD_MEAL', res.data.data.getMeal);
					commit("SET_NOTIFICATION", { msg: "Meal added successfully!", error: 0 });
				}
				commit("UPDATE_LOADING");
				return 1;
			} catch (error) {
				console.log(error)
				commit('UPDATE_PERCENTAGE', null);
				commit("SET_NOTIFICATION", { msg: "Could not add the meal", error: 1 });
				commit("UPDATE_LOADING");
				return 0;
			}
		},
		async submitVotes({ commit }, data) {
			try {
				commit("UPDATE_LOADING")
				let votes = "[";
				data.votes.forEach(vote => {
					votes += `{vote: "${vote.vote}", meal_item_id: "${vote.meal_item_id}", report: "${vote.report}"}`
				});
				votes += "]";
				const res = await axios({
					url: process.env.VUE_APP_GRAPHQL_API,
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
				if (res.data.errors)
					commit("SET_NOTIFICATION", { msg: res.data.errors[0].message, error: 1 });
				else {
					commit('EMIT_ADD_VOTE', res.data.data.addVotes._id);
					commit('UPDATE_MEAL', res.data.data.addVotes);
					commit("SET_NOTIFICATION", { msg: "Votes submited successfully!", error: 0 });
				}
				commit("UPDATE_LOADING")
				return "success";
			} catch (error) {
				console.log(error);
				commit("SET_NOTIFICATION", { msg: "Could not submit the votes", error: 1 });
				commit("UPDATE_LOADING")
			}
		},
		async createUser({ commit }, code) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: process.env.VUE_APP_GRAPHQL_API,
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
				if (res.data.errors)
					commit("SET_NOTIFICATION", { msg: res.data.errors[0].message, error: 1 });
				else {
					commit("LOGIN", res.data.data.createUser)
					commit("SET_NOTIFICATION", { msg: "Logged in successfully!", error: 0 });
				}
				commit("UPDATE_LOADING")
				return "1";
			} catch (error) {
				console.log(error)
				commit("UPDATE_LOADING")
				commit("SET_NOTIFICATION", { msg: error, error: 1 });
			}
		},
		async getUser({ commit }, id) {
			try {
				commit("UPDATE_LOADING")

				const res = await axios({
					url: process.env.VUE_APP_GRAPHQL_API,
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
				commit("UPDATE_LOADING")
				commit("SET_NOTIFICATION", { msg: "Server error", error: 1 });
			}
		},
		async deleteMeal({ commit }, id) {
			try {
				commit("UPDATE_LOADING")
				const res = await axios({
					url: process.env.VUE_APP_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
						mutation { 
							deleteMeal (mealId: "${id}")
						}
						`
					}
				});
				if (res.data.errors)
					commit("SET_NOTIFICATION", { msg: res.data.errors, error: 1 });
				else {
					if (res.data.data.deleteMeal) {
						commit("EMIT_DELETE_MEAL", id)
						commit("DELETE_MEAL", id)
						commit("SET_NOTIFICATION", { msg: "Meal deleted Successfully!", error: 0 });
					}
					else
						commit("SET_NOTIFICATION", { msg: "Cannot delete this meal..", error: 1 });
				}
				commit("UPDATE_LOADING")
			} catch (error) {
				commit("UPDATE_LOADING")
				commit("SET_NOTIFICATION", { msg: "Cannot delete this item..", error: 1 });
			}
		},
		async checkAddMeal({ commit }) {
			try {
				const res = await axios({
					url: process.env.VUE_APP_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
								query { 
									checkAddMeal 
								}
							`
					}
				});
				commit("SET_ADDMEAL", res.data.data.checkAddMeal);
			} catch (error) {
				commit("SET_NOTIFICATION", { msg: "Server error", error: 1 });
			}
		},
		async exportMeal({ commit }, id) {
			try {
				const res = await axios({
					url: process.env.VUE_APP_GRAPHQL_API,
					method: 'post',
					data: {
						query: `
								query { 
									getMealExport(mealId: "${id}") {
										mealName
										mealName
										itemName
										votes_up
										votes_down
										user
										vote
										report
										voteDate
										mealDate
									}
								}
							`
					}
				});
				commit("EXPORT_CSV", res.data.data.getMealExport);
			} catch (error) {
				console.log(error)
				commit("SET_NOTIFICATION", { msg: "Server error", error: 1 });
			}
		},
		async connectSocket({ commit }, token) {
			try {
				commit("SET_SOCKET", token);
				// commit("SOCKET_LISTENERS")
			} catch (error) {
				console.log(error);
			}
		}
	},
}