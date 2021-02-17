const models = require('../../../models')
const fs = require('fs');
const patho = require('path');
const { transformMeal } = require('../merge');
const socket = require('../../../socket')

// clean database;
// const t = await models.MealItem.find().populate('votes');
// 			for (let i = 0; i < t.length; i++) {
// 				for (let j = 0; j < t[i].votes.length; j++) {
// 					await t[i].votes[j].delete();
// 				}
// 				await t[i].delete();
// 			}

module.exports = {
	createMeal: async (root, args, cntx, req) => {
		if (!req.isAuth)
			throw new Error('Unauthenticated');
		try {

			if (!await checkAddMeal())
				throw new Error('Today\'s meal already exists.');
			if (args.mealName == "null" || args.mealName == "")
				throw new Error('Meal name is required');
			const meal = new models.Meal({
				name: args.mealName,
				user: req.userId
			});
			const result = await meal.save();
			socket.publish('MEAL_CREATED', {
				mealCreated: transformMeal(result, enableVoting(result))
			})
			return transformMeal(result, enableVoting(result));
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	createMealItem: async (root, args, cntx, req) => {
		if (!req.isAuth)
			throw new Error('Unauthenticated');
		try {
			const meal = await models.Meal.findById(args.input.meal);
			const { filename, createReadStream } = await args.input.image.file;
			const { ext } = await patho.parse(filename);
			const generatedName = args.input.meal + "_" + args.input.name + "_" + parseInt(Math.random() * 1000000) + ext;
			const stream = createReadStream();
			await storeFS({ stream, generatedName });
			const dir = "public/meals/";
			await compressImage(dir, generatedName)
			const mealItem = new models.MealItem({
				name: args.input.name,
				image_url: dir + generatedName,
				meal: args.input.meal
			});
			const res = await mealItem.save();
			meal.meals.push(res);
			await meal.save();
			return "success";
		} catch (err) {
			console.log(err)
			throw err;
		}
	},
	deleteMeal: async (root, args, cntx, req) => {
		if (!req.isAuth)
			throw new Error('Unauthenticated');
		try {
			const user = await models.User.findById(req.userId);
			const meal = await models.Meal.findById({ _id: args.mealId }).populate({
				path: 'meals',
				populate: {
					path: 'votes',
				}
			});
			if (meal.user != req.userId && !user.staff)
				throw new Error('You are not the owner of the meal')
			for (let i = 0; i < meal.meals.length; i++) {
				let item = meal.meals[i];
				for (let j = 0; j < item.votes.length; j++) {
					let vote = item.votes[j];
					await vote.delete();
				}
				try {
					fs.unlinkSync(item.image_url);
				} catch (err) {
					console.error(err)
					throw err;
				}
				await item.delete();
			}
			await meal.delete();
			if (meal)
				return true;
			else
				return false;
		} catch (err) {
			throw err;
		}
	},
}