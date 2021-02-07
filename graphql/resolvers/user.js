const models = require('../../models/index')
const { transformUser } = require("./merge");

module.exports = {
	createUser: async (args) => {
		try {
			const user = await models.User.findOne({ username: args.userInput.username })
			if (user)
				throw new Error("User exists already");
			const userData = new models.User({
				username: "zlayine",
				displayname: "zouheir",
				intra_id: "1",
				image_url: "a",
				staff: false,
				campus: "khouribga"
			});
			const result = await userData.save();
			return transformUser(result);
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
}