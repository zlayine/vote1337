const express = require('express');
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql').graphqlHTTP
const mongoose = require('mongoose')
const path = require('path');
const graphqlSchema = require('./graphql/schema')
const graphqlResolvers = require('./graphql/resolvers')
import { graphqlUploadExpress } from 'graphql-upload'
const isAuth = require('./middlewares/auth')
const env = require('./environment')

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
		schema: graphqlSchema,
		rootValue: graphqlResolvers,
		graphiql: true,
	}));

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
	}).catch(err => {
		console.log(err)
	})


