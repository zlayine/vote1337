const models = require('../../models/index')
const { transformVote } = require("./merge");

module.exports = {
	addVote: async (args) => {
		try {
			const page = args.page;
			const count = await models.Report.count();
			const reports = await models.Report.find().skip((page - 1) * 10).limit(10);
			const res = reports.map(e => {
				return transformReport(e)
			});
			return {
				page: +page,
				reports: res,
				totalPages: parseInt(count / 10) + 1
			}
		} catch (err) {
			console.log(err);
			throw err
		}
	},
	addVote: async (args) => {
		// if (!req.isAuth)
		// 	throw new Error('Unauthenticated');
		try {
			const voteData = new models.Vote({
				vote: args.voteInput.vote,
				meal_item: args.voteInput.meal_item,
				user: "60200e78d89b4f1f4b27105b",
				// user: req.userId
			});
			const result = await voteData.save();
			return transformVote(result);
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
}