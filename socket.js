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
		socket.on('join', async (campus) => {
			socket.join(campus)
			console.log("user joined", campus)
		});

		socket.on('newMeal', async (data) => {
			socket.broadcast.to(data.campus).emit('newMealAdded', data);
		});

		socket.on('newVote', async (data) => {
			socket.broadcast.to(data.campus).emit('newVoteAdded', data);
		});

		socket.on('deletedMeal', async (data) => {
			socket.broadcast.to(data.campus).emit('mealDeleted', data);
		});

		socket.on("disconnect", () => {
			delete users[socket.decoded];
		});
	});
}