const models = require('../../../models')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const { transformReport } = require("../merge");

module.exports = {
	getReports: async (root, args, cntx, req) => {
		try {
			// const count = parseInt(await models.Report.count() / 10);
			// const reports = await models.Report.find({ meal: args.meal }).skip((page - 1) * 10).limit(10);
			console.log(args.meal)
			const reports = await models.Vote.aggregate([
				{
					$lookup: {
						from: 'mealitems', let: { "mealitems": "$mealitems" }, pipeline: [
							{ $match: { meal: ObjectId(args.meal) } }
						], as: "mealitems"
					},
				},
				{ $match: { "report": { "$ne": '' } } },
				{ $project: { meal_item: 1, report: 1, createdAt: 1, user: 1, _id: 1 } }
			]);
			console.log(reports);
			return reports.map(e => {
				return transformReport(e)
			});
		} catch (err) {
			console.log(err);
			throw err
		}
	},
}