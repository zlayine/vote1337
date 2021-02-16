// const mealResolver = require('./meal')
// const userResolver = require('./user')
// const votesResolver = require('./vote')
// const reportResolver = require('./report')
const queries = require('./queries')
const mutations = require('./mutations')
const subscriptions = require('./subscriptions')
import { GraphQLUpload } from 'graphql-upload'

const rootResolver = {
	Upload: GraphQLUpload,
	...queries,
	...mutations,
	...subscriptions,
	// ...mealResolver,
	// ...userResolver,
	// ...votesResolver,
	// ...reportResolver
};

module.exports = rootResolver;