const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const mealSchema = new Schema({
	name: {
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
	user_id: {
		type: Schema.Types.ObjectId,
		ref: 'User'	
	},
	reports: {
		type: Schema.Types.ObjectId,
		ref: 'Report'	
	}
}, {timestamps: true});

module.exports = mongoose.model('Meal', mealSchema);

