const models = require('../../models/index')
const { transformUser } = require("./merge");
const axios = require('axios');
const jwt = require('jsonwebtoken')

const request_token = async (code) => {
	try {
		const res = await axios.post("https://api.intra.42.fr/oauth/token", {
			grant_type: "authorization_code",
			client_id: "112d563acce9f5f0ea1be2f74995194a18e3a3f9e3128d3c7906443679f633bf",
			client_secret: "1b3ee8bf4e04fc2af2e4bb8218fb8c335027b41d4b84fe9d886b7b8aed4a6920",
			code: code,
			redirect_uri: "http://localhost:8080/auth"
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