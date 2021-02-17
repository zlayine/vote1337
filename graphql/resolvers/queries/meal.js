const models = require('../../../models')
const { transformMeal } = require('../merge');
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
			socket.publish('MEAL_FETCH', {
				mealFetched: "hello"
			})
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
			const res = await models.Vote.aggregate([
				{ $lookup: {from: 'users', localField: 'user', foreignField: '_id', as: 'user'} },
				{ $unwind: "$user" },
				{ $lookup: {from: 'mealitems', localField: 'meal_item', foreignField: '_id', as: 'meal_item'} },
				{ $unwind: "$meal_item" },
				{ $lookup: {from: 'meals', localField: 'meal_item.meal', foreignField: '_id', as: 'meal'} },
				{ $unwind: "$meal" },


			]);
			console.log(res);
			// return transformExport(res);
		} catch (err) {
			console.log(err);
			throw err;
		}
	}
}
