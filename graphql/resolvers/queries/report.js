const models = require('../../../models')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const { transformReport } = require("../merge");

module.exports = {
	getReports: async (root, args, cntx, req) => {
		if (!cntx.isAuth)
			throw new Error('Unauthenticated');
		try {
			const user = await models.User.findById(cntx.userId);
			if (!user.staff)
				throw new Error('You don\'t have permission for this action');
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
			return reports.map(e => {
				return transformReport(e)
			});
		} catch (err) {
			console.log(err);
			throw err
		}
	},
}