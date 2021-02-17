const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const voteSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'	
	},
	vote: {
		type: String,
		required: true
	},
	meal_item: {
		type: Schema.Types.ObjectId,
		ref: 'MealItem'
	},
	report: {
		type: String,
		default: "",
	},
}, {timestamps: true});

module.exports = mongoose.model('Vote', voteSchema);

