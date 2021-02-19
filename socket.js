const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const env = require('./environment')


module.exports = (io) => {
	let users = {};

	io.use((socket, next) => {
		console.log("user connected: ", socket.handshake.query)
		if (socket.handshake.query && socket.handshake.query.token) {
			jwt.verify(socket.handshake.query.token, env.process.JWT_PKEY,
				(err, decoded) => {
					if (!err) socket.decoded = decoded.userId;
					next();
				}
			);
		}
	}).on('connection', (socket) => {

		socket.on('newMeal', async (data) => {
			socket.broadcast.emit('newMealAdded', data);
		});

		socket.on('newVote', async (data) => {
			socket.broadcast.emit('newVoteAdded', data);
		});

		socket.on('deletedMeal', async (data) => {
			io.emit('mealDeleted', data);
			// socket.broadcast.emit('mealDeleted', data);
		});

		socket.on("disconnect", () => {
			delete users[socket.decoded];
			console.log("disconnected")
		});
	});
}