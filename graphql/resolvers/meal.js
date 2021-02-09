const models = require('../../models')
const fs = require('fs');
const { transformMeal } = require('./merge');


const storeFS = ({ stream, filename }) => {
	const uploadDir = '/Users/zouheir/Desktop/Web/vote1337/voteApi/public/meals';
	const path = `${uploadDir}/${filename}`;
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

const createMealItem = async (item, mealId) => {
	const { filename, mimetype, createReadStream } = await item.image.file;
	const stream = createReadStream();
	const pathObj = await storeFS({ stream, filename });
	const fileLocation = pathObj.path;
	const mealItem = new models.MealItem({
		name: item.name,
		image_url: fileLocation,
		meal: mealId
	});
	const result = await mealItem.save();
	return result;
}

module.exports = {
	getMeals: async (args) => {
		try {
			const page = args.page;
			const count = await models.Meal.count();
			const meals = await models.Meal.find().skip((page - 1) * 10).limit(10);
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
	createMeal: async (args, req) => {
		// if (!req.isAuth)
		// 	throw new Error('Unauthenticated');
		try {
			const meal = new models.Meal({
				name: args.mealInput.name,
				user: "60200e78d89b4f1f4b27105b",
				// user: req.userId
			});
			const result = await meal.save();
			args.mealInput.items.forEach(async item => {
				let res = await createMealItem(item, result.id);
				result.meals.push(res);
				await result.save();
			});
			return transformMeal(result);
		} catch (err) {
			console.log(err);
			throw err;
		}
	}
	

}