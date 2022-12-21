import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ControlButtons from "./ControlButtons";
import TimeSyncRoom from "time-sync-room/client";

export default function Stopwatch(props) {
    const { roomName } = useParams();
    const [time, setTime] = useState(0);
    const [room, setRoom] = useState();
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        setRoom(TimeSyncRoom.join(roomName));
    }, [roomName]);

    useEffect(() => {
        if (room) {
            room.timer((time) => {
                setTime(time);
            });
            room.onPause((isPaused) => {
                setIsPaused(isPaused);
            });
            room.onActive((isActive) => {
                setIsActive(isActive);
            });
        }
    }, [room]);

    const msToHMS = (ms) => {
        let milliseconds = ms % 1000;
        // 1- Convert to seconds:
        let seconds = parseInt(ms / 1000);
        // 2- Extract hours:
        const hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
        seconds = seconds % 3600; // seconds remaining after extracting hours
        // 3- Extract minutes:
        const minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
        // 4- Keep only seconds not extracted to minutes:
        seconds = seconds % 60;
        return hours + ":" + minutes + ":" + seconds;
    };
    return (
        <div className="stopwatch">
            <button>Room</button>
            <div className="stopwatch-time">{msToHMS(time)}</div>
            <ControlButtons
                active={isActive}
                isPaused={isPaused}
                handleStart={() => {
                    room.start();
                }}
                handlePause={() => {
                    room.pause();
                }}
                handleResume={() => {
                    room.resume();
                }}
                handleReset={() => {
                    room.reset();
                }}
            />
        </div>
    );
}
