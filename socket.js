const jwt = require('jsonwebtoken');
const env = require('./environment')

module.exports = (io) => {
	let users = {};

	io.use((socket, next) => {
		// console.log("user connected: ", socket.handshake.query)
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
			io.of('/').in(campus + "_add").clients(function (error, clients) {
				var total = clients.length;
				if (total)
					socket.emit('someoneAdding');
			});
			// console.log("user joined", campus)
		});

		socket.on('newMeal', async (data) => {
			socket.to(data.campus).emit('newMealAdded', data);
		});

		socket.on('newVote', async (data) => {
			socket.to(data.campus).emit('newVoteAdded', data);
		});

		socket.on('deletedMeal', async (data) => {
			socket.to(data.campus).emit('mealDeleted', data);
		});

		socket.on('notifyAdding', async (campus) => {
			socket.join(campus + "_add");
			socket.broadcast.to(campus).emit('someoneAdding');
		})

		socket.on('notifyLeave', async (campus) => {
			socket.leave(campus + "_add");
			io.of('/').in(campus + "_add").clients(function (error, clients) {
				var total = clients.length;
				// console.log("total users", total)
				if (!total)
					socket.broadcast.to(campus).emit('noOneAdding');
			});
		})

		socket.on('changeCampus', async (data) => {
			socket.leave(data.old);
			socket.join(data.new);
		})

		socket.on("disconnect", () => {
			// delete users[socket.decoded];
		});
	});
}