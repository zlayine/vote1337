const queries = require('./queries')
const mutations = require('./mutations')
const subscriptions = require('./subscriptions')
import { GraphQLUpload } from 'graphql-upload'

const rootResolver = {
	Upload: GraphQLUpload,
	...queries,
	...mutations,
	...subscriptions,
};

module.exports = rootResolver;