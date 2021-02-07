const mealResolver = require('./meal')
import { GraphQLUpload } from 'graphql-upload'

const rootResolver = {
	Upload: GraphQLUpload,
	...mealResolver
};

module.exports = rootResolver;