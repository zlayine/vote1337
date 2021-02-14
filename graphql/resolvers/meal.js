const models = require('../../models')
const fs = require('fs');
const patho = require('path');
const { transformMeal } = require('./merge');
const moment = require('moment');
const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");

//clean database;
// const t = await models.MealItem.find().populate('votes');
// 			for (let i = 0; i < t.length; i++) {
// 				for (let j = 0; j < t[i].votes.length; j++) {
// 					await t[i].votes[j].delete();
// 				}
// 				await t[i].delete();
// 			}

const compressImage = async (dir, name) => {
	const file = await imagemin([dir + "tmp/" + name], {
		destination: dir,
		plugins: [
			imageminMozjpeg({ quality: 50 })
		]
	});
	const path = dir + "tmp/" + name;
	try {
		fs.unlinkSync(path)
	} catch (err) {
		console.error(err)
		throw err;
	}
	return file;
};

const storeFS = ({ stream, generatedName }) => {
	const uploadDir = patho.resolve("./public/meals/tmp");
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

const enableVoting = async (meal) => {
	// return true;
	const latest = await models.Meal.findOne().sort({ createdAt: 'desc' });
	if (latest.id != meal._id)
		return false;
	let now = moment();
	let mealDate = moment(new Date(meal.createdAt));
	let diff = now.diff(mealDate, 'hours');
	if (diff > 3)
		return false;
	return true;
}

const checkAddMeal = async () => {
	// return true;
	try {
		const meal = await models.Meal.findOne().sort({ createdAt: 'desc' });
		let now = moment();
		// let now = moment(moment("17:45:00", "HH:mm:ss").toDate());
		if (meal) {
			let mealDate = moment(new Date(meal.createdAt));
			let mealStart = moment(moment("11:00:00", "HH:mm:ss").toDate());
			let mealToStartDiff = mealDate.diff(mealStart, "minutes");
			if (mealToStartDiff >= 0) {
				mealStart = moment(moment("16:45:00", "HH:mm:ss").toDate());
				mealToStartDiff = mealDate.diff(mealStart, "minutes");
			}
			let nowToStartDiff = now.diff(mealStart, "minutes");
			console.log("createed at", meal.createdAt);
			console.log("meal start", mealStart);
			console.log("now", now);
			console.log("now diff", nowToStartDiff);
			console.log("meal diff", mealToStartDiff);

			if (nowToStartDiff >= 0 && mealToStartDiff < 0) {
				return true;
			}
			return false;
		} else {
			let mealStart = moment(moment("12:00:00", "HH:mm:ss").toDate());
			let nowToStartDiff = now.diff(mealStart, "minutes");
			if (nowToStartDiff >= 0 && nowToStartDiff < 4 * 60) return true;
			else {
				mealStart = moment(moment("17:45:00", "HH:mm:ss").toDate());
				nowToStartDiff = now.diff(mealStart, "minutes");
				if (nowToStartDiff >= 0 && nowToStartDiff < 3 * 60) return true;

			}
			return false;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
}

module.exports = {
	getMeals: async (args) => {
		try {
			const page = args.page;
			const count = parseInt(await models.Meal.count() / 2);
			console.log(count);
			const meals = await models.Meal.find().sort({ createdAt: 'desc' }).skip((page - 1) * 2).limit(2);
			const res = meals.map(e => {
				return transformMeal(e)
			});
			if (res.length)
				res[0].enabled = await enableVoting(res[0]);
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
	getMeal: async (args) => {
		try {
			const meal = await models.Meal.findById(args.mealId);
			return transformMeal(meal, await enableVoting(meal));
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	createMeal: async (args, req) => {
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
			return transformMeal(result, enableVoting(result));
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
	checkAddMeal: async (args, req) => {
		// return true;
		if (!req.isAuth)
			return false;
		return await checkAddMeal();
	},
	deleteMeal: async (args, req) => {
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
	}


}