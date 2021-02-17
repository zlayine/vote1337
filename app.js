const express = require('express');
const bodyParser = require('body-parser')

const mongoose = require('mongoose')

const graphqlHttp = require('express-graphql').graphqlHTTP

// import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { subscribe, execute } = require('graphql')
const { makeExecutableSchema } = require('graphql-tools');
const { createServer } = require('http');

const path = require('path');
const graphqlSchema = require('./graphql/schema')
const graphqlResolvers = require('./graphql/resolvers')
import { graphqlUploadExpress } from 'graphql-upload'
const isAuth = require('./middlewares/auth')
const env = require('./environment')

const schema = makeExecutableSchema({
	typeDefs: graphqlSchema,
	resolvers: graphqlResolvers,
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use('/public/meals', express.static(path.join(__dirname, '/public/meals')));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	if (req.method == 'OPTIONS')
		return res.sendStatus(200);
	next();
})

app.use(isAuth);

app.use('/graphql',
	graphqlUploadExpress({ maxFileSize: '10M', maxFiles: 10 }),
	graphqlHttp({
		schema: schema,
	}));

// app.use('/graphiql', graphiqlExpress({
// 	endpointURL: '/graphql',
// 	subscriptionsEndpoint: `ws://localhost:3000/subscriptions` // subscriptions endpoint.
// }));

const ws = createServer(app);

const {
	MONGO_USERNAME,
	MONGO_PASSWORD,
	MONGO_HOSTNAME,
	MONGO_PORT,
	MONGO_DB
} = env.process;

let url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
if (process.env.NODE_ENV == "development")
	url = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;

mongoose.connect(url)
	.then(() => {
		app.listen(3000);
		// ws.listen(3000, () => {
		// 	console.log(`GraphQL Server is now running`);
		// 	new SubscriptionServer({
		// 		execute,
		// 		subscribe,
		// 		schema,
		// 		onConnect: () => console.log("client connected")
		// 	}, {
		// 		server: ws,
		// 		path: '/subscriptions',
		// 	});
		// });
	}).catch(err => {
		console.log(err)
	})



