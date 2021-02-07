const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		required: true
	},
    displayname: {
        type: String,
        required: true
    },
	intra_id: {
		type: String,
		required: true
	},
	image_url: {
		type: String,
		required: true
	},
	staff: {
		type: Boolean,
		required: true
	},
	campus: {
		type: String,
		required: true
	},
});

module.exports = mongoose.model('User', userSchema);

