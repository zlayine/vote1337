const models = require('../../../models')
const { transformMeal } = require("../merge");
const moment = require('moment');

const createVote = async (data, userId) => {
	try {
		const voteData = new models.Vote({
			vote: data.vote,
			meal_item: data.meal_item_id,
			report: data.report,
			user: userId
		});
		const resVote = await voteData.save();
		const mealItem = await updateMealItemVote(data.vote, data.meal_item_id, data.report);
		mealItem.votes.push(resVote);
		await mealItem.save();
		return "1";
	} catch (error) {
		console.log(error)
	}
}

const updateMealItemVote = async (vote, id, report) => {
	try {
		const mealitem = await models.MealItem.findById(id);
		if (vote == "up")
			mealitem.votes_up += 1;
		else
			mealitem.votes_down += 1;
		if (report != "")
			mealitem.reports += 1;
		return await mealitem.save();;
	} catch (error) {
		console.log(error);
	}
}

const checkMeal = async (id) => {
	try {
		const meal = await models.Meal.findById(id);
		let now = moment();
		let mealDate = moment(new Date(meal.createdAt));
		let diff = now.diff(mealDate, 'hours');
		if (diff > 23)
			return false;
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

const checkUserVoted = async (meal, userId) => {
	try {
		const vote = await models.MealItem.findOne({ meal: meal }).populate({ path: 'votes', match: { user: userId } })
		if (vote.votes.length)
			return true;
		return false;
	} catch (error) {
		console.log(error);
		return true;
	}
}

module.exports = {
	addVotes: async (root, args, cntx, req) => {
		if (!cntx.isAuth)
			throw new Error('Unauthenticated.');
		try {
			let items = args.voteInput;
			if (!(await checkMeal(args.meal)))
				throw new Error('Meal does not accept votes.')
			if (await checkUserVoted(args.meal, cntx.userId))
				throw new Error('You\'ve already voted for this meal.')
			for (let i = 0; i < items.length; i++) {
				await createVote(items[i], cntx.userId);
			}
			const result = await models.Meal.findById(args.meal);
			return transformMeal(result);
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
}