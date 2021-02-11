const models = require('../../models')
const fs = require('fs');
const patho = require('path');
const { transformMeal } = require('./merge');
const moment = require('moment');

const storeFS = ({ stream, generatedName }) => {
	const uploadDir = patho.resolve("./public/meals");
	const path = `${uploadDir}/${generatedName}`;
	return new Promise((resolve, reject) =>
		stream
			.on('error', error => {
				if (stream.truncated)
					fs.unlinkSync(path);
				reject(error);
			})
			.pipe(fs.createWriteStream(path))
			.on('error', error => reject(error))
			.on('finish', () => resolve({ path }))
	);
}

const checkMeal = async () => {
	try {
		const meal = await models.Meal.findOne().sort({ createdAt: 'desc' });
		let now = moment();
		let mealDate = moment(new Date(meal.created));
		let diff = now.diff(mealDate, 'hours');
		if (diff > 3)
			return true;
		return false;
	} catch (error) {
		console.log(error);
		return false;
	}
}

module.exports = {
	getMeals: async (args) => {
		try {
			const page = args.page;
			const count = await models.Meal.count();
			const meals = await models.Meal.find().sort({ createdAt: 'desc' }).skip((page - 1) * 10).limit(10);
			const res = meals.map(e => {
				return transformMeal(e)
			});
			return {
				page: +page,
				meals: res,
				totalPages: parseInt(count / 10) + 1
			}
		} catch (err) {
			console.log(err);
			throw err
		}
	},
	getMeal: async (args) => {
		try {
			const meal = await models.Meal.findById(args.mealId);
			return transformMeal(meal);
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	createMeal: async (args, req) => {
		if (!req.isAuth)
			throw new Error('Unauthenticated');
		try {
			const meal = new models.Meal({
				name: args.mealName,
				user: req.userId
			});
			const result = await meal.save();
			return transformMeal(result);
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	createMealItem: async (args, req) => {
		if (!req.isAuth)
			throw new Error('Unauthenticated');
		try {
			const meal = await models.Meal.findById(args.input.meal);
			const { filename, createReadStream } = await args.input.image.file;
			const { ext } = await patho.parse(filename);
			const generatedName = args.input.meal + "_" + args.input.name + "_" + parseInt(Math.random() * 1000000) + ext;

			const stream = createReadStream();
			await storeFS({ stream, generatedName });
			const dir = "public/meals/" + generatedName;

			const mealItem = new models.MealItem({
				name: args.input.name,
				image_url: dir,
				meal: args.input.meal
			});
			const res = await mealItem.save();
			meal.meals.push(res);
			await meal.save();
			return "success";
		} catch (err) {
			console.log(err)
		}
	}


}