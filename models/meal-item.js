const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const mealItemSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	image_url: {
		type: String,
		required: true
	},
    votes_up: {
        type: Number,
		default: 0
    },
	votes_down: {
		type: Number,
		default: 0
	},
	vote_sick: {
		type: Number,
		default: 0
	},
	meal_id: {
		type: Schema.Types.ObjectId,
		ref: 'Meal'	
	},
	votes: {
		type: Schema.Types.ObjectId,
		ref: 'Vote'
	},
}, {timestamps: true});

module.exports = mongoose.model('MealItem', mealItemSchema);

