const socket = require('../../../socket')

module.exports = {
	RootSubscription: {
		mealFetched: {
			subscribe: () => socket.asyncIterator('MEAL_FETCH')
		}
	},
}