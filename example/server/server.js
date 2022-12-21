const express = require("express");
const app = express();
const TimeSyncRoom = require("time-sync-room");

require("dotenv").config();
const { PORT = 5000 } = process.env;

const server = require("http").Server(app);

TimeSyncRoom.init(server);

server.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
