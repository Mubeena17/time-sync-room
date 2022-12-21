# Time Sync Room

Time Sync Room is a Javascript library for Time syncing the clients in a socket room.

## Installation

```bash
npm i time-sync-room
```

## Usage Client

A time-sync-room client can connect to server with other clients in same room using socket room, and will synchronize it's stopwatch time with all clients in room. Client can join room with method join() and it will return object with method to retrieve stopwatch timer and status of stopwatch.

### Connect and join socket room

```javascript
import TimeSyncRoom from "time-sync-room/client";

//create socket connection with URL as server URL
TimeSyncRoom.init(URL);

//Join or create a socket room, returns object with methods
let room = TimeSyncRoom.join(roomName);
```

### Listen for the stopwatch status

```javascript

//listen for the stopwatch timer
room.timer((time) => time));

//listen for stopwatch pause
room.onPause((isPaused) => isPaused));

//listen for stopwatch running
room.onActive((isActive) =>  setIsActive(isActive));

```

### Stopwatch method

```javascript
//start the stopwatch
room.start();

//pause the stopwatch
room.pause();

//reset or stop stopwatch
room.reset();
```

```javascript
import TimeSyncRoom from "time-sync-room";
const express = require("express");
const app = express();

//create socket connection
const server = require("http").Server(app);
TimeSyncRoom.init(server);
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
