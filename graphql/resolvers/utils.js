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
	const mealTimes = getConfig().times;
	console.log(mealTimes);
	try {
		const meal = await models.Meal.findOne({ campus: campus }).sort({ createdAt: 'desc' });
		let now = moment().tz("Africa/Casablanca");
		console.log("now", now);
		// now = moment(moment("16:00:00", "HH:mm:ss").toDate());
		if (meal) {
			let mealDate = moment(new Date(meal.createdAt));
			let mealStart = moment(moment(mealTimes[campus].lunch, "HH:mm").toDate());
			let mealToStartDiff = mealDate.diff(mealStart, "minutes");
			console.log(mealToStartDiff);
			if (mealToStartDiff >= 0) {
				mealStart = moment(moment(mealTimes[campus].dinner, "HH:mm").toDate());
				mealToStartDiff = mealDate.diff(mealStart, "minutes");
			}
			let nowToStartDiff = now.diff(mealStart, "minutes");
			console.log(nowToStartDiff);
			if (nowToStartDiff >= 0 && mealToStartDiff < 0) {
				return true;
			}
			return false;
		} else {
			let mealStart = moment(moment(mealTimes[campus].lunch, "HH:mm").toDate());
			let nowToStartDiff = now.diff(mealStart, "minutes");
			console.log(nowToStartDiff);
			if (nowToStartDiff >= 0 && nowToStartDiff < 4 * 60) return true;
			else {
				mealStart = moment(moment(mealTimes[campus].dinner, "HH:mm").toDate());
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
