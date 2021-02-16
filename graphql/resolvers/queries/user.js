const models = require('../../../models');
const { loginUser } = require('../utils');
const { transformUser } = require("../merge");

module.exports = {
	login: async (root, { userId }) => {
		return loginUser(userId);
	},
	getUser: async (root, args, cntx, req) => {
		try {
			const user = await models.User.findOne({ _id: args.userId });
			if (!user)
				throw new Error('User does not exist');
			else
				return transformUser(user);
		} catch (err) {
			console.log(err)
			throw err;
		}
	}
}