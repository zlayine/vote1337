const models = require('../../../models')
const axios = require('axios');
const env = require('../../../environment');
const { loginUser } = require('../utils');

const request_token = async (code) => {
	try {
		const res = await axios.post("https://api.intra.42.fr/oauth/token", {
			grant_type: "authorization_code",
			client_id: env.process.CLIENT_ID_42,
			client_secret: env.process.CLIENT_SECRET_42,
			code: code,
			redirect_uri: env.process.CLIENT_REDIRECT_42
		})
		// console.log(res.data.access_token);
		return res.data.access_token;
	} catch (err) {
		console.log("rq token error: ", err);
		throw err;
		return null;
	}
}

const request_data = async (token) => {
	try {
		const res = await axios.get("https://api.intra.42.fr/v2/me", {
			headers: {
				"Authorization": `Bearer ${token}`
			}
		})
		// console.log(resx.data);
		return res.data;
	} catch (err) {
		console.log(err);
		console.log("rq data error: ", err);
		throw err;
		return null
	}
}

const getUserCampus = (data) => {
	let primary = data.campus_users.filter(c => c.is_primary == true)[0].campus_id;
	return data.campus.filter(c => c.id == primary)[0].name;
}

module.exports = {
	createUser: async (root, args, cntx, req) => {
		try {
			const token = await request_token(args.code);
			const data = await request_data(token);
			if (!token || !data)
				throw new Error("User creation failed");
			const user = await models.User.findOne({ username: data.login })
			if (!user) {
				let campus = getUserCampus(data);
				const userData = new models.User({
					username: data.login,
					displayname: data.displayname,
					intra_id: data.id,
					image_url: data.image_url,
					staff: data["staff?"],
					campus: campus
				});
				const result = await userData.save();
				return await loginUser(result.id);
			}
			else {
				return await loginUser(user.id);
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
}