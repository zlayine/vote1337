module.exports = {
	RootSubscription: {
		mealCreated: {
			// resolve: (payload) => {
			// 	return {
			// 		customData: payload,
			// 	};
			// },
			subscribe: () => socket.asyncIterator('MEAL_CREATED')
		},
	},
}