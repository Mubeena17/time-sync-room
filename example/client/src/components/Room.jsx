import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Room() {
    const [state, setState] = useState({ roomName: "" });
    const navigate = useNavigate();
    const handleRoomNameChange = (e) => {
        setState({ roomName: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        var roomName = state.roomName.trim();
        if (!roomName) {
            return;
        }
        navigate(`/room/${roomName}`);
        setState({ roomName: "" });
    };
    return (
        <form className="roomForm" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Room Name"
                value={state.roomName}
                onChange={handleRoomNameChange}
            />
            <input type="submit" value="Create Room" />
        </form>
    );
}
