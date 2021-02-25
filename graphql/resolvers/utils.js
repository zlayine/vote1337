const models = require('../../models')
const fs = require('fs');
const patho = require('path');
const moment = require('moment-timezone');
const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const jwt = require('jsonwebtoken');
const { transformUser } = require('./merge');
const env = require('../../environment');
const { getConfig } = require('../../helpers/config');

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

const enableMealVoting = async (meal) => {
	// return true;
	const latest = await models.Meal.findOne({ campus: meal.campus }).sort({ createdAt: 'desc' });
	if (latest.id != meal._id)
		return false;
	let now = moment();
	let mealDate = moment(new Date(meal.createdAt));
	let diff = now.diff(mealDate, 'hours');
	if (diff > getConfig().voting)
		return false;
	return true;
}

const checkAddMeal = async (campus) => {
	// return true;
	let debug = 0;
	const mealTimes = getConfig().times;
	try {
		const meal = await models.Meal.findOne({ campus: campus }).sort({ createdAt: 'desc' });
		let now = moment().tz("Africa/Casablanca");
		let mealTime = mealTimes[campus].lunch.split(':');
		let mealStart = moment.tz("Africa/Casablanca").set({ hours: mealTime[0], minutes: mealTime[1], seconds: 0 });

		if (debug) now.set({ hours: 12, minutes: 0 });
		if (debug) console.log("now", now);

		if (meal) {
			let mealDate = moment(new Date(meal.createdAt));
			let mealToStartDiff = mealDate.diff(mealStart, "minutes");
			if (mealToStartDiff >= 0) {
				mealTime = mealTimes[campus].dinner.split(':');
				mealStart = moment.tz("Africa/Casablanca").set({ hours: mealTime[0], minutes: mealTime[1], seconds: 0 });
				mealToStartDiff = mealDate.diff(mealStart, "minutes");
			}
			let nowToStartDiff = now.diff(mealStart, "minutes");

			if (debug) console.log("mealstart ", mealToStartDiff)
			if (debug) console.log("nowstart ", nowToStartDiff)
			
			if (nowToStartDiff >= 0 && mealToStartDiff < 0)
				return true;
			return false;
		} else {
			let nowToStartDiff = now.diff(mealStart, "minutes");
			if (nowToStartDiff >= 0 && nowToStartDiff < 4 * 60)
				return true;
			else {
				mealTime = mealTimes[campus].dinner.split(':');
				mealStart = moment.tz("Africa/Casablanca").set({ hours: mealTime[0], minutes: mealTime[1], seconds: 0 });
				nowToStartDiff = now.diff(mealStart, "minutes");
				if (nowToStartDiff >= 0 && nowToStartDiff < 3 * 60)
					return true;
			}
			return false;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
}

const loginUser = async (userId) => {
	const user = await models.User.findOne({ _id: userId });
	if (!user)
		throw new Error('User does not exist');
	const token = jwt.sign({ userId: user.id, email: user.email }, env.process.JWT_PKEY, {
		expiresIn: '3500h'
	});
	return { user: transformUser(user), token: token }
}

exports.enableMealVoting = enableMealVoting;
exports.checkAddMeal = checkAddMeal;
exports.storeFS = storeFS;
exports.compressImage = compressImage;
exports.loginUser = loginUser;
