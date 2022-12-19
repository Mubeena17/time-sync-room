const init = (server) => {
    var ntp = require("socket-ntp");

    const io = require("socket.io")(server);

    let rooms = {};
    let roomConnections = {};

    try {
        io.on("connection", async (socket) => {
            console.log(`socket with the id ${socket.id} is now connected`);
            ntp.sync(socket);

            socket.on("join_room", (data) => {
                socket.join(data);
                if (!roomConnections[data]) {
                    roomConnections[data] = new Set();
                }
                roomConnections[data].add(socket.id);
                if (rooms[data]) {
                    io.to(socket.id).emit("timer_action", rooms[data]);
                }
            });

            socket.on("timer_action", (data) => {
                socket.to(data.room).emit("timer_action", data);
                rooms[data.room] = data;
            });

            socket.on("disconnect", function () {
                console.log(
                    `socket with the id ${socket.id} is now disconnected`
                );
                Object.keys(roomConnections).forEach((room) => {
                    if (roomConnections[room].has(socket.id)) {
                        roomConnections[room].delete(socket.id);
                    }
                    if (
                        roomConnections[room] &&
                        roomConnections[room].size === 0
                    ) {
                        delete roomConnections[room];
                        delete rooms[room];
                        console.log(rooms);
                    }
                });
            });
        });
    } catch (err) {
        console.log("Error : ", err.message);
    }
};

module.exports = { init };
