const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const reportSchema = new Schema({
	description: {
		type: String,
		required: true
	},
	meal_item: {
		type: Schema.Types.ObjectId,
		ref: 'MealItem'
	},
	meal: {
		type: Schema.Types.ObjectId,
		ref: 'Meal'
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'	
	},
}, {timestamps: true});

module.exports = mongoose.model('Report', reportSchema);

