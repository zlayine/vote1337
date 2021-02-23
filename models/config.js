const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const configSchema = new Schema({
	launch: {
		type: String,
		required: true
	},
	dinner: {
		type: String,
		required: true
	},
	votingSpan: [{
		type: String,
		required: true
	}],
	
}, {timestamps: true});

module.exports = mongoose.model('Config', configSchema);

