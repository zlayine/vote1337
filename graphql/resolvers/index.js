const mealResolver = require('./meal')
const userResolver = require('./user')
import { GraphQLUpload } from 'graphql-upload'

const rootResolver = {
	Upload: GraphQLUpload,
	...mealResolver,
	...userResolver
};

module.exports = rootResolver;