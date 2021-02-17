const models = require('../../../models')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const { transformReport } = require("../merge");

module.exports = {
	getReports: async (root, args, cntx, req) => {
		try {
			// const count = parseInt(await models.Report.count() / 10);
			// const reports = await models.Report.find({ meal: args.meal }).skip((page - 1) * 10).limit(10);
			// console.log(args.meal)
			const reports = await models.Meal.aggregate([
				{ $match: { _id: ObjectId(args.meal) } },
				{
					$lookup: {
						from: 'mealitems',
						let: { meals: "$meals" },
						pipeline: [
							{ $match: { $expr: { $in: ["$_id", "$$meals"] } } }
						], as: "meals"
					},
				},
				{ $unwind: "$meals" },
				{
					$lookup: {
						from: 'votes',
						let: { votes: "$meals.votes" },
						pipeline: [
							{ $match: { $expr: { $in: ["$_id", "$$votes"] } } },
						], as: "votes"
					}
				},
				{ $unwind: "$votes" },
				{ $lookup: { from: 'users', localField: 'votes.user', foreignField: '_id', as: 'user' } },
				{ $match: { "votes.report": { "$ne": '' } } },
				{ $project: { "votes.meal_item": 1, "votes.report": 1, "votes.createdAt": 1, "user": 1, "votes._id": 1 } }
			]);
			console.log("reports", reports);
			return reports.map(e => {
				return transformReport(e)
			});
		} catch (err) {
			console.log(err);
			throw err
		}
	},
}