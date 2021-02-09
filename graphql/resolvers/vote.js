const models = require('../../models/index')
const { transformVote, transformMeal } = require("./merge");

const createReport = async (data, meal) => {
	try {
		const reportData = new models.Report({
			description: data.report,
			meal_item: data.meal_item_id,
			meal: meal,
			user: "60200e78d89b4f1f4b27105b",
			// user: req.userId
		});
		await reportData.save();
		return "1"
	} catch (error) {
		console.log(error);
	}
}

const createVote = async (data) => {
	try {
		const voteData = new models.Vote({
			vote: data.vote,
			meal_item: data.meal_item_id,
			user: "60200e78d89b4f1f4b27105b",
			// user: req.userId
		});
		await voteData.save();
		await updateMealItemVote(data.vote, data.meal_item_id);
		return "1";
	} catch (error) {
		console.log(error)
	}
}

const updateMealItemVote = async (vote, id) => {
	try {
		const mealitem = await models.MealItem.findById(id);
		if (vote == "up")
			mealitem.votes_up += 1;
		else
			mealitem.votes_down += 1;
		await mealitem.save();
		return "1";
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	addVotes: async (args) => {
		// if (!req.isAuth)
		// 	throw new Error('Unauthenticated');
		try {
			args.voteInput.forEach(async item => {
				await createVote(item);
				await createReport(item, args.meal);
			});
			const result = await models.Meal.findById(args.meal);
			return transformMeal(result);
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
}