const express = require('express');
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql').graphqlHTTP
const mongoose = require('mongoose')

const graphqlSchema = require('./graphql/schema')
const graphqlResolvers = require('./graphql/resolvers')
const isAuth = require('./middlewares/is-auth')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	if (req.method == 'OPTIONS')
		return res.sendStatus(200);
	next();
})

app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
}));

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    app.listen(3000);
}).catch(err => {
    console.log(err)
})


