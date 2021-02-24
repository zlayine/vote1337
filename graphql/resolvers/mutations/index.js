const meal = require('./meal.js')
const user = require('./user.js')
const vote = require('./vote.js')
const models = require('../../../models')
const { updateConfig } = require('../../../helpers/config.js');

module.exports = {
	RootMutation: {
		...meal,
		...user,
		...vote,
		updateConfig: async (root, args, cntx, req) => {
			// if (!cntx.isAuth)
				// throw new Error('Unauthenticated');
			try {
				let data = JSON.parse(args.configData);
				const user = await models.User.findById(cntx.userId);
				if (!user.staff)
					throw new Error('Action not permitted..');
				updateConfig(data);
			} catch (error) {
				throw error;
			}
		}
	}
}