const meal = require('./meal.js')
const user = require('./user.js')
const vote = require('./vote.js')

module.exports = {
	RootMutation: {
		...meal,
		...user,
		...vote,
	},
}