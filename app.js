const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const http = require('http');
const socketio = require('socket.io');

const cors = require('cors');

const graphqlHttp = require('express-graphql').graphqlHTTP
const { makeExecutableSchema } = require('graphql-tools');

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

app.use(cors());

app.use('/graphql',
	graphqlUploadExpress({ maxFileSize: '10M', maxFiles: 10 }),
	graphqlHttp({
		schema: schema,
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

const server = http.createServer(app);
const io = socketio.listen(server);

require("./socket")(io);

mongoose.connect(url, { useNewUrlParser: true , useUnifiedTopology: true})
	.then(() => {
		console.log("Database Connected!")
		server.listen(3000);
		console.log("Listening on port 3000...")
	}).catch(err => {
		console.log(err)
	})



