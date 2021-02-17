const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const mealSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'	
	},
	meals: [{
		type: Schema.Types.ObjectId,
		ref: 'MealItem'
	}],
}, {timestamps: true});

module.exports = mongoose.model('Meal', mealSchema);

