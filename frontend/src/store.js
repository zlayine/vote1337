import axios from 'axios'

import {getLocalUser} from './auth.js';

const user = getLocalUser();

export default {
    state: {
        brands: [],
        currentUser: user,
        isLogged: !!user,
    },
    getters: {
        brands: state => state.brands,
        currentUser: state => state.currentUser,
        isLogged: state => state.isLogged,
    },
    mutations: {
        LOGIN(state, payload){
            state.isLogged = true;
            state.currentUser = Object.assign({}, payload.user, {token: payload.access_token});
            localStorage.setItem("user", JSON.stringify(state.currentUser));
            axios.defaults.headers.common["Authorization"] = `Bearer ${state.currentUser.token}`
        },
        LOGOUT(state) {
            localStorage.removeItem("user");
            state.isLogged = false;
            state.currentUser = null;
        },
        UPDATE_BRANDS(state, payload){
            state.brands = payload;
        },
    },
    actions: {
        getBrands({commit}){
            return new Promise((resolve, error) => {
                axios.get('/api/brands')
                .then((res) => {
                    commit('UPDATE_BRANDS', res.data.brands);
                    resolve(res);
                })
				.catch( err => {
					console.log(err);
					error(err)
				})
            });
        },
    }
}