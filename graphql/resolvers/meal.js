const models = require('../../models')
const fs = require('fs');
const patho = require('path');
const { transformMeal } = require('./merge');


const storeFS = ({ stream, generatedName }) => {
	const uploadDir = patho.resolve("./public/meals");
	const path = `${uploadDir}/${generatedName}`;
	
	// console.log(path);
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
	// console.log(item.image.file)
	const { filename, mimetype, createReadStream } = await item.image.file;
	const { ext } = await patho.parse(filename);
	const generatedName = mealId + "_" + item.name + "_" + parseInt(Math.random() * 1000000) + ext;

	const stream = createReadStream();
	const pathObj = await storeFS({ stream, generatedName });
	console.log(pathObj);
	// const fileLocation = pathObj.path;
	const dir = "public/meals/" + generatedName;
	const mealItem = new models.MealItem({
		name: item.name,
		image_url: dir,
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