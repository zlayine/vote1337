const { dateToString } = require('../../helpers/date');
const models = require('../../models')
const env = require('../../environment')

const mealResolver = async mealId => {
	try {
		const meal = await models.Meal.findById(mealId)
		return transformMeal(meal);
	} catch (err) {
		throw err;
	}
};

const mealItemsResolver = async mealItemsIds => {
	try {
		const items = await models.MealItem.find({ _id: { $in: mealItemsIds } })
		return items.map(e => {
			return transformMealItem(e)
		})
	} catch (err) {
		throw err;
	}
};


const mealItemResolver = async mealItemId => {
	try {
		const item = await models.MealItem.findById(mealItemId);
		return transformMealItem(item)
	} catch (err) {
		throw err;
	}
}

const reportsResolver = async reportIds => {
	try {
		const reports = await models.Report.find({ _id: { $in: reportIds } })
		return reports.map(e => {
			return transformReport(e)
		})
	} catch (err) {
		throw err;
	}
}

const votesResolver = async voteIds => {
	try {
		const votes = await models.Vote.find({ _id: { $in: voteIds } })
		return votes.map(e => {
			return transformVote(e)
		})
	} catch (err) {
		throw err;
	}
}

const userResolver = async userId => {
	try {
		const user = await models.User.findById(userId)
		return transformUser(user);
	} catch (err) {
		console.log(err);
		throw err;
	}
};

const transformMeal = (meal, enabled = false) => {
	return {
		...meal._doc,
		_id: meal.id,
		meals: mealItemsResolver.bind(this, meal._doc.meals),
		reports: reportsResolver.bind(this, meal._doc.reports),
		user: userResolver.bind(this, meal._doc.user),
		enabled: enabled,
		createdAt: dateToString(meal.createdAt),
		updatedAt: dateToString(meal.updatedAt),
	}
};

const transformMealItem = (item) => {
	return {
		...item._doc,
		_id: item.id,
		meal: mealResolver.bind(this, item._doc.meal),
		votes: votesResolver.bind(this, item._doc.votes),
		image_url: env.process.SERVER_URL + item._doc.image_url,
		createdAt: dateToString(item._doc.createdAt),
		updatedAt: dateToString(item._doc.updatedAt),
	}
};

const transformReport = (report) => {
	return {
		_id: report._id,
		user: userResolver.bind(this, report.user),
		meal_item: mealItemResolver.bind(this, report.meal_item),
		report: report.votes.report,
		createdAt: dateToString(report.votes.createdAt),
	}
};

const transformExport = (data) => {
	return {
		mealName: data.meal.name,
		itemName: data.meal_item.name,
		votes_up: data.meal_item.votes_up,
		votes_down: data.meal_item.votes_down,
		user: data.user.username,
		vote: data.vote,
		report: data.report,
		createdAt: data.createdAt,
		mealDate: data.meal.createdAt,
	}
};

const transformVote = (vote) => {
	return {
		...vote._doc,
		_id: vote.id,
		meal_item: mealItemResolver.bind(this, vote._doc.meal_item),
		user: userResolver.bind(this, vote._doc.user),
		report: null,
		createdAt: dateToString(vote._doc.createdAt),
		updatedAt: dateToString(vote._doc.updatedAt),
	}
};

const transformUser = (user) => {
	return {
		...user._doc,
		_id: user.id,
	};
}

exports.transformUser = transformUser;
exports.transformMeal = transformMeal;
exports.transformMealItem = transformMealItem;
exports.transformReport = transformReport;
exports.transformVote = transformVote;
exports.transformExport = transformExport;