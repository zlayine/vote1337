const models = require('../../models')
const fs = require('fs');
const { transformMeal } = require('./merge');


const storeFS = ({ stream, filename }) => {
    const uploadDir = '../../public/meals';
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
    const { filename, mimetype, createReadStream } = await item.file;
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
			const meals = await models.Meal.findAll({
				offset: (page - 1) * 10,
				limit: count / 10
			});
			meals = meals.map(e => {
				return transformMeal(e)
			});
			return {
				page: page,
				meals: meals,
				totalPages: 1
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
				user: ""
				// user: req.userId
			});
			const result = await meal.save();
			args.mealInput.items.forEach(item => {
				let item = await createMealItem(item, result.id);
				meal.meals.push(item);
			});
			// let items = await createMealItems(args.mealInput.items, result.id);
			// createdEvent = transformEvent(result)
			// const user = await User.findById('601d724af9be5b7860eb25bf');
			// const result = await meal.save();
			return transformMeal(result);
		} catch (err) {
			console.log(err);
			throw err;
		}
	},


}