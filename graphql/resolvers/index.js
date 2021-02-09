const mealResolver = require('./meal')
const userResolver = require('./user')
const votesResolver = require('./vote')
const reportResolver = require('./report')
import { GraphQLUpload } from 'graphql-upload'

const rootResolver = {
	Upload: GraphQLUpload,
	...mealResolver,
	...userResolver,
	...votesResolver,
	...reportResolver
};

module.exports = rootResolver;