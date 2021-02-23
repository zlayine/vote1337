const meal = require('./meal.js')
const user = require('./user.js')
const report = require('./report.js');
const { config } = require('../../../helpers/config.js');

module.exports = {
	RootQuery: {
		...meal,
		...user,
		...report,
		getConfig: async (root, args, cntx, req) => {
			if (!cntx.isAuth)
				throw new Error('Unauthenticated');
			return config;
		},
	},
}