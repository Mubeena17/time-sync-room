import { io } from "socket.io-client";
import ntp from "socket-ntp/client/ntp";

let socket;
//initialize the socket with url (server)
const init = (url) => {
    if (!socket) {
        socket = io.connect(url);
        ntp.init(socket);
    }
};

//simple network time protocol time returns the latency
//between the server and client, compared with server
const getSyncedTime = () => {
    var offset = ntp.offset();
    return new Date(new Date().getTime() - offset);
};
// join to emit
const join = (roomName) => {
    //initial timer
    let timer = { value: 0 };
    //status of the timer
    let isPaused = false;
    let isActive = false;
    //sntp time at action (start, pause, reset, resume)
    let lastActionTime;
    //paused timer
    let offset = 0;

    //to store callback function to set timer
    let timerChangeCallback;
    //to store callback function to set action state pause
    let pauseCallback;
    //to store callback function to set action state active
    let activeCallback;

    //emits to join with a room
    socket.emit("join_room", roomName);

    //create a callback function to set timers (kind of listner for timer object)
    const timerProxy = new Proxy(timer, {
        set: function (target, key, value) {
            target[key] = value;
            timerChangeCallback(value);
            return true;
        },
    });

    //function start timer
    const start = () => {
        isActive = true;
        activeCallback(true);
    };
    //function to pause timer
    const pause = () => {
        isPaused = true;
        isActive = true;
        //set state action pause
        pauseCallback(true);
        activeCallback(true);
    };
    //function to reset timer
    const reset = () => {
        isActive = false;
        isPaused = false;
        activeCallback(false);
        timerProxy.value = 0;
    };
    //function to resume timer
    const resume = () => {
        isPaused = false;
        pauseCallback(false);
    };
    //listner for every action change . data object of roomname action, ActionTime, current timer
    socket.on("timer_action", (data) => {
        //sntp time at time of action
        lastActionTime = data.timeStamp;

        if (data.action === "start") {
            offset = 0;
            start();
        }

        if (data.action === "pause") {
            timerProxy.value = data.timer;
            offset = 0;
            pause();
        }

        if (data.action === "resume") {
            offset = data.timer;
            resume();
        }

        if (data.action === "reset") {
            offset = 0;
            reset();
        }
    });
    // set timer every 200ms with difference in starttime (time of action) and current time
    setInterval(() => {
        if (isActive && !isPaused) {
            //time of action
            const startTime = new Date(lastActionTime);
            //current sntp time
            const currentTime = getSyncedTime();
            // value of timer , for every sec , the value increase so the timer value
            const diff = currentTime.getTime() - startTime.getTime();
            //offset when the paused state timers value
            timerProxy.value = diff + offset;
        }
    }, 200);
    //emit the action timeStamp timers roomname
    const emitAction = (action) => {
        lastActionTime = getSyncedTime();
        socket.emit("timer_action", {
            room: roomName,
            action,
            timeStamp: lastActionTime,
            timer: timerProxy.value,
        });
    };

    return {
        start: () => {
            offset = 0;
            emitAction("start");
            start();
        },
        pause: () => {
            offset = 0;
            emitAction("pause");
            pause();
        },
        resume: () => {
            emitAction("resume");
            offset = timerProxy.value;
            resume();
        },
        reset: () => {
            offset = 0;
            emitAction("reset");
            reset();
        },
        timer: function (callback) {
            timerChangeCallback = callback;
        },
        onPause: function (callback) {
            pauseCallback = callback;
        },
        onActive: function (callback) {
            activeCallback = callback;
        },
        getSyncedTime,
    };
};

export default { init, join };
