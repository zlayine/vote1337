const meal = require('./meal.js')
const user = require('./user.js')
const report = require('./report.js')

module.exports = {
	RootQuery: {
		...meal,
		...user,
		...report,
	},
}