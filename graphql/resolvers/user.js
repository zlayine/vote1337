const models = require('../../models/index')
const { transformUser } = require("./merge");
const axios = require('axios');
const jwt = require('jsonwebtoken')

const request_token = async (code) => {
	try {
		const res = await axios.post("https://api.intra.42.fr/oauth/token", {
			grant_type: "authorization_code",
			client_id: process.env.CLIENT_ID_42,
			client_secret: process.env.CLIENT_SECRET_42,
			code: code,
			redirect_uri: process.env.CLIENT_REDIRECT_42
		})
		return res.data.access_token;
	} catch (err) {
		console.log(err);
	}
}

const request_data = async (token) => {
	try {
		const res = await axios.get("https://api.intra.42.fr/v2/me", {
			headers: {
				"Authorization": `Bearer ${token}`
			}
		})
		return res.data;
	} catch (err) {
		console.log(err);
	}
}

const loginUser = async (userId) => {
	const user = await models.User.findOne({ _id: userId });
	if (!user)
		throw new Error('User does not exist');
	const token = jwt.sign({ userId: user.id, email: user.email }, 'herfhehrbve12jkdkfdf', {
		expiresIn: '3500h'
	});
	return { user: transformUser(user), token: token }
}


module.exports = {
	createUser: async (args) => {
		try {
			const token = await request_token(args.code);
			const data = await request_data(token);
			const user = await models.User.findOne({ username: data.login })
			if (!user) {
				const userData = new models.User({
					username: data.login,
					displayname: data.displayname,
					intra_id: data.id,
					image_url: data.image_url,
					staff: data["staff?"],
					campus: data.campus[0].name
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
	login: async ({ userId }) => {
		return loginUser(userId);
	},
	getUser: async args => {
		try {
			const user = await models.User.findOne({ _id: args.userId });
			if (!user)
				throw new Error('User does not exist');
			else
				return transformUser(user);
		} catch (err) {
			console.log(err)
			throw err;
		}
	}
}