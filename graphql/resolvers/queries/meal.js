const models = require('../../../models')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const { transformMeal, transformExport } = require('../merge');
const { enableMealVoting, checkAddMeal } = require('../utils');
const socket = require('../../../socket')

module.exports = {
	getMeals: async (root, args, cntx, req) => {
		if (!cntx.isAuth)
			throw new Error('Unauthenticated');
		try {
			const limit = 10;
			const page = args.page;
			const count = parseInt(await models.Meal.count() / limit);
			const meals = await models.Meal.find().sort({ createdAt: 'desc' }).skip((page - 1) * limit).limit(limit);
			const res = meals.map(e => {
				return transformMeal(e)
			});
			// socket.publish('MEAL_FETCH', {
			// 	mealFetched: "hello"
			// })
			if (res.length)
				res[0].enabled = await enableMealVoting(res[0]);
			return {
				page: +page,
				meals: res,
				totalPages: !count ? 1 : count + 1
			}
		} catch (err) {
			console.log(err);
			throw err
		}
	},
	getMeal: async (root, args, cntx, req) => {
		if (!cntx.isAuth)
			throw new Error('Unauthenticated');
		try {
			const meal = await models.Meal.findById(args.mealId);
			return transformMeal(meal, await enableMealVoting(meal));
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	checkAddMeal: async (root, args, cntx, req) => {
		return true;
		if (!cntx.isAuth)
			return false;
		return await checkAddMeal();
	},
	getMealExport: async (root, args, cntx, req) => {
		// if (!cntx.isAuth)
		// 	throw new Error('Unauthenticated');
		try {

			const res = await models.Meal.aggregate([
				{ $match: { _id: ObjectId(args.mealId) } },
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
				{ $unwind: "$user" },
				{ $project: { "name": 1, "meals.name": 1, "votes.vote": 1, "votes.report": 1, "meals.votes_up": 1, "meals.votes_down": 1, "createdAt": 1, "votes.createdAt": 1, "user.username": 1} }
			]);
			return res.map(v => {
				return transformExport(v)
			});
		} catch (err) {
			console.log(err);
			throw err;
		}
	}
}
