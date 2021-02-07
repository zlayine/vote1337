const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const reportSchema = new Schema({
	description: {
		type: String,
		required: true
	},
	meal_item_id: {
		type: Schema.Types.ObjectId,
		ref: 'MealItem'
	},
	meal_id: {
		type: Schema.Types.ObjectId,
		ref: 'Meal'
	},
	user_id: {
		type: Schema.Types.ObjectId,
		ref: 'User'	
	},
}, {timestamps: true});

module.exports = mongoose.model('Report', reportSchema);

